import type { SearchDocument } from "./client";

export type PublicSearchDocument = {
	id: string;
	kind: SearchDocument["kind"];
	kindLabel: string;
	title: string;
	url: string;
	summary: string;
	keywords: string;
	productType: string | null;
	facetSlugs: string[];
	sourceHash: string;
	sourcePrecedence: number;
};

export type PublicSearchIndex = {
	schemaVersion: 1;
	version: string;
	generatedAt: string;
	sourceCommit: string;
	documentCount: number;
	documentsHash: string;
	documents: PublicSearchDocument[];
	legacyTypeSlugs: string[];
};

export function isPublicSearchIndex(value: unknown): value is PublicSearchIndex {
	if (!value || typeof value !== "object") return false;
	const index = value as Partial<PublicSearchIndex>;
	return (
		index.schemaVersion === 1 &&
		typeof index.version === "string" &&
		typeof index.documentCount === "number" &&
		Array.isArray(index.documents) &&
		index.documents.length === index.documentCount &&
		Array.isArray(index.legacyTypeSlugs)
	);
}

export function toSearchDocuments(index: PublicSearchIndex): SearchDocument[] {
	return index.documents.map((document) => ({
		id: document.id,
		kind: document.kind,
		kindLabel: document.kindLabel,
		title: document.title,
		url: document.url,
		category: document.productType ?? undefined,
		excerpt: document.summary,
		body: document.keywords,
		facetSlugs: document.facetSlugs,
		sourcePrecedence: document.sourcePrecedence,
	}));
}

export async function loadPublicSearchIndex(signal?: AbortSignal): Promise<PublicSearchIndex> {
	const response = await fetch("/search-index.json", { cache: "force-cache", signal });
	if (!response.ok) throw new Error("Public search index unavailable");
	const value: unknown = await response.json();
	if (!isPublicSearchIndex(value)) throw new Error("Public search index schema is invalid");
	return value;
}
