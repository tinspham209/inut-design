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
	StaffProductionLine,
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

const TELEGRAM_PART_LIMIT = 3600;
const TELEGRAM_TIME_ZONE = "Asia/Ho_Chi_Minh";

function formatNotificationPrice(amount: number): string {
	return `${amount.toLocaleString("vi-VN")}₫`;
}

function formatOrderDate(value: string): string {
	return new Date(value).toLocaleString("vi-VN", {
		timeZone: TELEGRAM_TIME_ZONE,
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		hourCycle: "h23",
	});
}

function productionDetails(line: StoredLine | StaffProductionLine): string[] {
	if (line.production) {
		if (!validCreativaPrintPath(line.production.printAssetPath))
			throw new CreativaError(
				"ORDER_SNAPSHOT_INVALID",
				"Thiếu đường dẫn in trong đơn đã lưu.",
				500
			);
		return [`   • File in: ${escapeTelegram(line.production.printAssetPath)}`];
	}
	if (!line.artwork?.identity || !line.artwork.version)
		throw new CreativaError(
			"ORDER_SNAPSHOT_INVALID",
			"Thiếu thông tin sản xuất trong đơn đã lưu.",
			500
		);
	return [
		`   • Artwork: ${escapeTelegram(`${line.artwork.identity} / ${line.artwork.version}`)}`,
		`   • Master: ${escapeTelegram(
			line.artwork.printAsset?.asset._ref || "Không có — kiểm tra CMS"
		)}`,
		`   • Fit/template: ${escapeTelegram(
			line.selection.fitReference || "Không lưu — kiểm tra CMS"
		)}`,
	];
}

function notificationText(order: StoredOrder): string {
	const paymentMethod =
		order.paymentMethod === "cod" ? "COD (Thanh toán khi nhận hàng)" : "Chuyển khoản ngân hàng";
	const items = order.lines
		.map((line, index) => {
			const price =
				line.unitPrice !== undefined && line.subtotal !== undefined
					? `   • SL: ${line.quantity} × ${formatNotificationPrice(
							line.unitPrice
					  )} = ${formatNotificationPrice(line.subtotal)}`
					: `   • SL: ${line.quantity} (giá theo tổng đơn đã lưu)`;
			return [
				`${index + 1}. <b>${escapeTelegram(line.productName)}</b>`,
				...(line.productType === "skin-laptop" ? ["   • Loại: Skin laptop"] : []),
				`   • Mẫu: ${escapeTelegram(line.selection.modelName)}`,
				`   • Phạm vi: ${escapeTelegram(line.selection.coverageName)}${
					line.selection.coverageMeaning
						? ` — ${escapeTelegram(line.selection.coverageMeaning)}`
						: ""
				}`,
				...productionDetails(line),
				price,
			].join("\n");
		})
		.join("\n\n");
	const sanityStudioUrl = `https://inut-design.sanity.studio/desk/creativaOrder;${encodeURIComponent(
		order._id
	)}`;
	const orderTrackingUrl = `https://inutdesign.com/creativa/order-tracking/${encodeURIComponent(
		order.publicId
	)}`;

	return [
		`✨ <b>ĐƠN HÀNG CREATIVA MỚI</b>`,
		"━━━━━━━━━━━━━━━━━━",
		`<b>Mã đơn hàng:</b> <code>${escapeTelegram(order.publicId)}</code>`,
		`<b>Thời gian:</b> ${formatOrderDate(order.orderDate)}`,
		"━━━━━━━━━━━━━━━━━━",
		`👤 <b>THÔNG TIN KHÁCH HÀNG</b>`,
		`• 🧑 <b>Họ tên:</b> ${escapeTelegram(order.customer.name)}`,
		`• 📱 <b>Điện thoại:</b> <code>${escapeTelegram(order.customer.phone)}</code>`,
		...(order.customer.email ? [`• 📧 <b>Email:</b> ${escapeTelegram(order.customer.email)}`] : []),
		`• 🏠 <b>Địa chỉ:</b> ${escapeTelegram(
			order.customer.address || "Chưa cung cấp — cần liên hệ bổ sung"
		)}`,
		...(order.customer.note ? [`• 📝 <b>Ghi chú:</b> ${escapeTelegram(order.customer.note)}`] : []),
		"━━━━━━━━━━━━━━━━━━",
		`📦 <b>CHI TIẾT ĐƠN HÀNG</b>`,
		items,
		"━━━━━━━━━━━━━━━━━━",
		`💰 <b>TỔNG KẾT</b>`,
		`• Tạm tính: ${formatNotificationPrice(order.merchandiseTotal)}`,
		`• Phí ship (${escapeTelegram(order.shipping.name)}): ${formatNotificationPrice(
			order.shippingFee
		)}`,
		`• Giảm giá: ${formatNotificationPrice(order.discount)}`,
		`• <b>Thành tiền: ${formatNotificationPrice(order.finalAmount)}</b>`,
		`• <b>Thanh toán:</b> ${paymentMethod}`,
		"━━━━━━━━━━━━━━━━━━",
		`🔗 Xem trong Sanity Studio: ${escapeTelegram(sanityStudioUrl)}`,
		`🔗 Xem trong INUT Order Tracking: ${escapeTelegram(orderTrackingUrl)}`,
	].join("\n");
}

