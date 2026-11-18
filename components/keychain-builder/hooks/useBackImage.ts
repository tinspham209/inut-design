import { useCallback, useRef, useState } from "react";
import { uploadKeychainImage } from "@/api-client/keychain";
import { loadSanityImage } from "../image/loadSanityImage";
import type { ImageFace } from "../types";

export function useBackImage() {
	const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
	const [error, setError] = useState<string | null>(null);
	const revision = useRef(0);
	const upload = useCallback(async (file: File): Promise<ImageFace | null> => {
		const current = ++revision.current;
		setStatus("uploading"); setError(null);
		try {
			const response = await uploadKeychainImage(file);
			await loadSanityImage(response.url);
			if (revision.current !== current) return null;
			setStatus("idle");
			return { image: response.image, url: response.url, transform: { xMm: 0, yMm: 0, scale: 1, rotation: 0, flipX: false } };
		} catch (reason) {
			if (revision.current === current) { setStatus("error"); setError(reason instanceof Error ? reason.message : "Không tải được ảnh mặt sau."); }
			return null;
		}
	}, []);
	const cancel = useCallback(() => { revision.current += 1; setStatus("idle"); setError(null); }, []);
	return { upload, cancel, status, error };
}
