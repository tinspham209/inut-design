import type { NextApiRequest, NextApiResponse } from "next";
import { uploadImageAssetToSanity } from "@/api-client/sanity-server";
import { sanityImageUrl } from "@/api-client/sanity-image";
import rateLimit, { getRequestRateLimitToken } from "@/utils/rateLimit";
import {
	decodeBase64Image,
	sanitizeKeychainFilename,
	validateKeychainImage,
	validatePersistedKeychainImage,
} from "@/utils/keychain/imageValidation";
import { validateBrowserJsonRequest } from "@/utils/server/request-guard";

export const config = { api: { bodyParser: { sizeLimit: "14mb" } } };
const MAX_BYTES = 10 * 1024 * 1024;
const limiter = rateLimit({ interval: 60_000, uniqueTokenPerInterval: 1000 });
type UploadResponse = { image: { _type: string; asset: { _ref: string; _type: string } }; url: string } | { error: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<UploadResponse>) {
	if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
	const requestError = validateBrowserJsonRequest(req, 14 * 1024 * 1024);
	if (requestError) return res.status(requestError.status).json({ error: requestError.error });
	try { await limiter.check(res as unknown as Response, 6, getRequestRateLimitToken(req)); }
	catch { return res.status(429).json({ error: "Quá nhiều lượt tải. Vui lòng thử lại sau." }); }
	const { data, contentType, filename } = req.body || {};
	if (typeof data !== "string" || !["image/png", "image/jpeg", "image/webp"].includes(contentType)) return res.status(415).json({ error: "Chỉ hỗ trợ PNG, JPEG và WebP." });
	if (data.length > Math.ceil(MAX_BYTES * 4 / 3) + 8) return res.status(413).json({ error: "Ảnh không được vượt quá 10 MB." });
	try {
		const bytes = decodeBase64Image(data);
		if (bytes.byteLength > MAX_BYTES) return res.status(413).json({ error: "Ảnh không được vượt quá 10 MB." });
		validateKeychainImage(bytes, contentType);
		const safeFilename = sanitizeKeychainFilename(filename, contentType);
		const copy = new Uint8Array(bytes.byteLength);
		copy.set(bytes);
		const image = await uploadImageAssetToSanity(new Blob([copy.buffer], { type: contentType }), {
			filename: safeFilename,
			contentType,
		});
		const result = { image, url: sanityImageUrl(image, "design") };
		validatePersistedKeychainImage(result);
		return res.status(200).json(result);
	} catch (error) {
		if (error instanceof Error && ["INVALID_BASE64", "INVALID_SIZE", "UNSUPPORTED_FORMAT", "INVALID_IMAGE"].includes(error.message)) return res.status(400).json({ error: "Dữ liệu ảnh không hợp lệ hoặc vượt kích thước hỗ trợ." });
		if (error instanceof Error && error.message === "INVALID_PERSISTENCE_RESULT") return res.status(500).json({ error: "Không xác nhận được ảnh đã lưu. Vui lòng thử lại." });
		return res.status(500).json({ error: "Không tải được ảnh. Vui lòng thử lại." });
	}
}
