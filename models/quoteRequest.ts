export enum UsagePurposeValue {
	KINH_DOANH = "kinh-doanh",
	CA_NHAN = "ca-nhan",
	NHAN_DAN_BAO_BI = "nhan-dan-bao-bi",
	STICKER = "sticker",
	OTHER = "other",
}

export enum DesignStatusValue {
	HAVE_DESIGN = "have-design",
	NEED_DESIGN_AND_PRINT = "need-design-and-print",
}

export enum PriorityLevelValue {
	BINH_THUONG = "binh-thuong",
	GAP = "gap",
}

export type CreateQuoteRequestInput = {
	customerName: string;
	companyBrand?: string;
	phone: string;
	email: string;
	usagePurpose: UsagePurposeValue;
	usagePurposeOtherDetail?: string;
	designStatus?: DesignStatusValue;
	priorityLevel?: PriorityLevelValue;
	urgentDate?: string;
	notes?: string;
};

export type QuoteRequestForm = CreateQuoteRequestInput & {
	_id?: string;
};

export enum FormQuoteRequestType {
	STICKER_SHEET = "sticker-sheet",
	STICKER_DIECUT = "sticker-diecut",
	LAPTOP_CUSTOMIZE = "laptop-customize",
	PHONE_CUSTOMIZE = "phone-customize",
	LIGHTER_CUSTOMIZE = "lighter-customize",
	MACNUT_CUSTOMIZE = "macnut-customize",
}
