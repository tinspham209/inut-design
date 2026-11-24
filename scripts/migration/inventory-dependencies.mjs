import { execFileSync } from "node:child_process";
import { readFile, readdir, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const outputDir = path.join(root, "artifacts/migration/baseline");
const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
const directDependencies = {
	...packageJson.dependencies,
	...packageJson.devDependencies,
};
const dependencySections = new Map(
	Object.entries(packageJson.dependencies ?? {})
		.map(([name]) => [name, "production"])
		.concat(Object.entries(packageJson.devDependencies ?? {}).map(([name]) => [name, "development"])),
);
const ignoredDirectories = new Set([
	".git",
	".next",
	"artifacts",
	"dist",
	"node_modules",
	"public",
	"specs",
]);
const sourceExtensions = new Set([".cjs", ".js", ".jsx", ".mjs", ".ts", ".tsx"]);

async function walk(directory) {
	const entries = await readdir(directory, { withFileTypes: true });
	const files = [];
	for (const entry of entries) {
		if (ignoredDirectories.has(entry.name)) continue;
		const absolutePath = path.join(directory, entry.name);
		if (entry.isDirectory()) files.push(...(await walk(absolutePath)));
		else if (sourceExtensions.has(path.extname(entry.name))) files.push(absolutePath);
	}
	return files;
}

function escapeRegex(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function migrationAction(packageName) {
	if (packageName === "@vercel/analytics") return "remove";
	if (
		[
			"@imgly/background-removal",
			"onnxruntime-web",
			"sharp",
		].includes(packageName)
	) {
		return "worker-boundary-review";
	}
	if (
		[
			"@emotion/cache",
			"@emotion/react",
			"@emotion/server",
			"@emotion/styled",
			"@mui/icons-material",
			"@mui/material",
			"@next/bundle-analyzer",
			"@next/third-parties",
			"@react-three/drei",
			"@react-three/fiber",
			"@types/node",
			"@types/react",
			"@types/react-dom",
			"@types/three",
			"eslint-config-next",
			"next",
			"react",
			"react-dom",
			"react-material-ui-carousel",
			"three",
		].includes(packageName)
	) {
		return "upgrade-unit";
	}
	return dependencySections.get(packageName) === "development" ? "keep-dev" : "keep";
}

function runtimeScope(packageName, consumers) {
	const scopes = new Set();
	for (const consumer of consumers) {
		if (
			consumer.startsWith("pages/api/") ||
			consumer.startsWith("server/") ||
			consumer.startsWith("utils/creativa/") ||
			consumer.startsWith("utils/keychain/")
		) {
			scopes.add("worker");
		}
		if (consumer.startsWith("scripts/") || consumer.endsWith(".config.js") || consumer.endsWith(".config.ts")) {
			scopes.add("build");
		}
		if (consumer.startsWith("components/") || consumer.startsWith("pages/")) scopes.add("browser");
		if (consumer.includes(".test.") || consumer.includes(".spec.")) scopes.add("test");
	}
	if (dependencySections.get(packageName) === "development") scopes.add("dev-test");
	if (!scopes.size) scopes.add(packageName === "sharp" ? "worker-risk" : "direct-unused");
	return [...scopes].sort();
}

const installed = JSON.parse(
	execFileSync("pnpm", ["list", "--json", "--depth=0"], { cwd: root, encoding: "utf8" }),
);
const installedByName = new Map();
for (const collection of installed) {
	for (const [section, dependencies] of Object.entries(collection)) {
		if (section !== "dependencies" && section !== "devDependencies") continue;
		for (const [name, detail] of Object.entries(dependencies ?? {})) {
			installedByName.set(name, detail);
		}
	}
}

const sourceFiles = await walk(root);
const sourceContents = await Promise.all(
	sourceFiles.map(async (file) => [path.relative(root, file).replaceAll(path.sep, "/"), await readFile(file, "utf8")]),
);
const dependencies = [];

for (const [name, declaredVersion] of Object.entries(directDependencies).sort(([left], [right]) =>
	left.localeCompare(right),
)) {
	const importPattern = new RegExp(
		`(?:from\\s*|import\\s*\\(|require\\s*\\()["']${escapeRegex(name)}(?:/[^"']*)?["']`,
	);
	const consumers = sourceContents
		.filter(([, source]) => importPattern.test(source))
		.map(([file]) => file)
		.sort();
	const installedPackage = installedByName.get(name);
	const packagePath = path.join(root, "node_modules", ...name.split("/"), "package.json");
	let metadata = null;
	try {
		metadata = JSON.parse(await readFile(packagePath, "utf8"));
	} catch (error) {
		if (error?.code !== "ENOENT") throw error;
	}
	dependencies.push({
		package: name,
		declaredVersion,
		resolvedVersion: installedPackage?.version ?? null,
		installed: Boolean(installedPackage && metadata),
		section: dependencySections.get(name),
		license: metadata?.license ?? null,
		peerConstraints: metadata?.peerDependencies ?? {},
		consumers,
		scope: runtimeScope(name, consumers),
		migrationAction: migrationAction(name),
		ownerDecision: null,
	});
}

await mkdir(outputDir, { recursive: true });
await writeFile(
	path.join(outputDir, "dependencies.json"),
	`${JSON.stringify(
		{
			schemaVersion: 1,
			count: dependencies.length,
			dependencies,
		},
		null,
		2,
	)}\n`,
);

console.log(`Inventoried ${dependencies.length} direct dependencies.`);
