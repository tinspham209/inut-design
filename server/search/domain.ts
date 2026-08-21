export const SEARCH_MAX_QUERY_LENGTH = 80;
export const SEARCH_DEFAULT_PAGE_SIZE = 24;
export const SEARCH_MAX_PAGE_SIZE = 48;
export const SEARCH_MAX_PAGE = 100;

export type SearchKind =
	| "product"
	| "macnut"
	| "lighter"
	| "service"
	| "blog"
	| "information";

export type SearchDocument = {
	id: string;
	url: string;
	kind: SearchKind;
	kindLabel: string;
	title: string;
	category?: string;
	slug?: string;
	excerpt?: string;
	body?: string;
	facetSlugs?: string[];
	sourcePrecedence: number;
};

export type SearchResult = {
	id: string;
	kind: SearchKind;
	kindLabel: string;
	title: string;
	excerpt: string;
	url: string;
};

export type SearchRequest = {
	query: string;
	terms: string[];
	page: number;
	pageSize: number;
	facet?: string;
};

export type SearchPage = {
	items: SearchResult[];
	total: number;
	page: number;
	pageSize: number;
	hasMore: boolean;
};

export type SearchParamValue = string | string[] | undefined;

export type SearchParams = {
	q?: SearchParamValue;
	productType?: SearchParamValue;
	page?: SearchParamValue;
	pageSize?: SearchParamValue;
};

export type ParsedSearchRequest =
	| { status: "prompt"; reason: "missing" | "blank" | "invalid" }
	| { status: "valid"; request: SearchRequest };

export const normalizeSearchText = (value: string): string =>
	value
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[đĐ]/g, "d")
		.toLocaleLowerCase()
		.replace(/\s+/g, " ")
		.trim();

const isSingleValue = (value: SearchParamValue): value is string =>
	typeof value === "string";

const parsePositiveInteger = (value: SearchParamValue, fallback: number): number | null => {
	if (value === undefined) return fallback;
	if (!isSingleValue(value) || !/^\d+$/.test(value)) return null;

	const parsed = Number(value);
	return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
};

export function parseSearchParams(params: SearchParams): ParsedSearchRequest {
	if (!isSingleValue(params.q)) {
		return {
			status: "prompt",
			reason: params.q === undefined ? "missing" : "invalid",
		};
	}

	const query = params.q.replace(/\s+/g, " ").trim();
	if (!query) return { status: "prompt", reason: "blank" };
	if (query.length > SEARCH_MAX_QUERY_LENGTH) {
		return { status: "prompt", reason: "invalid" };
	}

	let facet: string | undefined;
	if (params.productType !== undefined) {
		if (!isSingleValue(params.productType)) {
			return { status: "prompt", reason: "invalid" };
		}
		facet = normalizeSearchText(params.productType);
		if (!facet) return { status: "prompt", reason: "invalid" };
	}

	const page = parsePositiveInteger(params.page, 1);
	const pageSize = parsePositiveInteger(params.pageSize, SEARCH_DEFAULT_PAGE_SIZE);
	if (
		page === null ||
		pageSize === null ||
		page > SEARCH_MAX_PAGE ||
		pageSize > SEARCH_MAX_PAGE_SIZE
	) {
		return { status: "prompt", reason: "invalid" };
	}

	const normalizedQuery = normalizeSearchText(query);
	const terms = normalizedQuery.split(" ").filter(Boolean);
	if (terms.length === 0) return { status: "prompt", reason: "blank" };

	return {
		status: "valid",
		request: {
			query,
			terms,
			page,
			pageSize,
			facet,
		},
	};
}

const fieldValue = (value?: string): string => normalizeSearchText(value || "");

const hasAllTerms = (document: SearchDocument, terms: string[]): boolean => {
	const searchableText = [
		document.title,
		document.category,
		document.slug,
		document.excerpt,
		document.body,
	]
		.map(fieldValue)
		.join(" ");

	return terms.every((term) => searchableText.includes(term));
};

