/**
 * Speculation Rules Configuration
 * Implements prefetch and prerender strategies for faster navigation
 * @see https://developer.chrome.com/docs/web-platform/implementing-speculation-rules
 */

export interface SpeculationRule {
	source: "list" | "document";
	urls?: string[];
	where?: SpeculationCondition;
	eagerness: "immediate" | "eager" | "moderate" | "conservative";
}

export interface SpeculationCondition {
	href_matches?: string;
	not?: { href_matches?: string };
	and?: SpeculationCondition[];
	or?: SpeculationCondition[];
}

export interface SpeculationRulesConfig {
	prefetch?: SpeculationRule[];
	prerender?: SpeculationRule[];
}

/**
 * Check if the browser supports Speculation Rules API
 */
export const supportsSpeculationRules = (): boolean => {
	if (typeof window === "undefined") return false;
	return HTMLScriptElement.supports?.("speculationrules") ?? false;
};

/**
 * High-priority routes for aggressive prefetching
 * These are the most commonly navigated pages
 */
const CRITICAL_ROUTES = [
	"/",
	"/san-pham",
	"/san-pham/skin-laptop",
	"/san-pham/skin-nut-phim",
	"/san-pham/lighters",
	"/services",
	"/contact",
	"/about-us",
	"/contact/form",
];

/**
 * Secondary routes for moderate prefetching
 */
const SECONDARY_ROUTES = [
	"/services/sticker",
	"/services/ca-nhan-hoa",
	"/services/an-pham-luu-niem",
	"/services/an-pham-van-phong",
	"/services/an-pham-su-kien",
	"/services/an-pham-tiep-thi",
	"/services/an-pham-fb",
	"/services/an-pham-bao-bi",
	"/order-tracking",
	"/blog",
];

/**
 * Routes to exclude from speculation
 * These typically involve state changes or require authentication
 */
const EXCLUDED_PATTERNS = ["/checkout/*", "/api/*", "/sanity/*", "/order-tracking/*"];

/**
 * Get speculation rules configuration based on current page context
 * @param currentPath - Current page path for context-aware rules
 */
export const getSpeculationRules = (currentPath?: string): SpeculationRulesConfig => {
	const rules: SpeculationRulesConfig = {
		prefetch: [
			// Tier 1: Critical navigation - prefetch immediately on moderate interaction
			{
				source: "list",
				urls: CRITICAL_ROUTES,
				eagerness: "moderate",
			},
			// Tier 2: Secondary routes - prefetch on conservative interaction (hover)
			{
				source: "list",
				urls: SECONDARY_ROUTES,
				eagerness: "conservative",
			},
			// Tier 3: Document-based prefetch for product links
			{
				source: "document",
				where: {
					and: [{ href_matches: "/san-pham/*" }, { not: { href_matches: "/san-pham/*/*" } }],
				},
				eagerness: "conservative",
			},
			// Tier 4: Document-based prefetch for service links
			{
				source: "document",
				where: {
					href_matches: "/services/**",
				},
				eagerness: "conservative",
			},
			// Tier 5: Document-based prefetch for blog links
			{
				source: "document",
				where: {
					href_matches: "/blog/*",
				},
				eagerness: "conservative",
			},
		],
		prerender: [
			// Only prerender the most critical pages to save bandwidth
			{
				source: "list",
				urls: ["/"],
				eagerness: "moderate",
			},
		],
	};

	// Context-aware rules based on current page
	if (currentPath) {
		// If on a product listing page, prerender top products
		if (currentPath.startsWith("/san-pham/")) {
			rules.prerender?.push({
				source: "document",
				where: {
					href_matches: "/san-pham/**",
				},
				eagerness: "conservative",
			});
		}

		// If on services page, aggressively prefetch service subcategories
		if (currentPath.startsWith("/services")) {
			rules.prefetch?.push({
				source: "document",
				where: {
					href_matches: "/services/**",
				},
				eagerness: "moderate",
			});
		}
	}

	return rules;
};

/**
 * Convert speculation rules config to JSON string for script injection
 */
export const serializeSpeculationRules = (rules: SpeculationRulesConfig): string => {
	return JSON.stringify(rules, null, 2);
};

/**
 * Get fallback prefetch URLs for browsers without speculation rules support
 */
export const getFallbackPrefetchUrls = (): string[] => {
	return [...CRITICAL_ROUTES, ...SECONDARY_ROUTES.slice(0, 4)];
};

/**
 * Page categories for analytics tracking
 */
export const PAGE_CATEGORIES: Record<string, string> = {
	"/": "home",
	"/san-pham": "products",
	"/services": "services",
	"/blog": "blog",
	"/contact": "contact",
	"/about-us": "about",
	"/checkout": "checkout",
	"/order-tracking": "order",
};

const SpeculationRulesUtils = {
	getSpeculationRules,
	supportsSpeculationRules,
	serializeSpeculationRules,
	getFallbackPrefetchUrls,
	PAGE_CATEGORIES,
};

export default SpeculationRulesUtils;
