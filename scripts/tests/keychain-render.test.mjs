import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { getBackRenderSource } from "../../components/keychain-builder/render/renderModel.ts";
import { initialKeychainConfig } from "../../components/keychain-builder/hooks/useKeychainState.ts";
import { renderShowcasePng } from "../../components/keychain-builder/render/renderPng.ts";
import { extractImageAlpha } from "../../components/keychain-builder/geometry/imageAlpha.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

test("back render sources preserve the one-time mirror and material rules", () => {
	assert.deepEqual(getBackRenderSource("through-acrylic", "front"), { imageUrl: "front", mirrorX: true, print: true, materialFill: false });
	assert.equal(getBackRenderSource("mirror-front", "front").mirrorX, true);
	assert.deepEqual(getBackRenderSource("custom", "front", "back"), { imageUrl: "back", mirrorX: false, print: true, materialFill: false });
	assert.equal(getBackRenderSource("white", "front").materialFill, true);
	assert.equal(getBackRenderSource("material", "front").imageUrl, undefined);
});

test("all six scope/scale PNG variants are emitted within the selected physical envelope", async () => {
	const created = [];
	const fillStyles = [];
	class Path { constructor(value) { this.value = value; } }
	class Canvas {
		constructor() { this.width = 0; this.height = 0; this.clientWidth = 500; this.context = { clearRect() {}, drawImage() {}, save() {}, restore() {}, translate() {}, rotate() {}, scale() {}, fill() { fillStyles.push(this.fillStyle); }, clip() {}, beginPath() {}, arc() {}, stroke() {} }; created.push(this); }
		getContext() { return this.context; }
		toBlob(callback, type) { this.blobWidth = this.width; callback(new Blob([`${this.width}x${this.height}`], { type })); }
	}
	globalThis.Path2D = Path;
	globalThis.document = { createElement: (tag) => { assert.equal(tag, "canvas"); return new Canvas(); } };
	globalThis.Image = class { set src(value) { this.value = value; queueMicrotask(() => this.onload?.()); } };
	const frame = { viewBox: [0, 0, 50, 40], cutPath: "M 0 0 L 50 0 L 50 40 Z", printPath: "M 0 0 L 50 0 L 50 40 Z", hole: { cx: 25, cy: 8, radiusMm: 2 }, source: "" };
	const cases = [];
	for (const scope of ["full-keychain", "charm-only"]) for (const scale of [1, 2, 3]) cases.push({ scope, scale });
	for (const { scope, scale } of cases) {
		const config = { ...initialKeychainConfig, acrylicId: "red" };
		const blob = await renderShowcasePng(frame, config, undefined, scale, scope);
		assert.equal(blob.type, "image/png");
		const expectedWidth = initialKeychainConfig.sizeCm * 100 * scale;
		assert.ok(blob.size > 0);
		assert.ok(created.some((canvas) => canvas.blobWidth === expectedWidth));
	}
	assert.ok(fillStyles.includes("red"), "selected opaque acrylic is used as the canvas material fill");
});

test("tainted canvas access fails with an explicit CORS error and 3D textures share the 2D renderer", async () => {
	globalThis.document = { createElement: () => ({ width: 0, height: 0, getContext: () => ({ drawImage() {}, getImageData() { throw new Error("SecurityError"); } }) }) };
	assert.throws(() => extractImageAlpha({ width: 10, height: 10 }, 2048), /CORS/);
	const source = await readFile(path.join(root, "components/keychain-builder/render/render3dTexture.ts"), "utf8");
	assert.match(source, /renderKeychain2d\(canvas, frame, config, image, side\)/);
});

test("both previews have no automatic motion and 3D renders only on demand", async () => {
	const preview2d = await readFile(path.join(root, "components/keychain-builder/preview/Preview2D.tsx"), "utf8");
	const preview3d = await readFile(path.join(root, "components/keychain-builder/preview/Preview3D.tsx"), "utf8");
	assert.doesNotMatch(preview2d, /requestAnimationFrame|autoRotate|setInterval/);
	assert.match(preview3d, /frameloop="demand"/);
	assert.match(preview3d, /enableDamping=\{false\}/);
	assert.doesNotMatch(preview3d, /autoRotate|requestAnimationFrame|setInterval/);
});
