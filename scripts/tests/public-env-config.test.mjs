import assert from "node:assert/strict";
import test from "node:test";

import {
	getUmamiRuntimeConfig,
	isExplicitlyDisabled,
	isExplicitlyEnabled,
} from "../../utils/public-env.ts";
import { resolveSiteUrl } from "../../utils/siteUrl.ts";

test("Umami requires explicit enablement and a website id", () => {
	assert.equal(getUmamiRuntimeConfig(undefined, "site-id", undefined).configured, false);
	assert.equal(getUmamiRuntimeConfig("false", "site-id", undefined).configured, false);
	assert.equal(getUmamiRuntimeConfig("true", "", undefined).configured, false);
	assert.deepEqual(getUmamiRuntimeConfig("true", "site-id", "https://analytics.example/"), {
		enabled: true,
		websiteId: "site-id",
		hostUrl: "https://analytics.example",
		configured: true,
		scriptUrl: "https://analytics.example/script.js",
	});
});

test("feature flags parse explicit booleans safely", () => {
	assert.equal(isExplicitlyEnabled("TRUE"), true);
	assert.equal(isExplicitlyEnabled(undefined), false);
	assert.equal(isExplicitlyDisabled("FALSE"), false);
	assert.equal(isExplicitlyDisabled(undefined), true);
});

test("site URL resolves legacy production URLs through the configured origin", () => {
	const previous = process.env.NEXT_PUBLIC_SITE_URL;
	assert.equal(
		resolveSiteUrl("https://inutdesign.com/san-pham/lighters"),
		"https://inutdesign.com/san-pham/lighters",
	);
	assert.equal(resolveSiteUrl("/search?q=skin"), "https://inutdesign.com/search?q=skin");
	if (previous === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
	else process.env.NEXT_PUBLIC_SITE_URL = previous;
});
