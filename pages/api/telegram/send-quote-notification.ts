import type { NextApiRequest, NextApiResponse } from "next";
import { TelegramClient, sendWithRetry } from "@/utils/telegram";
import { validateTelegramEnv } from "@/utils/telegram/validateTelegramEnv";
import rateLimit from "@/utils/rateLimit";
import {
	browserRateLimitToken,
	validateBrowserJsonRequest,
} from "@/utils/server/request-guard";
import { requireServerEnv } from "@/utils/server-env";
import { formatQuoteRequestMessage } from "@/utils/telegram/formatQuoteRequestMessage";
import { QuoteRequestForm } from "@/models/quoteRequest";

const limiter = rateLimit({
	interval: 60 * 1000, // 1 minute
	uniqueTokenPerInterval: 500,
});

interface SendQuoteNotificationRequest {
	quoteData: QuoteRequestForm;
}

interface SendQuoteNotificationResponse {
	success: boolean;
	messageId?: number;
	error?: string;
}

/**
 * API Route: Send Telegram notification for new quote request
 * POST /api/telegram/send-quote-notification
 */
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<SendQuoteNotificationResponse>
) {
	if (req.method !== "POST") {
		return res.status(405).json({ success: false, error: "Method not allowed" });
	}
	const requestError = validateBrowserJsonRequest(req);
	if (requestError) {
		return res.status(requestError.status).json({ success: false, error: requestError.error });
	}
	try {
		await limiter.check(res as unknown as Response, 10, browserRateLimitToken(req));
	} catch {
		return res.status(429).json({ success: false, error: "Rate limit exceeded" });
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

		const botToken = requireServerEnv("TELEGRAM_BOT_TOKEN");
		const chatId = requireServerEnv("TELEGRAM_CHAT_ID");

		const { quoteData } = req.body as SendQuoteNotificationRequest;

		if (!quoteData) {
			return res.status(400).json({
				success: false,
				error: "Missing quoteData in request body",
			});
		}

		const requiredFields = ["customerName", "phone", "usagePurpose"];
		for (const field of requiredFields) {
			if (!quoteData[field as keyof typeof quoteData]) {
				return res.status(400).json({
					success: false,
					error: `Missing required field: ${field}`,
				});
			}
		}

		const telegram = new TelegramClient(botToken);
		const message = formatQuoteRequestMessage(quoteData);

		const maxRetries = Number(process.env.TELEGRAM_MAX_RETRIES || 3);
		const baseDelayMs = Number(process.env.TELEGRAM_RETRY_BASE_DELAY || 1000);

		const result = await sendWithRetry(telegram, chatId, message, {
			parseMode: "HTML",
			disableWebPagePreview: true,
			maxRetries,
			baseDelayMs,
		});

		if (result.success) {
			console.log("[Telegram API] Quote notification sent successfully:", {
				customer: quoteData.customerName,
				messageId: result.messageId,
				attempts: result.attempts,
			});

			return res.status(200).json({
				success: true,
				messageId: result.messageId,
			});
		} else {
			console.error("[Telegram API] Failed to send quote notification:", result.error, {
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