const bestFieldScore = (document: SearchDocument, query: string, terms: string[]): number => {
	const title = fieldValue(document.title);
	const category = fieldValue(document.category);
	const slug = fieldValue(document.slug);
	const excerpt = fieldValue(document.excerpt);
	const body = fieldValue(document.body);

	if (title === query) return 600;
	if (title.startsWith(query)) return 500;
	if (terms.some((term) => title.includes(term))) return 400;
	if (terms.some((term) => category.includes(term) || slug.includes(term))) return 300;
	if (terms.some((term) => excerpt.includes(term))) return 200;
	if (terms.some((term) => body.includes(term))) return 100;
	return 0;
};

const isFacetEligible = (document: SearchDocument): boolean =>
	document.kind === "product" || document.kind === "macnut";

const compareResults = (a: SearchResultWithScore, b: SearchResultWithScore): number => {
	if (a.score !== b.score) return b.score - a.score;
	if (a.document.sourcePrecedence !== b.document.sourcePrecedence) {
		return a.document.sourcePrecedence - b.document.sourcePrecedence;
	}

	const titleOrder = a.document.title.localeCompare(b.document.title, "vi", {
		sensitivity: "base",
	});
	if (titleOrder !== 0) return titleOrder;
	return a.document.url.localeCompare(b.document.url);
};

type SearchResultWithScore = {
	document: SearchDocument;
	score: number;
};

const toExcerpt = (document: SearchDocument, terms: string[]): string => {
	const source = document.excerpt || document.body || document.title || "";
	const plainText = source
		.replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
		.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
		.replace(/[`*_>#~-]/g, " ")
		.replace(/<[^>]*>/g, " ")
		.replace(/\s+/g, " ")
		.trim();

	if (plainText.length <= 180) return plainText;

	const normalized = normalizeSearchText(plainText);
	const matchIndex = terms
		.map((term) => normalized.indexOf(term))
		.filter((index) => index >= 0)
		.sort((a, b) => a - b)[0];
	const start = Math.max(0, (matchIndex || 0) - 60);
	const excerpt = plainText.slice(start, start + 180).trim();
	return `${start > 0 ? "... " : ""}${excerpt}${start + 180 < plainText.length ? " ..." : ""}`;
};

const toPublicResult = (document: SearchDocument, terms: string[]): SearchResult => ({
	id: document.id,
	kind: document.kind,
	kindLabel: document.kindLabel,
	title: document.title,
	excerpt: toExcerpt(document, terms),
	url: document.url,
});

export function searchDocuments(
	documents: SearchDocument[],
	request: SearchRequest,
	legacyTypeSlugs: string[] = []
): SearchPage {
	const normalizedLegacySlugs = new Set(legacyTypeSlugs.map(normalizeSearchText));
	const normalizedQuery = normalizeSearchText(request.query);
	const isLegacyTypeQuery =
		!request.facet && normalizedLegacySlugs.has(normalizedQuery);

	const matching = documents
		.filter((document) => {
			if (request.facet && isFacetEligible(document)) {
				const facets = (document.facetSlugs || []).map(normalizeSearchText);
				if (!facets.includes(request.facet)) return false;
			}

			if (isLegacyTypeQuery) {
				return (
					isFacetEligible(document) &&
					(document.facetSlugs || []).some(
						(slug) => normalizeSearchText(slug) === normalizedQuery
					)
				);
			}

			return hasAllTerms(document, request.terms);
		})
		.map((document) => ({
			document,
			score: isLegacyTypeQuery
				? 350
				: bestFieldScore(document, normalizedQuery, request.terms),
		}))
		.filter((result) => result.score > 0)
		.sort(compareResults);

	const bestByUrl = new Map<string, SearchResultWithScore>();
	for (const result of matching) {
		const existing = bestByUrl.get(result.document.url);
		if (!existing || compareResults(result, existing) < 0) {
			bestByUrl.set(result.document.url, result);
		}
	}

	const deduped = Array.from(bestByUrl.values()).sort(compareResults);
	const start = (request.page - 1) * request.pageSize;
	const items = deduped
		.slice(start, start + request.pageSize)
		.map(({ document }) => toPublicResult(document, request.terms));

	return {
		items,
		total: deduped.length,
		page: request.page,
		pageSize: request.pageSize,
		hasMore: start + items.length < deduped.length,
	};
}
