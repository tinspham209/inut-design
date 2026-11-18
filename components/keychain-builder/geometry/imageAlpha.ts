export type AlphaMask = { width: number; height: number; alpha: Uint8Array };

export type AlphaTransform = { rotation: number; flipX: boolean };
export function extractImageAlpha(image: CanvasImageSource & { width: number; height: number }, maxDimension = 2048, threshold = 16, transform: AlphaTransform = { rotation: 0, flipX: false }): AlphaMask {
	if (!Number.isFinite(image.width) || !Number.isFinite(image.height) || image.width <= 0 || image.height <= 0 || !Number.isInteger(maxDimension) || maxDimension < 1 || !Number.isFinite(threshold) || threshold < 0 || threshold > 255) throw new Error("Ảnh không hợp lệ để tạo đường viền");
	if (!Number.isFinite(transform.rotation) || typeof transform.flipX !== "boolean") throw new Error("Biến đổi ảnh không hợp lệ");
	const sourceScale = Math.min(1, maxDimension / Math.max(image.width, image.height));
	const sourceWidth = Math.max(1, Math.round(image.width * sourceScale));
	const sourceHeight = Math.max(1, Math.round(image.height * sourceScale));
	const radians = (transform.rotation * Math.PI) / 180;
	const rotatedWidth = Math.abs(sourceWidth * Math.cos(radians)) + Math.abs(sourceHeight * Math.sin(radians));
	const rotatedHeight = Math.abs(sourceHeight * Math.cos(radians)) + Math.abs(sourceWidth * Math.sin(radians));
	const rotatedScale = Math.min(1, maxDimension / Math.max(rotatedWidth, rotatedHeight));
	const width = Math.max(1, Math.ceil(rotatedWidth * rotatedScale));
	const height = Math.max(1, Math.ceil(rotatedHeight * rotatedScale));
	const canvas = document.createElement("canvas"); canvas.width = width; canvas.height = height;
	const context = canvas.getContext("2d", { willReadFrequently: true });
	if (!context) throw new Error("Canvas không khả dụng để xử lý alpha");
	try {
		context.translate(width / 2, height / 2);
		context.rotate(radians);
		context.scale(transform.flipX ? -1 : 1, 1);
		context.drawImage(image, -sourceWidth * rotatedScale / 2, -sourceHeight * rotatedScale / 2, sourceWidth * rotatedScale, sourceHeight * rotatedScale);
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
