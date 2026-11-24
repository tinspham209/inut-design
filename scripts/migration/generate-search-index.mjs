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
		if (seenIds.has(id)) errors.push(`Duplicate search document ID ${id}.`);
		if (seenUrls.has(url)) errors.push(`Duplicate search document URL ${url}.`);
		seenIds.add(id);
		seenUrls.add(url);
		return {
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
