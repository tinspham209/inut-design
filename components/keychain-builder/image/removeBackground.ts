export type BackgroundRemovalProgress = (progress: number) => void;

/** Runs inference in the browser. Only the model/WASM assets are fetched; the image stays local. */
export async function removeBackgroundLocally(source: Blob, onProgress: BackgroundRemovalProgress): Promise<Blob> {
	if (typeof window === "undefined") throw new Error("Tách nền chỉ khả dụng trong trình duyệt.");
	const { removeBackground } = await import("@imgly/background-removal");
	const result = await removeBackground(source, {
		device: "cpu",
		model: "isnet_quint8",
		output: { format: "image/webp", quality: 0.92 },
		progress: (_key, current, total) => {
			if (total > 0) onProgress(Math.max(0, Math.min(99, Math.round((current / total) * 100))));
		},
	});
	if (!result.size || !result.type.includes("image/")) throw new Error("Không tạo được ảnh PNG/WebP sau khi tách nền.");
	return result;
}
