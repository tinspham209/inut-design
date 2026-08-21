import { parseSearchParams, SearchPage, SearchParams, searchDocuments } from "./domain";
import { getSearchCorpus, SearchFacetOption } from "./sources";

export class SearchUnavailableError extends Error {
	constructor() {
		super("Search source unavailable");
		this.name = "SearchUnavailableError";
	}
}

export async function searchSite(params: SearchParams): Promise<SearchPage> {
	const { page } = await searchSiteWithFacets(params);
	return page;
}

export async function searchSiteWithFacets(
	params: SearchParams
): Promise<{ page: SearchPage; facets: SearchFacetOption[] }> {
	const parsed = parseSearchParams(params);
	if (parsed.status !== "valid") {
		throw new Error("Invalid search request");
	}

	try {
		const corpus = await getSearchCorpus();
		return {
			page: searchDocuments(corpus.documents, parsed.request, corpus.legacyTypeSlugs),
			facets: corpus.facets,
		};
	} catch (error) {
		throw new SearchUnavailableError();
	}
}

export { parseSearchParams };
export type {
	SearchDocument,
	SearchKind,
	SearchPage,
	SearchRequest,
	SearchResult,
} from "./domain";
export type { SearchFacetOption } from "./sources";
