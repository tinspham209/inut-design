/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Umami Event Tracking Utilities
 * Privacy-focused analytics with no cookies
 * Complements GA4 tracking for redundancy and privacy compliance
 */

import envConst from "./env-const";

type UmamiTrackFunction = (
	eventName?: string | object | ((props: any) => any),
	data?: object
) => void;
type UmamiIdentifyFunction = (data: object | string, additionalData?: object) => void;

declare global {
	interface Window {
		umami?: {
			track: UmamiTrackFunction;
			identify: UmamiIdentifyFunction;
		};
	}
}

// Helper to check if Umami is available
const isUmamiAvailable = (): boolean => {
	return (
		typeof window !== "undefined" &&
		typeof window.umami !== "undefined" &&
		envConst.ENABLE_UMAMI === "true"
	);
};

// Core Umami wrapper
export const umami = {
	track: (eventName?: string | object | ((props: any) => any), data?: object): void => {
		if (isUmamiAvailable()) {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			window.umami!.track(eventName, data);
		} else if (envConst.NODE_ENV === "development") {
			console.log("[Umami Debug]", eventName, data);
		}
	},

	identify: (data: object | string, additionalData?: object): void => {
		if (isUmamiAvailable()) {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			window.umami!.identify(data, additionalData);
		} else if (envConst.NODE_ENV === "development") {
			console.log("[Umami Identify]", data, additionalData);
		}
	},
};

/**
 * Track custom page view (for SPA navigation)
 * Note: Umami auto-tracks page views by default
 */
export const trackUmamiPageView = (url?: string, title?: string): void => {
	if (url || title) {
		umami.track((props: any) => ({
			...props,
			url: url || window.location.pathname,
			title: title || document.title,
		}));
	} else {
		umami.track(); // Default page view
	}
};

/**
 * Track custom event
 */
export const trackUmamiEvent = (eventName: string, data?: object): void => {
	umami.track(eventName, data);
};

// ============================================
// E-COMMERCE TRACKING
// ============================================

export interface UmamiProductData {
	id: string;
	name: string;
	category?: string;
	price?: number;
	quantity?: number;
	variant?: string;
}

/**
 * Track product view
 */
export const trackUmamiProductView = (product: UmamiProductData): void => {
	umami.track("product_view", {
		productId: product.id,
		productName: product.name,
		category: product.category || "Unknown",
		price: product.price || 0,
	});
};

/**
 * Track product click
 */
export const trackUmamiProductClick = (product: UmamiProductData, listName?: string): void => {
	umami.track("product_click", {
		productId: product.id,
		productName: product.name,
		category: product.category || "Unknown",
		listName: listName || "Unknown",
		price: product.price || 0,
	});
};

/**
 * Track add to cart
 */
export const trackUmamiAddToCart = (product: UmamiProductData): void => {
	umami.track("add_to_cart", {
		productId: product.id,
		productName: product.name,
		category: product.category || "Unknown",
		price: product.price || 0,
		quantity: product.quantity || 1,
		value: (product.price || 0) * (product.quantity || 1),
	});
};

/**
 * Track remove from cart
 */
export const trackUmamiRemoveFromCart = (product: UmamiProductData): void => {
	umami.track("remove_from_cart", {
		productId: product.id,
		productName: product.name,
		quantity: product.quantity || 1,
	});
};

/**
 * Track checkout started
 */
export const trackUmamiBeginCheckout = (items: UmamiProductData[], totalValue: number): void => {
	umami.track("begin_checkout", {
		itemCount: items.length,
		totalValue: totalValue,
		currency: "VND",
	});
};

/**
 * Track purchase completed
 */
export const trackUmamiPurchase = (
	orderId: string,
	items: UmamiProductData[],
	totalValue: number
): void => {
	umami.track("purchase", {
		orderId: orderId,
		itemCount: items.length,
		totalValue: totalValue,
		currency: "VND",
	});
};

// ============================================
// CONVERSION TRACKING
// ============================================

/**
 * Track order button click (Messenger)
 */
export const trackUmamiOrderButton = (productName: string, category?: string): void => {
	umami.track("order_button_click", {
		productName: productName,
		category: category || "Unknown",
		method: "messenger",
	});
};

/**
 * Track contact interaction
 */
export const trackUmamiContact = (method: string, productName?: string): void => {
	umami.track("contact_click", {
		method: method, // messenger, phone, whatsapp, email
		productName: productName || "N/A",
	});
};

/**
 * Track phone click
 */
