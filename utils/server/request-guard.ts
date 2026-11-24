import type { NextApiRequest } from "next";
import { getDeploymentChannel } from "@/utils/deployment-channel";
import { getRequestRateLimitToken } from "@/utils/rateLimit";

type GuardResult = { status: number; error: string } | null;

function configuredOrigins(): Set<string> {
	const origins = new Set<string>();
	for (const value of [
		process.env.NEXT_PUBLIC_SITE_URL || "https://inutdesign.com",
		process.env.PREVIEW_SITE_URL,
		...(process.env.NEXT_PUBLIC_ALLOWED_ORIGINS?.split(",") ?? []),
	]) {
		const trimmed = value?.trim();
		if (!trimmed || trimmed === "*") continue;
		try {
			origins.add(new URL(trimmed).origin);
		} catch {
			throw new Error("Allowed origin configuration is invalid");
		}
	}
	if (getDeploymentChannel() !== "production") {
		for (const port of [3000, 3001]) {
			origins.add(`http://localhost:${port}`);
			origins.add(`http://127.0.0.1:${port}`);
		}
	}
	return origins;
}

export function validateBrowserJsonRequest(
	req: NextApiRequest,
	maxBodyBytes = 65_536,
): GuardResult {
	let origins: Set<string>;
	try {
		origins = configuredOrigins();
	} catch {
		return { status: 503, error: "Origin configuration unavailable" };
	}
	const origin = typeof req.headers.origin === "string" ? req.headers.origin : "";
	if (!origin || !origins.has(origin)) return { status: 403, error: "Origin not allowed" };
	if (!req.headers["content-type"]?.toLowerCase().startsWith("application/json")) {
		return { status: 415, error: "JSON content type required" };
	}
	const contentLength = Number(req.headers["content-length"] ?? 0);
	if (
		(req.headers["content-length"] !== undefined &&
			(!Number.isSafeInteger(contentLength) || contentLength < 0)) ||
		contentLength > maxBodyBytes
	) {
		return { status: 413, error: "Request body too large" };
	}
	try {
		if (new TextEncoder().encode(JSON.stringify(req.body ?? {})).byteLength > maxBodyBytes) {
			return { status: 413, error: "Request body too large" };
		}
	} catch {
		return { status: 400, error: "Request body is invalid" };
	}
	return null;
}

export const browserRateLimitToken = (req: NextApiRequest) =>
	getRequestRateLimitToken(req);
