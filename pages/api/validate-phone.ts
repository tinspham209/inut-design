import type { NextApiRequest, NextApiResponse } from "next";
import { ValidatePhoneResponse } from "@/models/phoneValidation";
import envConst from "@/utils/env-const";
import { isValidVietnamesePhone, normalizePhone } from "@/utils/phone";
import rateLimit from "@/utils/rateLimit";
import { checkZaloRegistered } from "@/utils/zalo";

const limiter = rateLimit({
	interval: 60 * 1000, // 1 minute
	uniqueTokenPerInterval: 500,
});

function getClientIp(req: NextApiRequest): string {
	const forwarded = req.headers["x-forwarded-for"];
	if (typeof forwarded === "string" && forwarded.trim()) {
		return forwarded.split(",")[0].trim();
	}
	return (req.socket?.remoteAddress as string) || "unknown";
}

/**
 * API Route: Advisory Zalo existence probe for the quote request phone field.
 * POST /api/validate-phone
 * Never blocks submission: errors and rate limits resolve to `zaloRegistered: null`.
 */
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ValidatePhoneResponse>
) {
	try {
		await limiter.check(res as unknown as Response, 20, `PHONE_VALIDATE-${getClientIp(req)}`);
	} catch {
		return res.status(200).json({ success: true, formatValid: true, zaloRegistered: null });
	}

	if (req.method !== "POST") {
		return res.status(405).json({
			success: false,
			formatValid: false,
			zaloRegistered: null,
			error: "Method not allowed",
		});
	}

	const apiKey = req.headers["x-api-key"];
	if (apiKey !== envConst.X_API_KEY) {
		return res.status(401).json({
			success: false,
			formatValid: false,
			zaloRegistered: null,
			error: "Unauthorized",
		});
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
