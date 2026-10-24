import type { SanityImage } from "./image";

export type CoverageCode = "top" | "bottom" | "interior" | "full";
export type CreativaImage = SanityImage & {
	alt: string;
	view: "top" | "bottom" | "interior" | "other";
};

export type CreativaTextBlock = {
	_type: "block";
	_key?: string;
	style?: string;
	listItem?: "bullet" | "number";
	level?: number;
	children: Array<{ _type: "span"; _key?: string; text: string; marks?: string[] }>;
	markDefs?: Array<{ _key: string; _type: "link"; href: string }>;
};
export type CreativaDescription =
	| string
	| Array<CreativaTextBlock | (SanityImage & { _type: "image"; alt?: string })>;

export type CreativaProduct = {
	_id: string;
	_rev?: string;
	_createdAt: string;
	name: string;
	slug: { current: string };
	active: boolean;
	description?: CreativaDescription;
	images: CreativaImage[];
};

export type CreativaModel = {
	_id: string;
	name: string;
	code: string;
	sortOrder: number;
	active: boolean;
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
	profileId?: string;
	name?: string;
	bankName: string;
	bankShortName?: string;
	bankCode?: string;
	accountName: string;
	accountNumber: string;
	image?: SanityImage;
	transferInstructions?: string;
};

export type CreativaShippingRule = {
	_id: string;
	code: string;
	name: string;
	fee: number;
	note?: string;
};

export type CreativaBankIssue = "missing_primary" | "multiple_primary" | "invalid_primary";
export type CreativaOptions = {
	models: CreativaModel[];
	coverages: CreativaCoverage[];
	bankAvailable: boolean;
	bankIssue?: CreativaBankIssue;
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
		coverageName: string;
		coverageCode: CoverageCode;
		coverageMeaning: string;
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
> & {
	unitPrice?: number;
	subtotal?: number;
	selection: Pick<CreativaOrderLine["selection"], "modelName" | "coverageName"> &
		Partial<Pick<CreativaOrderLine["selection"], "modelId" | "coverageId" | "coverageCode">>;
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
	customer: Pick<CreativaCustomer, "name" | "phone" | "email" | "address">;
	lines: CreativaPublicLine[];
	currency: "VND";
	merchandiseTotal: number;
	shippingFee: number;
	discount: number;
	finalAmount: number;
	shipping: CreativaShipping;
	bank: CreativaBank | null;
	transferContent?: string;
	trackingNumber?: string;
};

export type CreativaAccepted = {
	created: boolean;
	order: CreativaPublicOrder;
	analyticsTransactionId?: string;
};
export type CreativaApiError = {
	code: string;
	message: string;
	terminal?: boolean;
	fieldErrors?: Record<string, string>;
	quote?: CreativaQuote;
};

export type CreativaEnvelope<T> = { ok: true; data: T } | { ok: false; error: CreativaApiError };

export type CreativaPurchaseEvent = {
	event: string;
	transactionId: string;
	data?: Record<string, string | number | boolean>;
	items?: Array<Record<string, string | number>>;
};
