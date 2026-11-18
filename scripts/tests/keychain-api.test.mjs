import assert from "node:assert/strict";
import test from "node:test";
import { initialKeychainConfig } from "../../components/keychain-builder/hooks/useKeychainState.ts";
import { createKeychainRequestFingerprint } from "../../utils/keychain/requestFingerprint.ts";
import { isKeychainRequestId, isSanityImageReference, validateKeychainServerConfig } from "../../utils/keychain/serverValidation.ts";

test("server validation requires a v4 request id and valid Sanity image references", () => {
	assert.equal(isKeychainRequestId("bf9ab3f4-64b2-4f1c-b66d-0a272c7cce6d"), true);
	assert.equal(isKeychainRequestId("not-a-uuid"), false);
	assert.equal(isSanityImageReference({ _type: "image", asset: { _type: "reference", _ref: "image-a1b2c3-200x300-png" } }), true);
	assert.equal(isSanityImageReference({ _type: "image", asset: { _type: "reference", _ref: "image-demo-200x300-png" } }), false);
	assert.equal(validateKeychainServerConfig(initialKeychainConfig), true);
	assert.equal(validateKeychainServerConfig({ ...initialKeychainConfig, front: { ...initialKeychainConfig.front, image: { _type: "image", asset: { _type: "reference", _ref: "image-invalid" } } } }), false);
	const image = { _type: "image", asset: { _type: "reference", _ref: "image-a1b2c3-200x300-png" } };
	const face = { ...initialKeychainConfig.front, image, url: "https://cdn.sanity.io/images/abc123/production/a1b2c3-200x300.png" };
	assert.equal(validateKeychainServerConfig({ ...initialKeychainConfig, front: face }), true);
	assert.equal(validateKeychainServerConfig({ ...initialKeychainConfig, front: { ...face, url: "https://example.com/a1b2c3-200x300.png" } }), false);
});

test("request fingerprints sort object keys and ignore transient view state", () => {
	const baseline = { shape: { type: "frame", frameId: "heart" }, sizeCm: 5, camera: { x: 1 }, view: "front" };
	const reordered = { view: "back", sizeCm: 5, shape: { frameId: "heart", type: "frame" }, camera: { x: 9 } };
	assert.equal(createKeychainRequestFingerprint(baseline), createKeychainRequestFingerprint(reordered));
	assert.notEqual(createKeychainRequestFingerprint(baseline), createKeychainRequestFingerprint({ ...baseline, sizeCm: 6 }));
});
