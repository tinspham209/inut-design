import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const baselineDir = path.join(root, "artifacts/migration/baseline");
const outputPath = path.join(root, "artifacts/migration/runtime/static/manifest.json");

async function json(relativePath) {
	return JSON.parse(await readFile(path.join(root, relativePath), "utf8"));
}

function sorted(values) {
	return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

function isPublicRoute(route) {
	return (
		route.startsWith("/") &&
		!route.startsWith("/api/") &&
		!route.includes("[") &&
		!["/404", "/500", "/_app", "/_document", "/_error"].includes(route)
	);
}

const [routes, slugs, pagesManifest, prerenderManifest] = await Promise.all([
	json("artifacts/migration/baseline/routes.json"),
	json("artifacts/migration/runtime/current-slugs.json"),
	json(".next/server/pages-manifest.json"),
	json(".next/prerender-manifest.json"),
]);

if (slugs.validation?.status !== "pass" || !Array.isArray(slugs.paths)) throw new Error("Current slug inventory is invalid");
const expected = sorted([
	...routes.routes.filter((route) => !route.path.includes("[")).map((route) => route.path),
	...slugs.paths,
]);
const generated = sorted([
	...Object.keys(pagesManifest).filter(
		(route) => isPublicRoute(route),
	),
	...Object.keys(prerenderManifest.routes ?? {}).filter(isPublicRoute),
]);
const missing = expected.filter((route) => !generated.includes(route));
const unexpected = generated.filter((route) => !expected.includes(route));
const report = {
	schemaVersion: 1,
	generatedAt: new Date().toISOString(),
	expectedCount: expected.length,
	generatedCount: generated.length,
	expected,
	generated,
	missing,
	unexpected,
	status: missing.length || unexpected.length ? "fail" : "pass",
};

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`);

if (report.status !== "pass") {
	console.error(
		`Static manifest differs from baseline: ${missing.length} missing, ${unexpected.length} unexpected.`,
	);
	process.exitCode = 1;
} else {
	console.log(`Static manifest reconciled ${generated.length} generated public paths.`);
}
