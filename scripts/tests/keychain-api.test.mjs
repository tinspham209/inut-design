import assert from "node:assert/strict";
import test from "node:test";
import { initialKeychainConfig } from "../../components/keychain-builder/hooks/useKeychainState.ts";
import { createKeychainRequestFingerprint } from "../../utils/keychain/requestFingerprint.ts";
import { isKeychainRequestId, isSanityImageReference, validateKeychainServerConfig } from "../../utils/keychain/serverValidation.ts";
import { readSnapshotById, saveSnapshotIdempotently } from "../../utils/keychain/snapshotLifecycle.ts";
import { getExportImageIssue } from "../../components/keychain-builder/image/exportReadiness.ts";

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

test("server-generated design preview URLs are public-format CDN URLs accepted by strict validation", async () => {
	process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "abc123";
	process.env.NEXT_PUBLIC_SANITY_DATASET = "production";
	const { sanityImageUrl } = await import("../../api-client/sanity-image.ts");
	const image = { _type: "image", asset: { _type: "reference", _ref: "image-a1b2c3-64x64-png" } };
	const url = sanityImageUrl(image, "design");
	assert.equal(new URL(url).hostname, "cdn.sanity.io");
	assert.match(url, /\/images\/abc123\/production\/a1b2c3-/);
	assert.equal(validateKeychainServerConfig({ ...initialKeychainConfig, front: { ...initialKeychainConfig.front, image, url } }), true);
});

test("request fingerprints sort object keys and ignore transient view state", () => {
	const baseline = { shape: { type: "frame", frameId: "heart" }, sizeCm: 5, camera: { x: 1 }, view: "front" };
	const reordered = { view: "back", sizeCm: 5, shape: { frameId: "heart", type: "frame" }, camera: { x: 9 } };
	assert.equal(createKeychainRequestFingerprint(baseline), createKeychainRequestFingerprint(reordered));
	assert.notEqual(createKeychainRequestFingerprint(baseline), createKeychainRequestFingerprint({ ...baseline, sizeCm: 6 }));
});

test("snapshot retries are immutable, conflicting payloads fail, and direct reads have no expiry", async () => {
	const documents = new Map(); let createCalls = 0;
	const repository = {
		readDirect: async (id) => documents.get(id) || null,
		createIfAbsent: async (id, config) => {
			createCalls += 1;
			if (!documents.has(id)) documents.set(id, { _id: id, requestFingerprint: createKeychainRequestFingerprint(config), config: structuredClone(config), createdAt: "2026-11-18T00:00:00.000Z" });
		},
	};
	const requestId = "bf9ab3f4-64b2-4f1c-b66d-0a272c7cce6d";
	const config = { version: 1, material: { thicknessMm: 5 }, front: { image: { _type: "image", asset: { _type: "reference", _ref: "image-a1b2c3-64x64-png" } } } };
	const digest = createKeychainRequestFingerprint(config);
	assert.equal((await saveSnapshotIdempotently(requestId, config, digest, repository)).status, "created");
	assert.equal((await saveSnapshotIdempotently(requestId, config, digest, repository)).status, "replay");
	assert.equal((await saveSnapshotIdempotently(requestId, { ...config, version: 2 }, createKeychainRequestFingerprint({ ...config, version: 2 }), repository)).status, "conflict");
	assert.equal(createCalls, 1);
	const stored = documents.get(`keychainDesign.${requestId}`);
	for (const days of [30, 90, 365]) {
		assert.equal((await readSnapshotById(requestId, repository)).status, 200);
		assert.equal((await repository.readDirect(stored._id)).requestFingerprint, digest);
		assert.equal(stored.createdAt, "2026-11-18T00:00:00.000Z");
		void days;
	}
	assert.equal((await readSnapshotById("not-a-uuid", repository)).status, 400);
	assert.equal(documents.get(stored._id).config.version, 1, "a retry does not mutate the original snapshot");
	assert.deepEqual(documents.get(stored._id).config.material, config.material, "material controls persist in the immutable snapshot");
});

test("snapshot image readiness rejects pending, local, and stale front or custom-back sources", () => {
	const ref = { _type: "image", asset: { _type: "reference", _ref: "image-a1b2c3-64x64-png" } };
	const validFace = { image: ref, url: "https://cdn.sanity.io/images/abc123/production/a1b2c3-64x64.png", transform: initialKeychainConfig.front.transform };
	const config = { ...initialKeychainConfig, front: validFace };
	assert.equal(getExportImageIssue(config), undefined);
	assert.equal(getExportImageIssue({ ...config, front: { ...validFace, url: "blob:pending-upload" } }), "local");
	assert.equal(getExportImageIssue({ ...config, front: { ...validFace, url: "https://cdn.sanity.io/images/abc123/production/different-64x64.png" } }), "stale");
	assert.equal(getExportImageIssue({ ...config, backMode: "custom", backCustom: undefined }), "missing");
	assert.equal(getExportImageIssue({ ...config, backMode: "custom", backCustom: { ...validFace, url: "blob:pending-back" } }), "local");
});

test("manual snapshot deletion does not remove an image referenced by another snapshot", async () => {
	const assetRef = "image-a1b2c3-64x64-png";
	const documents = new Map([
		["keychainDesign.one", { _id: "keychainDesign.one", imageRef: assetRef }],
		["keychainDesign.two", { _id: "keychainDesign.two", imageRef: assetRef }],
	]);
	documents.delete("keychainDesign.one");
	const remainingReferences = [...documents.values()].filter((document) => document.imageRef === assetRef).length;
	assert.equal(remainingReferences, 1);
	assert.equal(documents.has("keychainDesign.one"), false);
	const repository = { readDirect: async (id) => documents.get(id) || null, createIfAbsent: async () => {} };
	assert.equal((await readSnapshotById("11111111-1111-4111-8111-111111111111", repository)).status, 404);
});
