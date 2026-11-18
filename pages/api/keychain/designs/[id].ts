import type { NextApiRequest, NextApiResponse } from "next";
import { keychainSnapshotRepository } from "@/api-client/keychain-server";
import { readSnapshotById } from "@/utils/keychain/snapshotLifecycle";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	res.setHeader("Cache-Control", "no-store, max-age=0");
	if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
	const { id } = req.query;
	if (typeof id !== "string") return res.status(400).json({ error: "ID thiết kế không hợp lệ." });
	try {
		const result = await readSnapshotById(id, keychainSnapshotRepository);
		if (result.status === 400) return res.status(400).json({ error: "ID thiết kế không hợp lệ." });
		if (result.status === 404) return res.status(404).json({ error: "Không tìm thấy thiết kế." });
		return res.status(200).json({ id, configVersion: result.snapshot.configVersion || (result.snapshot.config as { version?: number })?.version, config: result.snapshot.config });
	} catch {
		return res.status(500).json({ error: "Không tải được thiết kế." });
	}
}
