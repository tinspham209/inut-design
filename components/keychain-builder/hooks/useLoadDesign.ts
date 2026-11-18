import { useCallback, useEffect, useRef, useState } from "react";
import { readKeychainSnapshot } from "@/api-client/keychain";
import type { KeychainAction } from "../types";
import { validateKeychainConfig } from "@/utils/keychain/validation";

export function useLoadDesign(id?: string | string[]) {
	const [status, setStatus] = useState<"idle" | "loading" | "loaded" | "error">(id ? "loading" : "idle");
	const [error, setError] = useState<string | null>(null);
	const revision = useRef(0);
	const load = useCallback(async (designId: string, dispatch: (action: KeychainAction) => void) => {
		const current = ++revision.current;
		setStatus("loading"); setError(null);
		try {
			const result = await readKeychainSnapshot(designId);
			if (!validateKeychainConfig(result.config)) throw new Error("Liên kết chứa cấu hình không hợp lệ.");
			if (revision.current !== current) return;
			dispatch({ type: "load", config: result.config }); setStatus("loaded");
		} catch (reason) {
			if (revision.current === current) { setStatus("error"); setError(reason instanceof Error ? reason.message : "Không tải được thiết kế."); }
		}
	}, []);
	useEffect(() => { if (typeof id === "string") return () => { revision.current += 1; }; }, [id]);
	return { status, error, load };
}
