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
	{ type: "disabled-imgly", pattern: /@imgly\/background-removal/g },
	{ type: "disabled-onnx", pattern: /onnxruntime-web|\.onnx|ort-wasm/g },
	{ type: "migration-test-generator", pattern: /scripts\/migration|api-fixtures\/|test-spx-sync/g },
	{ type: "dev-test-dependency", pattern: /node_modules\/(?:vitest|jest|playwright|tsx)\//g },
	{
		type: "node-dom-jsdom",
		pattern: /(?:from|import|require|external)\s*\(?["'](?:jsdom|isomorphic-dompurify|remark-prism)["']\)?|node_modules\/(?:jsdom|isomorphic-dompurify|remark-prism)\//g,
	},
	{
		type: "node-vm",
		pattern: /(?:from|import|require|external)\s*\(?["'](?:node:)?vm["']\)?|["']node:vm["']/g,
	},
];
const appWorkerRoots = /(?:^|\/)(?:pages\/api|pages\/blog|server|api-client|utils)\//;
const requestTimeModules = [
	{
		type: "request-time-filesystem",
		pattern: /from\s+["'](?:node:)?fs(?:\/promises)?["']|require\(["'](?:node:)?fs(?:\/promises)?["']\)/g,
	},
	{
		type: "request-time-path",
		pattern: /from\s+["'](?:node:)?path["']|require\(["'](?:node:)?path["']\)/g,
	},
	{
		type: "request-time-vm",
		pattern: /from\s+["'](?:node:)?vm["']|require\(["'](?:node:)?vm["']\)/g,
	},
	{
		type: "request-time-jsdom",
		pattern: /from\s+["'](?:jsdom|isomorphic-dompurify|remark-prism)["']|require\(["'](?:jsdom|isomorphic-dompurify|remark-prism)["']\)/g,
	},
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
		if (extension === ".map") {
			try {
				const sourceMap = JSON.parse(source);
				const contents = Array.isArray(sourceMap.sourcesContent) ? sourceMap.sourcesContent : [];
				for (const [index, content] of contents.entries()) {
					const source = sourceMap.sources?.[index] ?? "";
					if (
						typeof content !== "string" ||
						source.includes("node_modules/") ||
						!appWorkerRoots.test(source)
					) {
						continue;
					}
					for (const candidate of requestTimeModules) {
						candidate.pattern.lastIndex = 0;
						if (candidate.pattern.test(content)) {
							findings.push({
								file: `${relative}:${source}`,
								type: candidate.type,
								severity: "error",
							});
						}
					}
				}
			} catch {
				// Compiled map validation is handled by the build tool.
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
