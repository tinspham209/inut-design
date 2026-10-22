import { createHash, randomBytes } from "crypto";
import type {
	CreativaBank,
	CreativaCheckoutRequest,
	CreativaCustomer,
	CreativaOrderLine,
	CreativaPaymentStatus,
	CreativaOrderStatus,
	CreativaQuote,
} from "@/models/creativa";
import { canonicalJson, CreativaError, CREATIVA_CAPABILITY } from "./contracts";

export type Ref = { _type: "reference"; _ref: string };
export type Receipt = {
	_type: "notificationReceipt";
	_key: string;
	destinationId: string;
	chatId: string;
	state: "pending" | "dispatching" | "sent" | "failed" | "unknown";
	nonce?: string;
	attemptedAt?: string;
	outcome?: string;
	messageId?: string;
};
export type StoredLine = CreativaOrderLine & {
	_type: "acceptedLine";
	product: Ref;
	model: Ref;
	coverage: Ref;
	retainedImages: Array<CreativaOrderLine["productImage"] & { _key: string }>;
	sourceRevisions: { product: string; model: string; coverage: string };
};
export type StoredOrder = {
	_id: string;
	_type: "creativaOrder";
	_rev: string;
	publicId: string;
	analyticsId: string;
	orderDate: string;
	status: CreativaOrderStatus;
	paymentStatus: CreativaPaymentStatus;
	paymentMethod: "cod" | "bank_transfer";
	customer: CreativaCustomer;
	lines: StoredLine[];
	currency: "VND";
	merchandiseTotal: number;
	shippingFee: number;
	discount: 0;
	finalAmount: number;
	shipping: CreativaQuote["shipping"];
	bank: CreativaBank | null;
	trackingNumber?: string;
	notifications: Receipt[];
	handoffIssue?: string;
	analyticsReceipts: Array<{
		_type: "analyticsReceipt";
		_key: string;
		destination: string;
		eventKey: string;
		claimedAt: string;
	}>;
};
export type StoredIntent = {
	_id: string;
	_type: "creativaCheckoutIntent";
	_rev: string;
	state: "pending" | "accepted" | "rejected";
	fingerprint?: string;
	request?: CreativaCheckoutRequest;
	order?: Ref;
	rejection?: { code: string; message: string; status: number; quote?: CreativaQuote };
};
export const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");
export const semanticDigest = (value: unknown) => sha256(canonicalJson(value));
export const reference = (_ref: string): Ref => ({ _type: "reference", _ref });
export function intentId(capability: unknown): string {
	if (typeof capability !== "string" || !CREATIVA_CAPABILITY.test(capability)) {
		throw new CreativaError("INVALID_CAPABILITY", "Mã khôi phục không hợp lệ.", 400);
	}
	return `creativa.intent.${sha256(capability)}`;
}
export function generatePublicId(): string {
	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";
	return [...randomBytes(10)].map((byte) => alphabet[byte & 63]).join("");
}
export function unavailable(): CreativaError {
	return new CreativaError(
		"OUTCOME_UNKNOWN",
		"Chưa xác định được kết quả. Vui lòng khôi phục cùng lần đặt hàng.",
		503
	);
}
export function conflict(error: unknown): boolean {
	return (
		typeof error === "object" && error !== null && "statusCode" in error && error.statusCode === 409
	);
}
