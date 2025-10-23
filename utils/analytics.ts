/**
 * Google Analytics & GTM Event Tracking Utilities
 * For GA4 Enhanced Measurement and E-commerce
 */

declare global {
	interface Window {
		gtag?: (...args: any[]) => void;
		dataLayer?: any[];
	}
}

// Types for better type safety
export interface GAEventParams {
	category?: string;
	label?: string;
	value?: number;
	[key: string]: any;
}

export interface ProductData {
	id: string;
	name: string;
	brand?: string;
	category?: string;
	variant?: string;
	price?: number;
	quantity?: number;
}

// Helper to check if gtag is available
const isGtagAvailable = (): boolean => {
	return typeof window !== "undefined" && typeof window.gtag === "function";
};

// Core gtag wrapper
export const gtag = (...args: any[]): void => {
	if (isGtagAvailable()) {
		window.gtag!(...args);
	} else if (process.env.NODE_ENV === "development") {
		console.log("[GA Debug]", ...args);
	}
};

/**
 * Track Page Views (for Next.js route changes)
 * @param url - The page URL
 * @param title - Optional page title
 */
export const trackPageView = (url: string, title?: string): void => {
	gtag("event", "page_view", {
		page_path: url,
		page_title: title || document.title,
		page_location: window.location.href,
	});
};

/**
 * Track custom events
 * @param action - Event action name
 * @param params - Event parameters
 */
export const trackEvent = (action: string, params?: GAEventParams): void => {
	gtag("event", action, params);
};

// ============================================
// E-COMMERCE TRACKING (GA4)
// ============================================

/**
 * Track when user views a product
 * @param product - Product data
 */
export const trackViewProduct = (product: ProductData): void => {
	gtag("event", "view_item", {
		currency: "VND",
		value: product.price || 0,
		items: [
			{
				item_id: product.id,
				item_name: product.name,
				item_brand: product.brand || "INUT Design",
				item_category: product.category,
				item_variant: product.variant,
				price: product.price,
				quantity: 1,
			},
		],
	});
};

/**
 * Track when user clicks on a product
 * @param product - Product data
 * @param listName - Name of the list where product was shown
 * @param position - Position in the list
 */
export const trackSelectProduct = (
	product: ProductData,
	listName?: string,
	position?: number
): void => {
	gtag("event", "select_item", {
		item_list_name: listName || "Product List",
		items: [
			{
				item_id: product.id,
				item_name: product.name,
				item_brand: product.brand || "INUT Design",
				item_category: product.category,
				price: product.price,
				index: position,
			},
		],
	});
};

/**
 * Track add to cart
 * @param product - Product data
 */
export const trackAddToCart = (product: ProductData): void => {
	gtag("event", "add_to_cart", {
		currency: "VND",
		value: (product.price || 0) * (product.quantity || 1),
		items: [
			{
				item_id: product.id,
				item_name: product.name,
				item_brand: product.brand || "INUT Design",
				item_category: product.category,
				item_variant: product.variant,
				price: product.price,
				quantity: product.quantity || 1,
			},
		],
	});
};

/**
 * Track remove from cart
 * @param product - Product data
 */
export const trackRemoveFromCart = (product: ProductData): void => {
	gtag("event", "remove_from_cart", {
		currency: "VND",
		value: (product.price || 0) * (product.quantity || 1),
		items: [
			{
				item_id: product.id,
				item_name: product.name,
				price: product.price,
				quantity: product.quantity || 1,
			},
		],
	});
};

/**
 * Track beginning of checkout
 * @param products - Array of products in cart
 * @param value - Total cart value
 */
export const trackBeginCheckout = (products: ProductData[], value: number): void => {
	gtag("event", "begin_checkout", {
		currency: "VND",
		value: value,
		items: products.map((product) => ({
			item_id: product.id,
			item_name: product.name,
			item_brand: product.brand || "INUT Design",
			item_category: product.category,
			price: product.price,
			quantity: product.quantity || 1,
		})),
	});
};

/**
 * Track purchase/conversion
 * @param transactionId - Unique order ID
 * @param products - Array of products purchased
 * @param value - Total order value
 */
export const trackPurchase = (
	transactionId: string,
	products: ProductData[],
	value: number
): void => {
	gtag("event", "purchase", {
		transaction_id: transactionId,
		currency: "VND",
		value: value,
		items: products.map((product) => ({
			item_id: product.id,
			item_name: product.name,
			item_brand: product.brand || "INUT Design",
			item_category: product.category,
			item_variant: product.variant,
			price: product.price,
			quantity: product.quantity || 1,
		})),
	});
};

// ============================================
// CONVERSION TRACKING
// ============================================

/**
 * Track contact form submission
 * @param formType - Type of form (quote, contact, etc.)
 */
export const trackFormSubmit = (formType: string): void => {
	trackEvent("form_submit", {
		form_type: formType,
	});
};

/**
 * Track messenger/chat button clicks
 * @param platform - Platform name (messenger, whatsapp, etc.)
 * @param productName - Optional product context
 */
export const trackContactClick = (platform: string, productName?: string): void => {
	trackEvent("contact_click", {
		contact_method: platform,
		product_name: productName,
	});
};

/**
 * Track phone number clicks
 */
export const trackPhoneClick = (): void => {
	trackEvent("phone_click", {
		contact_method: "phone",
	});
};

/**
 * Track order button clicks (order via messenger)
 * @param productName - Product being ordered
 * @param category - Product category
 */
export const trackOrderButtonClick = (productName: string, category: string): void => {
	trackEvent("order_button_click", {
		product_name: productName,
		product_category: category,
	});
};

/**
 * Track social media clicks
 * @param platform - Social platform (facebook, instagram, etc.)
 */
export const trackSocialClick = (platform: string): void => {
	trackEvent("social_click", {
		social_platform: platform,
	});
};

/**
 * Track search queries
 * @param searchTerm - Search term entered
 */
export const trackSearch = (searchTerm: string): void => {
	trackEvent("search", {
		search_term: searchTerm,
	});
};

/**
 * Track file downloads
 * @param fileName - Name of downloaded file
 */
export const trackDownload = (fileName: string): void => {
	trackEvent("file_download", {
		file_name: fileName,
	});
};

/**
 * Track outbound link clicks
 * @param url - URL being clicked
 */
export const trackOutboundClick = (url: string): void => {
	trackEvent("outbound_click", {
		link_url: url,
	});
};

// ============================================
// ENGAGEMENT TRACKING
// ============================================

/**
 * Track video engagement
 * @param action - play, pause, complete
 * @param videoTitle - Video title
 */
export const trackVideoEngagement = (action: string, videoTitle: string): void => {
	trackEvent(`video_${action}`, {
		video_title: videoTitle,
	});
};

/**
 * Track time on page (call on unmount)
 * @param pageType - Type of page
 * @param timeSpent - Time in seconds
 */
export const trackTimeOnPage = (pageType: string, timeSpent: number): void => {
	trackEvent("time_on_page", {
		page_type: pageType,
		time_seconds: timeSpent,
	});
};

const analytics = {
	trackPageView,
	trackEvent,
	trackViewProduct,
	trackSelectProduct,
	trackAddToCart,
	trackRemoveFromCart,
	trackBeginCheckout,
	trackPurchase,
	trackFormSubmit,
	trackContactClick,
	trackPhoneClick,
	trackOrderButtonClick,
	trackSocialClick,
	trackSearch,
	trackDownload,
	trackOutboundClick,
	trackVideoEngagement,
	trackTimeOnPage,
};

export default analytics;
