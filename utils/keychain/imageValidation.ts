import sharp from "sharp";

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const ACCEPTED_FORMATS = new Set(["png", "jpeg", "webp"]);

export async function normalizeKeychainImage(input: Buffer, declaredMime: string): Promise<Buffer> {
	if (!Buffer.isBuffer(input) || input.length === 0 || input.length > MAX_UPLOAD_BYTES) throw new Error("INVALID_SIZE");
	const expectedFormat = declaredMime.replace(/^image\//, "");
	if (!ACCEPTED_FORMATS.has(expectedFormat)) throw new Error("UNSUPPORTED_FORMAT");
	const metadata = await sharp(input, { failOn: "error", limitInputPixels: 20_000_000, sequentialRead: true }).metadata();
	if (metadata.format !== expectedFormat || !metadata.width || !metadata.height || metadata.width > 12000 || metadata.height > 12000) throw new Error("INVALID_IMAGE");
	return sharp(input, { failOn: "error", limitInputPixels: 20_000_000, sequentialRead: true })
		.rotate().resize({ width: 2048, height: 2048, fit: "inside", withoutEnlargement: true }).webp({ quality: 85 }).toBuffer();
}
