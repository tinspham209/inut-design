/* eslint-disable camelcase -- Telegram uses snake_case request fields. */
import { randomUUID } from "crypto";
import { creativaServerClient } from "@/api-client/creativa-server";
import { CreativaError, validCreativaPrintPath } from "./contracts";
import {
	conflict,
	NotificationPart,
	Receipt,
	sha256,
	StoredLine,
	StoredOrder,
} from "./records.server";

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

function productionDetails(line: StoredLine): string[] {
	if (line.production) {
		if (!validCreativaPrintPath(line.production.printAssetPath))
			throw new CreativaError(
				"ORDER_SNAPSHOT_INVALID",
				"Thiếu đường dẫn in trong đơn đã lưu.",
				500
			);
		return [`Print file: ${line.production.printAssetPath}`];
	}
	if (!line.artwork?.identity || !line.artwork.version)
		throw new CreativaError(
			"ORDER_SNAPSHOT_INVALID",
			"Thiếu thông tin sản xuất trong đơn đã lưu.",
			500
		);
	return [
		`Artwork: ${line.artwork.identity} / ${line.artwork.version}`,
		`Master: ${line.artwork.printAsset?.asset._ref || "Không có — kiểm tra CMS"}`,
		`Fit/template: ${line.selection.fitReference || "Không lưu — kiểm tra CMS"}`,
	];
}

