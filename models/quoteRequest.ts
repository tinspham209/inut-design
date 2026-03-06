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
	IN_ANH = "in-anh",
	BANG_CUNG_IN_THONG_TIN = "bang-cung-in-thong-tin",
	MOC_KHOA_MICA = "moc-khoa-mica",
	PIN_CAI_AO_MICA = "pin-cai-ao-mica",
	ACRYLIC_MAGNET = "acrylic-magnet",
	STICKER_SHEET = "sticker-sheet",
	STICKER_MAGNET = "sticker-magnet",
	STICKER_DIECUT = "sticker-diecut",
	STICKER_KISSCUT = "sticker-kisscut",
	LAPTOP_CUSTOMIZE = "laptop-customize",
	PHONE_CUSTOMIZE = "phone-customize",
	LIGHTER_CUSTOMIZE = "lighter-customize",
	MACNUT_CUSTOMIZE = "macnut-customize",
}
