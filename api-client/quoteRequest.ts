import { client } from "./sanity-client";
import { CreateQuoteRequestInput, QuoteRequestForm } from "../models/quoteRequest";

export const quoteRequestApi = {
	async create(input: CreateQuoteRequestInput): Promise<QuoteRequestForm> {
		const doc = {
			_type: "form-nhan-bao-gia",
			customerName: input.customerName,
			companyBrand: input.companyBrand,
			phone: input.phone,
			email: input.email,
			usagePurpose: input.usagePurpose,
			usagePurposeOtherDetail: input.usagePurposeOtherDetail,
			designStatus: input.designStatus,
			priorityLevel: input.priorityLevel,
			urgentDate: input.urgentDate,
			notes: input.notes,
		};

		return await client.create(doc);
	},
};