function notificationText(order: StoredOrder): string {
	const text = [
		`INUT Creativa — ${order.publicId}`,
		`Ngày: ${order.orderDate}`,
		...order.lines.map((line, index) =>
			[
				`${index + 1}. ${line.productName} [${line.productType}]`,
				...productionDetails(line),
				`Model: ${line.selection.modelName} (${line.selection.modelCode})`,
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
	return text.join("\n");
}

export function formatNotification(order: StoredOrder): string {
	return escapeTelegram(notificationText(order));
}

function notificationParts(order: StoredOrder): NotificationPart[] {
	const chunks: string[] = [];
	let chunk = "";
	const append = (value: string) => {
		const escaped = escapeTelegram(value);
		if (chunk.length + escaped.length > 3600) {
			chunks.push(chunk);
			chunk = "";
		}
		chunk += escaped;
	};
	for (const { segment } of new Intl.Segmenter("vi", { granularity: "grapheme" }).segment(
		notificationText(order)
	)) {
		// Pathologically long combining clusters still split only between complete Unicode code points.
		if (escapeTelegram(segment).length > 3600) {
			for (const character of segment) append(character);
		} else append(segment);
	}
	if (chunk) chunks.push(chunk);
	return chunks.map((body, index) => {
		const text =
			chunks.length === 1
				? body
				: `INUT Creativa — ${escapeTelegram(order.publicId)} [${index + 1}/${
						chunks.length
				  }]\n${body}`;
		return {
			_type: "notificationPart",
			_key: sha256(`v1:${index}:${text}`).slice(0, 32),
			position: index + 1,
			text,
			state: "pending",
			attempts: 0,
		};
	});
}

type DispatchOptions = { retry?: boolean; acknowledgeUnknown?: boolean };
type DispatchRun = { deadline: number; sends: number };
type NotificationClient = ReturnType<typeof creativaServerClient>;

function mayDispatch(
	progress: Pick<NotificationPart, "state" | "attemptedAt">,
	options: DispatchOptions
): boolean {
	if (progress.state === "sent") return false;
	if (progress.state === "pending") return true;
	if (!options.retry) return false;
	if (progress.state === "failed") return true;
	if (!options.acknowledgeUnknown) {
		throw new CreativaError(
			"UNKNOWN_REQUIRES_ACK",
			"Cần đối soát và xác nhận trước khi gửi lại phần chưa rõ kết quả.",
			409
		);
	}
	if (progress.state === "dispatching") {
		const attemptedAt = Date.parse(progress.attemptedAt || "");
		if (!Number.isFinite(attemptedAt) || Date.now() - attemptedAt < 60000) {
			throw new CreativaError("DISPATCH_IN_PROGRESS", "Đang gửi; không được gửi chồng.", 409);
		}
	}
	return true;
}

function aggregateReceipt(
	receipt: Receipt,
	parts: NotificationPart[],
	pendingOutcome = "PARTIAL_PENDING"
): Receipt {
	const incomplete = parts.find((part) => part.state !== "sent");
	return {
		...receipt,
		parts,
		formatVersion: 1,
		state: incomplete?.state || "sent",
		outcome: incomplete
			? incomplete.state === "pending"
				? pendingOutcome
				: incomplete.outcome
			: "DELIVERED",
	};
}

async function patchReceipt(
	client: NotificationClient,
	order: StoredOrder,
	receipt: Receipt
): Promise<void> {
	await client
		.patch(order._id)
		.ifRevisionId(order._rev)
		.set({
			notifications: order.notifications.map((current) =>
				current._key === receipt._key ? receipt : current
			),
		})
		.commit({ visibility: "sync", returnDocuments: false, timeout: 2500 });
}

function stateUnavailable(): CreativaError {
	return new CreativaError(
		"HANDOFF_STATE_UNAVAILABLE",
		"Chưa lưu được kết quả thông báo; cần kiểm tra trạng thái trước khi thử lại.",
		503
	);
}

async function savePartOutcome(
	client: NotificationClient,
	orderId: string,
	key: string,
	partKey: string,
	nonce: string,
	outcome: Partial<NotificationPart>
): Promise<void> {
	for (let attempt = 0; attempt < 4; attempt++) {
		const order = await client.getDocument<StoredOrder>(orderId);
		const receipt = order?.notifications.find((current) => current._key === key);
		const part = receipt?.parts?.find((current) => current._key === partKey);
		if (!order || !receipt || !part || part.nonce !== nonce || part.state !== "dispatching") {
			throw stateUnavailable();
		}
		const parts = receipt.parts.map((current) =>
			current._key === partKey ? { ...current, ...outcome } : current
		);
		try {
			await patchReceipt(
				client,
				order,
				aggregateReceipt(
					receipt,
					parts,
					outcome.state === "pending" ? outcome.outcome || "PARTIAL_PENDING" : "PARTIAL_PENDING"
				)
			);
			return;
		} catch (error) {
			if (!conflict(error)) throw error;
		}
	}
	throw stateUnavailable();
}

async function sendPart(
	chatId: string,
	text: string,
	timeout: number
): Promise<Partial<NotificationPart>> {
	const token = process.env.CREATIVA_TELEGRAM_BOT_TOKEN;
	if (!token) return { state: "failed", outcome: "TOKEN_MISSING" };
	const abort = new AbortController();
	const timer = setTimeout(() => abort.abort(), timeout);
	try {
		const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
			method: "POST",
			signal: abort.signal,
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
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
			return { state: "sent", outcome: "DELIVERED", messageId: String(result.result.message_id) };
		}
		return response.status >= 400 && response.status < 500
			? { state: "failed", outcome: "PROVIDER_REJECTED" }
			: { state: "unknown", outcome: "PROVIDER_OUTCOME_UNKNOWN" };
	} catch {
		return { state: "unknown", outcome: "TRANSPORT_OUTCOME_UNKNOWN" };
	} finally {
		clearTimeout(timer);
	}
}

async function dispatchOne(
	client: NotificationClient,
	orderId: string,
	key: string,
	options: DispatchOptions,
	run: DispatchRun
): Promise<void> {
	let conflicts = 0;
	while (conflicts < 4) {
		const order = await client.getDocument<StoredOrder>(orderId);
		const receipt = order?.notifications.find((current) => current._key === key);
		if (!order || !receipt || receipt.state === "sent") return;
		if (!receipt.parts?.length) {
			if (!mayDispatch(receipt, options)) return;
			const legacyUnknown = receipt.state === "unknown" || receipt.state === "dispatching";
			const initialized = aggregateReceipt(
				{
					...receipt,
					...(legacyUnknown && { legacyUnknownAcknowledgedAt: new Date().toISOString() }),
				},
				notificationParts(order)
			);
			try {
				await patchReceipt(client, order, initialized);
			} catch (error) {
				if (!conflict(error)) throw error;
				conflicts++;
			}
			continue;
		}
		const part = receipt.parts.find((current) => current.state !== "sent");
		if (!part || !mayDispatch(part, options)) return;
		if (run.sends >= 4 || run.deadline - Date.now() < 3500) {
			// No send has been claimed: future operator invocations can safely advance pending parts.
			if (part.state === "pending") {
				try {
					await patchReceipt(
						client,
						order,
						aggregateReceipt(
							receipt,
							receipt.parts,
							run.sends >= 4 ? "DISPATCH_BUDGET_EXHAUSTED" : "DISPATCH_DEADLINE_REACHED"
						)
					);
					return;
				} catch (error) {
					if (!conflict(error)) throw error;
					conflicts++;
					continue;
				}
			}
			return;
		}
		const nonce = randomUUID();
		const attemptedAt = new Date().toISOString();
		const claimed: NotificationPart = {
			...part,
			state: "dispatching",
			outcome: "DISPATCHING",
			nonce,
			attemptedAt,
			attempts: part.attempts + 1,
			...(part.state === "unknown" || part.state === "dispatching"
				? { unknownAcknowledgedAt: attemptedAt }
				: {}),
		};
		try {
			await patchReceipt(
				client,
				order,
				aggregateReceipt(
					{ ...receipt, nonce, attemptedAt },
					receipt.parts.map((current) => (current._key === part._key ? claimed : current))
				)
			);
		} catch (error) {
			if (!conflict(error)) throw error;
			conflicts++;
			continue;
		}
		const timeLeft = run.deadline - Date.now() - 500;
		if (timeLeft <= 0) {
			await savePartOutcome(client, orderId, key, part._key, nonce, {
				state: "pending",
				outcome: "DEADLINE_BEFORE_SEND",
			});
			return;
		}
		run.sends++;
		const outcome = await sendPart(receipt.chatId, part.text, Math.min(3000, timeLeft));
		await savePartOutcome(client, orderId, key, part._key, nonce, outcome);
		if (outcome.state !== "sent") return;
		conflicts = 0;
	}
	throw stateUnavailable();
}

export async function dispatchNotifications(
	orderId: string,
	options: DispatchOptions = {}
): Promise<void> {
	// At most four transport attempts; no new send after the 15-second send budget.
	const run = { deadline: Date.now() + 15000, sends: 0 };
	const client = creativaServerClient().withConfig({ timeout: 2500 });
	let order = await client.getDocument<StoredOrder>(orderId);
	if (!order || order._type !== "creativaOrder")
		throw new CreativaError("ORDER_NOT_FOUND", "Không tìm thấy đơn.", 404);
	if (options.retry && !order.notifications.length) {
		const setup = await notificationSetup();
		if (setup.issue)
			throw new CreativaError(setup.issue, "Kiểm tra cấu hình sales trước khi thử lại.", 503);
		await client
			.patch(orderId)
			.ifRevisionId(order._rev)
			.set({ notifications: setup.receipts })
			.unset(["handoffIssue"])
			.commit({ visibility: "sync", returnDocuments: false, timeout: 2500 });
		order = await client.getDocument<StoredOrder>(orderId);
		if (!order) throw new CreativaError("SERVICE_UNAVAILABLE", "Không thể tải đơn.", 503);
	}
	for (const candidate of order.notifications) {
		await dispatchOne(client, orderId, candidate._key, options, run);
	}
}
