import type { NextApiRequest, NextApiResponse } from "next";
import { TelegramClient, sendWithRetry } from "@/utils/telegram";
import { validateTelegramEnv } from "@/utils/telegram/validateTelegramEnv";
import envConst from "@/utils/env-const";
import rateLimit from "@/utils/rateLimit";
import { formatAbandonedCheckoutMessage } from "@/utils/telegram/formatAbandonedCheckoutMessage";
import {
	SendAbandonedCheckoutNotificationRequest,
	SendAbandonedCheckoutNotificationResponse,
} from "@/utils/telegram/telegram.types";

const limiter = rateLimit({
	interval: 60 * 1000,
	uniqueTokenPerInterval: 500,
});

/**
 * API Route: Send Telegram notification for abandoned checkout
 * POST /api/telegram/send-abandoned-checkout-notification
 */
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<SendAbandonedCheckoutNotificationResponse>
) {
	try {
		await limiter.check(res as unknown as Response, 20, "CACHE_TOKEN");
	} catch {
		return res.status(429).json({ success: false, error: "Rate limit exceeded" });
	}

	if (req.method !== "POST") {
		return res.status(405).json({
			success: false,
			error: "Method not allowed",
		});
	}

	const apiKey = req.headers["x-api-key"];
	if (apiKey !== envConst.X_API_KEY) {
		return res.status(401).json({ success: false, error: "Unauthorized" });
	}

	try {
		const envValidation = validateTelegramEnv();
		if (!envValidation.isValid) {
			console.error("[Telegram API] Environment validation failed:", envValidation.errors);
			return res.status(500).json({
				success: false,
				error: "Telegram configuration error: " + envValidation.errors.join(", "),
			});
		}

		const abandonedData = req.body as SendAbandonedCheckoutNotificationRequest;

		if (!abandonedData) {
			return res.status(400).json({
				success: false,
				error: "Missing request body",
			});
		}

		if (!abandonedData.customerPhone) {
			return res.status(400).json({
				success: false,
				error: "Missing required field: customerPhone",
			});
		}

		if (!Array.isArray(abandonedData.orderItems) || abandonedData.orderItems.length === 0) {
			return res.status(400).json({
				success: false,
				error: "Missing required field: orderItems",
			});
		}

		if (!abandonedData.abandonedAt) {
			return res.status(400).json({
				success: false,
				error: "Missing required field: abandonedAt",
			});
		}

		const botToken = envConst.TELEGRAM_BOT_TOKEN;
		const chatId = envConst.TELEGRAM_CHAT_ID;

		const telegram = new TelegramClient(botToken);
		const message = formatAbandonedCheckoutMessage(abandonedData);

		const maxRetries = Number(process.env.TELEGRAM_MAX_RETRIES || 3);
		const baseDelayMs = Number(process.env.TELEGRAM_RETRY_BASE_DELAY || 1000);

		const result = await sendWithRetry(telegram, chatId, message, {
			parseMode: "HTML",
			disableWebPagePreview: true,
			maxRetries,
			baseDelayMs,
		});

		if (result.success) {
			console.log("[Telegram API] Abandoned checkout notification sent:", {
				customerPhone: abandonedData.customerPhone,
				messageId: result.messageId,
				attempts: result.attempts,
			});

			return res.status(200).json({
				success: true,
				messageId: result.messageId,
			});
		}

		console.error("[Telegram API] Failed to send abandoned checkout notification:", {
			error: result.error,
			attempts: result.attempts,
		});

		return res.status(500).json({
			success: false,
			error: result.error || "Failed to send Telegram notification",
		});
	} catch (error) {
		console.error("[Telegram API] Unexpected error:", error);

		return res.status(500).json({
			success: false,
			error: error instanceof Error ? error.message : "Internal server error",
		});
	}
}
