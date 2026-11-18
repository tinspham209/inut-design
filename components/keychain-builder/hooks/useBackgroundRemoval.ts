import { useCallback, useRef, useState } from "react";
import { uploadKeychainImage } from "@/api-client/keychain";
import { removeBackgroundLocally } from "../image/removeBackground";

export type BackgroundRemovalFace = "front" | "backCustom";
export type BackgroundRemovalState = { status: "idle" | "processing" | "uploading" | "complete" | "error" | "unsupported"; progress: number; error?: string };
type ProcessedImage = { image: { _type: "image"; asset: { _ref: string; _type: "reference" } }; url: string };
const initialState: BackgroundRemovalState = { status: "idle", progress: 0 };

export function useBackgroundRemoval() {
	const [states, setStates] = useState<Record<BackgroundRemovalFace, BackgroundRemovalState>>({ front: initialState, backCustom: initialState });
	const revisions = useRef<Record<BackgroundRemovalFace, number>>({ front: 0, backCustom: 0 });
	const isCurrent = useCallback((face: BackgroundRemovalFace, revision: number) => revisions.current[face] === revision, []);
	const update = useCallback((face: BackgroundRemovalFace, state: BackgroundRemovalState) => setStates((current) => ({ ...current, [face]: state })), []);
	const cancel = useCallback((face: BackgroundRemovalFace) => {
		revisions.current[face] += 1;
		setStates((current) => ({ ...current, [face]: initialState }));
	}, []);
	const remove = useCallback(async (face: BackgroundRemovalFace, sourceUrl?: string): Promise<ProcessedImage | null | undefined> => {
		const revision = ++revisions.current[face];
		if (!sourceUrl) { update(face, { status: "error", progress: 0, error: "Tải ảnh lên trước khi tách nền." }); return null; }
		if (typeof window === "undefined" || !window.Worker || !window.WebAssembly) {
			update(face, { status: "unsupported", progress: 0, error: "Trình duyệt này chưa hỗ trợ xử lý ảnh cục bộ. Hãy dùng Chrome hoặc Safari mới hơn, hoặc giữ ảnh gốc." });
			return null;
		}
		update(face, { status: "processing", progress: 0 });
		try {
			const sourceAddress = new URL(sourceUrl, window.location.origin);
			if (sourceAddress.protocol !== "https:" || sourceAddress.hostname !== "cdn.sanity.io" || !sourceAddress.pathname.startsWith("/images/")) throw new Error("Nguồn ảnh không hợp lệ để xử lý cục bộ.");
			const response = await fetch(sourceAddress.toString(), { mode: "cors", credentials: "omit" });
			if (!response.ok) throw new Error("Không tải được ảnh gốc để xử lý. Hãy thử lại.");
			const source = await response.blob();
			if (!source.size || source.size > 10 * 1024 * 1024) throw new Error("Ảnh gốc không hợp lệ hoặc vượt quá 10 MB.");
			const processed = await removeBackgroundLocally(source, (progress) => {
				if (isCurrent(face, revision)) update(face, { status: "processing", progress });
			});
			if (!isCurrent(face, revision)) return undefined;
			update(face, { status: "uploading", progress: 100 });
			const file = new File([processed], `keychain-${face}-background-removed.webp`, { type: "image/webp" });
			const uploaded = await uploadKeychainImage(file);
			if (!isCurrent(face, revision)) return undefined;
			update(face, { status: "complete", progress: 100 });
			return uploaded;
		} catch (reason) {
			if (!isCurrent(face, revision)) return undefined;
			const message = reason instanceof Error ? reason.message : "Không tách được nền. Ảnh gốc vẫn được giữ.";
			update(face, { status: "error", progress: 0, error: `${message} Ảnh gốc vẫn được giữ.` });
			return null;
		}
	}, [isCurrent, update]);
	return { states, remove, cancel };
}
