/**
 * Google Tag Manager DataLayer Utility
 * Provides standardized data layer event pushing for GTM
 * Supports enhanced e-commerce, custom dimensions, and user properties
 */

import envConst from "./env-const";

// Type definitions for data layer events
export interface DataLayerEvent {
	event: string;
	ecommerce?: GA4EcommerceData;
	user_properties?: UserProperties;
	custom_dimensions?: CustomDimensions;
	[key: string]: any;
}

export interface GA4EcommerceData {
	currency?: string;
	value?: number;
	transaction_id?: string;
	items?: GA4Item[];
}

export interface GA4Item {
	item_id: string;
	item_name: string;
	affiliation?: string;
	coupon?: string;
	discount?: number;
	index?: number;
	item_brand?: string;
	item_category?: string;
	item_category2?: string;
	item_category3?: string;
	item_category4?: string;
	item_category5?: string;
	item_list_id?: string;
	item_list_name?: string;
	item_variant?: string;
	location_id?: string;
	price: number;
	quantity: number;
}

export interface UserProperties {
	customer_id?: string;
	customer_type?: "new" | "returning" | "loyal" | "vip";
	lifetime_value?: number;
	purchase_count?: number;
	first_visit_date?: string;
	last_visit_date?: string;
	engagement_score?: number;
}

export interface CustomDimensions {
	user_type?: string;
	device_type?: string;
	traffic_source?: string;
	customer_segment?: string;
	product_category?: string;
	price_range?: "budget" | "mid-range" | "premium";
	session_count?: number;
	page_depth?: number;
}

// Extend Window interface for dataLayer
declare global {
	interface Window {
		dataLayer?: DataLayerEvent[];
	}
}

/**
 * Initialize dataLayer if not exists
 */
const initDataLayer = (): void => {
	if (typeof window !== "undefined") {
		window.dataLayer = window.dataLayer || [];
	}
};

/**
 * Push event to dataLayer
 * @param event - DataLayer event object
 */
export const pushToDataLayer = (event: DataLayerEvent): void => {
	initDataLayer();
	if (typeof window !== "undefined" && window.dataLayer) {
		window.dataLayer.push(event);
		if (envConst.NODE_ENV === "development") {
			console.log("[DataLayer]", event.event, event);
		}
	}
};

/**
 * Push e-commerce event to dataLayer
 * @param eventName - Event name (view_item, add_to_cart, etc.)
 * @param ecommerce - E-commerce data
 * @param customDimensions - Optional custom dimensions
 */
export const pushEcommerceEvent = (
	eventName: string,
	ecommerce: GA4EcommerceData,
	customDimensions?: CustomDimensions
): void => {
	pushToDataLayer({
		event: eventName,
		ecommerce,
		...(customDimensions && { custom_dimensions: customDimensions }),
	});
};

/**
 * Push user properties to dataLayer
 * @param properties - User properties
 */
export const pushUserProperties = (properties: UserProperties): void => {
	pushToDataLayer({
		event: "user_properties",
		user_properties: properties,
	});
};

/**
 * Push custom event to dataLayer
 * @param eventName - Event name
 * @param eventData - Event data
 */
export const pushCustomEvent = (
	eventName: string,
	eventData: Record<string, any>
): void => {
	pushToDataLayer({
		event: eventName,
		...eventData,
	});
};

/**
 * Get current dataLayer state
 * @returns Array of dataLayer events
 */
export const getDataLayer = (): DataLayerEvent[] => {
	if (typeof window !== "undefined" && window.dataLayer) {
		return [...window.dataLayer];
	}
	return [];
};

/**
 * Clear dataLayer (useful for testing)
 */
export const clearDataLayer = (): void => {
	if (typeof window !== "undefined") {
		window.dataLayer = [];
	}
};

/**
 * Check if event exists in dataLayer
 * @param eventName - Event name to check
 * @returns boolean
 */
