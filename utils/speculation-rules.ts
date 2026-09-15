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
	// Let Next.js Link prefetch only links it renders instead of issuing a broad
	// set of speculative requests for catalog and product routes.
	return { prefetch: [] };
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
	return [];
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
