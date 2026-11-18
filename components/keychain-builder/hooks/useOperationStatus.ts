import { useCallback, useRef, useState } from "react";

export type OperationState = { status: "idle" | "pending" | "success" | "error"; message?: string };
export function useOperationStatus() {
	const [state, setState] = useState<OperationState>({ status: "idle" });
	const revision = useRef(0);
	const run = useCallback(async <T,>(operation: () => Promise<T>, successMessage?: string): Promise<T | undefined> => {
		const current = ++revision.current;
		setState({ status: "pending" });
		try {
			const result = await operation();
			if (revision.current === current) setState({ status: "success", message: successMessage });
			return result;
		} catch (error) {
			if (revision.current === current) setState({ status: "error", message: error instanceof Error ? error.message : "Đã xảy ra lỗi. Vui lòng thử lại." });
			return undefined;
		}
	}, []);
	const invalidate = useCallback(() => { revision.current += 1; setState({ status: "idle" }); }, []);
	return { state, run, invalidate };
}
