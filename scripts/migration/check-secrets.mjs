import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const requireBuild = process.argv.includes("--require-build");
const outputPath = path.join(root, "artifacts/migration/runtime/security/secret-scan.json");
const candidateRoots = [
	".next/static",
	"dist/client",
	".cloudflare",
	"public",
	"artifacts/migration/runtime",
	"artifacts/migration/preview",
	"artifacts/migration/release",
];
const textExtensions = new Set([".css", ".html", ".js", ".json", ".log", ".map", ".mjs", ".txt"]);
const ignoredPublicNames = new Set(["search-index.json", "sitemap.xml", "robots.txt"]);
const secretPatterns = [
	{ type: "private-key", pattern: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g },
	{ type: "telegram-token", pattern: /\b\d{8,12}:[A-Za-z0-9_-]{20,}\b/g },
	{ type: "github-token", pattern: /\bgh[pousr]_[A-Za-z0-9_]{20,}\b/g },
	{ type: "jwt", pattern: /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{5,}\b/g },
	{ type: "aws-access-key", pattern: /\bAKIA[A-Z0-9]{16}\b/g },
	{ type: "bearer-value", pattern: /\bBearer\s+[A-Za-z0-9._~+/=-]{24,}\b/gi },
];
const legacyPublicNames = [
	"NEXT_PUBLIC_TELEGRAM_BOT_TOKEN",
	"NEXT_PUBLIC_TELEGRAM_CHAT_ID",
	"NEXT_PUBLIC_X_API_KEY",
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

let serverOnlyNames = [];
try {
	const envManifest = JSON.parse(
		await readFile(path.join(root, "artifacts/migration/baseline/env-names.json"), "utf8"),
	);
	serverOnlyNames = envManifest.records
		.filter((record) =>
			["worker-secret", "scheduler", "legacy-public-secret"].includes(record.scope),
		)
		.map((record) => record.name)
		.filter(Boolean);
} catch {
	// A dedicated source inventory failure is reported at the manifest stage.
}
const retiredAliasNames = [
	"SANITY_PROJECT_ID",
	"SANITY_DATASET",
	"ENABLE_ZALO_PHONE_CHECK",
];
const forbiddenNames = [
	...new Set([...legacyPublicNames, ...serverOnlyNames, ...retiredAliasNames]),
];
const publicNames = new Set([
	"NODE_ENV",
	"NEXT_PUBLIC_SANITY_PROJECT_ID",
	"NEXT_PUBLIC_SANITY_DATASET",
]);

const scanRoots = candidateRoots.filter((candidate) => existsSync(path.join(root, candidate)));
const buildRoots = scanRoots.filter((candidate) => [".next/static", "dist/client", ".cloudflare"].includes(candidate));
const findings = [];
let scannedFiles = 0;

if (requireBuild && buildRoots.length === 0) {
	findings.push({
		file: "(build-output)",
		type: "missing-build-output",
		severity: "error",
	});
}

for (const relativeRoot of scanRoots) {
	const files = await walk(path.join(root, relativeRoot));
	for (const file of files) {
		const extension = path.extname(file).toLowerCase();
		const basename = path.basename(file);
		if (!textExtensions.has(extension) || (relativeRoot === "public" && ignoredPublicNames.has(basename))) {
			continue;
		}
		let source;
		try {
			source = await readFile(file, "utf8");
		} catch {
			continue;
		}
		scannedFiles += 1;
		const relative = path.relative(root, file).replaceAll(path.sep, "/");
		const isBrowserOutput =
			relative.startsWith(".next/static/") ||
			relative.includes("/assets/") ||
			relative.startsWith("public/");
		for (const name of forbiddenNames) {
			if (publicNames.has(name)) continue;
			const exactName = new RegExp(`(^|[^A-Z0-9_])${name}([^A-Z0-9_]|$)`);
			if (isBrowserOutput && exactName.test(source)) {
				findings.push({ file: relative, type: "forbidden-env-name", name, severity: "error" });
			}
		}
		for (const candidate of secretPatterns) {
			candidate.pattern.lastIndex = 0;
			if (candidate.pattern.test(source)) {
				findings.push({ file: relative, type: candidate.type, severity: "error" });
			}
		}
	}
}

const uniqueFindings = [
	...new Map(
		findings.map((finding) => [`${finding.file}:${finding.type}:${finding.name ?? ""}`, finding]),
	).values(),
].sort((left, right) =>
	`${left.file}:${left.type}`.localeCompare(`${right.file}:${right.type}`),
);

const report = {
	schemaVersion: 1,
	generatedAt: new Date().toISOString(),
	requireBuild,
	scannedRoots: scanRoots,
	scannedFiles,
	findings: uniqueFindings,
	status: uniqueFindings.length ? "fail" : "pass",
};

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`);

if (uniqueFindings.length) {
	console.error(`Secret scan found ${uniqueFindings.length} finding(s). See ${path.relative(root, outputPath)}.`);
	process.exitCode = 1;
} else {
	console.log(`Secret scan passed across ${scannedFiles} generated/public files.`);
}
