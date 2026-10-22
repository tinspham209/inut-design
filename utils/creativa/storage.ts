import type { CreativaPublicOrder } from "@/models/creativa";
import {
	CREATIVA_ATTEMPT_KEY,
	CREATIVA_CAPABILITY,
	CREATIVA_HISTORY_KEY,
	CREATIVA_PUBLIC_ID,
	isRecord,
} from "./contracts";

export type StorageResult<T> = { value: T; error?: string; unavailable?: boolean };
export type SubmittedContribution = { lineKey: string; contributionId: string; quantity: number };
export type CheckoutAttempt = {
	version: 1;
	capability: string;
	submitted: SubmittedContribution[];
	historyHandled: boolean;
	cartHandled: boolean;
	order?: CreativaPublicOrder;
};
let liveAttempt: CheckoutAttempt | null = null;
let liveAttemptWasPersisted = false;

export function browserId(bytes = 16): string {
	const data = new Uint8Array(bytes);
	crypto.getRandomValues(data);
	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";
	return Array.from(data, (value) => alphabet[value & 63]).join("");
}

export function checkoutCapability(): string {
	const bytes = new Uint8Array(32);
	crypto.getRandomValues(bytes);
	return btoa(String.fromCharCode(...bytes))
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");
}

export function readHistory(): StorageResult<string[]> {
	if (typeof window === "undefined") return { value: [] };
	try {
		const raw = localStorage.getItem(CREATIVA_HISTORY_KEY);
		if (raw === null) return { value: [] };
		const parsed: unknown = JSON.parse(raw);
		if (!Array.isArray(parsed)) throw new Error("INVALID_HISTORY");
		const valid = parsed.filter(
			(id): id is string => typeof id === "string" && CREATIVA_PUBLIC_ID.test(id)
		);
		return {
			value: [...new Set(valid)],
			...(valid.length !== parsed.length && {
				error: "Một số mã đã lưu không hợp lệ. Bạn có thể xóa lịch sử để khôi phục.",
			}),
		};
	} catch {
		return {
			value: [],
			error: "Không thể đọc lịch sử trên trình duyệt này. Bạn vẫn có thể nhập mã để tra cứu.",
		};
	}
}

function writeHistory(ids: string[]): StorageResult<string[]> {
	try {
		localStorage.setItem(CREATIVA_HISTORY_KEY, JSON.stringify(ids));
		window.dispatchEvent(new Event("creativa-history"));
		return { value: ids };
	} catch {
		return {
			value: readHistory().value,
			error: "Không thể lưu lịch sử. Vui lòng sao chép mã đơn hàng để giữ lại.",
		};
	}
}

export function rememberAcceptedId(id: string): StorageResult<string[]> {
	const current = readHistory();
	if (current.error) return current;
	if (!CREATIVA_PUBLIC_ID.test(id)) return { ...current, error: "Mã đơn hàng không hợp lệ." };
	return current.value.includes(id) ? current : writeHistory([id, ...current.value]);
}

export function removeHistoryId(id: string): StorageResult<string[]> {
	const current = readHistory();
	return writeHistory(current.value.filter((value) => value !== id));
}

export function clearHistory(): StorageResult<string[]> {
	try {
		localStorage.removeItem(CREATIVA_HISTORY_KEY);
		window.dispatchEvent(new Event("creativa-history"));
		return { value: [] };
	} catch {
		return { value: readHistory().value, error: "Không thể xóa lịch sử trên trình duyệt này." };
	}
}

export function readAttempt(): StorageResult<CheckoutAttempt | null> {
	if (typeof window === "undefined") return { value: null };
	try {
		const raw = localStorage.getItem(CREATIVA_ATTEMPT_KEY);
		if (raw === null) return { value: liveAttemptWasPersisted ? null : liveAttempt };
		const value: unknown = JSON.parse(raw);
		if (
			!isRecord(value) ||
			value.version !== 1 ||
			typeof value.capability !== "string" ||
			!CREATIVA_CAPABILITY.test(value.capability) ||
			!Array.isArray(value.submitted) ||
			typeof value.cartHandled !== "boolean" ||
			typeof value.historyHandled !== "boolean"
		) {
			throw new Error("INVALID_ATTEMPT");
		}
		const submitted: SubmittedContribution[] = value.submitted.map((entry: unknown) => {
			if (
				!isRecord(entry) ||
				typeof entry.lineKey !== "string" ||
				typeof entry.contributionId !== "string" ||
				typeof entry.quantity !== "number" ||
				!Number.isSafeInteger(entry.quantity) ||
				entry.quantity < 1
			)
				throw new Error("INVALID_CONTRIBUTION");
			return {
				lineKey: entry.lineKey,
				contributionId: entry.contributionId,
				quantity: entry.quantity,
			};
		});
		const attempt: CheckoutAttempt = {
			version: 1,
			capability: value.capability,
			submitted,
			cartHandled: value.cartHandled,
			historyHandled: value.historyHandled,
		};
		if (liveAttempt?.capability === attempt.capability) {
			attempt.cartHandled ||= liveAttempt.cartHandled;
			attempt.historyHandled ||= liveAttempt.historyHandled;
		}
		liveAttempt = attempt;
		liveAttemptWasPersisted = true;
		return { value: attempt };
	} catch (error) {
		const unavailable = error instanceof Error && error.name === "SecurityError";
		return {
			value: unavailable ? liveAttempt : null,
			unavailable,
			error: unavailable
				? "Trình duyệt đang chặn lưu trữ. Tiến trình chỉ có thể giữ trong trang đang mở."
				: "Không thể đọc lần đặt hàng trước. Không gửi lại nếu bạn chưa xác nhận kết quả với hỗ trợ.",
		};
	}
}

export function saveAttempt(attempt: CheckoutAttempt): string | null {
	try {
		const current = readAttempt();
		if (current.error && !current.unavailable) return current.error;
		if (current.value && current.value.capability !== attempt.capability) {
			return "Một lần đặt hàng trước đang chờ xác nhận. Vui lòng khôi phục trước khi đặt tiếp.";
		}
		if (liveAttempt?.capability !== attempt.capability) liveAttemptWasPersisted = false;
		liveAttempt = attempt;
		// Keep only recovery metadata, never customer/order payloads.
		localStorage.setItem(
			CREATIVA_ATTEMPT_KEY,
			JSON.stringify({
				version: 1,
				capability: attempt.capability,
				submitted: attempt.submitted,
				historyHandled: attempt.historyHandled,
				cartHandled: attempt.cartHandled,
			})
		);
		liveAttemptWasPersisted = true;
		return null;
	} catch {
		return "Không thể lưu tiến trình trên trình duyệt. Hãy giữ trang mở và sao chép mã sau khi đặt hàng.";
	}
}

export function clearAttempt(capability: string): string | null {
	if (liveAttempt?.capability === capability) {
		liveAttempt = null;
		liveAttemptWasPersisted = false;
	}
	try {
		const current = readAttempt();
		if (current.error) return current.error;
		if (current.value?.capability === capability) localStorage.removeItem(CREATIVA_ATTEMPT_KEY);
		return null;
	} catch {
		return "Không thể xóa tiến trình đã hoàn tất. Không gửi lại đơn hàng này.";
	}
}
