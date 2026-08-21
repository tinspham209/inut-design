import { parseSearchParams, searchSite } from "@/server/search";
import { NextApiRequest, NextApiResponse } from "next";

const getSearchParams = (query: NextApiRequest["query"]) => ({
	q: query.q,
	productType: query.productType,
	page: query.page,
	pageSize: query.pageSize,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== "GET") {
		res.setHeader("Allow", "GET");
		return res.status(405).json({ error: "method_not_allowed" });
	}

	const params = getSearchParams(req.query);
	if (parseSearchParams(params).status !== "valid") {
		return res.status(400).json({ error: "invalid_query" });
	}

	try {
		const page = await searchSite(params);
		res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
		return res.status(200).json(page);
	} catch (error) {
		console.error("Search source unavailable", error instanceof Error ? error.message : "unknown error");
		return res.status(503).json({ error: "search_unavailable" });
	}
}
