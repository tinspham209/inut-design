import type { NextApiRequest, NextApiResponse } from "next";
import { getKeychainSnapshot } from "@/api-client/keychain-server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	res.setHeader("Cache-Control", "no-store, max-age=0");
	if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
	const { id } = req.query;
	if (typeof id !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) return res.status(400).json({ error: "ID thiết kế không hợp lệ." });
	try {
		const document = await getKeychainSnapshot(`keychainDesign.${id}`);
		if (!document) return res.status(404).json({ error: "Không tìm thấy thiết kế." });
		return res.status(200).json({ id, configVersion: document.configVersion, config: document.config });
	} catch {
		return res.status(500).json({ error: "Không tải được thiết kế." });
	}
}
