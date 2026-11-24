import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const packageJson = JSON.parse(await readFile(path.join(root, "package.json"), "utf8"));
const lockfile = await readFile(path.join(root, "pnpm-lock.yaml"));
const baselineDir = path.join(root, "artifacts/migration/baseline");
const json = async (file) => JSON.parse(await readFile(path.join(baselineDir, file), "utf8"));
const [routes, slugs, apis, redirects, envNames] = await Promise.all([
	json("routes.json"),
	json("slugs.json"),
	json("apis.json"),
	json("redirects.json"),
	json("env-names.json"),
]);
const hashFile = async (relativePath) => {
	try {
		return createHash("sha256")
			.update(await readFile(path.join(root, relativePath)))
			.digest("hex");
	} catch (error) {
		if (error?.code === "ENOENT") return null;
		throw error;
	}
};
const channel = process.env.DEPLOYMENT_CHANNEL || "local";
const output = {
	schemaVersion: 1,
	channel,
	commitSha: execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim(),
	lockfileHash: createHash("sha256").update(lockfile).digest("hex"),
	versions: {
		node: process.version,
		pnpm: packageJson.packageManager,
		next: packageJson.dependencies.next,
		react: packageJson.dependencies.react,
		vinext: packageJson.dependencies.vinext,
		vite: packageJson.devDependencies.vite,
	},
	manifestHashes: {
		routes: createHash("sha256").update(JSON.stringify(routes)).digest("hex"),
		slugs: createHash("sha256").update(JSON.stringify(slugs)).digest("hex"),
		apis: createHash("sha256").update(JSON.stringify(apis)).digest("hex"),
		redirects: createHash("sha256").update(JSON.stringify(redirects)).digest("hex"),
		envNames: createHash("sha256").update(JSON.stringify(envNames.records.map((item) => item.name))).digest("hex"),
		searchIndex: await hashFile("public/search-index.json"),
		sitemap: await hashFile("public/sitemap.xml"),
		robots: await hashFile("public/robots.txt"),
	},
	worker: {
		moduleFiles: await readdir(
			path.join(root, ".cloudflare/output/v1/workers/default/bundle"),
			{ recursive: true },
		).catch(() => []),
		assetSummary: {
			fileCount: (await readdir(
				path.join(root, ".cloudflare/output/v1/workers/default/assets"),
				{ recursive: true },
			).catch(() => [])).length,
		},
	},
	previewVersion: process.env.CLOUDFLARE_PREVIEW_VERSION || null,
	productionVersion: process.env.CLOUDFLARE_PRODUCTION_VERSION || null,
	generatedAt: new Date().toISOString(),
};
const outputPath = path.join(root, "artifacts/migration/release/release-manifest.json");
await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(`Captured immutable release manifest for ${channel} at ${path.relative(root, outputPath)}.`);
