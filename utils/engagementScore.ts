/**
 * User Engagement Scoring Utility
 * Calculates and tracks user engagement scores for business intelligence
 * Supports cohort analysis and user segmentation
 */

import { pushToDataLayer } from "./dataLayer";

// Engagement event types with weights
export interface EngagementEvent {
	type: "page_view" | "scroll" | "click" | "add_to_cart" | "purchase" | "contact" | "search";
	value: number;
	timestamp: number;
	metadata?: Record<string, any>;
}

// Engagement score configuration
export interface EngagementConfig {
	pageViewWeight: number;
	scrollWeight: number;
	clickWeight: number;
	addToCartWeight: number;
	purchaseWeight: number;
	contactWeight: number;
	searchWeight: number;
	decayFactor: number; // Factor to decay old events (0-1)
	sessionTimeoutMs: number;
}

// Default engagement weights
const DEFAULT_CONFIG: EngagementConfig = {
	pageViewWeight: 1,
	scrollWeight: 2,
	clickWeight: 3,
	addToCartWeight: 10,
	purchaseWeight: 50,
	contactWeight: 15,
	searchWeight: 5,
	decayFactor: 0.95,
	sessionTimeoutMs: 30 * 60 * 1000, // 30 minutes
};

// Storage keys
const ENGAGEMENT_EVENTS_KEY = "inut_engagement_events";
const ENGAGEMENT_SCORE_KEY = "inut_engagement_score";
const SESSION_START_KEY = "inut_session_start";

/**
 * Get stored engagement events
 * @returns Array of engagement events
 */
export const getEngagementEvents = (): EngagementEvent[] => {
	if (typeof window === "undefined") return [];
	try {
		const stored = localStorage.getItem(ENGAGEMENT_EVENTS_KEY);
		return stored ? JSON.parse(stored) : [];
	} catch (error) {
		console.error("[Engagement] Failed to get events:", error);
		return [];
	}
};

/**
 * Save engagement events to storage
 * @param events - Events to save
 */
const saveEngagementEvents = (events: EngagementEvent[]): void => {
	if (typeof window === "undefined") return;
	try {
		// Keep only last 100 events to prevent storage bloat
		const trimmed = events.slice(-100);
		localStorage.setItem(ENGAGEMENT_EVENTS_KEY, JSON.stringify(trimmed));
	} catch (error) {
		console.error("[Engagement] Failed to save events:", error);
	}
};

/**
 * Track an engagement event
 * @param type - Event type
 * @param value - Event value (e.g., scroll depth, time spent)
 * @param metadata - Optional metadata
 */
export const trackEngagementEvent = (
	type: EngagementEvent["type"],
	value = 1,
	metadata?: Record<string, any>
): void => {
	const event: EngagementEvent = {
		type,
		value,
		timestamp: Date.now(),
		metadata,
	};

	const events = getEngagementEvents();
	events.push(event);
	saveEngagementEvents(events);

	// Recalculate and update score
	const score = calculateEngagementScore();
	updateEngagementScore(score);

	// Push to dataLayer for GTM
	pushToDataLayer({
		event: "engagement_event",
		engagement_type: type,
		engagement_value: value,
		engagement_score: score,
		...metadata,
	});
};

/**
 * Calculate engagement score based on events
 * @param config - Optional configuration override
 * @returns Calculated engagement score
 */
export const calculateEngagementScore = (config: EngagementConfig = DEFAULT_CONFIG): number => {
	const events = getEngagementEvents();
	const now = Date.now();

	let score = 0;

	events.forEach((event) => {
		// Apply time decay
		const ageMs = now - event.timestamp;
		const decayMultiplier = Math.pow(config.decayFactor, ageMs / (24 * 60 * 60 * 1000));

		// Get weight for event type
		let weight = 1;
		switch (event.type) {
			case "page_view":
				weight = config.pageViewWeight;
				break;
			case "scroll":
				weight = config.scrollWeight;
				break;
			case "click":
				weight = config.clickWeight;
				break;
			case "add_to_cart":
				weight = config.addToCartWeight;
				break;
			case "purchase":
				weight = config.purchaseWeight;
				break;
			case "contact":
				weight = config.contactWeight;
				break;
			case "search":
				weight = config.searchWeight;
				break;
		}

		score += weight * event.value * decayMultiplier;
	});

	return Math.round(score * 100) / 100;
};

/**
 * Update stored engagement score
 * @param score - New score
 */
const updateEngagementScore = (score: number): void => {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(ENGAGEMENT_SCORE_KEY, score.toString());
	} catch (error) {
		console.error("[Engagement] Failed to save score:", error);
	}
};

/**
 * Get current engagement score
 * @returns Current engagement score
 */
