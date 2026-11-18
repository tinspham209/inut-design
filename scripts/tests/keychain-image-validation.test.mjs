import assert from "node:assert/strict";
import test from "node:test";
import sharp from "sharp";
import { normalizeKeychainImage } from "../../utils/keychain/imageValidation.ts";

const fixture = async (format, width = 64, height = 32) => sharp({ create: { width, height, channels: 4, background: { r: 255, g: 30, b: 10, alpha: 0.5 } } })[format]().toBuffer();

test("accepts and normalizes the supported raster formats", async () => {
	for (const [format, mime] of [["png", "image/png"], ["jpeg", "image/jpeg"], ["webp", "image/webp"]]) {
		const normalized = await normalizeKeychainImage(await fixture(format), mime);
		assert.equal((await sharp(normalized).metadata()).format, "webp");
	}
});

test("rejects declared format mismatches and corrupt bytes", async () => {
	await assert.rejects(normalizeKeychainImage(await fixture("png"), "image/jpeg"), /INVALID_IMAGE/);
	await assert.rejects(normalizeKeychainImage(Buffer.from("not an image"), "image/png"));
});

test("resizes oversized dimensions within the browser rendering limit", async () => {
	const normalized = await normalizeKeychainImage(await fixture("png", 2300, 1500), "image/png");
	const { width, height } = await sharp(normalized).metadata();
	assert.ok(width <= 2048 && height <= 2048);
});
