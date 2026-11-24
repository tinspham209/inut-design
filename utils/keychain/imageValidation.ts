const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 2048;
const MAX_IMAGE_PIXELS = MAX_IMAGE_DIMENSION * MAX_IMAGE_DIMENSION;
const ACCEPTED_FORMATS = new Map([
	["image/png", "png"],
	["image/jpeg", "jpeg"],
	["image/webp", "webp"],
] as const);

type ImageMime = keyof typeof ACCEPTED_FORMATS extends never
	? never
	: "image/png" | "image/jpeg" | "image/webp";

export type ValidatedKeychainImage = {
	mime: ImageMime;
	format: "png" | "jpeg" | "webp";
	byteLength: number;
	width: number;
	height: number;
	pixelCount: number;
};

export type PersistedKeychainImage = {
	image: { _type: "image"; asset: { _ref: string; _type: "reference" } };
	url: string;
};

function uint32be(bytes: Uint8Array, offset: number) {
	return (
		(((bytes[offset] ?? 0) << 24) |
			((bytes[offset + 1] ?? 0) << 16) |
			((bytes[offset + 2] ?? 0) << 8) |
			(bytes[offset + 3] ?? 0)) >>>
		0
	);
}

function uint32le(bytes: Uint8Array, offset: number) {
	return (
		((bytes[offset] ?? 0) |
			((bytes[offset + 1] ?? 0) << 8) |
			((bytes[offset + 2] ?? 0) << 16) |
			((bytes[offset + 3] ?? 0) << 24)) >>>
		0
	);
}

function uint16be(bytes: Uint8Array, offset: number) {
	return ((bytes[offset] ?? 0) << 8) | (bytes[offset + 1] ?? 0);
}

function uint16le(bytes: Uint8Array, offset: number) {
	return (bytes[offset] ?? 0) | ((bytes[offset + 1] ?? 0) << 8);
}

function uint24le(bytes: Uint8Array, offset: number) {
	return (bytes[offset] ?? 0) | ((bytes[offset + 1] ?? 0) << 8) | ((bytes[offset + 2] ?? 0) << 16);
}

function text(bytes: Uint8Array, start: number, length: number) {
	return String.fromCharCode(...bytes.subarray(start, start + length));
}

function pngDimensions(bytes: Uint8Array) {
	const signature = [137, 80, 78, 71, 13, 10, 26, 10];
	if (bytes.length < 24 || signature.some((value, index) => bytes[index] !== value)) {
		throw new Error("INVALID_IMAGE");
	}
	let dimensions: { width: number; height: number } | null = null;
	for (let offset = 8; offset + 12 <= bytes.length; ) {
		const chunkLength = uint32be(bytes, offset);
		const chunkEnd = offset + 12 + chunkLength;
		if (chunkEnd > bytes.length) throw new Error("INVALID_IMAGE");
		const chunkType = text(bytes, offset + 4, 4);
		if (offset === 8 && (chunkLength !== 13 || chunkType !== "IHDR")) {
			throw new Error("INVALID_IMAGE");
		}
		if (chunkType === "IHDR") {
			dimensions = { width: uint32be(bytes, offset + 8), height: uint32be(bytes, offset + 12) };
		}
		offset = chunkEnd;
		if (chunkType === "IEND") {
			if (!dimensions || chunkLength !== 0 || offset !== bytes.length) throw new Error("INVALID_IMAGE");
			return dimensions;
		}
	}
	throw new Error("INVALID_IMAGE");
}

function jpegDimensions(bytes: Uint8Array) {
	if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) throw new Error("INVALID_IMAGE");
	let offset = 2;
	const frameMarkers = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);
	while (offset + 3 < bytes.length) {
		while (bytes[offset] === 0xff) offset += 1;
		const marker = bytes[offset];
		offset += 1;
		if (marker === 0xd9 || marker === 0xda) break;
		if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd8)) continue;
		const segmentLength = uint16be(bytes, offset);
		if (segmentLength < 2 || offset + segmentLength > bytes.length) throw new Error("INVALID_IMAGE");
		if (frameMarkers.has(marker)) {
			if (segmentLength < 7) throw new Error("INVALID_IMAGE");
			if (bytes[bytes.length - 2] !== 0xff || bytes[bytes.length - 1] !== 0xd9) {
				throw new Error("INVALID_IMAGE");
			}
			return {
				height: uint16be(bytes, offset + 3),
				width: uint16be(bytes, offset + 5),
			};
		}
		offset += segmentLength;
	}
	throw new Error("INVALID_IMAGE");
}

