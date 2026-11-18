import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { FRAME_IDS, SIZES_CM } from "../../data/keychain/catalog.ts";
import { frameScale, holeAtMm, reconstructHole, scaleEnvelope } from "../../components/keychain-builder/geometry/mm.ts";
import { initialKeychainConfig, keychainReducer } from "../../components/keychain-builder/hooks/useKeychainState.ts";
import { validateKeychainConfig } from "../../utils/keychain/validation.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

test("all 18 demo frames include cut, print, hole, and mm source dimensions", async () => {
	assert.equal(FRAME_IDS.length, 18);
	for (const id of FRAME_IDS) {
		const svg = await readFile(path.join(root, "public/keychain/frames", `frame-${id}.svg`), "utf8");
		assert.match(svg, /id="cut"/); assert.match(svg, /id="print"/); assert.match(svg, /id="hole"/);
		assert.match(svg, /data-diameter-mm="4"/);
	}
});

test("all supported sizes keep the frame envelope and reconstructed hole physical", () => {
	for (const sizeCm of SIZES_CM) {
		const scale = frameScale(82, 97, sizeCm);
		assert.ok(Math.max(82, 97) * scale <= sizeCm * 10 + 1e-9);
		assert.equal(reconstructHole(10, 12).radiusMm, 2);
		assert.equal(holeAtMm(10, 12, scale, 6, 3).radiusMm, 2);
	}
	assert.equal(scaleEnvelope({ minX: 0, minY: 0, maxX: 20, maxY: 40 }, 5).heightMm, 50);
	assert.throws(() => scaleEnvelope({ minX: 4, minY: 0, maxX: 4, maxY: 8 }, 5));
});

test("config validation rejects unsupported acrylic/back combinations and bad transforms", () => {
	assert.equal(validateKeychainConfig(initialKeychainConfig), true);
	assert.equal(validateKeychainConfig({ ...initialKeychainConfig, printSides: 0 }), false);
	assert.equal(validateKeychainConfig({ ...initialKeychainConfig, backMode: "custom", printSides: 2 }), false);
	assert.equal(validateKeychainConfig({ ...initialKeychainConfig, front: { transform: { xMm: Infinity, yMm: 0, scale: 1, rotation: 0, flipX: false } } }), false);
	const customBack = { image: { _type: "image", asset: { _ref: "image-demo-200x200-png", _type: "reference" } }, url: "https://cdn.sanity.io/images/p/d/image-demo.png", transform: initialKeychainConfig.front.transform };
	const clearTwoSide = keychainReducer(initialKeychainConfig, { type: "set-face", face: "backCustom", value: customBack });
	assert.equal(validateKeychainConfig({ ...clearTwoSide, printSides: 2, backMode: "custom" }), true);
});
