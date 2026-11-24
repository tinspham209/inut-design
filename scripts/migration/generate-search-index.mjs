import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { register } from "node:module";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

const root = process.cwd();
register("./scripts/typescript-loader.mjs", pathToFileURL("./"));

for (const envFile of [".env", ".env.local", ".env.development", ".env.development.local"]) {
	const absolutePath = path.join(root, envFile);
	if (existsSync(absolutePath)) process.loadEnvFile(absolutePath);
}

const [
	{ getSearchCorpus },
	{ normalizeSearchText },
] = await Promise.all([import("@/server/search/sources"), import("@/server/search/client")]);
const corpus = await getSearchCorpus();
const fieldAllowList = [
	"id",
	"kind",
	"kindLabel",
	"title",
	"url",
	"summary",
	"keywords",
	"productType",
	"facetSlugs",
	"sourceHash",
	"sourcePrecedence",
];
const prohibitedFields = new Set([
	"body",
	"asset",
	"customer",
	"customerName",
	"phone",
	"email",
	"order",
	"orderItems",
	"upload",
	"token",
	"secret",
	"shareLink",
	"_ref",
	"_type",
]);
const seenIds = new Set();
const seenUrls = new Set();
const errors = [];

function hash(value) {
	return createHash("sha256").update(value).digest("hex");
}

const documents = corpus.documents
	.map((document) => {
		const id = String(document.id ?? "");
		const url = String(document.url ?? "");
		const sourceText = [
			document.title,
			document.category,
			document.slug,
			document.excerpt,
			document.body,
			...(document.facetSlugs ?? []),
		]
			.filter(Boolean)
			.join(" ");
		if (!id || !url.startsWith("/")) errors.push(`Invalid public search identity for ${url || id || "unknown"}.`);
		if (id.includes("drafts.") || id.includes("versions.")) errors.push(`Draft search document ${id}.`);
		if (seenIds.has(id)) errors.push(`Duplicate search document ID ${id}.`);
		if (seenUrls.has(url)) errors.push(`Duplicate search document URL ${url}.`);
		seenIds.add(id);
		seenUrls.add(url);
		const publicDocument = {
			id,
			kind: document.kind,
			kindLabel: document.kindLabel,
			title: document.title,
			url,
			summary: String(document.excerpt || document.body || document.title || "").slice(0, 360),
			keywords: normalizeSearchText(sourceText),
			productType: document.category ?? null,
			facetSlugs: [...new Set(document.facetSlugs ?? [])].sort(),
			sourceHash: hash(JSON.stringify(document)),
			sourcePrecedence: document.sourcePrecedence,
		};
		for (const segment of url.split("/").filter(Boolean)) {
			if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(segment)) {
				errors.push(`Invalid search URL segment "${segment}" in ${url}.`);
			}
		}
		for (const key of Object.keys(publicDocument)) {
			if (!fieldAllowList.includes(key)) errors.push(`Field ${key} is not allow-listed in ${url}.`);
			if (prohibitedFields.has(key)) errors.push(`Prohibited field ${key} leaked into ${url}.`);
		}
		return publicDocument;
	})
	.sort((left, right) => left.url.localeCompare(right.url) || left.id.localeCompare(right.id));

if (errors.length) {
	console.error(`Search index generation failed (${errors.length}):`);
	for (const error of errors) console.error(`- ${error}`);
	process.exit(1);
}

const sourceCommit = execFileSync("git", ["rev-parse", "HEAD"], {
	cwd: root,
	encoding: "utf8",
}).trim();
const documentsHash = hash(JSON.stringify(documents));
if (documents.length === 0) errors.push("Search index cannot be empty.");
if (new Set(documents.map((document) => document.id)).size !== documents.length) {
	errors.push("Search index contains duplicate document IDs.");
}
if (new Set(documents.map((document) => document.url)).size !== documents.length) {
	errors.push("Search index contains duplicate document URLs.");
}
if (errors.length) {
	console.error(`Search index validation failed (${errors.length}):`);
	for (const error of new Set(errors)) console.error(`- ${error}`);
	process.exit(1);
}
const output = {
	schemaVersion: 1,
	version: documentsHash,
	generatedAt: new Date().toISOString(),
	sourceCommit,
	documentCount: documents.length,
	documentsHash,
	fieldAllowList,
	facets: corpus.facets,
	legacyTypeSlugs: corpus.legacyTypeSlugs,
	documents,
};
const outputPath = path.join(root, "artifacts/migration/runtime/static/search-index.json");
await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(`Generated ${documents.length} public search documents at ${path.relative(root, outputPath)}.`);
