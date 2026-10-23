export function isCreativaPath(path: string): boolean {
	return /^\/creativa(?:\/|$)/.test(path.split("?")[0]);
}

export const CREATIVA_PRIVATE_PROPERTY =
	/customer|phone|email|address|note|capability|public.?id|order.?id|order.?number|search.?term|idempotency|print.?asset|production|fit.?reference|artwork|account.?number|account.?holder|account.?name/i;

export function safeCreativaUrl(input: string): string {
	if (!input) return input;
	try {
		const url = new URL(input, "https://inutdesign.com");
		const creator =
			/^\/(?:api\/)?creativa(?:\/|$)/.test(url.pathname) ||
			/^\/_next\/data\/[^/]+\/creativa(?:\/|$)/.test(url.pathname);
		if (creator) {
			url.pathname = url.pathname
				.replace(/^(\/creativa\/order-tracking)\/[^/]+\/?$/, "$1/[id]")
				.replace(/^(\/api\/creativa\/orders)\/[A-Za-z0-9_-]{10}\/?$/, "$1/[id]")
				.replace(/^(\/_next\/data\/[^/]+\/creativa\/order-tracking)\/[^/]+\.json$/, "$1/[id].json");
			url.search = "";
			url.hash = "";
		}
		return /^https?:/.test(input) ? url.toString() : `${url.pathname}${url.search}${url.hash}`;
	} catch {
		return "/creativa";
	}
}
