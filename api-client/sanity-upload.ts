const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 2048;
const ALLOWED_IMAGE_TYPES = new Set([
	"image/png",
	"image/jpeg",
	"image/webp",
	"image/svg+xml",
]);

function loadImage(blob: Blob): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const image = new Image();
		const objectUrl = URL.createObjectURL(blob);
		image.onload = () => {
			URL.revokeObjectURL(objectUrl);
			resolve(image);
		};
		image.onerror = () => {
			URL.revokeObjectURL(objectUrl);
			reject(new Error("Không thể đọc ảnh thiết kế."));
		};
		image.src = objectUrl;
	});
}

/**
 * Reject oversized/unsupported assets and rasterize large images to a
 * compressed WebP before they cross the network boundary.
 */
export async function prepareSanityImageUpload(file: File | Blob): Promise<Blob> {
	if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
		throw new Error("Ảnh thiết kế phải là PNG, JPG, WEBP hoặc SVG.");
	}
	if (file.size > MAX_UPLOAD_BYTES) {
		throw new Error("Ảnh thiết kế không được vượt quá 10MB.");
	}

	// SVG should remain vector data so existing transparent designs keep their
	// original behavior.
	if (file.type === "image/svg+xml" || typeof window === "undefined") {
		return file;
	}

	const image = await loadImage(file);
	const scale = Math.min(1, MAX_IMAGE_DIMENSION / Math.max(image.width, image.height));
	const width = Math.max(1, Math.round(image.width * scale));
	const height = Math.max(1, Math.round(image.height * scale));
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	canvas.getContext("2d")?.drawImage(image, 0, 0, width, height);

	const compressed = await new Promise<Blob | null>((resolve) =>
		canvas.toBlob(resolve, "image/webp", 0.85)
	);
	return compressed || file;
}

export async function uploadImageToSanity(
	file: File | Blob
): Promise<{ _type: string; asset: { _ref: string; _type: string } }> {
	const prepared = await prepareSanityImageUpload(file);
	const data = new Uint8Array(await prepared.arrayBuffer());
	let binary = "";
	const chunkSize = 0x8000;
	for (let offset = 0; offset < data.length; offset += chunkSize) {
		binary += String.fromCharCode(...data.subarray(offset, offset + chunkSize));
	}
	const base64 = btoa(binary);

	const response = await fetch("/api/sanity/upload-image", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			data: base64,
			contentType: prepared.type || "image/webp",
			filename: prepared instanceof File ? prepared.name : "design.webp",
		}),
	});

	if (!response.ok) {
		throw new Error("Failed to upload image. Please try again.");
	}

	return response.json();
}