export const getCurrentEngagementScore = (): number => {
	if (typeof window === "undefined") return 0;
	try {
		const stored = localStorage.getItem(ENGAGEMENT_SCORE_KEY);
		return stored ? parseFloat(stored) : 0;
	} catch (error) {
		console.error("[Engagement] Failed to get score:", error);
		return 0;
	}
};

/**
 * Get user segment based on engagement score
 * @returns User segment string
 */
export const getUserSegment = (): string => {
	const score = getCurrentEngagementScore();
	if (score >= 500) return "champion";
	if (score >= 200) return "loyal";
	if (score >= 100) return "potential_loyalist";
	if (score >= 50) return "promising";
	if (score >= 20) return "needs_attention";
	if (score >= 5) return "about_to_sleep";
	return "new";
};

/**
 * Get engagement level (for analytics)
 * @returns Engagement level string
 */
export const getEngagementLevel = (): "high" | "medium" | "low" | "none" => {
	const score = getCurrentEngagementScore();
	if (score >= 100) return "high";
	if (score >= 30) return "medium";
	if (score >= 5) return "low";
	return "none";
};

/**
 * Check if user is highly engaged
 * @returns boolean
 */
export const isHighlyEngaged = (): boolean => {
	return getCurrentEngagementScore() >= 100;
};

/**
 * Reset engagement data (useful for testing or user reset)
 */
export const resetEngagement = (): void => {
	if (typeof window === "undefined") return;
	try {
		localStorage.removeItem(ENGAGEMENT_EVENTS_KEY);
		localStorage.removeItem(ENGAGEMENT_SCORE_KEY);
		localStorage.removeItem(SESSION_START_KEY);
		console.log("[Engagement] Engagement data reset");
	} catch (error) {
		console.error("[Engagement] Failed to reset:", error);
	}
};

/**
 * Get engagement summary for analytics
 * @returns Engagement summary object
 */
export const getEngagementSummary = () => {
	const events = getEngagementEvents();
	const score = getCurrentEngagementScore();
	const segment = getUserSegment();
	const level = getEngagementLevel();

	// Count events by type
	const eventCounts = events.reduce((acc, event) => {
		acc[event.type] = (acc[event.type] || 0) + 1;
		return acc;
	}, {} as Record<string, number>);

	return {
		score,
		segment,
		level,
		totalEvents: events.length,
		eventCounts,
		lastEventTime: events.length > 0 ? events[events.length - 1].timestamp : null,
	};
};

/**
 * Track page view engagement
 * @param pageName - Page name
 * @param timeOnPage - Time spent on page in seconds
 */
export const trackPageEngagement = (pageName: string, timeOnPage: number): void => {
	trackEngagementEvent("page_view", 1, {
		page_name: pageName,
		time_on_page: timeOnPage,
	});
};

/**
 * Track scroll engagement
 * @param depth - Scroll depth percentage
 */
export const trackScrollEngagement = (depth: number): void => {
	trackEngagementEvent("scroll", depth / 100, {
		scroll_depth: depth,
	});
};

/**
 * Track click engagement
 * @param elementName - Element clicked
 * @param elementType - Type of element
 */
export const trackClickEngagement = (elementName: string, elementType: string): void => {
	trackEngagementEvent("click", 1, {
		element_name: elementName,
		element_type: elementType,
	});
};

/**
 * Track cart engagement
 * @param productName - Product added to cart
 * @param value - Cart value
 */
export const trackCartEngagement = (productName: string, value: number): void => {
	trackEngagementEvent("add_to_cart", 1, {
		product_name: productName,
		cart_value: value,
	});
};

/**
 * Track purchase engagement
 * @param orderId - Order ID
 * @param value - Purchase value
 */
export const trackPurchaseEngagement = (orderId: string, value: number): void => {
	trackEngagementEvent("purchase", 1, {
		order_id: orderId,
		purchase_value: value,
	});
};

/**
 * Track contact engagement
 * @param contactMethod - Contact method used
 */
export const trackContactEngagement = (contactMethod: string): void => {
	trackEngagementEvent("contact", 1, {
		contact_method: contactMethod,
	});
};

/**
 * Track search engagement
 * @param searchTerm - Search term
 * @param resultsCount - Number of results
 */
export const trackSearchEngagement = (searchTerm: string, resultsCount: number): void => {
	trackEngagementEvent("search", 1, {
		search_term: searchTerm,
		results_count: resultsCount,
	});
};

const engagementUtils = {
	trackEngagementEvent,
	calculateEngagementScore,
	getCurrentEngagementScore,
	getUserSegment,
	getEngagementLevel,
	isHighlyEngaged,
	resetEngagement,
	getEngagementSummary,
	trackPageEngagement,
	trackScrollEngagement,
	trackClickEngagement,
	trackCartEngagement,
	trackPurchaseEngagement,
	trackContactEngagement,
	trackSearchEngagement,
};

export default engagementUtils;
