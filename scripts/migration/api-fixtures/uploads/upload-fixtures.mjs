import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

import sharp from "sharp";

const manifestPath = path.join(process.cwd(), "scripts/migration/api-fixtures/uploads/manifest.json");

const crcTable = Array.from({ length: 256 }, (_, index) => {
	let value = index;
	for (let bit = 0; bit < 8; bit += 1) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
	return value >>> 0;
});

function crc32(buffer) {
	let crc = 0xffffffff;
	for (const value of buffer) crc = crcTable[(crc ^ value) & 0xff] ^ (crc >>> 8);
	return (crc ^ 0xffffffff) >>> 0;
}

function pngWithDimensions(width, height) {
	const chunk = Buffer.alloc(25);
	chunk.writeUInt32BE(13, 0);
	chunk.write("IHDR", 4, "ascii");
	chunk.writeUInt32BE(width, 8);
	chunk.writeUInt32BE(height, 12);
	chunk[16] = 8;
	chunk[17] = 6;
	chunk[18] = 0;
	chunk[19] = 0;
	chunk[20] = 0;
	chunk.writeUInt32BE(crc32(chunk.subarray(4, 21)), 21);
	return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk]);
}

function mimeForFormat(format) {
	if (format === "png") return "image/png";
	if (format === "jpeg") return "image/jpeg";
	if (format === "webp") return "image/webp";
	return "application/octet-stream";
}

async function validImage(format) {
	const base = sharp({
		create: {
			width: 1,
			height: 1,
			channels: 4,
			background: { r: 16, g: 32, b: 64, alpha: 1 },
		},
	});
	return format === "jpeg" ? base.jpeg().toBuffer() : base[format]().toBuffer();
}

export async function loadUploadFixtures() {
	const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
	const valid = {
		png: await validImage("png"),
		jpeg: await validImage("jpeg"),
		webp: await validImage("webp"),
	};

	return manifest.cases.map((fixture) => {
		let bytes = fixture.format in valid ? Buffer.from(valid[fixture.format]) : null;
		let data;
		if (fixture.data) {
			data = fixture.data;
		} else if (fixture.byteLength) {
			bytes = Buffer.alloc(fixture.byteLength);
			data = bytes.toString("base64");
		} else if (fixture.mutate === "signature") {
			bytes[0] ^= 0xff;
		} else if (fixture.mutate === "polyglot") {
			bytes = Buffer.concat([bytes, Buffer.from("\n<script>fixture</script>", "utf8")]);
		} else if (fixture.mutate === "dimensions" || fixture.mutate === "huge-dimensions") {
			bytes = pngWithDimensions(fixture.width, fixture.height);
		}

		return {
			...fixture,
			contentType: fixture.declaredMime ?? mimeForFormat(fixture.format),
			filename: fixture.format === "jpeg" ? "migration.jpg" : `migration.${fixture.format}`,
			data: data ?? bytes?.toString("base64"),
			decodedByteLength: bytes?.length ?? null,
		};
	});
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
	const fixtures = await loadUploadFixtures();
	console.log(
		`Loaded ${fixtures.length} upload fixtures: ${fixtures.map((fixture) => fixture.name).join(", ")}.`,
	);
}
