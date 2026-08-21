import type { NextApiRequest, NextApiResponse } from "next";
import { createLighterOrder } from "@/api-client/sanity-server";
import { CreateOrderLighterInput, OrderLighter } from "@/models/cart";
import rateLimit, { getRequestRateLimitToken } from "@/utils/rateLimit";

type ApiResponse = OrderLighter | { error: string };

const limiter = rateLimit({ interval: 60 * 1000, uniqueTokenPerInterval: 1000 });

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	try {
		await limiter.check(
			res as unknown as globalThis.Response,
			10,
			getRequestRateLimitToken(req)
		);
	} catch {
		return res.status(429).json({ error: "Too many order attempts. Please try again later." });
	}

	const orderData = req.body as CreateOrderLighterInput;
	if (!orderData?.customerName || !orderData?.customerPhone || !Array.isArray(orderData.orderItems)) {
		return res.status(400).json({ error: "Invalid order payload" });
	}
	if (orderData.orderItems.some((item) => !item._key || !item.product?._ref || !item.lighterType?._ref)) {
		return res.status(400).json({ error: "Invalid order item payload" });
	}

	try {
		return res.status(200).json(await createLighterOrder(orderData));
	} catch (error) {
		console.error("Error creating lighter order:", error);
		return res.status(500).json({ error: "Failed to create order. Please try again." });
	}
}