export const trackUmamiPhoneClick = (): void => {
	umami.track("phone_click");
};

/**
 * Track Zalo click
 */
export const trackUmamiZaloClick = (): void => {
	umami.track("zalo_click");
};

/**
 * Track form submission
 */
export const trackUmamiFormSubmit = (formType: string): void => {
	umami.track("form_submit", {
		formType: formType, // quote_request, contact_form, etc.
	});
};

/**
 * Track social media click
 */
export const trackUmamiSocialClick = (platform: string): void => {
	umami.track("social_click", {
		platform: platform, // facebook, instagram, tiktok, etc.
	});
};

// ============================================
// ENGAGEMENT TRACKING
// ============================================

/**
 * Track search
 */
export const trackUmamiSearch = (searchTerm: string, resultsCount?: number): void => {
	umami.track("search", {
		searchTerm: searchTerm,
		resultsCount: resultsCount,
	});
};

/**
 * Track outbound link click
 */
export const trackUmamiOutboundClick = (url: string): void => {
	umami.track("outbound_click", {
		destination: url,
	});
};

/**
 * Track file download
 */
export const trackUmamiDownload = (fileName: string): void => {
	umami.track("file_download", {
		fileName: fileName,
	});
};

/**
 * Track video engagement
 */
export const trackUmamiVideoEngagement = (action: string, videoName: string): void => {
	umami.track("video_engagement", {
		action: action, // play, pause, complete
		videoName: videoName,
	});
};

/**
 * Track scroll depth
 */
export const trackUmamiScrollDepth = (depth: number): void => {
	umami.track("scroll_depth", {
		depthPercentage: depth,
	});
};

/**
 * Track time on page
 */
export const trackUmamiTimeOnPage = (pageName: string, seconds: number): void => {
	umami.track("time_on_page", {
		pageName: pageName,
		durationSeconds: seconds,
	});
};

/**
 * Track abandoned checkout (user filled phone + address but didn't submit)
 */
export const trackUmamiAbandonedCheckout = (
	customerPhone: string,
	items: UmamiProductData[],
	deliveryAddress?: string
): void => {
	umami.track("abandoned_checkout", {
		customerPhone,
		itemCount: items.length,
		items: items.map((i) => `${i.name} (${i.quantity})`).join(", "),
		deliveryAddress: deliveryAddress || "N/A",
	});
};

// ============================================
// PERFORMANCE TRACKING (bfcache + Speculation)
// ============================================

/**
 * Track bfcache status
 */
export const trackUmamiBFCacheStatus = (
	wasRestored: boolean,
	navigationType: string,
	restorationTime: number
): void => {
	umami.track("bfcache_status", {
		wasRestored,
		navigationType,
		restorationTimeMs: Math.round(restorationTime),
	});
};

/**
 * Track bfcache not restored reasons
 */
export const trackUmamiBFCacheNotRestored = (reasons: string[]): void => {
	umami.track("bfcache_not_restored", {
		reasons: reasons.join("; "),
		reasonCount: reasons.length,
	});
};

/**
 * Track speculation rules support
 */
export const trackUmamiSpeculationSupport = (supported: boolean, browser: string): void => {
	umami.track("speculation_support", {
		supported,
		browser,
	});
};

/**
 * Track prerender activation
 */
export const trackUmamiPrerenderActivated = (activationTime: number): void => {
	umami.track("prerender_activated", {
		activationTimeMs: Math.round(activationTime),
	});
};

/**
 * Track prefetch effectiveness
 */
export const trackUmamiPrefetchEffectiveness = (
	url: string,
	wasUsed: boolean,
	timeSaved: number
): void => {
	umami.track("prefetch_effectiveness", {
		url,
		wasUsed,
		timeSavedMs: Math.round(timeSaved),
	});
};

// ============================================
// SESSION IDENTIFICATION
// ============================================

/**
 * Identify user session (for logged-in users or after order)
 */
export const identifyUmamiUser = (userId: string, userData?: object): void => {
	if (userData) {
		umami.identify(userId, userData);
	} else {
		umami.identify(userId);
	}
};

/**
 * Track anonymous session data (e.g., cart state, preferences)
 */
export const trackUmamiSessionData = (data: object): void => {
	umami.identify(data);
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Batch track multiple events (useful for checkout flow)
 */
export const trackUmamiBatch = (events: Array<{ name: string; data?: object }>): void => {
	events.forEach(({ name, data }) => {
		umami.track(name, data);
	});
};
