import type { NextApiRequest, NextApiResponse } from "next";
import { TelegramClient, formatOrderMessage, sendWithRetry } from "@/utils/telegram";
import {
	SendOrderNotificationRequest,
	SendOrderNotificationResponse,
} from "@/utils/telegram/telegram.types";
import { validateTelegramEnv } from "@/utils/telegram/validateTelegramEnv";
import envConst from "@/utils/env-const";
import rateLimit from "@/utils/rateLimit";

// Usage in API route
const limiter = rateLimit({
	interval: 60 * 1000, // 1 minute
	uniqueTokenPerInterval: 500,
});

/**
 * API Route: Send Telegram notification for new order
 * POST /api/telegram/send-order-notification
 */
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<SendOrderNotificationResponse>
) {
	try {
		// TODO: refine rateLimit types to accept NextApiResponse; temporary cast
		await limiter.check(res as unknown as Response, 10, "CACHE_TOKEN"); // 10 requests per minute
	} catch {
		return res.status(429).json({ success: false, error: "Rate limit exceeded" });
	}

	// Only allow POST
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
		// Validate environment variables
		const envValidation = validateTelegramEnv();
		if (!envValidation.isValid) {
			console.error("[Telegram API] Environment validation failed:", envValidation.errors);
			return res.status(500).json({
				success: false,
				error: "Telegram configuration error: " + envValidation.errors.join(", "),
			});
		}

		// Get environment variables
		const botToken = envConst.TELEGRAM_BOT_TOKEN;
		const chatId = envConst.TELEGRAM_CHAT_ID;

		// Parse request body
		const { orderData } = req.body as SendOrderNotificationRequest;

		if (!orderData) {
			return res.status(400).json({
				success: false,
				error: "Missing orderData in request body",
			});
		}

		// Validate required order fields
		const requiredFields = [
			"orderNumber",
			"orderDate",
			"customerName",
			"customerPhone",
			"orderItems",
			"totalAmount",
			"finalAmount",
		];

		for (const field of requiredFields) {
			if (!orderData[field as keyof typeof orderData]) {
				return res.status(400).json({
					success: false,
					error: `Missing required field: ${field}`,
				});
			}
		}

		// Initialize Telegram client
		const telegram = new TelegramClient(botToken);

		// Format message
		const message = formatOrderMessage(orderData);

		// Retry configuration (optional env overrides)
		const maxRetries = Number(process.env.TELEGRAM_MAX_RETRIES || 3);
		const baseDelayMs = Number(process.env.TELEGRAM_RETRY_BASE_DELAY || 1000);

		const result = await sendWithRetry(telegram, chatId, message, {
			parseMode: "HTML",
			disableWebPagePreview: true,
			maxRetries,
			baseDelayMs,
		});

		if (result.success) {
			console.log("[Telegram API] Notification sent successfully:", {
				orderNumber: orderData.orderNumber,
				messageId: result.messageId,
				attempts: result.attempts,
			});

			return res.status(200).json({
				success: true,
				messageId: result.messageId,
			});
		} else {
			console.error("[Telegram API] Failed to send notification:", result.error, {
				attempts: result.attempts,
			});

			return res.status(500).json({
				success: false,
				error: result.error || "Failed to send Telegram notification",
			});
		}
	} catch (error) {
		console.error("[Telegram API] Unexpected error:", error);

		return res.status(500).json({
			success: false,
			error: error instanceof Error ? error.message : "Internal server error",
		});
	}
}
