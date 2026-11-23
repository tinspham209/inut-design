import assert from "node:assert/strict";
import { client } from "../api-client/sanity-browser.ts";
import { getHomepageContent, HOMEPAGE_CONTENT_QUERY } from "../api-client/homepage.ts";
import { dynamicDocuments, SEARCH_DYNAMIC_SOURCES_QUERY } from "../server/search/dynamic-sources.ts";
import { createExpiringPromiseCache, SEARCH_CORPUS_TTL_MS } from "../server/search/expiring-promise-cache.ts";

const originalFetchDescriptor = Object.getOwnPropertyDescriptor(client, "fetch");
const originalNow = Date.now;
const calls = [];
let mockTime = 1_000;
Date.now = () => mockTime;
Object.defineProperty(client, "fetch", {
	configurable: true,
	writable: true,
	value: async (query) => {
		calls.push(query);
		if (query === HOMEPAGE_CONTENT_QUERY) {
			return { banner: [], products: [], macnuts: [], lighters: [] };
		}
		if (query === SEARCH_DYNAMIC_SOURCES_QUERY) {
			return { products: [], macnuts: [], lighters: [], productTypes: [], macnutTypes: [] };
		}
		throw new Error("Unexpected external content query in local measurement");
	},
});

try {
	for (let i = 0; i < 85; i += 1) await getHomepageContent();
	assert.equal(calls.length, 85, "homepage must use one grouped fetch per regeneration");
	assert.ok(calls.every((query) => query === HOMEPAGE_CONTENT_QUERY));

	calls.length = 0;
	await dynamicDocuments();
	assert.equal(calls.length, 1, "search dynamic sources must use one grouped fetch");
	assert.ok(calls[0].includes('"products"'));
	assert.ok(calls[0].includes('"macnuts"'));
	assert.ok(calls[0].includes('"lighters"'));
	assert.ok(calls[0].includes('"productTypes"'));
	assert.ok(calls[0].includes('"macnutTypes"'));

	calls.length = 0;
	const corpusCache = createExpiringPromiseCache(SEARCH_CORPUS_TTL_MS);
	await corpusCache.get(dynamicDocuments);
	await corpusCache.get(dynamicDocuments);
	assert.equal(calls.length, 1, "warm corpus must coalesce and reuse one grouped fetch");
	mockTime += SEARCH_CORPUS_TTL_MS + 1;
	await corpusCache.get(dynamicDocuments);
	assert.equal(calls.length, 2, "expired corpus must refresh once");

	console.log(
		JSON.stringify({
			homepageRegenerations: 85,
			homepageGroupedReads: 85,
			searchDynamicGroupedReadsPerRefresh: 1,
			searchWarmReads: 1,
			searchReadsAfter24HourExpiry: 2,
			searchTtlHours: SEARCH_CORPUS_TTL_MS / 3_600_000,
			externalCalls: 0,
		})
	);
} finally {
	Date.now = originalNow;
	if (originalFetchDescriptor) Object.defineProperty(client, "fetch", originalFetchDescriptor);
	else delete client.fetch;
}
