import type { NextApiRequest } from "next";
import { getDeploymentChannel } from "@/utils/deployment-channel";
import { getRequestRateLimitToken } from "@/utils/rateLimit";
import { SITE_URL } from "@/utils/siteUrl";

type GuardResult = { status: number; error: string } | null;

function configuredOrigins(): Set<string> {
	const origins = new Set<string>();
	const channel = getDeploymentChannel();
	if (channel === "preview" && !process.env.PREVIEW_SITE_URL) {
		throw new Error("Preview origin is required");
	}
	for (const value of [
		SITE_URL,
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
	if (channel === "development" || channel === "test") {
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
	const origin = typeof req.headers.origin === "string" ? req.headers.origin : "";
	const host = typeof req.headers.host === "string" ? req.headers.host : "";
	let isSameOrigin = false;
	try {
		isSameOrigin = Boolean(host && new URL(origin).host === host);
	} catch {
		return { status: 403, error: "Origin not allowed" };
	}
	if (!isSameOrigin) {
		let origins: Set<string>;
		try {
			origins = configuredOrigins();
		} catch {
			return { status: 503, error: "Origin configuration unavailable" };
		}
		if (!origins.has(origin)) return { status: 403, error: "Origin not allowed" };
	}
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
