import { create } from "zustand";
import type { CreativaImage, CreativaPurchaseLine } from "@/models/creativa";
import {
	CREATIVA_CART_KEY,
	CreativaError,
	isRecord,
	lineIdentity,
	parsePurchaseLines,
	safeMoney,
	safeQuantity,
} from "@/utils/creativa/contracts";
import { browserId, readAttempt, type SubmittedContribution } from "@/utils/creativa/storage";

export type CreativaCartLine = CreativaPurchaseLine & {
	instanceId: string;
	productName: string;
	productSlug: string;
	productImage?: CreativaImage;
	modelName: string;
	coverageName: string;
	unitPrice: number;
	contributions: Array<{ id: string; quantity: number }>;
};

type CartInput = Omit<CreativaCartLine, "instanceId" | "contributions">;
type CartState = {
	items: CreativaCartLine[];
	hydrated: boolean;
	error: string | null;
	warning: string | null;
	memoryOnly: boolean;
	quarantinedCount: number;
	hydrate: () => void;
	add: (item: CartInput) => void;
	update: (instanceId: string, quantity: number) => void;
	remove: (instanceId: string) => void;
	reconcile: (submitted: SubmittedContribution[]) => void;
	resetCorrupt: () => void;
	discardInvalid: () => void;
};

function decodeEntry(item: unknown): CreativaCartLine {
	if (
		!isRecord(item) ||
		typeof item.instanceId !== "string" ||
		!item.instanceId ||
		!Array.isArray(item.contributions) ||
		typeof item.productName !== "string" ||
		typeof item.productSlug !== "string" ||
		typeof item.modelName !== "string" ||
		typeof item.coverageName !== "string"
	)
		throw new Error("INVALID_CART");
	const [purchase] = parsePurchaseLines([item]);
	const contributions = item.contributions.map((entry: unknown) => {
		if (!isRecord(entry) || typeof entry.id !== "string" || !entry.id)
			throw new Error("INVALID_CART");
		return { id: entry.id, quantity: safeQuantity(entry.quantity) };
	});
	if (
		!contributions.length ||
		new Set(contributions.map((entry) => entry.id)).size !== contributions.length ||
		contributions.reduce((sum, entry) => safeQuantity(sum + entry.quantity), 0) !==
			purchase.quantity
	) {
		throw new Error("INVALID_CART");
	}
	const unitPrice = safeMoney(item.unitPrice);
	safeMoney(unitPrice * purchase.quantity);
	return {
		...purchase,
		instanceId: item.instanceId,
		productName: item.productName,
		productSlug: item.productSlug,
		modelName: item.modelName,
		coverageName: item.coverageName,
		unitPrice,
		contributions,
	};
}

function decodeCart(raw: string | null): { items: CreativaCartLine[]; invalidCount: number } {
	if (raw === null) return { items: [], invalidCount: 0 };
	const value: unknown = JSON.parse(raw);
	if (!isRecord(value) || value.version !== 1 || !Array.isArray(value.items))
		throw new Error("INVALID_CART");
	const items: CreativaCartLine[] = [];
	let invalidCount = 0;
	for (const entry of value.items) {
		try {
			const item = decodeEntry(entry);
			if (items.some((existing) => existing.instanceId === item.instanceId))
				throw new Error("INVALID_CART");
			items.push(item);
		} catch (error) {
			if (
				!(error instanceof CreativaError) &&
				!(error instanceof Error && error.message === "INVALID_CART")
			)
				throw error;
			invalidCount += 1;
		}
	}
	return { items, invalidCount };
}

function latestCart(): CreativaCartLine[] {
	const decoded = decodeCart(localStorage.getItem(CREATIVA_CART_KEY));
	if (decoded.invalidCount) throw new Error("INVALID_CART");
	return decoded.items;
}

function persist(items: CreativaCartLine[]): void {
	localStorage.setItem(CREATIVA_CART_KEY, JSON.stringify({ version: 1, items }));
}

export function submittedContributions(items: CreativaCartLine[]): SubmittedContribution[] {
	return items.flatMap((item) =>
		item.contributions.map((entry) => ({
			lineKey: lineIdentity(item),
			contributionId: entry.id,
			quantity: entry.quantity,
		}))
	);
}

export function isReserved(item: CreativaCartLine): boolean {
	const attempt = readAttempt();
	if (attempt.error && !attempt.unavailable) return true;
	return !!attempt.value?.submitted.some((entry) =>
		item.contributions.some((contribution) => entry.contributionId === contribution.id)
	);
}

