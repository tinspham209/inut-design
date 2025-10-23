import { OrderLighter } from "@/models";

/**
 * Telegram API response types
 */
export interface TelegramApiResponse<T = any> {
	ok: boolean;
	result?: T;
	description?: string;
	error_code?: number;
}

export interface TelegramMessage {
	message_id: number;
	from: TelegramUser;
	chat: TelegramChat;
	date: number;
	text?: string;
}

export interface TelegramUser {
	id: number;
	is_bot: boolean;
	first_name: string;
	username?: string;
}

export interface TelegramChat {
	id: number;
	type: "private" | "group" | "supergroup" | "channel";
	title?: string;
	username?: string;
}

/**
 * Notification request/response types
 */
export type SendOrderNotificationRequest = {
	orderNumber: string;
	orderId: string;
	orderData: OrderLighter;
};

export interface SendOrderNotificationResponse {
	success: boolean;
	messageId?: number;
	error?: string;
}
