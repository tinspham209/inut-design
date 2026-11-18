import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { FRAME_IDS, SIZES_CM } from "../../data/keychain/catalog.ts";
import { frameScale, holeAtMm, reconstructHole, scaleEnvelope } from "../../components/keychain-builder/geometry/mm.ts";
import { initialKeychainConfig, keychainReducer } from "../../components/keychain-builder/hooks/useKeychainState.ts";
import { validateKeychainConfig } from "../../utils/keychain/validation.ts";
import { createDieCutGeometry, isLatestGeometryRevision, traceDieCut } from "../../components/keychain-builder/geometry/dieCut.ts";
import sharp from "sharp";

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
	for (const frameId of FRAME_IDS) for (const sizeCm of SIZES_CM) {
		assert.ok(FRAME_IDS.includes(frameId));
		const scale = frameScale(82, 97, sizeCm);
		assert.ok(Math.max(82, 97) * scale <= sizeCm * 10 + 1e-9);
		assert.equal(reconstructHole(10, 12).radiusMm, 2);
		assert.equal(holeAtMm(10, 12, scale, 6, 3).radiusMm, 2);
	}
	assert.equal(scaleEnvelope({ minX: 0, minY: 0, maxX: 20, maxY: 40 }, 5).heightMm, 50);
	assert.throws(() => scaleEnvelope({ minX: 4, minY: 0, maxX: 4, maxY: 8 }, 5));
});

test("die-cut rejects empty and disconnected alpha masks and normalizes the outline", () => {
	const rectangle = (width, height, islands = 1) => {
		const alpha = new Uint8Array(width * height);
		for (let y = 4; y < height - 4; y += 1) for (let x = 4; x < (islands === 1 ? width - 4 : Math.floor(width / 3)); x += 1) alpha[y * width + x] = 1;
		if (islands > 1) for (let y = 4; y < height - 4; y += 1) for (let x = Math.floor((width * 2) / 3); x < width - 4; x += 1) alpha[y * width + x] = 1;
		return { width, height, alpha };
	};
	assert.throws(() => traceDieCut({ width: 8, height: 8, alpha: new Uint8Array(64) }, 5), /rỗng/);
	assert.throws(() => traceDieCut(rectangle(40, 24, 2), 5), /nhiều mảnh/);
	const contour = traceDieCut(rectangle(40, 24), 5);
	assert.ok(Math.abs(Math.max(contour.widthMm, contour.heightMm) - 50) < 0.001);
	assert.ok(contour.points.length >= 4);
});

test("die-cut geometry unions a 10 mm ear and keeps the attachment hole at 4 mm", () => {
	const alpha = new Uint8Array(40 * 24);
	for (let y = 4; y < 20; y += 1) for (let x = 4; x < 36; x += 1) alpha[y * 40 + x] = 1;
	const geometry = createDieCutGeometry({ width: 40, height: 24, alpha }, 5);
	assert.equal(geometry.hole.radiusMm, 2);
	assert.match(geometry.path, /A 2 2/);
	assert.ok(geometry.heightMm > 24 && Math.max(geometry.widthMm, geometry.heightMm) <= 50.01);
});

test("synthetic alpha fixtures distinguish transparent, empty, multi-island, and asymmetric images", async () => {
	const fixture = async (name) => {
		const { data, info } = await sharp(path.join(root, "public/keychain/fixtures", `${name}.png`)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
		const alpha = new Uint8Array(info.width * info.height);
		for (let i = 0; i < alpha.length; i += 1) alpha[i] = data[i * info.channels + 3] ? 1 : 0;
		return { width: info.width, height: info.height, alpha };
	};
	const empty = await fixture("empty-alpha"); const multiIsland = await fixture("multi-island");
	assert.throws(() => traceDieCut(empty, 5), /rỗng/);
	assert.throws(() => traceDieCut(multiIsland, 5), /nhiều mảnh/);
	for (const name of ["opaque-square", "transparent-blob", "asymmetric-arrow"]) assert.ok(createDieCutGeometry(await fixture(name), 5).points.length >= 4);
});

test("config validation rejects unsupported acrylic/back combinations and bad transforms", () => {
	assert.equal(validateKeychainConfig(initialKeychainConfig), true);
	assert.equal(validateKeychainConfig({ ...initialKeychainConfig, printSides: 0 }), false);
	assert.equal(validateKeychainConfig({ ...initialKeychainConfig, backMode: "custom", printSides: 2 }), false);
	assert.equal(validateKeychainConfig({ ...initialKeychainConfig, backMode: "white", printSides: 1 }), true);
	assert.equal(validateKeychainConfig({ ...initialKeychainConfig, backMode: "mirror-front", printSides: 2 }), true);
	for (const acrylicId of ["red", "yellow", "orange", "green", "blue", "white", "black"]) assert.equal(validateKeychainConfig({ ...initialKeychainConfig, acrylicId, backMode: "material", printSides: 1 }), true);
	assert.equal(validateKeychainConfig({ ...initialKeychainConfig, front: { transform: { xMm: Infinity, yMm: 0, scale: 1, rotation: 0, flipX: false } } }), false);
	const customBack = { image: { _type: "image", asset: { _ref: "image-demo-200x200-png", _type: "reference" } }, url: "https://cdn.sanity.io/images/p/d/image-demo.png", transform: initialKeychainConfig.front.transform };
	const clearTwoSide = keychainReducer(initialKeychainConfig, { type: "set-face", face: "backCustom", value: customBack });
	assert.equal(validateKeychainConfig({ ...clearTwoSide, printSides: 2, backMode: "custom" }), true);
});

test("worker results publish only for the latest geometry revision", () => {
	assert.equal(isLatestGeometryRevision(8, 8), true);
	assert.equal(isLatestGeometryRevision(7, 8), false);
	assert.equal(isLatestGeometryRevision(-1, 8), false);
});
