import type {
	CreativaCheckoutRequest,
	CreativaCustomer,
	CreativaPurchaseLine,
} from "@/models/creativa";

export const CREATIVA_PUBLIC_ID = /^[A-Za-z0-9_-]{10}$/;
export const CREATIVA_CAPABILITY = /^[A-Za-z0-9_-]{43}$/;
export const CREATIVA_CART_KEY = "inut-creativa-cart";
export const CREATIVA_HISTORY_KEY = "inut-creativa-order-history";
export const CREATIVA_ATTEMPT_KEY = "inut-creativa-checkout-attempt";
export const RESERVED_SKIN_SLUGS = ["huong-dan-su-dung"];

export class CreativaError extends Error {
	terminal = false;
	constructor(
		public code: string,
		message: string,
		public status = 422,
		public fieldErrors?: Record<string, string>
	) {
		super(message);
		this.name = "CreativaError";
	}
}

export function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function requireText(value: unknown, field: string, max = 500, errorKey?: string): string {
	if (typeof value !== "string" || !value.trim() || value.length > max) {
		const message = `Thông tin ${field} không hợp lệ.`;
		throw new CreativaError(
			"INVALID_INPUT",
			message,
			422,
			errorKey ? { [errorKey]: message } : undefined
		);
	}
	return value.trim();
}

function optionalText(
	value: unknown,
	field: string,
	max = 2000,
	errorKey?: string
): string | undefined {
	if (value === undefined || value === null || value === "") return undefined;
	if (typeof value !== "string" || value.length > max) {
		const message = `Thông tin ${field} không hợp lệ.`;
		throw new CreativaError(
			"INVALID_INPUT",
			message,
			422,
			errorKey ? { [errorKey]: message } : undefined
		);
	}
	return value.trim() || undefined;
}

export function safeMoney(value: unknown): number {
	if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) {
		throw new CreativaError("INVALID_PRICE", "Cấu hình giá không hợp lệ.", 503);
	}
	return value;
}

export function safeQuantity(value: unknown): number {
	if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 1) {
		throw new CreativaError("INVALID_QUANTITY", "Số lượng phải là số nguyên dương hợp lệ.");
	}
	return value;
}

export function lineIdentity(
	line: Pick<CreativaPurchaseLine, "productType" | "productId" | "selection">
): string {
	return JSON.stringify([
		line.productType,
		line.productId,
		line.selection.modelId,
		line.selection.coverageId,
	]);
}

export function parsePurchaseLines(value: unknown): CreativaPurchaseLine[] {
	if (!Array.isArray(value) || value.length === 0) {
		throw new CreativaError("EMPTY_CART", "Giỏ hàng chưa có sản phẩm.");
	}
	const merged = new Map<string, CreativaPurchaseLine>();
	for (const item of value) {
		if (!isRecord(item) || item.productType !== "skin-laptop" || !isRecord(item.selection)) {
			throw new CreativaError("UNSUPPORTED_PRODUCT", "Loại sản phẩm không được hỗ trợ.");
		}
		const line: CreativaPurchaseLine = {
			productType: "skin-laptop",
			productId: requireText(item.productId, "sản phẩm", 128),
			selection: {
				modelId: requireText(item.selection.modelId, "mẫu MacBook", 128),
				coverageId: requireText(item.selection.coverageId, "phạm vi dán", 128),
			},
			quantity: safeQuantity(item.quantity),
		};
		const key = lineIdentity(line);
		const previous = merged.get(key);
		if (previous) previous.quantity = safeQuantity(previous.quantity + line.quantity);
		else merged.set(key, line);
	}
	return [...merged.values()].sort((a, b) => lineIdentity(a).localeCompare(lineIdentity(b)));
}

export function parseCustomer(value: unknown): CreativaCustomer {
	if (!isRecord(value))
		throw new CreativaError("INVALID_CUSTOMER", "Vui lòng nhập thông tin khách hàng.");
	const name = requireText(value.name, "họ tên", 200, "name");
	if (typeof value.phone !== "string" || !/^[0-9]{10}$/.test(value.phone)) {
		throw new CreativaError("INVALID_PHONE", "Số điện thoại phải gồm đúng 10 chữ số.", 422, {
			phone: "Số điện thoại phải gồm đúng 10 chữ số.",
		});
	}
	const email = optionalText(value.email, "email", 254, "email");
	if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		throw new CreativaError("INVALID_EMAIL", "Email không hợp lệ.", 422, {
			email: "Email không hợp lệ.",
		});
	}
	const address = optionalText(value.address, "địa chỉ", 2000, "address");
	const note = optionalText(value.note, "ghi chú", 2000, "note");
	return {
		name,
		phone: value.phone,
		...(email && { email }),
		...(address && { address }),
		...(note && { note }),
	};
}

export function parsePayment(value: unknown): "cod" | "bank_transfer" {
	if (value !== "cod" && value !== "bank_transfer") {
		throw new CreativaError("INVALID_PAYMENT", "Vui lòng chọn phương thức thanh toán.");
	}
	return value;
}

export function parseCheckout(value: unknown): CreativaCheckoutRequest {
	if (!isRecord(value) || !isRecord(value.reviewedQuote)) {
		throw new CreativaError("INVALID_INPUT", "Thông tin đặt hàng không hợp lệ.");
	}
	const digest = requireText(value.reviewedQuote.digest, "báo giá", 64);
	if (!/^[a-f0-9]{64}$/.test(digest)) {
		throw new CreativaError("INVALID_QUOTE", "Vui lòng kiểm tra lại báo giá.");
	}
	const amounts = [
		value.reviewedQuote.merchandiseTotal,
		value.reviewedQuote.shippingFee,
		value.reviewedQuote.finalAmount,
	];
	if (
		amounts.some(
			(amount) => typeof amount !== "number" || !Number.isSafeInteger(amount) || amount < 0
		)
	) {
		throw new CreativaError("INVALID_QUOTE", "Các số tiền trong báo giá không hợp lệ.", 422);
	}
	return {
		lines: parsePurchaseLines(value.lines),
		customer: parseCustomer(value.customer),
		paymentMethod: parsePayment(value.paymentMethod),
		reviewedQuote: {
			digest,
			merchandiseTotal: safeMoney(value.reviewedQuote.merchandiseTotal),
			shippingFee: safeMoney(value.reviewedQuote.shippingFee),
			finalAmount: safeMoney(value.reviewedQuote.finalAmount),
		},
	};
}

export function canonicalJson(value: unknown): string {
	if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
	if (isRecord(value)) {
		return `{${Object.keys(value)
			.filter((key) => value[key] !== undefined)
			.sort()
			.map((key) => `${JSON.stringify(key)}:${canonicalJson(value[key])}`)
			.join(",")}}`;
	}
	return JSON.stringify(value);
}

export function formatCreativaPrice(amount: number): string {
	return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
}
