import type { NextApiRequest, NextApiResponse } from "next";
import { CreateQuoteRequestInput, QuoteRequestForm } from "@/models/quoteRequest";
import serverClient from "@/api-client/sanity-server";
import rateLimit, { getRequestRateLimitToken } from "@/utils/rateLimit";
import { isKeychainRequestId } from "@/utils/keychain/serverValidation";
import { keychainSnapshotRepository } from "@/api-client/keychain-server";

const limiter = rateLimit({ interval: 60 * 1000, uniqueTokenPerInterval: 1000 });

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<QuoteRequestForm | { error: string }>
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
		return res.status(429).json({ error: "Too many quote requests. Please try again later." });
	}

	const input = req.body as CreateQuoteRequestInput;
	if (!input?.customerName || !input?.phone || !input?.usagePurpose) {
		return res.status(400).json({ error: "Invalid quote request" });
	}

	try {
		let keychainDesign: { _type: "reference"; _ref: string } | undefined;
		if (input.keychainDesignId !== undefined && input.keychainDesignId !== "") {
			if (!isKeychainRequestId(input.keychainDesignId)) {
				return res.status(400).json({ error: "Liên kết thiết kế móc khóa không hợp lệ." });
			}
			const snapshot = await keychainSnapshotRepository.readDirect(`keychainDesign.${input.keychainDesignId}`);
			if (!snapshot) return res.status(400).json({ error: "Không tìm thấy thiết kế móc khóa đính kèm." });
			keychainDesign = { _type: "reference", _ref: snapshot._id };
		}
		const doc = {
			_type: "form-nhan-bao-gia",
			createdAt: new Date().toISOString(),
			customerName: input.customerName,
			companyBrand: input.companyBrand,
			phone: input.phone,
			email: input.email,
			usagePurpose: input.usagePurpose,
			usagePurposeOtherDetail: input.usagePurposeOtherDetail,
			quantity: input.quantity,
			deviceModel: input.deviceModel,
			receiveQuoteChannel: input.receiveQuoteChannel,
			receiveQuoteChannelOtherDetail: input.receiveQuoteChannelOtherDetail,
			designStatus: input.designStatus,
			priorityLevel: input.priorityLevel,
			urgentDate: input.urgentDate,
			notes: input.notes,
			...(keychainDesign ? { keychainDesign } : {}),
		};
		return res.status(200).json((await serverClient.create(doc)) as QuoteRequestForm);
	} catch (error) {
		console.error("Error creating quote request:", error);
		return res.status(500).json({ error: "Failed to submit quote request." });
	}
}
