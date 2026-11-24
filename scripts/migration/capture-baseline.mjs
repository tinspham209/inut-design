import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

import { apiContracts } from "./api-contracts.mjs";

const root = process.cwd();
const pagesDir = path.join(root, "pages");
const outputDir = path.join(root, "artifacts/migration/baseline");
const productionOrigin = "https://inutdesign.com";

async function readText(relativePath) {
	const absolutePath = path.join(root, relativePath);
	return existsSync(absolutePath) ? readFile(absolutePath, "utf8") : null;
}

function git(...args) {
	return execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
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

function routeFromFile(file) {
	const relative = path.relative(pagesDir, file).replaceAll(path.sep, "/");
	const withoutExtension = relative.replace(/\.(ts|tsx|js|jsx)$/, "");
	const route = withoutExtension === "index" ? "/" : `/${withoutExtension.replace(/\/index$/, "")}`;
	return route;
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

async function collectRoutes() {
	const files = (await walk(pagesDir)).filter(
		(file) =>
			/\.(ts|tsx|js|jsx)$/.test(file) &&
			!file.startsWith(`${path.join(pagesDir, "api")}${path.sep}`) &&
			!["/_app.", "/_document.", "/404.", "/500.", "/_error."].some((suffix) =>
				file.replaceAll(path.sep, "/").includes(suffix),
			),
	);

	return Promise.all(
		files.map(async (file) => {
			const source = await readFile(file, "utf8");
			const relativeFile = path.relative(root, file).replaceAll(path.sep, "/");
			const mode = renderMode(source);
			return {
				path: routeFromFile(file),
				file: relativeFile,
				renderMode: mode,
				getStaticPathsMode: fallbackMode(source),
				status: 200,
				canonicalUrl: productionOrigin + (routeFromFile(file) === "/" ? "/" : routeFromFile(file)),
				requiresData: source.includes("getStaticProps") || source.includes("getServerSideProps"),
			};
		}),
	).then((routes) => routes.sort((left, right) => left.path.localeCompare(right.path)));
}

async function loadNextConfig() {
	const moduleUrl = `${pathToFileURL(path.join(root, "next.config.js")).href}?baseline=${Date.now()}`;
	const loaded = await import(moduleUrl);
	return loaded.default;
}

async function writeJson(name, value) {
	const serialized = `${JSON.stringify(value, null, 2)}\n`;
	await writeFile(path.join(outputDir, name), serialized);
}

const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
const lockfile = await readText("pnpm-lock.yaml");
const sitemap = await readText("public/sitemap.xml");
const robots = await readText("public/robots.txt");
const nextConfig = await loadNextConfig();
const rawRoutes = await collectRoutes();
const redirects = (await nextConfig.redirects?.()) ?? [];
const headers = (await nextConfig.headers?.()) ?? [];

await mkdir(outputDir, { recursive: true });

await writeJson("source.json", {
	schemaVersion: 1,
	commitSha: git("rev-parse", "HEAD"),
	branch: git("branch", "--show-current"),
	capturedAt: new Date().toISOString(),
	dirtyFiles: git("status", "--short")
		.split("\n")
		.filter(Boolean)
		.map((line) => line.slice(3))
		.sort(),
	toolVersions: {
		node: process.version,
		pnpm: execFileSync("pnpm", ["--version"], { cwd: root, encoding: "utf8" }).trim(),
		next: packageJson.dependencies?.next ?? null,
		react: packageJson.dependencies?.react ?? null,
		reactDom: packageJson.dependencies?.["react-dom"] ?? null,
	},
	lockfileHash: lockfile ? createHash("sha256").update(lockfile).digest("hex") : null,
});

await writeJson("routes.json", {
	schemaVersion: 1,
	productionOrigin,
	count: rawRoutes.length,
	routes: rawRoutes,
});

await writeJson("apis.json", {
	schemaVersion: 1,
	count: apiContracts.length,
	apis: apiContracts.map((contract) => ({
		...contract,
		file: `pages${contract.path
			.replace("[publicId]", "[publicId]")
			.replace(/\[(slug|publicId|id)\]/g, "[$1]")
			.replace(/^\/api\//, "/api/")}${
			contract.path === "/api/creativa/orders" ? "/index" : ""
		}.ts`.replace("pages/api/keychain/designs.ts", "pages/api/keychain/designs/index.ts"),
	})),
});

await writeJson("redirects.json", {
	schemaVersion: 1,
	redirects: redirects
		.map((redirect) => ({
			...redirect,
			status: redirect.permanent ? 308 : 307,
		}))
		.sort((left, right) => left.source.localeCompare(right.source)),
});

await writeJson("http-expectations.json", {
	schemaVersion: 1,
	productionOrigin,
	headers,
	routes: rawRoutes.map(({ path: routePath, status, canonicalUrl }) => ({
		path: routePath,
		status,
		canonicalUrl,
	})),
	redirects: redirects.map((redirect) => ({
		path: redirect.source,
		status: redirect.permanent ? 308 : 307,
		location: redirect.destination,
	})),
});

await writeJson("sitemap.json", {
	schemaVersion: 1,
	source: "public/sitemap.xml",
	present: sitemap !== null,
	hash: sitemap ? createHash("sha256").update(sitemap).digest("hex") : null,
	urls: sitemap
		? [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]).sort()
		: [],
});

await writeJson("robots.json", {
	schemaVersion: 1,
	source: "public/robots.txt",
	present: robots !== null,
	hash: robots ? createHash("sha256").update(robots).digest("hex") : null,
	lines: robots
		? robots
				.split("\n")
				.map((line) => line.trim())
				.filter(Boolean)
		: [],
});

console.log(
	`Captured ${rawRoutes.length} public route modules, ${redirects.length} redirects, ` +
		`and ${headers.length} header rules in ${path.relative(root, outputDir)}.`,
);
