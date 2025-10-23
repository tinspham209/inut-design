/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from "axios";
import { SendOrderNotificationRequest } from "./telegram.types";

/**
 * Telegram Bot API client
 */
export class TelegramClient {
	private botToken: string;
	private baseUrl: string;

	constructor(botToken: string) {
		this.botToken = botToken;
		this.baseUrl = `https://api.telegram.org/bot${botToken}`;
	}

	/**
	 * Send a text message to a chat
	 */
	async sendMessage(
		chatId: string | number,
		text: string,
		options?: {
			parseMode?: "HTML" | "Markdown" | "MarkdownV2";
			disableWebPagePreview?: boolean;
			disableNotification?: boolean;
			replyMarkup?: {
				inline_keyboard?: Array<Array<{ text: string; callback_data?: string; url?: string }>>;
			};
		}
	): Promise<{
		success: boolean;
		messageId?: number;
		error?: string;
	}> {
		try {
			const response = await axios.post(`${this.baseUrl}/sendMessage`, {
				chat_id: Number(chatId),
				text,
				parse_mode: options?.parseMode || "HTML",
				disable_web_page_preview: options?.disableWebPagePreview ?? false,
				disable_notification: options?.disableNotification ?? false,
				reply_markup: options?.replyMarkup,
			});

			if (response.data.ok) {
				return {
					success: true,
					messageId: response.data.result.message_id,
				};
			}

			return {
				success: false,
				error: response.data.description || "Unknown error",
			};
		} catch (error) {
			const axiosError = error as AxiosError;
			const errorMessage =
				(axiosError.response?.data as any)?.description ||
				axiosError.message ||
				"Failed to send Telegram message";

			console.error("[Telegram] Send message error:", errorMessage);

			return {
				success: false,
				error: errorMessage,
			};
		}
	}

	/**
	 * Get bot information (for testing)
	 */
	async getMe(): Promise<any> {
		try {
			const response = await axios.get(`${this.baseUrl}/getMe`);
			return response.data;
		} catch (error) {
			console.error("[Telegram] Get bot info error:", error);
			throw error;
		}
	}
}

/**
 * Retry failed Telegram notification with exponential backoff.
 * Keeps API concerns encapsulated alongside the TelegramClient.
 */
export async function sendWithRetry(
	client: TelegramClient,
	chatId: string | number,
	message: string,
	options?: {
		parseMode?: "HTML" | "Markdown" | "MarkdownV2";
		disableWebPagePreview?: boolean;
		disableNotification?: boolean;
		replyMarkup?: any;
		maxRetries?: number; // default 3
		baseDelayMs?: number; // default 1000
	}
): Promise<{ success: boolean; messageId?: number; error?: string; attempts: number }> {
	const {
		parseMode = "HTML",
		disableWebPagePreview = true,
		disableNotification = false,
		replyMarkup,
		maxRetries = 3,
		baseDelayMs = 1000,
	} = options || {};

	let attempt = 0;
	let lastError: string | undefined;

	while (attempt < maxRetries) {
		attempt += 1;
		const result = await client.sendMessage(chatId, message, {
			parseMode,
			disableWebPagePreview,
			disableNotification,
			replyMarkup,
		});
		if (result.success) {
			if (attempt > 1) {
				console.log(`[Telegram] sendWithRetry succeeded on attempt ${attempt}`);
			}
			return { success: true, messageId: result.messageId, attempts: attempt };
		}
		lastError = result.error;
		console.warn(
			`[Telegram] Attempt ${attempt} failed: ${lastError}.${
				attempt < maxRetries ? " Retrying..." : ""
			}`
		);
		if (attempt < maxRetries) {
			const delay = baseDelayMs * Math.pow(2, attempt - 1);
			await new Promise((r) => setTimeout(r, delay));
		}
	}

	return { success: false, error: lastError || "Unknown error", attempts: attempt };
}

/**
 * Format order data into Telegram message
 */