export const hasEventInDataLayer = (eventName: string): boolean => {
	const dataLayer = getDataLayer();
	return dataLayer.some((event) => event.event === eventName);
};

/**
 * Get last event of specific type from dataLayer
 * @param eventName - Event name
 * @returns DataLayerEvent or undefined
 */
export const getLastEvent = (eventName: string): DataLayerEvent | undefined => {
	const dataLayer = getDataLayer();
	return dataLayer.filter((event) => event.event === eventName).pop();
};

/**
 * Get device type based on screen width
 * @returns Device type string
 */
export const getDeviceType = (): string => {
	if (typeof window === "undefined") return "unknown";
	const width = window.innerWidth;
	if (width < 768) return "mobile";
	if (width < 1024) return "tablet";
	return "desktop";
};

/**
 * Get user type based on visit history
 * @returns User type string
 */
export const getUserType = (): string => {
	if (typeof window === "undefined") return "new";
	const visitCount = parseInt(localStorage.getItem("visit_count") || "0", 10);
	if (visitCount === 0) return "new";
	if (visitCount < 5) return "returning";
	if (visitCount < 20) return "loyal";
	return "vip";
};

/**
 * Get price range category
 * @param price - Product price in VND
 * @returns Price range category
 */
export const getPriceRange = (
	price: number
): "budget" | "mid-range" | "premium" => {
	if (price < 100000) return "budget";
	if (price < 300000) return "mid-range";
	return "premium";
};

/**
 * Calculate cart total value
 * @param items - Array of cart items
 * @returns Total value
 */
export const calculateCartTotal = (
	items: Array<{ price: number; quantity: number }>
): number => {
	return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

/**
 * Generate session ID
 * @returns Session ID string
 */
export const getSessionId = (): string => {
	if (typeof window === "undefined") return "";
	let sessionId = sessionStorage.getItem("session_id");
	if (!sessionId) {
		sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
		sessionStorage.setItem("session_id", sessionId);
	}
	return sessionId;
};

/**
 * Get traffic source based on referrer and UTM parameters
 * @returns Traffic source string
 */
export const getTrafficSource = (): string => {
	if (typeof window === "undefined") return "direct";
	
	const urlParams = new URLSearchParams(window.location.search);
	const utmSource = urlParams.get("utm_source");
	const utmMedium = urlParams.get("utm_medium");
	
	if (utmSource) {
		return utmMedium ? `${utmSource}_${utmMedium}` : utmSource;
	}
	
	const referrer = document.referrer;
	if (!referrer) return "direct";
	
	try {
		const referrerDomain = new URL(referrer).hostname;
		if (referrerDomain.includes("google")) return "google_search";
		if (referrerDomain.includes("facebook")) return "facebook";
		if (referrerDomain.includes("instagram")) return "instagram";
		if (referrerDomain.includes("zalo")) return "zalo";
		if (referrerDomain.includes("tiktok")) return "tiktok";
		if (referrerDomain === window.location.hostname) return "internal";
		return "referral";
	} catch {
		return "direct";
	}
};

/**
 * Get page depth (number of pages viewed in session)
 * @returns Page depth number
 */
export const getPageDepth = (): number => {
	if (typeof window === "undefined") return 1;
	const depth = parseInt(sessionStorage.getItem("page_depth") || "1", 10);
	return depth;
};

/**
 * Increment page depth
 */
export const incrementPageDepth = (): void => {
	if (typeof window === "undefined") return;
	const currentDepth = getPageDepth();
	sessionStorage.setItem("page_depth", String(currentDepth + 1));
};

const dataLayerUtils = {
	pushToDataLayer,
	pushEcommerceEvent,
	pushUserProperties,
	pushCustomEvent,
	getDataLayer,
	clearDataLayer,
	hasEventInDataLayer,
	getLastEvent,
	getDeviceType,
	getUserType,
	getPriceRange,
	calculateCartTotal,
	getSessionId,
	getTrafficSource,
	getPageDepth,
	incrementPageDepth,
};

export default dataLayerUtils;
