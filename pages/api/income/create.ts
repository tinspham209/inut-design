import type { NextApiRequest, NextApiResponse } from "next";
import serverClient from "@/api-client/sanity-server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
	const { title, date, discount, vienManHinh, matPhim, matDay, matLung } = req.body || {};
	if (!title || !date) {
		return res.status(400).json({ error: "Invalid income payload" });
	}

	try {
		const result = await serverClient.create({
			_type: "income",
			title,
			date,
			discount,
			vienManHinh,
			matPhim,
			matDay,
			matLung,
		});
		return res.status(200).json(result);
	} catch (error) {
		console.error("Error creating income:", error);
		return res.status(500).json({ error: "Failed to create income." });
	}
}