export const useCreativaCart = create<CartState>()((set, get) => {
	function mutate(change: (items: CreativaCartLine[]) => CreativaCartLine[]) {
		if (get().error) throw new Error(get().error);
		let current = get().items;
		try {
			if (!get().memoryOnly) current = latestCart();
		} catch (error) {
			if (!(error instanceof Error) || error.name !== "SecurityError") {
				set({ error: "Không thể đọc giỏ đã lưu. Vui lòng khôi phục dữ liệu trước khi thay đổi." });
				throw new Error("Không thể đọc giỏ đã lưu.");
			}
			set({ memoryOnly: true });
		}
		const items = change(current);
		try {
			persist(items);
			set({ items, error: null, warning: null, memoryOnly: false, hydrated: true });
		} catch {
			set({
				items,
				error: null,
				hydrated: true,
				memoryOnly: true,
				warning:
					"Giỏ hàng chỉ được giữ trong trang đang mở vì trình duyệt không cho lưu. Không tải lại trước khi hoàn tất.",
			});
		}
	}
	return {
		items: [],
		hydrated: false,
		error: null,
		warning: null,
		memoryOnly: false,
		quarantinedCount: 0,
		hydrate: () => {
			if (typeof window === "undefined") return;
			if (get().memoryOnly) {
				set({ hydrated: true });
				return;
			}
			try {
				const decoded = decodeCart(localStorage.getItem(CREATIVA_CART_KEY));
				set({
					items: decoded.items,
					hydrated: true,
					quarantinedCount: decoded.invalidCount,
					error: decoded.invalidCount
						? `Có ${decoded.invalidCount} mục giỏ hàng không hợp lệ. Các mục hợp lệ được giữ lại; hãy khôi phục hoặc loại bỏ mục lỗi trước khi thanh toán.`
						: null,
				});
			} catch (error) {
				if (error instanceof Error && error.name === "SecurityError") {
					set({
						hydrated: true,
						error: null,
						memoryOnly: true,
						warning:
							"Trình duyệt đang chặn lưu giỏ hàng. Dữ liệu chỉ được giữ trong trang đang mở.",
					});
					return;
				}
				set({
					hydrated: true,
					error:
						"Không thể đọc giỏ hàng đã lưu. Dữ liệu chưa bị xóa; vui lòng khôi phục hoặc xóa giỏ lỗi.",
				});
			}
		},
		add: (input) =>
			mutate((items) => {
				parsePurchaseLines([input]);
				safeMoney(input.unitPrice);
				safeMoney(input.unitPrice * input.quantity);
				const found = items.find((item) => lineIdentity(item) === lineIdentity(input));
				const contribution = { id: browserId(), quantity: input.quantity };
				if (found) {
					safeMoney(found.unitPrice * safeQuantity(found.quantity + input.quantity));
					return items.map((item) =>
						item === found
							? {
									...item,
									quantity: safeQuantity(item.quantity + input.quantity),
									contributions: [...item.contributions, contribution],
							  }
							: item
					);
				}
				return [...items, { ...input, instanceId: browserId(), contributions: [contribution] }];
			}),
		update: (instanceId, quantity) => {
			if (quantity === 0) return get().remove(instanceId);
			safeQuantity(quantity);
			mutate((items) =>
				items.map((item) => {
					if (item.instanceId !== instanceId) return item;
					if (isReserved(item))
						throw new Error(
							"Sản phẩm đang chờ xác nhận đặt hàng. Vui lòng khôi phục tiến trình trước."
						);
					safeMoney(item.unitPrice * quantity);
					return { ...item, quantity, contributions: [{ id: browserId(), quantity }] };
				})
			);
		},
		remove: (instanceId) =>
			mutate((items) => {
				const item = items.find((entry) => entry.instanceId === instanceId);
				if (item && isReserved(item)) throw new Error("Sản phẩm đang chờ xác nhận đặt hàng.");
				return items.filter((entry) => entry.instanceId !== instanceId);
			}),
		reconcile: (submitted) =>
			mutate((items) =>
				items.flatMap((item) => {
					const contributions = item.contributions.flatMap((entry) => {
						const accepted = submitted.find(
							(candidate) =>
								candidate.lineKey === lineIdentity(item) && candidate.contributionId === entry.id
						);
						if (!accepted) return [entry];
						if (accepted.quantity > entry.quantity)
							throw new Error("Giỏ hàng đã thay đổi; không thể tự xóa sản phẩm đã đặt.");
						const remaining = entry.quantity - accepted.quantity;
						return remaining ? [{ ...entry, quantity: remaining }] : [];
					});
					const quantity = contributions.reduce((sum, entry) => sum + entry.quantity, 0);
					return quantity ? [{ ...item, contributions, quantity }] : [];
				})
			),
		resetCorrupt: () => {
			try {
				if (readAttempt().value || readAttempt().error)
					throw new Error("Vui lòng khôi phục lần đặt hàng trước khi xóa giỏ.");
				localStorage.removeItem(CREATIVA_CART_KEY);
				set({
					items: [],
					error: null,
					warning: null,
					memoryOnly: false,
					quarantinedCount: 0,
					hydrated: true,
				});
			} catch (error) {
				set({ error: error instanceof Error ? error.message : "Không thể xóa giỏ hàng lỗi." });
			}
		},
		discardInvalid: () => {
			try {
				const decoded = decodeCart(localStorage.getItem(CREATIVA_CART_KEY));
				persist(decoded.items);
				set({
					items: decoded.items,
					quarantinedCount: 0,
					error: null,
					warning: null,
					memoryOnly: false,
					hydrated: true,
				});
			} catch {
				set({ error: "Không thể loại bỏ mục lỗi. Dữ liệu cũ vẫn được giữ lại; vui lòng thử lại." });
			}
		},
	};
});
