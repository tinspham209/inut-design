import { register } from "node:module";
import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

import grayMatter from "gray-matter";

const root = process.cwd();
const outputPath = path.join(root, "artifacts/migration/baseline/slugs.json");
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const errors = [];

register("./scripts/typescript-loader.mjs", pathToFileURL("./"));

function ensureUnique(values, family) {
	const seen = new Set();
	for (const value of values) {
		if (typeof value !== "string" || !value) {
			errors.push(`${family}: blank or non-string slug.`);
			continue;
		}
		for (const segment of value.split("/")) {
			if (!slugPattern.test(segment)) errors.push(`${family}: invalid slug segment "${segment}".`);
		}
		if (seen.has(value)) errors.push(`${family}: duplicate slug "${value}".`);
		seen.add(value);
	}
}

function stringsFromSlugRecords(records, family) {
	return records
		.map((record) => record?.slug?.current)
		.filter((slug) => {
			if (typeof slug !== "string") {
				errors.push(`${family}: slug object is missing slug.current.`);
				return false;
			}
			return true;
		})
		.sort();
}

async function collectBlogSlugs() {
	const files = (await readdir(path.join(root, "blog"))).filter((file) => file.endsWith(".md")).sort();
	return Promise.all(
		files.map(async (file) => {
			const source = await readFile(path.join(root, "blog", file), "utf8");
			const slug = grayMatter(source).data.slug;
			if (typeof slug !== "string") errors.push(`blog: ${file} is missing frontmatter slug.`);
			return slug;
		}),
	);
}

async function collectServicePaths() {
	const source = await readFile(path.join(root, "components/common/header/routes.ts"), "utf8");
	return [...source.matchAll(/path:\s*["'](\/services(?:\/[^"']+)+)["']/g)]
		.map((match) => match[1].slice("/services/".length))
		.sort();
}

async function collectSanitySlugs() {
	for (const envFile of [".env", ".env.local", ".env.development", ".env.development.local"]) {
		const absolutePath = path.join(root, envFile);
		if (existsSync(absolutePath)) process.loadEnvFile(absolutePath);
	}
	const [{ lightersApi }, { productsApi }, { getCreativaCatalog }] = await Promise.all([
		import("@/api-client/lighters"),
		import("@/api-client/products"),
		import("@/api-client/creativa-catalog"),
	]);

	let creativa = [];
	let cursor;
	try {
		do {
			const page = await getCreativaCatalog("", cursor);
			creativa.push(...page.items.map((product) => product?.slug?.current));
			cursor = page.cursor;
		} while (cursor);
	} catch {
		throw new Error("Unable to read approved Creativa slugs; Sanity public read access is required.");
	}

	let lighterRecords;
	let laptopRecords;
	let macnutRecords;
	try {
		[lighterRecords, laptopRecords, macnutRecords] = await Promise.all([
			lightersApi.getAllLighterSlugs(),
			productsApi.getAllSlugs(),
			productsApi.getAllSlugsMacnut(),
		]);
	} catch {
		throw new Error("Unable to read approved product slugs; Sanity public read access is required.");
	}

	return {
		lighters: stringsFromSlugRecords(lighterRecords, "lighters"),
		laptop: stringsFromSlugRecords(laptopRecords, "laptop"),
		macnut: stringsFromSlugRecords(macnutRecords, "macnut"),
		creativa: creativa.sort(),
	};
}

const [blog, services, sanity] = await Promise.all([
	collectBlogSlugs(),
	collectServicePaths(),
	collectSanitySlugs(),
]);

const families = [
	{ family: "blog", routePrefix: "/blog", source: "blog/**/*.md frontmatter", slugs: blog.sort() },
	{
		family: "services",
		routePrefix: "/services",
		source: "components/common/header/routes.ts",
		slugs: services,
	},
	{
		family: "lighters",
		routePrefix: "/san-pham/lighters",
		source: "Sanity lighterProducts published documents",
		slugs: sanity.lighters,
	},
	{
		family: "laptop",
		routePrefix: "/san-pham/skin-laptop",
		source: "Sanity products published documents",
		slugs: sanity.laptop,
	},
	{
		family: "macnut",
		routePrefix: "/san-pham/skin-nut-phim",
		source: "Sanity macnut published documents",
		slugs: sanity.macnut,
	},
	{
		family: "creativa",
		routePrefix: "/creativa/skin-laptop",
		source: "Sanity Creativa eligible published catalog",
		slugs: sanity.creativa,
	},
].map((entry) => {
	const slugs = entry.slugs.filter((slug) => typeof slug === "string" && slug.length > 0);
	ensureUnique(slugs, entry.family);
	return {
		...entry,
		slugs,
		count: slugs.length,
		paths: slugs.map((slug) => `${entry.routePrefix}/${slug}`).sort(),
	};
});

const paths = families.flatMap((family) => family.paths);
const duplicatePaths = paths.filter((record, index) => paths.indexOf(record) !== index);
for (const duplicate of new Set(duplicatePaths)) errors.push(`Duplicate generated path ${duplicate}.`);

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(
	outputPath,
	`${JSON.stringify(
		{
			schemaVersion: 1,
			families,
			count: paths.length,
			paths: paths.sort(),
			validation: {
				status: errors.length ? "fail" : "pass",
				errors,
			},
		},
		null,
		2,
	)}\n`,
);
console.log(
	`Captured ${paths.length} slugs across ${families.length} route families; ${errors.length} validation issue(s) retained.`,
);
