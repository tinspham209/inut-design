import assert from "node:assert/strict";
import test from "node:test";
import sharp from "sharp";
import {
	decodeBase64Image,
	validateKeychainImage,
} from "../../utils/keychain/imageValidation.ts";

const fixture = async (format, width = 64, height = 32) =>
	sharp({
		create: {
			width,
			height,
			channels: 4,
			background: { r: 255, g: 30, b: 10, alpha: 0.5 },
		},
	})[format]().toBuffer();

test("accepts bounded PNG, JPEG, and WebP worker uploads", async () => {
	for (const [format, mime] of [
		["png", "image/png"],
		["jpeg", "image/jpeg"],
		["webp", "image/webp"],
	]) {
		const input = new Uint8Array(await fixture(format));
		const validated = validateKeychainImage(input, mime);
		assert.equal(validated.format, format);
		assert.equal(validated.width, 64);
		assert.equal(validated.height, 32);
		assert.equal(decodeBase64Image(Buffer.from(input).toString("base64")).byteLength, input.byteLength);
	}
});

test("rejects declared format mismatches, malformed base64, and corrupt bytes", async () => {
	const png = new Uint8Array(await fixture("png"));
	assert.throws(() => validateKeychainImage(png, "image/jpeg"), /INVALID_IMAGE/);
	assert.throws(() => decodeBase64Image("%%%"), /INVALID_BASE64/);
	assert.throws(() => validateKeychainImage(new TextEncoder().encode("not an image"), "image/png"), /INVALID_IMAGE/);
});

test("rejects browser output above the Worker dimensions and pixel ceiling", async () => {
	const oversized = new Uint8Array(await fixture("png", 2300, 1500));
	assert.throws(
		() => validateKeychainImage(new Uint8Array(Buffer.concat([
			Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
			Buffer.alloc(8),
		])), "image/png"),
		/INVALID_IMAGE/,
	);
	assert.throws(() => validateKeychainImage(oversized, "image/png"), /INVALID_IMAGE/);
});

test("decodes exact bytes at the 10 MiB boundary without a regex stack overflow", () => {
	const bytes = Buffer.alloc(10 * 1024 * 1024, 0xa5);
	assert.deepEqual(decodeBase64Image(bytes.toString("base64")), bytes);
});

test("enforces standard canonical padding, alphabet and trailing bits", () => {
	for (const value of ["AA==", "/w==", "AAA=", "//8=", "AAAA", "aGVsbG8="]) {
		assert.equal(Buffer.from(decodeBase64Image(value)).toString("base64"), value);
	}
	for (const value of ["", "A", "AAA", "====", "A===", "AA=A", "AB==", "AAB=", "//9=", "/x==", " AA==", "AA==\n", "AAA\n", "AAA\r", "AA\r\n", "__==", "AA==AAAA"]) {
		assert.throws(() => decodeBase64Image(value), /INVALID_BASE64/, value);
	}
});
