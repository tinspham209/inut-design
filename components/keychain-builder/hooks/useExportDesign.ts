import { useCallback, useRef, useState } from "react";
import { saveKeychainSnapshot } from "@/api-client/keychain";
import type { KeychainConfig } from "../types";

function uuid() {
	if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
	const bytes = crypto.getRandomValues(new Uint8Array(16));
	bytes[6] = (bytes[6] & 0x0f) | 0x40; bytes[8] = (bytes[8] & 0x3f) | 0x80;
	const hex = Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join("");
	return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function useExportDesign() {
	const [status, setStatus] = useState<"idle" | "pending" | "error" | "success">("idle");
	const [error, setError] = useState<string | null>(null);
	const [link, setLink] = useState<string | null>(null);
	const retryRef = useRef<{ fingerprint: string; id: string } | null>(null);
	const exportDesign = useCallback(async (config: KeychainConfig, render: () => Promise<Blob>) => {
		const fingerprint = JSON.stringify(config);
		if (!retryRef.current || retryRef.current.fingerprint !== fingerprint) retryRef.current = { fingerprint, id: uuid() };
		setStatus("pending"); setError(null);
		try {
			const png = await render();
			const snapshot = await saveKeychainSnapshot(config, retryRef.current.id);
			const objectUrl = URL.createObjectURL(png);
			const anchor = document.createElement("a"); anchor.href = objectUrl; anchor.download = `keychain-${snapshot.id}.png`; anchor.click();
			window.setTimeout(() => URL.revokeObjectURL(objectUrl), 30_000);
			setLink(new URL(snapshot.url, window.location.origin).toString()); setStatus("success");
			retryRef.current = null;
			return snapshot.url;
		} catch (reason) {
			setStatus("error"); setError(reason instanceof Error ? reason.message : "Không thể xuất thiết kế. Vui lòng thử lại.");
			throw reason;
		}
	}, []);
	return { exportDesign, status, error, link };
}
