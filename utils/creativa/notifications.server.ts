/* eslint-disable camelcase -- Telegram uses snake_case request fields. */
import { randomUUID } from "crypto";
import { creativaServerClient } from "@/api-client/creativa-server";
import { CreativaError } from "./contracts";
import { conflict, Receipt, sha256, StoredOrder } from "./records.server";

type Sales = {
	_id: string;
	_type: string;
	active: boolean;
	destinations?: Array<{
		_key: string;
		channel: string;
		chatId: string;
		active: boolean;
	}>;
};

export async function notificationSetup(): Promise<{
	receipts: Receipt[];
	issue?: string;
	sales?: string;
}> {
	try {
		const sales = await creativaServerClient().getDocument<Sales>("creativa.settings.sales");
		if (
			!sales ||
			sales._type !== "creativaSalesSettings" ||
			!sales.active ||
			!sales.destinations?.length
		) {
			return { receipts: [], issue: "SALES_CONFIGURATION_MISSING" };
		}
		const destinations = sales.destinations.filter((d) => d.active);
		if (
			!destinations.length ||
			destinations.length > 5 ||
			new Set(destinations.map((d) => d.chatId)).size !== destinations.length ||
			destinations.some(
				(d) => !d._key || d.channel !== "telegram" || !/^-?[0-9]{1,30}$/.test(d.chatId)
			)
		) {
			return { receipts: [], issue: "SALES_CONFIGURATION_INVALID" };
		}
		return {
			sales: sales._id,
			receipts: destinations.map((d) => ({
				_type: "notificationReceipt",
				_key: sha256(d._key).slice(0, 32),
				destinationId: d._key,
				chatId: d.chatId,
				state: "pending",
			})),
		};
	} catch {
		return { receipts: [], issue: "SALES_CONFIGURATION_UNAVAILABLE" };
	}
}

export const escapeTelegram = (value: string) =>
	value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function formatNotification(order: StoredOrder): string {
	const text = [
		`INUT Creativa — ${order.publicId}`,
		`Ngày: ${order.orderDate}`,
		...order.lines.map((line, index) =>
			[
				`${index + 1}. ${line.productName} [${line.productType}]`,
				`Artwork: ${line.artwork.identity} / ${line.artwork.version}`,
				`Master: ${line.artwork.printAsset?.asset._ref || "Không có — kiểm tra CMS"}`,
				`Model: ${line.selection.modelName} (${line.selection.modelCode})`,
				`Fit/template: ${line.selection.fitReference}`,
				`Coverage: ${line.selection.coverageName} — ${line.selection.coverageMeaning}`,
				`SL: ${line.quantity}; Đơn giá: ${line.unitPrice}; Thành tiền: ${line.subtotal} VND`,
			].join("\n")
		),
		`Khách: ${order.customer.name}`,
		`Điện thoại: ${order.customer.phone}`,
		`Email: ${order.customer.email || "Không cung cấp"}`,
		`Địa chỉ: ${order.customer.address || "Chưa cung cấp — cần liên hệ bổ sung"}`,
		`Ghi chú: ${order.customer.note || "Không"}`,
		`Thanh toán: ${order.paymentMethod}; trạng thái: ${order.paymentStatus}`,
		`Hàng: ${order.merchandiseTotal}; Vận chuyển (${order.shipping.name}): ${order.shippingFee}`,
		`Tổng: ${order.finalAmount} VND; Đơn: ${order.status}`,
	];
	return escapeTelegram(text.join("\n"));
}

async function saveOutcome(
	orderId: string,
	key: string,
	nonce: string,
	outcome: Partial<Receipt>
): Promise<void> {
	for (let attempt = 0; attempt < 4; attempt++) {
		const order = await creativaServerClient().getDocument<StoredOrder>(orderId);
		const receipt = order?.notifications.find((r) => r._key === key);
		if (!order || receipt?.nonce !== nonce || receipt.state !== "dispatching") return;
		try {
			await creativaServerClient()
				.patch(orderId)
				.ifRevisionId(order._rev)
				.set({
					notifications: order.notifications.map((r) =>
						r._key === key ? { ...r, ...outcome } : r
					),
				})
				.commit({ visibility: "sync", returnDocuments: false });
			return;
		} catch (error) {
			if (!conflict(error)) throw error;
		}
	}
	throw new CreativaError("HANDOFF_STATE_UNAVAILABLE", "Chưa lưu được kết quả thông báo.", 503);
}

