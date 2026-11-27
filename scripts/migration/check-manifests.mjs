import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const baselineDir = path.join(root, "artifacts/migration/baseline");
const errors = [];
const required = [
	"routes.json",
	"apis.json",
	"slugs.json",
	"redirects.json",
	"sitemap.json",
	"robots.json",
	"http-expectations.json",
	"dependencies.json",
	"env-names.json",
	"call-sites.json",
	"source.json",
	"vinext-check.txt",
];

async function loadJson(file) {
	const absolute = path.join(baselineDir, file);
	try {
		await access(absolute);
		return JSON.parse(await readFile(absolute, "utf8"));
	} catch (error) {
		errors.push(`Missing or invalid baseline artifact ${file}: ${error.message.split("\n")[0]}`);
		return null;
	}
}

function assertSorted(values, label) {
	const sorted = [...values].sort((left, right) => left.localeCompare(right));
	if (JSON.stringify(values) !== JSON.stringify(sorted)) errors.push(`${label} is not sorted.`);
}

function assertUnique(values, label) {
	const duplicates = values.filter((value, index) => values.indexOf(value) !== index);
	for (const duplicate of new Set(duplicates)) errors.push(`${label} contains duplicate ${duplicate}.`);
}

const [
	routes,
	apis,
	slugs,
	redirects,
	sitemap,
	dependencies,
	envNames,
	source,
] = await Promise.all([
	loadJson("routes.json"),
	loadJson("apis.json"),
	loadJson("slugs.json"),
	loadJson("redirects.json"),
	loadJson("sitemap.json"),
	loadJson("dependencies.json"),
	loadJson("env-names.json"),
	loadJson("source.json"),
]);

for (const file of required.filter(
	(name) => !["routes.json", "apis.json", "slugs.json", "redirects.json", "sitemap.json", "dependencies.json", "env-names.json", "source.json"].includes(name),
)) {
	await access(path.join(baselineDir, file)).catch(() => errors.push(`Missing baseline artifact ${file}.`));
}

if (routes) {
	if (routes.schemaVersion !== 1) errors.push("routes.json has unsupported schemaVersion.");
	if (routes.count !== 74 || routes.routes?.length !== 74) {
		errors.push(`routes.json must contain 74 public modules; found ${routes.routes?.length ?? 0}.`);
	}
	const paths = routes.routes?.map((record) => record.path) ?? [];
	assertSorted(paths, "routes.json paths");
	assertUnique(paths, "routes.json paths");
}

if (apis) {
	if (apis.schemaVersion !== 1) errors.push("apis.json has unsupported schemaVersion.");
	if (apis.count !== 18 || apis.apis?.length !== 18) {
		errors.push(`apis.json must contain 18 routes; found ${apis.apis?.length ?? 0}.`);
	}
	const paths = apis.apis?.map((record) => record.path) ?? [];
	assertSorted(paths, "apis.json paths");
	assertUnique(paths, "apis.json paths");
}

if (slugs) {
	const familyPaths = slugs.families?.flatMap((family) => family.paths ?? []) ?? [];
	assertSorted(slugs.paths ?? [], "slugs.json paths");
	assertUnique(slugs.paths ?? [], "slugs.json paths");
	if (
		JSON.stringify([...familyPaths].sort((left, right) => left.localeCompare(right))) !==
		JSON.stringify(slugs.paths ?? [])
	) {
		errors.push("slugs.json family paths do not reconcile to its global path list.");
	}
}

if (redirects) {
	const sources = redirects.redirects?.map((record) => record.source) ?? [];
	assertSorted(sources, "redirects.json sources");
	assertUnique(sources, "redirects.json sources");
}

if (sitemap) {
	assertSorted(sitemap.urls ?? [], "sitemap.json URLs");
	assertUnique(sitemap.urls ?? [], "sitemap.json URLs");
}

if (dependencies) {
	const packages = dependencies.dependencies?.map((record) => record.package) ?? [];
	assertSorted(packages, "dependencies.json packages");
	assertUnique(packages, "dependencies.json packages");
	if (dependencies.dependencies?.some((record) => record.resolvedVersion === null && record.installed)) {
		errors.push("dependencies.json marks an installed dependency without a resolved version.");
	}
}

if (envNames) {
	const names = envNames.records?.map((record) => record.name) ?? [];
	assertSorted(names, "env-names.json names");
	assertUnique(names, "env-names.json names");
	for (const record of envNames.records ?? []) {
		for (const forbidden of ["value", "secretValue", "token", "credential"]) {
			if (forbidden in record) errors.push(`${record.name}: forbidden ${forbidden} field in env manifest.`);
		}
	}
}

if (source) {
	if (!/^[0-9a-f]{40}$/.test(source.commitSha ?? "")) errors.push("source.json is missing a full commit SHA.");
	if (!/^[0-9a-f]{64}$/.test(source.lockfileHash ?? "")) errors.push("source.json is missing a lockfile SHA-256.");
}

const runtimeDir = path.join(root, "artifacts/migration/runtime");
let runtimeFiles = [];
try {
	runtimeFiles = await readdir(runtimeDir, { recursive: true });
} catch (error) {
	if (error?.code !== "ENOENT") throw error;
}
const runtimeDeltaFiles = runtimeFiles.filter(
	(file) => typeof file === "string" && /(manifest|route|slug|api|redirect|sitemap|search)/i.test(file),
);
if (runtimeDeltaFiles.length > 0) {
	const openSpecDir = path.join(root, "openspec");
	const openSpecFiles = await readdir(openSpecDir, { recursive: true }).catch(() => []);
	const hasSpecRecord = openSpecFiles.some(
		(file) => typeof file === "string" && file.endsWith(".md"),
	);
	if (!hasSpecRecord) {
		errors.push(
			"Runtime manifest artifacts exist without a reviewed OpenSpec specification or change record under openspec/.",
		);
	}
}

if (errors.length) {
	console.error(`Manifest integrity check failed (${errors.length}):`);
	for (const error of errors) console.error(`- ${error}`);
	process.exitCode = 1;
} else {
	console.log(`Manifest integrity passed for ${required.length} baseline artifacts.`);
}
