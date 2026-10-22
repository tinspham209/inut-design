import type { NextApiRequest, NextApiResponse } from "next";
import { LRUCache } from "lru-cache";
import type { CreativaEnvelope } from "@/models/creativa";
import { getRequestRateLimitToken } from "@/utils/rateLimit";
import { CreativaError } from "./contracts";
import { QuoteChanged } from "./orders.server";

const counters = new LRUCache<string, { count: number; reset: number }>({ max: 5000, ttl: 60000 });
type Handler = (req: NextApiRequest, body: unknown) => Promise<unknown>;
type Kind = "catalog" | "quote" | "submit" | "lookup" | "analytics";
const limits: Record<Kind, number> = { catalog: 120, quote: 60, submit: 10, lookup: 30, analytics: 240 };

export function scalarQuery(value: string | string[] | undefined, field: string): string {
	if (Array.isArray(value)) throw new CreativaError("INVALID_QUERY", `Tham số ${field} không hợp lệ.`, 400);
	return value || "";
}

function validateOrigin(req: NextApiRequest): void {
	const origins = new Set<string>();
	if (process.env.NEXT_PUBLIC_SITE_URL) {
		try { origins.add(new URL(process.env.NEXT_PUBLIC_SITE_URL).origin); }
		catch { throw new CreativaError("SERVICE_UNAVAILABLE", "Chưa cấu hình địa chỉ Creativa.", 503); }
	}
	if (process.env.NODE_ENV !== "production") {
		for (const port of [3000, 3001]) {
			origins.add(`http://localhost:${port}`);
			origins.add(`http://127.0.0.1:${port}`);
		}
	}
	const origin = req.headers.origin;
	if (!origin || !origins.has(origin)) throw new CreativaError("ORIGIN_REJECTED", "Nguồn yêu cầu không hợp lệ.", 403);
}

export async function readJsonBody(req: NextApiRequest): Promise<unknown> {
	const declaredLength = Number(req.headers["content-length"] || 0);
	if (declaredLength > 65536) throw new CreativaError("PAYLOAD_TOO_LARGE", "Yêu cầu quá lớn.", 413);
	if (!req.headers["content-type"]?.toLowerCase().startsWith("application/json")) {
		throw new CreativaError("INVALID_CONTENT_TYPE", "Yêu cầu phải là JSON.", 415);
	}
	const chunks: Buffer[] = [];
	let bytes = 0;
	for await (const chunk of req) {
		const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
		bytes += buffer.length;
		if (bytes > 65536) throw new CreativaError("PAYLOAD_TOO_LARGE", "Yêu cầu quá lớn.", 413);
		chunks.push(buffer);
	}
	try { return JSON.parse(Buffer.concat(chunks).toString("utf8")) as unknown; }
	catch { throw new CreativaError("INVALID_JSON", "JSON không hợp lệ.", 400); }
}

export function creativaApi(method: "GET" | "POST", kind: Kind, handler: Handler) {
	return async (req: NextApiRequest, res: NextApiResponse<CreativaEnvelope<unknown>>) => {
		res.setHeader("Cache-Control", "no-store, private, max-age=0");
		res.setHeader("Referrer-Policy", "no-referrer");
		res.setHeader("X-Content-Type-Options", "nosniff");
		res.setHeader("X-Robots-Tag", "noindex, nofollow");
		try {
			if (req.method !== method) {
				res.setHeader("Allow", method);
				throw new CreativaError("METHOD_NOT_ALLOWED", "Phương thức không được hỗ trợ.", 405);
			}
			if (method === "POST") validateOrigin(req);
			const key = `${kind}:${getRequestRateLimitToken(req)}`;
			const now = Date.now();
			const bucket = counters.get(key) || { count: 0, reset: now + 60000 };
			if (bucket.reset <= now) { bucket.count = 0; bucket.reset = now + 60000; }
			bucket.count += 1;
			counters.set(key, bucket);
			if (bucket.count > limits[kind]) {
				res.setHeader("Retry-After", Math.max(1, Math.ceil((bucket.reset - now) / 1000)));
				throw new CreativaError("RATE_LIMITED", "Bạn thao tác quá nhanh. Vui lòng thử lại sau.", 429);
			}
			const data = await handler(req, method === "POST" ? await readJsonBody(req) : undefined);
			const created = kind === "submit" && typeof data === "object" && data !== null && "created" in data && data.created === true;
			res.status(created ? 201 : 200).json({ ok: true, data });
		} catch (error) {
			const safe = error instanceof CreativaError ? error :
				new CreativaError("SERVICE_UNAVAILABLE", "Dịch vụ Creativa tạm thời gián đoạn. Vui lòng thử lại.", 503);
			if (!(error instanceof CreativaError)) console.error("creativa_api_service_failure", { kind });
			res.status(safe.status).json({
				ok: false, error: {
					code: safe.code, message: safe.message,
					...(safe.fieldErrors && { fieldErrors: safe.fieldErrors }),
					...(error instanceof QuoteChanged && { quote: error.quote }),
				},
			});
		}
	};
}
