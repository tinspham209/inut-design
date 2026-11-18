import { useEffect, useRef, useState } from "react";
import { loadSanityImage } from "@/components/keychain-builder/image/loadSanityImage";
import { extractImageAlpha } from "@/components/keychain-builder/geometry/imageAlpha";
import { isLatestGeometryRevision, type DieCutGeometry } from "@/components/keychain-builder/geometry/dieCut";
import type { KeychainConfig } from "@/components/keychain-builder/types";

export type DieCutStatus = "idle" | "processing" | "ready" | "error";
export function useDieCutGeometry(config: KeychainConfig, revision: number) {
	const [result, setResult] = useState<{ status: DieCutStatus; revision: number; geometry?: DieCutGeometry; error?: string }>({ status: "idle", revision });
	const latest = useRef(0);
	const face = config.front;
	const transform = face.transform;
	const smoothness = config.shape.type === "die-cut" ? config.shape.smoothness : 4;
	useEffect(() => {
		const current = ++latest.current;
		if (config.shape.type !== "die-cut") { setResult({ status: "idle", revision }); return; }
		if (!face.url) { setResult({ status: "error", revision, error: "Tải ảnh mặt trước để tạo đường cắt theo viền ảnh." }); return; }
		let worker: Worker | undefined;
		let timeout: ReturnType<typeof setTimeout> | undefined;
		let active = true;
		setResult({ status: "processing", revision });
		void loadSanityImage(face.url).then((image) => {
			if (!active) return;
			const mask = extractImageAlpha(image, 2048, 16, { rotation: transform.rotation, flipX: transform.flipX });
			worker = new Worker(new URL("../geometry/dieCut.worker.ts", import.meta.url), { type: "module" });
			worker.onmessage = (event: MessageEvent<{ revision: number; geometry?: DieCutGeometry; error?: string }>) => {
				if (!active || !isLatestGeometryRevision(event.data.revision, current) || !isLatestGeometryRevision(current, latest.current)) return;
				if (timeout) clearTimeout(timeout);
				worker?.terminate();
				setResult(event.data.geometry ? { status: "ready", revision, geometry: event.data.geometry } : { status: "error", revision, error: event.data.error || "Không thể tạo đường cắt." });
			};
			worker.onerror = () => {
				if (!active || current !== latest.current) return;
				if (timeout) clearTimeout(timeout);
				worker?.terminate();
				setResult({ status: "error", revision, error: "Bộ xử lý đường cắt không khả dụng. Hãy thử lại hoặc chọn khung cố định." });
			};
			timeout = setTimeout(() => {
				if (!active || current !== latest.current) return;
				worker?.terminate();
				setResult({ status: "error", revision, error: "Tạo đường cắt mất quá nhiều thời gian. Hãy chọn ảnh nhỏ hơn hoặc thử lại." });
			}, 20_000);
			worker.postMessage({ revision: current, width: mask.width, height: mask.height, alpha: mask.alpha.buffer, sizeCm: config.sizeCm, tolerancePx: Math.max(0.5, 5 - smoothness) }, [mask.alpha.buffer]);
		}).catch((error) => {
			if (active && current === latest.current) setResult({ status: "error", revision, error: error instanceof Error ? error.message : "Không tải được ảnh để tạo đường cắt." });
		});
		return () => { active = false; if (timeout) clearTimeout(timeout); worker?.terminate(); };
	}, [config.shape.type, config.sizeCm, smoothness, face.url, transform.xMm, transform.yMm, transform.scale, transform.rotation, transform.flipX, revision]);
	return result;
}