export async function dispatchNotifications(
	orderId: string,
	options: { retry?: boolean; acknowledgeUnknown?: boolean } = {}
): Promise<void> {
	let order = await creativaServerClient().getDocument<StoredOrder>(orderId);
	if (!order || order._type !== "creativaOrder")
		throw new CreativaError("ORDER_NOT_FOUND", "Không tìm thấy đơn.", 404);
	if (options.retry && !order.notifications.length) {
		const setup = await notificationSetup();
		if (setup.issue)
			throw new CreativaError(setup.issue, "Kiểm tra cấu hình sales trước khi thử lại.", 503);
		await creativaServerClient()
			.patch(orderId)
			.ifRevisionId(order._rev)
			.set({ notifications: setup.receipts })
			.unset(["handoffIssue"])
			.commit({ visibility: "sync", returnDocuments: false });
		order = await creativaServerClient().getDocument<StoredOrder>(orderId);
		if (!order) throw new CreativaError("SERVICE_UNAVAILABLE", "Không thể tải đơn.", 503);
	}
	for (const candidate of order.notifications) {
		if (candidate.state === "sent") continue;
		if (candidate.state === "dispatching" || candidate.state === "unknown") {
			if (!options.retry) continue;
			if (!options.acknowledgeUnknown)
				throw new CreativaError(
					"UNKNOWN_REQUIRES_ACK",
					"Cần xác nhận đã đối soát kết quả chưa rõ.",
					409
				);
			if (
				candidate.state === "dispatching" &&
				Date.now() - Date.parse(candidate.attemptedAt || "") < 60000
			) {
				throw new CreativaError("DISPATCH_IN_PROGRESS", "Đang gửi; không được gửi chồng.", 409);
			}
		}
		if (candidate.state === "failed" && !options.retry) continue;
		await dispatchOne(orderId, candidate._key, options);
	}
}

async function dispatchOne(
	orderId: string,
	key: string,
	options: { retry?: boolean; acknowledgeUnknown?: boolean }
) {
	for (let attempt = 0; attempt < 4; attempt++) {
		const order = await creativaServerClient().getDocument<StoredOrder>(orderId);
		const receipt = order?.notifications.find((r) => r._key === key);
		if (!order || !receipt || receipt.state === "sent") return;
		if (receipt.state !== "pending" && !options.retry) return;
		if (["dispatching", "unknown"].includes(receipt.state) && !options.acknowledgeUnknown) return;
		if (
			receipt.state === "dispatching" &&
			(!Number.isFinite(Date.parse(receipt.attemptedAt || "")) ||
				Date.now() - Date.parse(receipt.attemptedAt || "") < 60000)
		)
			return;
		const token = process.env.CREATIVA_TELEGRAM_BOT_TOKEN;
		const message = formatNotification(order);
		const nonce = randomUUID();
		const claimed = {
			...receipt,
			state: "dispatching" as const,
			nonce,
			attemptedAt: new Date().toISOString(),
		};
		try {
			await creativaServerClient()
				.patch(orderId)
				.ifRevisionId(order._rev)
				.set({ notifications: order.notifications.map((r) => (r._key === key ? claimed : r)) })
				.commit({ visibility: "sync", returnDocuments: false });
		} catch (error) {
			if (conflict(error)) continue;
			throw error;
		}
		if (!token || message.length > 4000) {
			await saveOutcome(orderId, key, nonce, {
				state: "failed",
				outcome: !token ? "TOKEN_MISSING" : "MESSAGE_TOO_LARGE",
			});
			return;
		}
		const abort = new AbortController();
		const timer = setTimeout(() => abort.abort(), 3000);
		let outcome: Partial<Receipt>;
		try {
			const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
				method: "POST",
				signal: abort.signal,
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ chat_id: receipt.chatId, text: message, parse_mode: "HTML" }),
			});
			const result: unknown = await response.json();
			if (
				typeof result === "object" &&
				result !== null &&
				"ok" in result &&
				result.ok === true &&
				"result" in result &&
				typeof result.result === "object" &&
				result.result !== null &&
				"message_id" in result.result &&
				typeof result.result.message_id === "number"
			) {
				outcome = {
					state: "sent",
					outcome: "DELIVERED",
					messageId: String(result.result.message_id),
				};
			} else if (response.status >= 400 && response.status < 500) {
				outcome = { state: "failed", outcome: "PROVIDER_REJECTED" };
			} else {
				outcome = { state: "unknown", outcome: "PROVIDER_OUTCOME_UNKNOWN" };
			}
		} catch {
			outcome = { state: "unknown", outcome: "TRANSPORT_OUTCOME_UNKNOWN" };
		} finally {
			clearTimeout(timer);
		}
		await saveOutcome(orderId, key, nonce, outcome);
		return;
	}
}
