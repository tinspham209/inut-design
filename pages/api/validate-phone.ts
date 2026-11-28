import type { NextApiRequest, NextApiResponse } from "next";
import { ValidatePhoneResponse } from "@/models/phoneValidation";
import { isValidVietnamesePhone, normalizePhone } from "@/utils/phone";
import rateLimit, { getRequestRateLimitToken } from "@/utils/rateLimit";
import { checkZaloRegistered } from "@/utils/zalo";
import { validateBrowserJsonRequest } from "@/utils/server/request-guard";

const limiter = rateLimit({
	interval: 60 * 1000, // 1 minute
	uniqueTokenPerInterval: 500,
});

/**
 * API Route: Advisory Zalo existence probe for the quote request phone field.
 * POST /api/validate-phone
 * Never blocks submission: errors and rate limits resolve to `zaloRegistered: null`.
 */
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ValidatePhoneResponse>
) {
	if (req.method !== "POST") {
		return res.status(405).json({
			success: false,
			formatValid: false,
			zaloRegistered: null,
			error: "Method not allowed",
		});
	}
	const requestError = validateBrowserJsonRequest(req);
	if (requestError) {
		return res.status(requestError.status).json({
			success: false,
			formatValid: false,
			zaloRegistered: null,
			error: requestError.error,
		});
	}
	try {
		const platform =
			typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers"
				? "cloudflare"
				: "node";
		await limiter.check(res as unknown as Response, 20, `PHONE_VALIDATE-${getRequestRateLimitToken(req, platform)}`);
	} catch {
		return res.status(200).json({ success: true, formatValid: true, zaloRegistered: null });
	}

	const phone = (req.body as { phone?: unknown })?.phone;

	if (typeof phone !== "string") {
		return res.status(200).json({ success: true, formatValid: false, zaloRegistered: null });
	}

	const normalized = normalizePhone(phone);

	if (!isValidVietnamesePhone(normalized)) {
		return res.status(200).json({ success: true, formatValid: false, zaloRegistered: null });
	}

	try {
		const zaloRegistered = await checkZaloRegistered(normalized);
		return res.status(200).json({ success: true, formatValid: true, zaloRegistered });
	} catch {
		return res.status(200).json({ success: true, formatValid: true, zaloRegistered: null });
	}
}