export interface OrderNotificationData {
	orderNumber: string;
	orderDate: string;
	customerName: string;
	customerPhone: string;
	customerEmail?: string;
	deliveryAddress?: string;
	orderItems: Array<{
		productName: string;
		variantName: string;
		quantity: number;
		unitPrice: number;
		subtotal: number;
	}>;
	totalAmount: number;
	shippingFee: number;
	discount: number;
	finalAmount: number;
	paymentMethod: "cod" | "bank_transfer";
	paymentStatus: string;
	notes?: string;
}

/**
 * Format order message for Telegram
 * Accepts raw OrderLighter (with only references) and optionally maps to resolve names.
 * If names are not provided, falls back to reference IDs.
 */
export function formatOrderMessage(
	order: SendOrderNotificationRequest["orderData"],
	options?
): string {
	const emoji = {
		order: "🔥",
		customer: "👤",
		customerName: "🧑",
		phone: "📱",
		email: "📧",
		address: "🏠",
		products: "📦",
		money: "💰",
		payment: "💳",
		notes: "📝",
		link: "🔗",
	} as const;

	// Helpers
	const sanitize = (value?: string) =>
		(value || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").trim();

	const formatPrice = (amount: number): string => amount.toLocaleString("vi-VN") + "₫";

	const paymentMethodLabel =
		order.paymentMethod === "cod" ? "COD (Tiền mặt)" : "Chuyển khoản ngân hàng";

	const orderDate = new Date(order.orderDate).toLocaleString("vi-VN", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	});

	const itemsText = order.orderItems
		.map((item, index) => {
			const productName = item.productName || "Sản phẩm";
			const typeName = item.lighterTypeName || "Loại";
			return (
				`${index + 1}. <b>${productName}</b>\n` +
				`   • Loại: ${typeName}` +
				`\n   • SL: ${item.quantity} × ${formatPrice(item.unitPrice)} = ${formatPrice(
					item.subtotal
				)}`
			);
		})
		.join("\n");

	const orderId = order._id;
	let sanityStudioUrl = `https://inut-design.sanity.studio/desk/ordersLighter`;
	if (orderId) {
		sanityStudioUrl += `;${orderId}`;
	}
	const message = `
${emoji.order} <b>ĐƠN HÀNG MỚI</b>
━━━━━━━━━━━━━━━━━━

<b>Mã đơn hàng:</b> <code>${sanitize(order.orderNumber)}</code>
<b>Loại:</b> Bật lửa ${emoji.order}
<b>Thời gian:</b> ${orderDate}

${emoji.customer} <b>THÔNG TIN KHÁCH HÀNG</b>
━━━━━━━━━━━━━━━━━━
• ${emoji.customerName} <b>:</b> ${sanitize(order.customerName)}
• ${emoji.phone} <b>:</b> <code>${sanitize(order.customerPhone)}</code>${
		order.customerEmail ? `\n• ${emoji.email} <b>:</b> ${sanitize(order.customerEmail)}` : ""
	}${
		order.deliveryAddress ? `\n• ${emoji.address} <b>:</b> ${sanitize(order.deliveryAddress)}` : ""
	}

${emoji.products} <b>CHI TIẾT ĐƠN HÀNG</b>
━━━━━━━━━━━━━━━━━━
${itemsText}

${emoji.money} <b>TỔNG KẾT</b>
━━━━━━━━━━━━━━━━━━
• Tạm tính: ${formatPrice(order.totalAmount)}
• Phí ship: ${formatPrice(order.shippingFee)}
• Giảm giá: ${formatPrice(order.discount)}
• <b>Thành tiền: ${formatPrice(order.finalAmount)}</b>

${emoji.payment} <b>Thanh toán:</b> ${paymentMethodLabel}
${order.notes ? `\n${emoji.notes} <b>Ghi chú:</b> ${sanitize(order.notes)}` : ""}

${emoji.link} <a href="${sanityStudioUrl}">Xem trong Sanity Studio</a>
`.trim();

	return message;
}

/**
 * Format test message
 */
export function formatTestMessage(): string {
	return `
🧪 <b>Test Telegram Bot</b>

Inut Design Order Bot đã được cấu hình thành công!

Bot sẽ tự động gửi thông báo khi có đơn hàng mới.

Thời gian test: ${new Date().toLocaleString("vi-VN")}
`.trim();
}

/**
 * Retry failed Telegram notification
 */
