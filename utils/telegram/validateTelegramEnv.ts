import envConst from "../env-const";

export function validateTelegramCredentials(
	botToken: string | undefined,
	chatId: string | undefined,
	names: { botToken: string; chatId: string } = {
		botToken: "TELEGRAM_BOT_TOKEN",
		chatId: "TELEGRAM_CHAT_ID",
	}
): {
	isValid: boolean;
	errors: string[];
} {
	const errors: string[] = [];

	if (!botToken) {
		errors.push(`${names.botToken} is not defined`);
	}

	if (!chatId) {
		errors.push(`${names.chatId} is not defined`);
	}

	const tokenPattern = /^\d+:[A-Za-z0-9_-]{35}$/;
	if (botToken && !tokenPattern.test(botToken)) {
		errors.push(`${names.botToken} has invalid format`);
	}

	if (chatId && !/^-?\d+$/.test(chatId)) {
		errors.push(`${names.chatId} must be a number`);
	}

	return {
		isValid: errors.length === 0,
		errors,
	};
}

/**
 * Validate required environment variables
 */
export function validateTelegramEnv(): {
	isValid: boolean;
	errors: string[];
} {
	return validateTelegramCredentials(
		envConst.TELEGRAM_BOT_TOKEN,
		envConst.TELEGRAM_CHAT_ID
	);
}