function webpDimensions(bytes: Uint8Array) {
	if (bytes.length < 16 || text(bytes, 0, 4) !== "RIFF" || text(bytes, 8, 4) !== "WEBP") {
		throw new Error("INVALID_IMAGE");
	}
	if (uint32le(bytes, 4) + 8 !== bytes.length) throw new Error("INVALID_IMAGE");
	for (let offset = 12; offset + 8 <= bytes.length; ) {
		const chunk = text(bytes, offset, 4);
		const chunkLength =
			(bytes[offset + 4] ?? 0) |
			((bytes[offset + 5] ?? 0) << 8) |
			((bytes[offset + 6] ?? 0) << 16) |
			((bytes[offset + 7] ?? 0) << 24);
		const dataStart = offset + 8;
		if (chunkLength < 0 || dataStart + chunkLength > bytes.length) throw new Error("INVALID_IMAGE");
		const payload = bytes.subarray(dataStart, dataStart + chunkLength);
		if (chunk === "VP8X" && payload.length >= 10) {
			return { width: uint24le(payload, 4) + 1, height: uint24le(payload, 7) + 1 };
		}
		if (chunk === "VP8L" && payload.length >= 5 && payload[0] === 0x2f) {
			const dimensions =
				(payload[1] ?? 0) |
				((payload[2] ?? 0) << 8) |
				((payload[3] ?? 0) << 16) |
				((payload[4] ?? 0) << 24);
			return {
				width: (dimensions & 0x3fff) + 1,
				height: ((dimensions >>> 14) & 0x3fff) + 1,
			};
		}
		if (
			chunk === "VP8 " &&
			payload.length >= 10 &&
			payload[3] === 0x9d &&
			payload[4] === 0x01 &&
			payload[5] === 0x2a
		) {
			return {
				width: (uint16le(bytes, dataStart + 6) & 0x3fff) >>> 0,
				height: (uint16le(bytes, dataStart + 8) & 0x3fff) >>> 0,
			};
		}
		offset = dataStart + chunkLength + (chunkLength % 2);
	}
	throw new Error("INVALID_IMAGE");
}

export function decodeBase64Image(data: string): Uint8Array {
	if (
		!data ||
		data.length % 4 !== 0 ||
		!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(data)
	) {
		throw new Error("INVALID_BASE64");
	}
	try {
		const binary = atob(data);
		if (btoa(binary) !== data) throw new Error("INVALID_BASE64");
		return Uint8Array.from(binary, (character) => character.charCodeAt(0));
	} catch {
		throw new Error("INVALID_BASE64");
	}
}

export function validateKeychainImage(
	input: Uint8Array,
	declaredMime: string,
): ValidatedKeychainImage {
	if (!(input instanceof Uint8Array) || input.length === 0 || input.length > MAX_UPLOAD_BYTES) {
		throw new Error("INVALID_SIZE");
	}
	const format = ACCEPTED_FORMATS.get(declaredMime as ImageMime);
	if (!format) throw new Error("UNSUPPORTED_FORMAT");
	const dimensions =
		format === "png" ? pngDimensions(input) : format === "jpeg" ? jpegDimensions(input) : webpDimensions(input);
	if (
		!dimensions.width ||
		!dimensions.height ||
		dimensions.width > MAX_IMAGE_DIMENSION ||
		dimensions.height > MAX_IMAGE_DIMENSION ||
		dimensions.width * dimensions.height > MAX_IMAGE_PIXELS
	) {
		throw new Error("INVALID_IMAGE");
	}
	return {
		mime: declaredMime as ImageMime,
		format,
		byteLength: input.byteLength,
		width: dimensions.width,
		height: dimensions.height,
		pixelCount: dimensions.width * dimensions.height,
	};
}

export function sanitizeKeychainFilename(filename: unknown, mime: ImageMime): string {
	const extensions: Record<ImageMime, string> = {
		"image/png": "png",
		"image/jpeg": "jpg",
		"image/webp": "webp",
	};
	const raw = typeof filename === "string" ? filename.trim() : "";
	if (!raw) return `keychain-design.${extensions[mime]}`;
	const base = raw.split(/[\\/]/).pop() || "";
	const stem = base
		.replace(/\.[^.]*$/, "")
		.replace(/[^a-zA-Z0-9_-]/g, "_")
		.replace(/^[_-]+|[_-]+$/g, "")
		.slice(0, 80);
	return `${stem || "keychain-design"}.${extensions[mime]}`;
}

export function validatePersistedKeychainImage(value: unknown): asserts value is PersistedKeychainImage {
	if (!value || typeof value !== "object") throw new Error("INVALID_PERSISTENCE_RESULT");
	const result = value as Partial<PersistedKeychainImage>;
	if (
		typeof result.url !== "string" ||
		!/^https?:\/\//.test(result.url) ||
		result.image?._type !== "image" ||
		result.image.asset?._type !== "reference" ||
		typeof result.image.asset?._ref !== "string" ||
		!result.image.asset._ref
	) {
		throw new Error("INVALID_PERSISTENCE_RESULT");
	}
}
