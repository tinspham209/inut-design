import envConst from "../env-const";

/**
 * Validate required environment variables
 */
export function validateTelegramEnv(): {
	isValid: boolean;
	errors: string[];
} {
	const errors: string[] = [];

	if (!envConst.TELEGRAM_BOT_TOKEN) {
		errors.push("TELEGRAM_BOT_TOKEN is not defined");
	}

	if (!envConst.TELEGRAM_CHAT_ID) {
		errors.push("TELEGRAM_CHAT_ID is not defined");
	}

	// Validate token format (basic check)
	const tokenPattern = /^\d+:[A-Za-z0-9_-]{35}$/;
	if (envConst.TELEGRAM_BOT_TOKEN && !tokenPattern.test(envConst.TELEGRAM_BOT_TOKEN)) {
		errors.push("TELEGRAM_BOT_TOKEN has invalid format");
	}

	// Validate chat ID format
	if (envConst.TELEGRAM_CHAT_ID) {
		const chatId = envConst.TELEGRAM_CHAT_ID;
		if (!/^-?\d+$/.test(chatId)) {
			errors.push("TELEGRAM_CHAT_ID must be a number");
		}
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
}
