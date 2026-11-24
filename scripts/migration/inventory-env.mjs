import { readFile, readdir, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const outputPath = path.join(root, "artifacts/migration/baseline/env-names.json");
const ignoredDirectories = new Set([
	".git",
	".next",
	".vinext",
	"artifacts",
	"coverage",
	"dist",
	"node_modules",
	"public",
	"specs",
]);
const sourceExtensions = new Set([".cjs", ".js", ".jsx", ".mjs", ".ts", ".tsx", ".yml", ".yaml"]);

async function walk(directory) {
	const entries = await readdir(directory, { withFileTypes: true });
	const files = [];
	for (const entry of entries) {
		if (ignoredDirectories.has(entry.name)) continue;
		const absolutePath = path.join(directory, entry.name);
		if (entry.isDirectory()) files.push(...(await walk(absolutePath)));
		else if (sourceExtensions.has(path.extname(entry.name)) || entry.name === ".env.example") {
			files.push(absolutePath);
		}
	}
	return files;
}

function classify(name, callers) {
	const legacyPublicSecrets = new Set([
		"NEXT_PUBLIC_TELEGRAM_BOT_TOKEN",
		"NEXT_PUBLIC_TELEGRAM_CHAT_ID",
		"NEXT_PUBLIC_X_API_KEY",
	]);
	if (legacyPublicSecrets.has(name)) {
		return {
			scope: "legacy-public-secret",
			visibility: "exposed-browser-credential",
			stage: "browser-build-remediation",
			rotationRequired: true,
		};
	}
	if (name.startsWith("SPX_SYNC_")) {
		return {
			scope: "scheduler",
			visibility: "server-only",
			stage: "worker-runtime",
			rotationRequired: false,
		};
	}
	if (name.startsWith("NEXT_PUBLIC_")) {
		return {
			scope: "browser-build",
			visibility: "public",
			stage: "build-and-browser",
			rotationRequired: false,
		};
	}
	if (
		/TELEGRAM|SANITY|TOKEN|SECRET|API_KEY|X_API_KEY|PASSWORD/.test(name) ||
		callers.some((caller) => caller.startsWith("pages/api/") || caller.startsWith("server/"))
	) {
		return {
			scope: callers.some((caller) => caller.startsWith("pages/api/cron/")) ? "scheduler" : "worker-secret",
			visibility: "server-only",
			stage: "worker-runtime",
			rotationRequired: false,
		};
	}
	return {
		scope: callers.some((caller) => caller.startsWith("scripts/")) ? "local-test" : "build",
		visibility: "internal",
		stage: "build-or-local",
		rotationRequired: false,
	};
}

const envReferences = new Map();
const files = await walk(root);
for (const file of files) {
	const source = await readFile(file, "utf8");
	const relative = path.relative(root, file).replaceAll(path.sep, "/");
	const patterns = [
		/\bprocess\.env\.([A-Z][A-Z0-9_]*)/g,
		/\bimport\.meta\.env\.([A-Z][A-Z0-9_]*)/g,
		/^\s*([A-Z][A-Z0-9_]*)\s*=/gm,
	];
	for (const pattern of patterns) {
		for (const match of source.matchAll(pattern)) {
			const name = match[1];
			if (!envReferences.has(name)) envReferences.set(name, new Set());
			envReferences.get(name).add(relative);
		}
	}
}

const records = [...envReferences]
	.map(([name, callerSet]) => {
		const callers = [...callerSet].sort();
		return {
			name,
			...classify(name, callers),
			callers,
		};
	})
	.sort((left, right) => left.name.localeCompare(right.name));

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(
	outputPath,
	`${JSON.stringify(
		{
			schemaVersion: 1,
			count: records.length,
			records,
		},
		null,
		2,
	)}\n`,
);

console.log(`Inventoried ${records.length} environment names without reading or writing values.`);
