import type { NextApiRequest, NextApiResponse } from "next";
import { uploadImageAssetToSanity } from "@/api-client/sanity-server";
import rateLimit, { getRequestRateLimitToken } from "@/utils/rateLimit";

export const config = {
	api: {
		bodyParser: {
			sizeLimit: "14mb",
		},
	},
};

const ALLOWED_IMAGE_TYPES = new Set([
	"image/png",
	"image/jpeg",
	"image/webp",
	"image/svg+xml",
]);
const limiter = rateLimit({ interval: 60 * 1000, uniqueTokenPerInterval: 1000 });

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<{ _type: string; asset: { _ref: string; _type: string } } | { error: string }>
) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	try {
		await limiter.check(
			res as unknown as Response,
			5,
			getRequestRateLimitToken(req)
		);
	} catch {
		return res.status(429).json({ error: "Too many uploads. Please try again later." });
	}

	const { data, contentType, filename } = req.body || {};
	if (
		typeof data !== "string" ||
		!ALLOWED_IMAGE_TYPES.has(contentType) ||
		data.length > 14 * 1024 * 1024
	) {
		return res.status(400).json({ error: "Invalid image upload" });
	}

	try {
		const asset = await uploadImageAssetToSanity(Buffer.from(data, "base64"), {
			filename: typeof filename === "string" ? filename : "design.webp",
			contentType,
		});
		return res.status(200).json(asset);
	} catch (error) {
		console.error("Error uploading image to Sanity:", error);
		return res.status(500).json({ error: "Failed to upload image. Please try again." });
	}
}