export function formatNotification(order: StoredOrder): string {
	return notificationText(order);
}

function splitTelegramHtml(value: string): string[] {
	const chunks: string[] = [];
	const openTags: string[] = [];
	let chunk = "";
	const openingTags = () => openTags.map((tag) => `<${tag}>`).join("");
	const closingTags = () =>
		openTags
			.slice()
			.reverse()
			.map((tag) => `</${tag}>`)
			.join("");
	const segmenter = new Intl.Segmenter("vi", { granularity: "grapheme" });
	const flush = () => {
		if (!chunk || chunk === openingTags()) return;
		chunks.push(chunk + closingTags());
		chunk = openingTags();
	};
	const appendText = (text: string) => {
		const appendPiece = (piece: string) => {
			if (chunk.length + piece.length + closingTags().length > TELEGRAM_PART_LIMIT) flush();
			if (chunk.length + piece.length + closingTags().length > TELEGRAM_PART_LIMIT) {
				for (const character of piece) appendPiece(character);
				return;
			}
			chunk += piece;
		};
		if (/^&(?:amp|lt|gt);$/.test(text)) {
			appendPiece(text);
			return;
		}
		for (const { segment } of segmenter.segment(text)) appendPiece(segment);
	};

	for (const token of value.split(/(<\/?(?:b|code)>|&(?:amp|lt|gt);)/g)) {
		if (!token) continue;
		const openTag = /^<(b|code)>$/.exec(token);
		if (openTag) {
			const closingLength = closingTags().length + `</${openTag[1]}>`.length;
			if (chunk.length + token.length + closingLength > TELEGRAM_PART_LIMIT) flush();
			chunk += token;
			openTags.push(openTag[1]);
			continue;
		}
		const closeTag = /^<\/(b|code)>$/.exec(token);
		if (closeTag) {
			if (openTags[openTags.length - 1] !== closeTag[1])
				throw new Error("Notification HTML tags are not balanced.");
			chunk += token;
			openTags.pop();
			continue;
		}
		appendText(token);
	}
	if (openTags.length) throw new Error("Notification HTML tags are not balanced.");
	if (chunk) chunks.push(chunk);
	return chunks;
}

export function formatNotificationParts(order: StoredOrder): NotificationPart[] {
	const chunks = splitTelegramHtml(notificationText(order));
	return chunks.map((body, index) => {
		const text =
			chunks.length === 1
				? body
				: `✨ INUT Creativa — ${escapeTelegram(order.publicId)} [${index + 1}/${
						chunks.length
				  }]\n${body}`;
		return {
			_type: "notificationPart",
			_key: sha256(`v2:${index}:${text}`).slice(0, 32),
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
		formatVersion: receipt.formatVersion ?? 2,
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
					formatVersion: 2,
					...(legacyUnknown && { legacyUnknownAcknowledgedAt: new Date().toISOString() }),
				},
				formatNotificationParts(order)
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
