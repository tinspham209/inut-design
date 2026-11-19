const COLOR_DISTANCE_LIMIT = 56;
const FULLY_REMOVED_DISTANCE = 28;

function rgbDistance(data: Uint8ClampedArray, index: number, color: [number, number, number]) {
	return Math.hypot(data[index] - color[0], data[index + 1] - color[1], data[index + 2] - color[2]);
}

function isNearBlack(color: [number, number, number]) {
	return Math.max(...color) < 72;
}

function isNearWhite(color: [number, number, number]) {
	return Math.min(...color) > 182;
}

function cornerColor(data: Uint8ClampedArray, width: number, height: number, x: number, y: number): [number, number, number] | null {
	const colors: [number, number, number][] = [];
	for (let dy = 0; dy < 3; dy += 1) for (let dx = 0; dx < 3; dx += 1) {
		const px = Math.min(width - 1, Math.max(0, x + dx));
		const py = Math.min(height - 1, Math.max(0, y + dy));
		const index = (py * width + px) * 4;
		if (data[index + 3] > 240) colors.push([data[index], data[index + 1], data[index + 2]]);
	}
	if (colors.length < 5) return null;
	const average: [number, number, number] = [0, 0, 0];
	for (const color of colors) for (let channel = 0; channel < 3; channel += 1) average[channel] += color[channel] / colors.length;
	return average;
}

/** Removes a connected, solid black or white canvas background while preserving existing alpha. */
export async function removeSolidBackground(source: Blob): Promise<Blob | null> {
	if (typeof window === "undefined") throw new Error("Tách nền chỉ khả dụng trong trình duyệt.");
	const bitmap = await createImageBitmap(source);
	try {
		const maxDimension = 2048;
		const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
		const width = Math.max(1, Math.round(bitmap.width * scale));
		const height = Math.max(1, Math.round(bitmap.height * scale));
		const canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		const context = canvas.getContext("2d", { willReadFrequently: true });
		if (!context) throw new Error("Canvas không khả dụng để tách nền.");
		context.drawImage(bitmap, 0, 0, width, height);
		const pixels = context.getImageData(0, 0, width, height);
		const { data } = pixels;
		let hasTransparency = false;
		for (let index = 3; index < data.length; index += 4) if (data[index] < 250) { hasTransparency = true; break; }
		if (hasTransparency) return null;

		const corners = [
			cornerColor(data, width, height, 0, 0),
			cornerColor(data, width, height, Math.max(0, width - 3), 0),
			cornerColor(data, width, height, 0, Math.max(0, height - 3)),
			cornerColor(data, width, height, Math.max(0, width - 3), Math.max(0, height - 3)),
		].filter((color): color is [number, number, number] => color !== null);
		const blackCorners = corners.filter(isNearBlack);
		const whiteCorners = corners.filter(isNearWhite);
		const candidates = blackCorners.length >= 3 ? blackCorners : whiteCorners.length >= 3 ? whiteCorners : [];
		if (candidates.length < 3) throw new Error("Nền chưa nhận diện được. Dùng ảnh PNG trong suốt hoặc ảnh có nền đen/trắng đồng màu.");
		const background: [number, number, number] = [0, 0, 0];
		for (const color of candidates) for (let channel = 0; channel < 3; channel += 1) background[channel] += color[channel] / candidates.length;

		const seen = new Uint8Array(width * height);
		const queue = new Int32Array(width * height);
		let head = 0;
		let tail = 0;
		const visit = (x: number, y: number) => {
			if (x < 0 || y < 0 || x >= width || y >= height) return;
			const pixel = y * width + x;
			if (seen[pixel]) return;
			const index = pixel * 4;
			if (rgbDistance(data, index, background) > COLOR_DISTANCE_LIMIT) return;
			seen[pixel] = 1;
			queue[tail] = pixel;
			tail += 1;
		};
		for (let x = 0; x < width; x += 1) { visit(x, 0); visit(x, height - 1); }
		for (let y = 1; y < height - 1; y += 1) { visit(0, y); visit(width - 1, y); }
		while (head < tail) {
			const pixel = queue[head];
			head += 1;
			const x = pixel % width;
			const y = Math.floor(pixel / width);
			visit(x - 1, y); visit(x + 1, y); visit(x, y - 1); visit(x, y + 1);
		}
		if (tail < width * height * 0.02) throw new Error("Không nhận diện được nền đen/trắng bao quanh hình. Hãy dùng ảnh PNG trong suốt hoặc ảnh nền đồng màu.");

		for (let pixel = 0; pixel < seen.length; pixel += 1) {
			if (!seen[pixel]) continue;
			const index = pixel * 4;
			const distance = rgbDistance(data, index, background);
			const alpha = Math.max(0, Math.min(255, Math.round(((distance - FULLY_REMOVED_DISTANCE) / (COLOR_DISTANCE_LIMIT - FULLY_REMOVED_DISTANCE)) * 255)));
			data[index + 3] = alpha;
		}
		context.putImageData(pixels, 0, 0);
		const result = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", 0.95));
		if (!result?.size) throw new Error("Không tạo được ảnh trong suốt sau khi tách nền.");
		return result;
	} finally {
		bitmap.close();
	}
}
