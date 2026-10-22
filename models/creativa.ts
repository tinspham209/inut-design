import type { SanityImage } from "./image";

export type CoverageCode = "top" | "bottom" | "interior" | "full";
export type CreativaImage = SanityImage & {
	alt: string;
	view: "top" | "bottom" | "interior" | "other";
};

export type CreativaProduct = {
	_id: string;
	_rev?: string;
	_createdAt: string;
	name: string;
	slug: { current: string };
	active: boolean;
	description?: string;
	artworkId: string;
	artworkVersion: string;
	printAsset?: { _type: "file"; asset: { _type: "reference"; _ref: string } };
	images: CreativaImage[];
};

export type CreativaModel = {
	_id: string;
	name: string;
	code: string;
	sortOrder: number;
	active: boolean;
	fitVerified: boolean;
	fitReference: string;
};

export type CreativaCoverage = {
	_id: string;
	code: CoverageCode;
	name: string;
	description: string;
	sortOrder: number;
	active: boolean;
	price: number;
};

export type CreativaBank = {
	bankName: string;
	accountName: string;
	accountNumber: string;
	transferInstructions?: string;
};

export type CreativaShippingRule = {
	_key: string;
	code: string;
	name: string;
	active: boolean;
	isDefault: boolean;
	sortOrder: number;
	fee: number;
	note?: string;
};

export type CreativaOptions = {
	models: CreativaModel[];
	coverages: CreativaCoverage[];
	bankAvailable: boolean;
};

export type CreativaCatalogPage = {
	items: CreativaProduct[];
	cursor: string | null;
	fromPrice: number | null;
};

export type CreativaPurchaseLine = {
	productType: "skin-laptop";
	productId: string;
	selection: { modelId: string; coverageId: string };
	quantity: number;
};

export type CreativaOrderLine = CreativaPurchaseLine & {
	_key: string;
	lineKey: string;
	productName: string;
	productSlug: string;
	productImage?: CreativaImage;
	selection: CreativaPurchaseLine["selection"] & {
		modelName: string;
		modelCode: string;
		fitReference: string;
		coverageName: string;
		coverageCode: CoverageCode;
		coverageMeaning: string;
	};
	artwork: {
		identity: string;
		version: string;
		printAsset?: CreativaProduct["printAsset"];
	};
	unitPrice: number;
	subtotal: number;
};

export type CreativaShipping = { code: string; name: string; fee: number };

export type CreativaQuote = {
	lines: CreativaOrderLine[];
	currency: "VND";
	merchandiseTotal: number;
	shippingFee: number;
	discount: 0;
	finalAmount: number;
	shipping: CreativaShipping;
	paymentMethod: "cod" | "bank_transfer";
	bankAvailable: boolean;
	digest: string;
};

export type CreativaCustomer = {
	name: string;
	phone: string;
	email?: string;
	address?: string;
	note?: string;
};

export type CreativaCheckoutRequest = {
	lines: CreativaPurchaseLine[];
	customer: CreativaCustomer;
	paymentMethod: "cod" | "bank_transfer";
	reviewedQuote: Pick<CreativaQuote, "digest" | "merchandiseTotal" | "shippingFee" | "finalAmount">;
};

export type CreativaPublicLine = Pick<
	CreativaOrderLine,
	| "_key"
	| "lineKey"
	| "productType"
	| "productId"
	| "productName"
	| "productSlug"
	| "productImage"
	| "quantity"
	| "unitPrice"
	| "subtotal"
> & {
	selection: Pick<
		CreativaOrderLine["selection"],
		"modelId" | "modelName" | "coverageId" | "coverageName" | "coverageCode"
	>;
};

export type CreativaOrderStatus =
	| "pending"
	| "confirmed"
	| "processing"
	| "in_transit"
	| "completed"
	| "cancelled";
export type CreativaPaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type CreativaPublicOrder = {
	publicId: string;
	orderDate: string;
	status: CreativaOrderStatus;
	paymentStatus: CreativaPaymentStatus;
	paymentMethod: "cod" | "bank_transfer";
	lines: CreativaPublicLine[];
	currency: "VND";
	merchandiseTotal: number;
	shippingFee: number;
	discount: 0;
	finalAmount: number;
	shipping: CreativaShipping;
	bank: CreativaBank | null;
	trackingNumber?: string;
};

export type CreativaAccepted = { created: boolean; order: CreativaPublicOrder };
export type CreativaApiError = {
	code: string;
	message: string;
	fieldErrors?: Record<string, string>;
	quote?: CreativaQuote;
};

export type CreativaEnvelope<T> = { ok: true; data: T } | { ok: false; error: CreativaApiError };

export type CreativaAnalyticsClaim = {
	claimed: boolean;
	event: string;
	transactionId?: string;
	data?: Record<string, string | number | boolean>;
	items?: Array<Record<string, string | number>>;
};
