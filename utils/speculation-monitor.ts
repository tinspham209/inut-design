/**
 * Speculation Rules Monitoring & Analytics
 * Tracks speculation rule effectiveness and prerender activation
 * @see https://developer.chrome.com/docs/web-platform/implementing-speculation-rules
 */

import { gtag } from "./analytics";
import { supportsSpeculationRules } from "./speculation-rules";

/**
 * Speculation metrics interface
 */
export interface SpeculationMetrics {
	/** Whether browser supports speculation rules */
	browserSupported: boolean;
	/** Whether current page was prerendered */
	wasPrerendered: boolean;
	/** Activation time in ms (for prerendered pages) */
	activationTime: number;
	/** Page path */
	pagePath: string;
	/** Timestamp of the event */
	timestamp: number;
}

/**
 * Prefetch hit metrics
 */
export interface PrefetchMetrics {
	/** URL that was prefetched */
	url: string;
	/** Whether the prefetch was used */
	wasUsed: boolean;
	/** Time saved in milliseconds */
	timeSaved: number;
}

/**
 * Check if the current page was prerendered
 */
export const wasPagePrerendered = (): boolean => {
	if (typeof document === "undefined") return false;

	// Check if document.prerendering exists (Chrome 121+)
	if ("prerendering" in document) {
		return (document as any).prerendering === true;
	}

	// Check performance entries
	const navEntries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
	if (navEntries.length > 0) {
		return navEntries[0].activationStart > 0;
	}

	return false;
};

/**
 * Get prerender activation time
 */
export const getPrerenderActivationTime = (): number => {
	const navEntries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
	if (navEntries.length > 0 && navEntries[0].activationStart > 0) {
		return navEntries[0].activationStart;
	}
	return 0;
};

/**
 * Track speculation rules browser support
 */
export const trackSpeculationSupport = (): void => {
	const supported = supportsSpeculationRules();

	gtag("event", "speculation_support", {
		speculation_supported: supported,
		browser: getBrowserName(),
		page_path: typeof window !== "undefined" ? window.location.pathname : "",
	});

	// Log in development
	if (process.env.NODE_ENV === "development") {
		console.log(
			"[speculation]",
			supported
				? "✅ Browser supports speculation rules"
				: "❌ Browser does not support speculation rules"
		);
	}
};

/**
 * Track prerender activation event
 * @param activationTime - Time taken to activate the prerendered page
 */
export const trackPrerenderActivated = (activationTime: number): void => {
	gtag("event", "prerender_activated", {
		activation_time_ms: Math.round(activationTime),
		page_path: window.location.pathname,
		timestamp: Date.now(),
	});

	// Log in development
	if (process.env.NODE_ENV === "development") {
		console.log("[speculation] Prerender activated in", Math.round(activationTime), "ms");
	}
};

/**
 * Track prefetch effectiveness
 * @param metrics - Prefetch metrics
 */
export const trackPrefetchEffectiveness = (metrics: PrefetchMetrics): void => {
	gtag("event", "prefetch_effectiveness", {
		prefetch_url: metrics.url,
		prefetch_used: metrics.wasUsed,
		time_saved_ms: Math.round(metrics.timeSaved),
	});
};

/**
 * Initialize prerender monitoring
 * Listen for prerenderingchange event
 */
export const initPrerenderMonitoring = (): (() => void) | void => {
	if (typeof document === "undefined") return;

	// Check if prerendering API is available
	if ("prerendering" in document) {
		const handlePrerenderingChange = () => {
			const activationTime = getPrerenderActivationTime() || performance.now();
			trackPrerenderActivated(activationTime);
		};

		document.addEventListener("prerenderingchange", handlePrerenderingChange);

		return () => {
			document.removeEventListener("prerenderingchange", handlePrerenderingChange);
		};
	}
};

/**
 * Initialize all speculation monitoring
 * Call this once in _app.tsx
 */
export const initSpeculationMonitoring = (): (() => void) | void => {
	if (typeof window === "undefined") return;

	// Track browser support
	trackSpeculationSupport();

	// Track if page was prerendered
	if (wasPagePrerendered()) {
		const activationTime = getPrerenderActivationTime();
		trackPrerenderActivated(activationTime);
	}

	// Initialize prerender monitoring
	const cleanupPrerender = initPrerenderMonitoring();

	return () => {
		if (typeof cleanupPrerender === "function") cleanupPrerender();
	};
};

/**
 * Get browser name for analytics
 */
const getBrowserName = (): string => {
	if (typeof navigator === "undefined") return "unknown";

	const ua = navigator.userAgent;

	if (ua.includes("Chrome") && !ua.includes("Edg")) return "chrome";
	if (ua.includes("Firefox")) return "firefox";
	if (ua.includes("Safari") && !ua.includes("Chrome")) return "safari";
	if (ua.includes("Edg")) return "edge";

	return "other";
};

/**
 * Comprehensive speculation status for analytics
 */
export const getSpeculationStatus = (): {
	supported: boolean;
	prerendered: boolean;
	activationTime: number;
	browser: string;
} => {
	return {
		supported: supportsSpeculationRules(),
		prerendered: wasPagePrerendered(),
		activationTime: getPrerenderActivationTime(),
		browser: getBrowserName(),
	};
};

const SpeculationMonitor = {
	initSpeculationMonitoring,
	trackSpeculationSupport,
	trackPrerenderActivated,
	trackPrefetchEffectiveness,
	wasPagePrerendered,
	getPrerenderActivationTime,
	getSpeculationStatus,
};

export default SpeculationMonitor;
