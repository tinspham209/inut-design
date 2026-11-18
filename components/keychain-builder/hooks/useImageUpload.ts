import { useCallback, useState } from "react";
import { uploadKeychainImage } from "@/api-client/keychain";
import type { ImageFace } from "../types";

export function useImageUpload() {
	const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
	const [error, setError] = useState<string | null>(null);
	const upload = useCallback(async (file: File): Promise<ImageFace | null> => {
		setStatus("uploading"); setError(null);
		try {
			const result = await uploadKeychainImage(file);
			setStatus("idle");
			return { image: result.image, url: result.url, transform: { xMm: 0, yMm: 0, scale: 1, rotation: 0, flipX: false } };
		} catch (reason) {
			setStatus("error"); setError(reason instanceof Error ? reason.message : "Không tải được ảnh.");
			return null;
		}
	}, []);
	return { upload, status, error };
}
