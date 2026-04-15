export enum UsagePurposeValue {
	KINH_DOANH = "kinh-doanh",
	CA_NHAN = "ca-nhan",
	NHAN_DAN_BAO_BI = "nhan-dan-bao-bi",
	STICKER = "sticker",
	OTHER = "other",
	IN_ANH = "in-anh",
	BANG_CUNG_IN_THONG_TIN = "bang-cung-in-thong-tin",
	IN_BI_THU = "in-bi-thu",
	MOC_KHOA_MICA = "moc-khoa-mica",
	PIN_CAI_AO_MICA = "pin-cai-ao-mica",
	ACRYLIC_MAGNET = "acrylic-magnet",
	STICKER_SHEET = "sticker-sheet",
	STICKER_MAGNET = "sticker-magnet",
	STICKER_DIECUT = "sticker-diecut",
	STICKER_KISSCUT = "sticker-kisscut",
	LAPTOP_CUSTOMIZE = "skin-laptop-customize",
	PHONE_CUSTOMIZE = "skin-phone-customize",
	LIGHTER_CUSTOMIZE = "lighters-customize",
	MACNUT_CUSTOMIZE = "macnut-customize",
	THANK_CARD_GIFT_CARD = "thank-card-gift-card",
	IN_POSTCARD = "in-postcard",
	GIAY_KHEN_GIAY_CHUNG_NHAN = "giay-khen-giay-chung-nhan",
	SO_TAY_KY_YEU_SO_BAM_GHIM = "so-tay-ky-yeu-so-bam-ghim",
	CATALOGUE_BROCHURE = "catalogue-brochure",
	IN_CARD_VISIT = "in-card-visit",
	TEM_BAO_HANH = "tem-bao-hanh",
	HOP_SAN_PHAM = "hop-san-pham",
	DECAL_NHAN_MAC = "decal-nhan-mac",
	TAM_LOT_BAN_AN = "tam-lot-ban-an",
	PHIEU_VE_HOA_DON_GTGT = "phieu-ve-hoa-don-gtgt",
	THIET_KE_IN_MENU = "design-in-menu",
	SAN_PHAM_DECOR = "san-pham-decor",
	IN_VOUCHER_VE_MOI_SU_KIEN_THE_TICH_DIEM = "in-voucher-ve-moi-su-kien-the-tich-diem",
	SU_KIEN_TRON_GOI = "su-kien-tron-goi",
	HUY_CHUONG = "huy-chuong",
	POSTER_DECAL = "poster-decal",
	HASHTAG_CAM_TAY = "hashtag-cam-tay",
	BANNER_STANDEE = "banner-standee",
	THIET_KE_IN_AN_CUA_HANG_TRON_GOI = "thiet-ke-in-an-cua-hang-tron-goi",
}

export enum DesignStatusValue {
	HAVE_DESIGN = "have-design",
	NEED_DESIGN_AND_PRINT = "need-design-and-print",
}

export enum PriorityLevelValue {
	BINH_THUONG = "binh-thuong",
	GAP = "gap",
}

export type ReceiveQuoteChannelValue = "email" | "zalo" | "phone" | "other";

export type CreateQuoteRequestInput = {
	customerName: string;
	companyBrand?: string;
	phone: string;
	email: string;
	usagePurpose: UsagePurposeValue;
	usagePurposeOtherDetail?: string;
	quantity: number;
	deviceModel?: string;
	receiveQuoteChannel: ReceiveQuoteChannelValue;
	receiveQuoteChannelOtherDetail?: string;
	designStatus?: DesignStatusValue;
	priorityLevel?: PriorityLevelValue;
	urgentDate?: string;
	notes?: string;
};

export type QuoteRequestForm = CreateQuoteRequestInput & {
	_id?: string;
};
