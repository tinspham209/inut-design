import type {
	CreativaAccepted,
	CreativaAnalyticsClaim,
	CreativaCatalogPage,
	CreativaCheckoutRequest,
	CreativaEnvelope,
	CreativaOptions,
	CreativaProduct,
	CreativaPublicOrder,
	CreativaPurchaseLine,
	CreativaQuote,
} from "@/models/creativa";
import { CreativaError } from "@/utils/creativa/contracts";

export class CreativaRequestError extends CreativaError {
	quote?: CreativaQuote;
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
	const controller = new AbortController();
	const timer = globalThis.setTimeout(() => controller.abort(), 20000);
	let response: Response;
	try {
		response = await fetch(url, {
			...init,
			signal: init?.signal || controller.signal,
			cache: "no-store",
			headers: {
				...(init?.body && { "Content-Type": "application/json" }),
				...init?.headers,
			},
		});
	} catch (error) {
		if (init?.signal?.aborted) throw error;
		throw new CreativaRequestError(
			"NETWORK_ERROR",
			"Chưa xác định được phản hồi từ dịch vụ. Vui lòng thử lại hoặc khôi phục tiến trình.",
			503
		);
	} finally {
		globalThis.clearTimeout(timer);
	}
	let payload: CreativaEnvelope<T>;
	try {
		payload = await response.json();
	} catch {
		throw new CreativaRequestError(
			"INVALID_RESPONSE",
			"Không thể đọc phản hồi. Vui lòng thử lại.",
			503
		);
	}
	if (payload.ok === false) {
		const error = new CreativaRequestError(
			payload.error.code,
			payload.error.message,
			response.status,
			payload.error.fieldErrors
		);
		error.quote = payload.error.quote;
		error.terminal = payload.error.terminal === true;
		throw error;
	}
	if (!response.ok || payload.ok !== true)
		throw new CreativaRequestError("INVALID_RESPONSE", "Dịch vụ tạm thời chưa sẵn sàng.", 503);
	return payload.data;
}

const post = <T>(path: string, body: unknown, headers?: Record<string, string>) =>
	request<T>(`/api/creativa/${path}`, { method: "POST", body: JSON.stringify(body), headers });

export const creativaApi = {
	catalog: (query = "", cursor?: string | null, signal?: AbortSignal) =>
		request<CreativaCatalogPage>(
			`/api/creativa/catalog?q=${encodeURIComponent(query)}${
				cursor ? `&cursor=${encodeURIComponent(cursor)}` : ""
			}`,
			{ signal }
		),
	product: (slug: string) =>
		request<{ product: CreativaProduct; options: CreativaOptions }>(
			`/api/creativa/products/${encodeURIComponent(slug)}`
		),
	options: () => request<CreativaOptions>("/api/creativa/options"),
	quote: (lines: CreativaPurchaseLine[], address: string, paymentMethod: "cod" | "bank_transfer") =>
		post<CreativaQuote>("quote", { lines, address, paymentMethod }),
	create: (order: CreativaCheckoutRequest, capability: string) =>
		post<CreativaAccepted>("orders", order, { "Idempotency-Key": capability }),
	resolve: (capability: string) => post<CreativaAccepted>("orders/resolve", { capability }),
	order: (id: string) =>
		request<CreativaPublicOrder>(`/api/creativa/orders/${encodeURIComponent(id)}`),
	claim: (capability: string, destination: "ga4" | "umami", eventKey: string) =>
		post<CreativaAnalyticsClaim>("orders/analytics-claim", { capability, destination, eventKey }),
};
