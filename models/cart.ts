import { SanityImage } from "./image";
import { SanitySlug } from "./products";

// ==================== Product Types ====================

export type PriceTier = {
	quantity: number;
	price: number; // Price in VND
};

export type LighterType = {
	_id: string;
	_type: "lighterType";
	name: string;
	slug: SanitySlug;
	description?: any[];
	priceTiers: PriceTier[];
	_createdAt: string;
	_updatedAt: string;
};

export type LighterProduct = {
	_id: string;
	_type: "lighterProducts";
	name: string;
	slug: SanitySlug;
	image: SanityImage[];
	details?: any[];
	special: boolean;
	lighterType: {
		_ref: string;
		_type: "reference";
	};
	_createdAt: string;
	_updatedAt: string;
};

// Populated lighter product with type details
export type LighterProductWithType = LighterProduct & {
	lighterTypeDetails: LighterType;
};

// ==================== Cart Types ====================

export type CartItemLighter = {
	productId: string;
	productName: string;
	productImage?: SanityImage;
	productSlug: string;
	lighterTypeId: string;
	lighterTypeName: string;
	quantity: number;
	unitPrice: number; // Price per unit based on quantity tier
	subtotal: number; // unitPrice × quantity
	priceTiers: PriceTier[]; // For recalculation
	designImage?: string; // Base64 or URL for custom design preview
	designPreview?: {
		previewUrl: string;
		rot: number;
		scale: number;
		x: number;
		y: number;
	};
	builderPreviewUrl?: string;
};

export type Cart = {
	items: CartItemLighter[];
	totalAmount: number;
	totalItems: number;
	lastUpdated: string;
};

// ==================== Order Types ====================

export type OrderItemLighter = {
	_key: string; // Required unique key for Sanity array items
	product: {
		_ref: string;
		_type: "reference";
	};
	productName?: string;
	lighterType: {
		_ref: string;
		_type: "reference";
	};
	lighterTypeName?: string;
	quantity: number;
	unitPrice: number;
	subtotal: number;
	designImage?: SanityImage; // Customer's custom design image
	designPreview?: {
		previewUrl: string;
		rot: number;
		scale: number;
		x: number;
		y: number;
	};
	builderPreviewUrl?: string;
	designSourceUrl?: string;
};

export type CustomerInfo = {
	customerName: string;
	customerPhone: string;
	customerEmail?: string;
};

export type DeliveryInfo = {
	deliveryAddress?: string;
};

export type OrderLighter = {
	_id?: string;
	_type: "ordersLighter";
	orderNumber: string;
	orderDate: string;
	status: "pending" | "confirmed" | "processing" | "completed" | "cancelled";
	orderItems: OrderItemLighter[];
	customerName: string;
	customerPhone: string;
	customerEmail?: string;
	deliveryAddress?: string;
	totalAmount: number;
	shippingFee: number;
	discount: number;
	finalAmount: number;
	notes?: string;
	paymentMethod: "cod" | "bank_transfer";
	paymentStatus: "pending" | "paid" | "failed" | "refunded";
	adminNotes?: string;
	trackingNumber?: string;
};

export type CreateOrderLighterInput = Omit<OrderLighter, "_type" | "orderNumber" | "orderDate"> & {
	orderDate?: string;
};

// ==================== Regular Products Cart Types ====================

export type CartItemProduct = {
	productId: string;
	productName: string;
	productImage?: SanityImage;
	productSlug: string;
	productType: string; // "skin-laptop", "macnut", "sticker", etc.
	productTypeName: string;
	quantity: number;
	price: number; // Price per unit (can be discussed with customer)
	subtotal: number; // price × quantity
};

export type ProductsCartStore = {
	// State
	items: CartItemProduct[];

	// Computed
	totalAmount: number;
	totalItems: number;

	// Actions
	addItem: (item: Omit<CartItemProduct, "subtotal">) => void;
	removeItem: (productId: string) => void;
	updateQuantity: (productId: string, quantity: number) => void;
	clearCart: () => void;

	// Hydration (for SSR)
	setItems: (items: CartItemProduct[]) => void;
};

// ==================== Cart Store Types ====================

export type LightersCartStore = {
	// State
	items: CartItemLighter[];

	// Computed
	totalAmount: number;
	totalItems: number;

	// Actions
	addItem: (item: Omit<CartItemLighter, "subtotal">) => void;
	removeItem: (productId: string, lighterTypeId: string) => void;
	updateQuantity: (productId: string, lighterTypeId: string, quantity: number) => void;
	clearCart: () => void;

	// Hydration (for SSR)
	setItems: (items: CartItemLighter[]) => void;
};

// ==================== Route Types ====================

export type ProductCategory = "lighters" | "skinLaptop" | "macnut" | "stickers";

export type CartRouteConfig = {
	routePattern: RegExp;
	category: ProductCategory;
	orderType: string;
	orderPrefix: string;
	checkoutPath: string;
};
