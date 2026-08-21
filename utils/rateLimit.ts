import { LRUCache } from "lru-cache";
import type { NextApiRequest } from "next";

type Options = {
	uniqueTokenPerInterval?: number;
	interval?: number;
};

function rateLimit(options?: Options) {
	const tokenCache = new LRUCache({
		max: options?.uniqueTokenPerInterval || 500,
		ttl: options?.interval || 60000,
	});

	return {
		check: (res: Response, limit: number, token: string) =>
			new Promise<void>((resolve, reject) => {
				const tokenCount = (tokenCache.get(token) as number[]) || [0];
				if (tokenCount[0] === 0) {
					tokenCache.set(token, tokenCount);
				}
				tokenCount[0] += 1;

				const currentUsage = tokenCount[0];
				const isRateLimited = currentUsage >= limit;

				if (isRateLimited) {
					reject(new Error("Rate limit exceeded"));
				} else {
					resolve();
				}
			}),
	};
}

export function getRequestRateLimitToken(req: NextApiRequest): string {
	const forwardedFor = req.headers["x-forwarded-for"];
	const forwardedAddress = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor?.split(",")[0];
	return forwardedAddress?.trim() || req.socket.remoteAddress || "unknown";
}

export default rateLimit;
