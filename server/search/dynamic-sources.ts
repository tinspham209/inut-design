import { client } from "@/api-client/sanity-browser";
import { SearchDocument, SearchKind } from "./domain";

export type SearchFacetOption = {
	slug: string;
	name: string;
};

type SearchDynamicSources = {
	products: SanitySearchRecord[];
	macnuts: SanitySearchRecord[];
	lighters: SanitySearchRecord[];
	productTypes: SearchFacetOption[];
	macnutTypes: SearchFacetOption[];
};

type SanitySearchRecord = {
	_id?: string;
	_type?: string;
	name?: string;
	slug?: string;
	details?: unknown;
	productType?: { name?: string; slug?: string };
	macnutType?: { name?: string; slug?: string };
	lighterType?: { name?: string; slug?: string };
};

export const SEARCH_DYNAMIC_SOURCES_QUERY = `{
	"products": *[_type == "products" && !(_id in path("drafts.**")) && defined(name) && defined(slug.current)]{
		_id, _type, name, "slug": slug.current, details,
		"productType": productType->{name, "slug": slug.current},
		"macnutType": macnutType->{name, "slug": slug.current}
	} | order(_createdAt desc),
	"macnuts": *[_type == "macnut" && !(_id in path("drafts.**")) && defined(name) && defined(slug.current)]{
		_id, _type, name, "slug": slug.current, details,
		"productType": productType->{name, "slug": slug.current},
		"macnutType": macnutType->{name, "slug": slug.current}
	} | order(_createdAt desc),
	"lighters": *[_type == "lighterProducts" && !(_id in path("drafts.**")) && defined(name) && defined(slug.current)]{
		_id, _type, name, "slug": slug.current, details,
		"lighterType": lighterType->{name, "slug": slug.current}
	} | order(_createdAt desc),
	"productTypes": *[_type == "productType" && !(_id in path("drafts.**")) && defined(name) && defined(slug.current)]{name, "slug": slug.current},
	"macnutTypes": *[_type == "macnutType" && !(_id in path("drafts.**")) && defined(name) && defined(slug.current)]{name, "slug": slug.current}
}`;

const isSearchDynamicSources = (value: unknown): value is SearchDynamicSources => {
	if (!value || typeof value !== "object") return false;
	const sources = value as Record<string, unknown>;
	return ["products", "macnuts", "lighters", "productTypes", "macnutTypes"].every((key) =>
		Array.isArray(sources[key])
	);
};

const plainRichText = (value: unknown): string => {
	if (typeof value === "string") return value;
	if (Array.isArray(value)) return value.map(plainRichText).filter(Boolean).join(" ");
	if (!value || typeof value !== "object") return "";
	const record = value as { text?: unknown; children?: unknown };
	if (record.text) return plainRichText(record.text);
	if (record.children) return plainRichText(record.children);
	return "";
};

export async function dynamicDocuments(): Promise<{
	documents: SearchDocument[];
	facets: SearchFacetOption[];
	legacyTypeSlugs: string[];
}> {
	const grouped = await client.fetch<unknown>(SEARCH_DYNAMIC_SOURCES_QUERY);
	if (!isSearchDynamicSources(grouped)) {
		throw new Error("Search content source returned an incomplete grouped result");
	}
	const { products, macnuts, lighters, productTypes, macnutTypes } = grouped;
	const toDocument = (
		record: SanitySearchRecord,
		kind: SearchKind,
		kindLabel: string,
		basePath: string,
		sourcePrecedence: number
	): SearchDocument | null => {
		if (!record._id || !record.name || !record.slug) return null;
		const type =
			kind === "product"
				? record.productType
				: kind === "macnut"
					? record.macnutType
					: record.lighterType;
		const facetSlugs =
			kind === "product" || kind === "macnut"
				? [record.productType?.slug, record.macnutType?.slug].filter(Boolean)
				: [];
		const typeName = type?.name || "";
		return {
			id: record._id,
			url: `${basePath}/${record.slug}`,
			kind,
			kindLabel,
			title: record.name,
			category: typeName || kindLabel,
			slug: record.slug,
			excerpt: typeName,
			body: plainRichText(record.details),
			facetSlugs,
			sourcePrecedence,
		};
	};
	const documents = [
		...products
			.map((record) => toDocument(record, "product", "Skin Laptop", "/san-pham/skin-laptop", 1))
			.filter((record): record is SearchDocument => Boolean(record)),
		...macnuts
			.map((record) => toDocument(record, "macnut", "Skin Nút Phím", "/san-pham/skin-nut-phim", 2))
			.filter((record): record is SearchDocument => Boolean(record)),
		...lighters
			.map((record) => toDocument(record, "lighter", "Bật lửa", "/san-pham/lighters", 3))
			.filter((record): record is SearchDocument => Boolean(record)),
	];
	const facets = [...productTypes, ...macnutTypes].filter(
		(facet): facet is SearchFacetOption => Boolean(facet?.name && facet?.slug)
	);
	return { documents, facets, legacyTypeSlugs: facets.map((facet) => facet.slug) };
}
