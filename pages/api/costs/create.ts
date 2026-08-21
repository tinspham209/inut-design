import type { NextApiRequest, NextApiResponse } from "next";
import serverClient from "@/api-client/sanity-server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
	const { title, date, price } = req.body || {};
	if (!title || !date || typeof price !== "number") {
		return res.status(400).json({ error: "Invalid cost payload" });
	}

	try {
		const result = await serverClient.create({ _type: "costs", title, date, price });
		return res.status(200).json(result);
	} catch (error) {
		console.error("Error creating cost:", error);
		return res.status(500).json({ error: "Failed to create cost." });
	}
}
