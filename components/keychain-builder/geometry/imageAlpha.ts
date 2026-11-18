export type AlphaMask = { width: number; height: number; alpha: Uint8Array };

export function extractImageAlpha(image: CanvasImageSource & { width: number; height: number }, maxDimension = 2048, threshold = 16): AlphaMask {
	if (!Number.isFinite(image.width) || !Number.isFinite(image.height) || image.width <= 0 || image.height <= 0 || !Number.isInteger(maxDimension) || maxDimension < 1 || !Number.isFinite(threshold) || threshold < 0 || threshold > 255) throw new Error("Ảnh không hợp lệ để tạo đường viền");
	const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
	const width = Math.max(1, Math.round(image.width * scale));
	const height = Math.max(1, Math.round(image.height * scale));
	const canvas = document.createElement("canvas"); canvas.width = width; canvas.height = height;
	const context = canvas.getContext("2d", { willReadFrequently: true });
	if (!context) throw new Error("Canvas không khả dụng để xử lý alpha");
	try {
		context.drawImage(image, 0, 0, width, height);
		const pixels = context.getImageData(0, 0, width, height);
		const alpha = new Uint8Array(width * height);
		for (let index = 0; index < alpha.length; index += 1) alpha[index] = pixels.data[index * 4 + 3] >= threshold ? 1 : 0;
		return { width, height, alpha };
	} catch {
		throw new Error("Ảnh không cho phép đọc alpha an toàn (CORS)");
	} finally {
		canvas.width = 0;
		canvas.height = 0;
	}
}
