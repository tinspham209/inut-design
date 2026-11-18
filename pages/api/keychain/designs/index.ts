import type { NextApiRequest, NextApiResponse } from "next";
import { createKeychainSnapshot, fingerprint, getKeychainSnapshot } from "@/api-client/keychain-server";
import { validateKeychainConfig } from "@/utils/keychain/validation";
import rateLimit, { getRequestRateLimitToken } from "@/utils/rateLimit";

const limiter = rateLimit({ interval: 60_000, uniqueTokenPerInterval: 1000 });
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
	try { await limiter.check(res as unknown as Response, 12, getRequestRateLimitToken(req)); }
	catch { return res.status(429).json({ error: "Quá nhiều lượt xuất. Vui lòng thử lại sau." }); }
	const { requestId, config } = req.body || {};
	if (typeof requestId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestId) || !validateKeychainConfig(config)) return res.status(400).json({ error: "Cấu hình thiết kế không hợp lệ." });
	const digest = fingerprint(config);
	try {
		const id = `keychainDesign.${requestId}`;
		const prior = await getKeychainSnapshot(id);
		if (prior) {
			if (prior.requestFingerprint !== digest) return res.status(409).json({ error: "Mã yêu cầu đã được dùng cho thiết kế khác." });
			return res.status(200).json({ id: requestId, url: `/builder/keychain?design=${requestId}` });
		}
		const snapshot = await createKeychainSnapshot(requestId, config, digest);
		if (snapshot?.requestFingerprint !== digest) return res.status(409).json({ error: "Xung đột khi lưu snapshot." });
		return res.status(201).json({ id: requestId, url: `/builder/keychain?design=${requestId}` });
	} catch {
		return res.status(500).json({ error: "Không lưu được thiết kế. Vui lòng thử lại." });
	}
}
