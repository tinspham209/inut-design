import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const pagesDir = path.join(root, "pages");
const baselineDir = path.join(root, "artifacts/migration/baseline");
const errors = [];

function routeFromFile(file) {
	const relative = path.relative(pagesDir, file).replaceAll(path.sep, "/");
	const route = relative.replace(/\.(ts|tsx|js|jsx)$/, "").replace(/\/index$/, "");
	return route === "index" ? "/" : `/${route}`;
}

function renderMode(source) {
	if (source.includes("getServerSideProps")) return "ssr";
	if (source.includes("revalidate")) return "isr";
	if (source.includes("getStaticProps") || source.includes("getStaticPaths")) return "ssg";
	return "static";
}

function fallbackMode(source) {
	const match = source.match(/fallback:\s*(false|true|["']blocking["'])/);
	return match ? match[1].replaceAll(/["']/g, "") : "none";
}

async function walk(directory) {
	const entries = await readdir(directory, { withFileTypes: true });
	const files = await Promise.all(
		entries.map((entry) => {
			const absolutePath = path.join(directory, entry.name);
			return entry.isDirectory() ? walk(absolutePath) : absolutePath;
		}),
	);
	return files.flat();
}

async function loadJson(name) {
	return JSON.parse(await readFile(path.join(baselineDir, name), "utf8"));
}

async function loadNextConfig() {
	const url = `${pathToFileURL(path.join(root, "next.config.js")).href}?verify=${Date.now()}`;
	return (await import(url)).default;
}

const baselineRoutes = await loadJson("routes.json");
const baselineHttp = await loadJson("http-expectations.json");
const baselineRedirects = await loadJson("redirects.json");
const nextConfig = await loadNextConfig();
const publicFiles = (await walk(pagesDir)).filter(
	(file) =>
		/\.(ts|tsx|js|jsx)$/.test(file) &&
		!file.startsWith(`${path.join(pagesDir, "api")}${path.sep}`) &&
		!["/_app.", "/_document.", "/404.", "/500.", "/_error."].some((suffix) =>
			file.replaceAll(path.sep, "/").includes(suffix),
		),
);

const currentRoutes = await Promise.all(
	publicFiles.map(async (file) => {
		const source = await readFile(file, "utf8");
		return {
			path: routeFromFile(file),
			file: path.relative(root, file).replaceAll(path.sep, "/"),
			renderMode: renderMode(source),
			getStaticPathsMode: fallbackMode(source),
		};
	}),
).then((routes) => routes.sort((left, right) => left.path.localeCompare(right.path)));

if (currentRoutes.length !== 74) errors.push(`Expected 74 public page modules; found ${currentRoutes.length}.`);
if (baselineRoutes.count !== 74) errors.push(`Baseline routes.json count must be 74; found ${baselineRoutes.count}.`);

for (const baseline of baselineRoutes.routes) {
	const current = currentRoutes.find((route) => route.path === baseline.path);
	if (!current) {
		errors.push(`Missing public route ${baseline.path} (${baseline.file}).`);
		continue;
	}
	if (current.file !== baseline.file) errors.push(`${baseline.path}: file changed from ${baseline.file} to ${current.file}.`);
}

for (const current of currentRoutes) {
	if (!baselineRoutes.routes.some((route) => route.path === current.path)) {
		errors.push(`Unexpected public route ${current.path} (${current.file}).`);
	}
}

for (const expected of baselineHttp.routes) {
	const baseline = baselineRoutes.routes.find((route) => route.path === expected.path);
	if (!baseline) {
		errors.push(`HTTP expectation references unknown route ${expected.path}.`);
		continue;
	}
	const canonical = baseline.canonicalUrl === "https://inutdesign.com/"
		? "https://inutdesign.com/"
		: `https://inutdesign.com${expected.path}`;
	if (expected.status !== 200) errors.push(`${expected.path}: baseline status must be 200, found ${expected.status}.`);
	if (expected.canonicalUrl !== canonical) {
		errors.push(`${expected.path}: invalid canonical expectation ${expected.canonicalUrl}; expected ${canonical}.`);
	}
}

const currentRedirects = ((await nextConfig.redirects?.()) ?? [])
	.map((redirect) => ({
		...redirect,
		status: redirect.permanent ? 308 : 307,
	}))
	.sort((left, right) => left.source.localeCompare(right.source));
if (JSON.stringify(currentRedirects) !== JSON.stringify(baselineRedirects.redirects)) {
	errors.push("Redirect rules differ from artifacts/migration/baseline/redirects.json.");
}

const currentHeaders = (await nextConfig.headers?.()) ?? [];
if (JSON.stringify(currentHeaders) !== JSON.stringify(baselineHttp.headers)) {
	errors.push("Header rules differ from artifacts/migration/baseline/http-expectations.json.");
}

if (errors.length) {
	console.error(`Route manifest verification failed (${errors.length}):`);
	for (const error of errors) console.error(`- ${error}`);
	process.exitCode = 1;
} else {
	console.log(`Verified ${currentRoutes.length} public route modules, redirects, and header rules.`);
}
