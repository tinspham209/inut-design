import assert from "node:assert/strict";
import test from "node:test";
import { isKeychainPath, safeKeychainUrl, sanitizeKeychainProperties } from "../../utils/keychain/privacy.ts";

test("identifies the keychain route without matching unrelated paths", () => {
	assert.equal(isKeychainPath("/builder/keychain?design=private-id"), true);
	assert.equal(isKeychainPath("/builder/lighters"), false);
});

test("removes design queries, fragments, and public asset URLs from telemetry context", () => {
	assert.equal(safeKeychainUrl("https://inutdesign.com/builder/keychain?design=private-id#preview"), "https://inutdesign.com/builder/keychain");
	assert.equal(safeKeychainUrl("https://cdn.sanity.io/images/project/dataset/image-id-2000x2000-png"), "");
	assert.equal(safeKeychainUrl("/builder/keychain?design=private-id"), "/builder/keychain");
});

test("keeps only allow-listed anonymous event fields", () => {
	assert.deepEqual(sanitizeKeychainProperties({ ring_id: "ring-01", mode: "custom", url: "https://cdn.sanity.io/private", design_id: "private-id", query: "private-id", scale: 3 }), { ring_id: "ring-01", mode: "custom", scale: 3 });
});

test("GA and Umami emit one sanitized action without duplicating automatic page views", async () => {
	process.env.NEXT_PUBLIC_ENABLE_UMAMI = "true";
	process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID = "test-site";
	const ga = []; const umami = [];
	const storage = () => { const values = new Map(); return { getItem: (key) => values.get(key) || null, setItem: (key, value) => values.set(key, String(value)), removeItem: (key) => values.delete(key) }; };
	globalThis.localStorage = storage(); globalThis.sessionStorage = storage();
	globalThis.window = {
		location: { pathname: "/builder/keychain", href: "https://inutdesign.com/builder/keychain?design=private-id" },
		gtag: (...args) => ga.push(args),
		umami: { track: (...args) => umami.push(args) },
	};
	globalThis.document = { referrer: "https://inutdesign.com/builder/keychain?design=referrer-id", title: "Keychain" };
	const { trackKeychainAction } = await import("../../utils/keychainAnalytics.ts");
	const { trackPageView } = await import("../../utils/analytics.ts");
	trackKeychainAction("keychain_export", { scale: 3, design_id: "private-id", image_url: "https://cdn.sanity.io/private" });
	assert.equal(ga.length, 1); assert.equal(umami.length, 1);
	assert.deepEqual(ga[0][2], { scale: 3, page_path: "/builder/keychain", page_location: "https://inutdesign.com/builder/keychain", page_referrer: "https://inutdesign.com/builder/keychain" });
	assert.deepEqual(umami[0][1], { scale: 3 });
	trackPageView("/builder/keychain?design=private-id", "Keychain");
	assert.equal(ga[1][2].page_path, "/builder/keychain");
	assert.equal(ga[1][2].page_location, "https://inutdesign.com/builder/keychain");
	assert.equal(umami.length, 1);
	globalThis.window.gtag = undefined; globalThis.window.umami = undefined;
	assert.doesNotThrow(() => trackKeychainAction("keychain_export", { scale: 1 }));
});
