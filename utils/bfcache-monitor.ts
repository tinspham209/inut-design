/**
 * Back/Forward Cache (bfcache) Monitoring & Analytics
 * Tracks bfcache hit rates and restoration performance
 * @see https://web.dev/articles/bfcache
 */

import { gtag } from "./analytics";
import { trackUmamiPageView } from "./umamiAnalytics";

/**
 * bfcache metrics interface
 */
export interface BFCacheMetrics {
	/** Whether the page was restored from bfcache */
	wasRestored: boolean;
	/** Navigation type: navigate, reload, back_forward, prerender */
	navigationType: string;
	/** Time taken to restore from bfcache in milliseconds */
	restorationTime: number;
	/** Page path that was restored */
	pagePath: string;
	/** Timestamp of the restoration event */
	timestamp: number;
}

/**
 * Reasons why bfcache might not be used
 */
export interface NotRestoredReasons {
	/** Root document reasons */
	src?: string;
	/** Individual frame reasons */
	urls?: Array<{
		url: string;
		reasons: string[];
	}>;
	/** Children frame reasons */
	children?: NotRestoredReasons[];
}

/**
 * Check if the current page load is a bfcache restoration
 */
export const isBFCacheRestoration = (): boolean => {
	if (typeof window === "undefined") return false;

	const navEntries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
	if (navEntries.length > 0) {
		return navEntries[0].type === "back_forward";
	}

	// Fallback for older browsers
	return performance?.navigation?.type === 2;
};

/**
 * Get navigation type from Performance API
 */
export const getNavigationType = (): string => {
	if (typeof window === "undefined") return "unknown";

	const navEntries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
	if (navEntries.length > 0) {
		return navEntries[0].type;
	}

	// Fallback
	const legacyType = performance.navigation?.type;
	switch (legacyType) {
		case 0:
			return "navigate";
		case 1:
			return "reload";
		case 2:
			return "back_forward";
		case 255:
			return "prerender";
		default:
			return "unknown";
	}
};

/**
 * Get notRestoredReasons if available (Chrome 123+)
 */
export const getNotRestoredReasons = (): NotRestoredReasons | null => {
	if (typeof window === "undefined") return null;

	const navEntries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
	if (navEntries.length > 0 && "notRestoredReasons" in navEntries[0]) {
		return (navEntries[0] as any).notRestoredReasons ?? null;
	}

	return null;
};

/**
 * Track bfcache hit event
 * @param event - PageTransitionEvent from pageshow
 */
export const trackBFCacheHit = (event: PageTransitionEvent): void => {
	const metrics: BFCacheMetrics = {
		wasRestored: event.persisted,
		navigationType: getNavigationType(),
		restorationTime: performance.now(),
		pagePath: window.location.pathname,
		timestamp: Date.now(),
	};

	// Send to GA4
	gtag("event", "bfcache_status", {
		bfcache_restored: metrics.wasRestored,
		navigation_type: metrics.navigationType,
		page_path: metrics.pagePath,
		restoration_time_ms: Math.round(metrics.restorationTime),
	});

	// Log in development
	if (process.env.NODE_ENV === "development") {
		console.log(
			"[bfcache]",
			metrics.wasRestored ? "✅ Restored from bfcache" : "❌ Not restored",
			metrics
		);
	}
};

/**
 * Track bfcache eligibility issues
 * @param reasons - NotRestoredReasons from Performance API
 */
export const trackBFCacheNotRestored = (reasons: NotRestoredReasons | null): void => {
	if (!reasons) return;

	const extractReasons = (data: NotRestoredReasons): string[] => {
		const allReasons: string[] = [];

		if (data.src) {
			allReasons.push(`root: ${data.src}`);
		}

		if (data.urls) {
			data.urls.forEach((item) => {
				allReasons.push(`${item.url}: ${item.reasons.join(", ")}`);
			});
		}

		if (data.children) {
			data.children.forEach((child) => {
				allReasons.push(...extractReasons(child));
			});
		}

		return allReasons;
	};

	const reasonList = extractReasons(reasons);

	// Send to GA4
	gtag("event", "bfcache_not_restored", {
		reasons: reasonList.join("; "),
		reason_count: reasonList.length,
		page_path: window.location.pathname,
	});

	// Log in development
	if (process.env.NODE_ENV === "development") {
		console.warn("[bfcache] Not restored reasons:", reasonList);
	}
};

/**
 * bfcache event handler for pageshow event
 * Use this in _app.tsx to track bfcache restorations
 */
export const handlePageShow = (event: PageTransitionEvent): void => {
	trackBFCacheHit(event);

	// Track notRestoredReasons if page wasn't restored
	if (!event.persisted) {
		const reasons = getNotRestoredReasons();
		if (reasons) {
			trackBFCacheNotRestored(reasons);
		}
	}
};

/**
 * Initialize bfcache monitoring
 * Call this once in _app.tsx
 */
export const initBFCacheMonitoring = (): (() => void) | void => {
	if (typeof window === "undefined") return;

	const handlePageshow = (event: PageTransitionEvent) => {
		handlePageShow(event);

		// Re-track page view on bfcache restoration for accurate analytics
		if (event.persisted) {
			trackUmamiPageView(window.location.pathname, document.title);
		}
	};

	window.addEventListener("pageshow", handlePageshow);

	// Return cleanup function
	return () => {
		window.removeEventListener("pageshow", handlePageshow);
	};
};

/**
 * Check if bfcache is supported in the current browser
 */
export const isBFCacheSupported = (): boolean => {
	if (typeof window === "undefined") return false;
	return "onpageshow" in window;
};

/**
 * Get bfcache support status for analytics
 */
export const getBFCacheSupportStatus = (): {
	supported: boolean;
	restored: boolean;
	navigationType: string;
} => {
	return {
		supported: isBFCacheSupported(),
		restored: isBFCacheRestoration(),
		navigationType: getNavigationType(),
	};
};

const BfCacheMonitor = {
	initBFCacheMonitoring,
	trackBFCacheHit,
	trackBFCacheNotRestored,
	handlePageShow,
	isBFCacheSupported,
	isBFCacheRestoration,
	getNavigationType,
	getNotRestoredReasons,
	getBFCacheSupportStatus,
};

export default BfCacheMonitor;
