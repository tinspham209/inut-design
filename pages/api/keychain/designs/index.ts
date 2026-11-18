import type { NextApiRequest, NextApiResponse } from "next";
import { fingerprint, keychainSnapshotRepository } from "@/api-client/keychain-server";
import { isKeychainRequestId, validateKeychainServerConfig } from "@/utils/keychain/serverValidation";
import { saveSnapshotIdempotently } from "@/utils/keychain/snapshotLifecycle";
import rateLimit, { getRequestRateLimitToken } from "@/utils/rateLimit";

const limiter = rateLimit({ interval: 60_000, uniqueTokenPerInterval: 1000 });
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
	try { await limiter.check(res as unknown as Response, 12, getRequestRateLimitToken(req)); }
	catch { return res.status(429).json({ error: "Quá nhiều lượt xuất. Vui lòng thử lại sau." }); }
	const { requestId, config } = req.body || {};
	if (!isKeychainRequestId(requestId) || !validateKeychainServerConfig(config)) return res.status(400).json({ error: "Cấu hình thiết kế không hợp lệ." });
	const digest = fingerprint(config);
	try {
		const result = await saveSnapshotIdempotently(requestId, config, digest, keychainSnapshotRepository);
		if (result.status === "conflict") return res.status(409).json({ error: "Mã yêu cầu đã được dùng cho thiết kế khác." });
		const status = result.status === "created" ? 201 : 200;
		return res.status(status).json({ id: requestId, url: `/builder/keychain?design=${requestId}` });
	} catch {
		return res.status(500).json({ error: "Không lưu được thiết kế. Vui lòng thử lại." });
	}
}
