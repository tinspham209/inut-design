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
