const imageCache = new Map<string, Promise<HTMLImageElement>>();
export async function loadSanityImage(url: string): Promise<HTMLImageElement> {
	if (typeof window === "undefined") throw new Error("Ảnh chỉ tải được trong trình duyệt");
	const cached = imageCache.get(url);
	if (cached) return cached;
	const pending = load(url);
	imageCache.set(url, pending);
	try { return await pending; } catch (error) { imageCache.delete(url); throw error; }
}

async function load(url: string): Promise<HTMLImageElement> {
	const candidates = [url, url.includes("?") ? `${url}&fm=jpg` : `${url}?fm=jpg`];
	let lastError: unknown;
	for (const candidate of candidates) {
		try {
			const image = new Image();
			image.crossOrigin = "anonymous";
			image.decoding = "async";
			await new Promise<void>((resolve, reject) => {
				image.onload = () => resolve();
				image.onerror = () => reject(new Error("Không tải được ảnh dùng cho bản xem trước"));
				image.src = candidate;
			});
			const canvas = document.createElement("canvas");
			canvas.width = canvas.height = 1;
			const context = canvas.getContext("2d");
			if (!context) throw new Error("Canvas không khả dụng trên thiết bị này");
			context.drawImage(image, 0, 0, 1, 1);
			context.getImageData(0, 0, 1, 1);
			return image;
		} catch (error) { lastError = error; }
	}
	throw new Error(`Ảnh không cho phép truy cập Canvas an toàn. ${lastError instanceof Error ? lastError.message : ""}`);
}
