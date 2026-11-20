import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { getBackRenderSource } from "../../components/keychain-builder/render/renderModel.ts";
import { initialKeychainConfig } from "../../components/keychain-builder/hooks/useKeychainState.ts";
import { renderShowcasePng } from "../../components/keychain-builder/render/renderPng.ts";
import { extractImageAlpha } from "../../components/keychain-builder/geometry/imageAlpha.ts";
import { getMaterialEdgeStyle } from "../../components/keychain-builder/render/materialStyle.ts";
import { getImageCropPercent } from "../../components/keychain-builder/controls/BackImageEditor.tsx";
import { mapCenteredGeometryToFrameUv } from "../../components/keychain-builder/geometry/frameUv.ts";
import { splitExtrudeMaterialGroups } from "../../components/keychain-builder/geometry/extrudeMaterialGroups.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

test("back render sources preserve the one-time mirror and material rules", () => {
	assert.deepEqual(getBackRenderSource("through-acrylic", "front"), { imageUrl: "front", mirrorX: true, print: true, materialFill: false });
	assert.equal(getBackRenderSource("mirror-front", "front").mirrorX, true);
	assert.deepEqual(getBackRenderSource("custom", "front", "back"), { imageUrl: "back", mirrorX: false, print: true, materialFill: false });
	assert.equal(getBackRenderSource("white", "front").materialFill, true);
	assert.equal(getBackRenderSource("material", "front").imageUrl, undefined);
});

test("custom-back crop estimate preserves aspect ratio and warns for substantial crop", () => {
	assert.equal(getImageCropPercent(1, 1), 0);
	assert.equal(getImageCropPercent(1, 2), 50);
	assert.equal(getImageCropPercent(3, 1), 67);
	assert.equal(getImageCropPercent(0, 1), 0);
});

test("edge, thickness, and sheen change shared render style and remain in snapshots", () => {
	const baseline = { edge: "natural", thicknessMm: 2, sheen: 0.1 };
	const changed = { edge: "polished", thicknessMm: 5, sheen: 0.9 };
	assert.notDeepEqual(getMaterialEdgeStyle(baseline), getMaterialEdgeStyle(changed));
	assert.notEqual(getMaterialEdgeStyle({ ...baseline, sheen: 0 }).color, getMaterialEdgeStyle({ ...baseline, sheen: 1 }).color);
	const config = { ...initialKeychainConfig, material: changed };
	assert.deepEqual(JSON.parse(JSON.stringify(config)).material, changed);
});

test("2D preview fits the full assembly and keeps the acrylic body a single base color", async () => {
	const source = await readFile(path.join(root, "components/keychain-builder/render/render2d.ts"), "utf8");
	assert.doesNotMatch(source, /showImageCoverage|fillRect\(minX, minY, sourceWidth/);
	assert.match(source, /const inset = Math\.min\(24, canvas\.width \* 0\.06, canvas\.height \* 0\.06\)/);
});

test("all six scope/scale PNG variants are emitted within the selected physical envelope", async () => {
	const created = [];
	const fillStyles = [];
	class Path { constructor(value) { this.value = value; } }
	class Canvas {
		constructor() { this.width = 0; this.height = 0; this.clientWidth = 500; this.dataset = {}; this.context = { clearRect() {}, drawImage() {}, save() {}, restore() {}, translate() {}, rotate() {}, scale() {}, fill() { fillStyles.push(this.fillStyle); }, fillRect() {}, clip() {}, beginPath() {}, arc() {}, stroke() {} }; created.push(this); }
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
	assert.doesNotMatch(preview3d, /type: "set-face"|type: "set-material"|type: "set-size"/);
});

test("classic 3D hardware uses one centered, two-sided connector set", async () => {
	const source = await readFile(path.join(root, "components/keychain-builder/preview/RingPlane.tsx"), "utf8");
	assert.doesNotMatch(source, /keychain_(?:01|02|03|tail)_b\.png/);
	assert.doesNotMatch(source, /backHead/);
	assert.match(source, /const head = plane\(\{ x: 0, y: 38, width: 431, height: 536 \}, 0\)/);
	assert.match(source, /depthTest=\{false\} side=\{DoubleSide\}/);
});

test("3D extrusion assigns one print texture to the selected physical face", async () => {
	assert.deepEqual(splitExtrudeMaterialGroups([
		{ start: 0, count: 120, materialIndex: 0 },
		{ start: 120, count: 72, materialIndex: 1 },
	]), [
		{ start: 0, count: 60, materialIndex: 0 },
		{ start: 60, count: 60, materialIndex: 1 },
		{ start: 120, count: 72, materialIndex: 2 },
	]);
	assert.throws(() => splitExtrudeMaterialGroups([{ start: 0, count: 7, materialIndex: 0 }]), /tách hai mặt/);
	const source = await readFile(path.join(root, "components/keychain-builder/preview/KeychainMesh.tsx"), "utf8");
	assert.match(source, /splitExtrudeMaterialGroups\(geometry\.groups\)/);
	assert.match(source, /attach="material-0" map=\{backTexture\}/);
	assert.match(source, /attach="material-1" map=\{frontTexture\}/);
	assert.match(source, /attach="material-0" transparent opacity=\{0\} depthWrite=\{false\}/);
	assert.match(source, /attach="material-1" transparent opacity=\{0\} depthWrite=\{false\}/);
	assert.match(source, /attach="material-2" color=\{acrylicColor\}/);
});

test("3D mesh UVs use the SVG viewBox instead of the cut-path bounds", async () => {
	const scale = 2;
	const viewBox = { minX: 9, minY: 0, width: 82, height: 97 };
	const xWorld = (9 - (viewBox.minX + viewBox.width / 2)) * scale;
	const yWorld = (viewBox.minY + viewBox.height / 2 - 10) * scale;
	const [u, v] = mapCenteredGeometryToFrameUv(xWorld, yWorld, viewBox.width * scale, viewBox.height * scale);
	assert.equal(u, 0);
	assert.ok(Math.abs(v - (1 - 10 / viewBox.height)) < 1e-9);
	const meshSource = await readFile(path.join(root, "components/keychain-builder/preview/KeychainMesh.tsx"), "utf8");
	assert.ok(meshSource.includes("geometry.translate(-(minX + viewWidth / 2)"));
});
