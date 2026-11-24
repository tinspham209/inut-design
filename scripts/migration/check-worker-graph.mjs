import { existsSync } from "node:fs";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const requireBuild = process.argv.includes("--require-build");
const outputPath = path.join(root, "artifacts/migration/runtime/security/worker-graph.json");
const candidateRoots = [".cloudflare", "dist/server", ".next/server/pages/api"];
const textExtensions = new Set([".cjs", ".css", ".html", ".js", ".json", ".map", ".mjs"]);
const forbidden = [
	{
		type: "native-sharp",
		pattern: /(?:require|import|from|external)[^"'\\n]{0,40}["'](?:sharp)["']|["']node_modules\/sharp\//g,
	},
	{
		type: "request-time-filesystem",
		pattern: /(?:require|import|from)[^"'\\n]{0,40}["'](?:node:)?fs(?:\/promises)?["']/g,
	},
	{
		type: "request-time-path",
		pattern: /(?:require|import|from)[^"'\\n]{0,40}["'](?:node:)?path["']/g,
	},
	{ type: "disabled-imgly", pattern: /@imgly\/background-removal/g },
	{ type: "disabled-onnx", pattern: /onnxruntime-web|\.onnx|ort-wasm/g },
	{ type: "migration-test-generator", pattern: /scripts\/migration|api-fixtures\/|test-spx-sync/g },
	{ type: "dev-test-dependency", pattern: /node_modules\/(?:vitest|jest|playwright|tsx)\//g },
];

async function walk(directory) {
	const entries = await readdir(directory, { withFileTypes: true });
	const files = [];
	for (const entry of entries) {
		const absolute = path.join(directory, entry.name);
		if (entry.isDirectory()) files.push(...(await walk(absolute)));
		else files.push(absolute);
	}
	return files;
}

const cloudflareRootExists = existsSync(path.join(root, ".cloudflare"));
const roots = candidateRoots.filter(
	(relative) =>
		existsSync(path.join(root, relative)) &&
		(!cloudflareRootExists || !relative.startsWith(".next")),
);
const findings = [];
let scannedFiles = 0;

if (requireBuild && roots.length === 0) {
	findings.push({
		file: "(worker-build)",
		type: "missing-worker-build",
		severity: "error",
	});
}

for (const relativeRoot of roots) {
	for (const file of await walk(path.join(root, relativeRoot))) {
		const extension = path.extname(file);
		if (!textExtensions.has(extension)) continue;
		const relative = path.relative(root, file).replaceAll(path.sep, "/");
		let source;
		try {
			source = await readFile(file, "utf8");
		} catch {
			continue;
		}
		scannedFiles += 1;
		for (const candidate of forbidden) {
			candidate.pattern.lastIndex = 0;
			if (candidate.pattern.test(source)) {
				findings.push({ file: relative, type: candidate.type, severity: "error" });
			}
		}
	}
}

const uniqueFindings = [
	...new Map(findings.map((finding) => [`${finding.file}:${finding.type}`, finding])).values(),
].sort((left, right) => `${left.file}:${left.type}`.localeCompare(`${right.file}:${right.type}`));

const report = {
	schemaVersion: 1,
	generatedAt: new Date().toISOString(),
	requireBuild,
	scannedRoots: roots,
	scannedFiles,
	findings: uniqueFindings,
	status: uniqueFindings.length ? "fail" : "pass",
};

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`);

if (uniqueFindings.length) {
	console.error(`Worker graph check found ${uniqueFindings.length} prohibited module(s). See ${path.relative(root, outputPath)}.`);
	process.exitCode = 1;
} else {
	console.log(`Worker graph check passed across ${scannedFiles} compiled files.`);
}
