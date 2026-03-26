/**
 * Prefetch Fallback for Browsers Without Speculation Rules Support
 * Uses traditional <link rel="prefetch"> for older browsers
 * @see https://web.dev/articles/speculation-rules
 */

import { getFallbackPrefetchUrls } from "./speculation-rules";

/**
 * Check if the browser supports <link rel="prefetch">
 */
export const supportsPrefetch = (): boolean => {
	if (typeof document === "undefined") return false;

	const link = document.createElement("link");
	return link.relList?.supports?.("prefetch") ?? false;
};

/**
 * Apply fallback prefetch using <link rel="prefetch">
 * @param urls - Array of URLs to prefetch
 */
export const applyFallbackPrefetch = (urls?: string[]): void => {
	if (typeof document === "undefined") return;

	const urlsToPrefetch = urls || getFallbackPrefetchUrls();

	urlsToPrefetch.forEach((url) => {
		// Check if prefetch link already exists
		const existingLink = document.querySelector(`link[rel="prefetch"][href="${url}"]`);
		if (existingLink) return;

		const link = document.createElement("link");
		link.rel = "prefetch";
		link.href = url;
		link.as = "document";

		// Add fetchpriority hint for supported browsers
		if ("fetchPriority" in HTMLLinkElement.prototype) {
			(link as any).fetchPriority = "low";
		}

		document.head.appendChild(link);
	});

	if (process.env.NODE_ENV === "development") {
		console.log("[prefetch-fallback] Applied fallback prefetch for", urlsToPrefetch.length, "URLs");
	}
};

/**
 * Apply fallback prefetch for specific page type
 * @param pageType - Type of page: 'home', 'products', 'services', 'blog'
 */
export const applyContextualPrefetch = (pageType: string): void => {
	const prefetchMap: Record<string, string[]> = {
		home: [
			"/san-pham/skin-laptop",
			"/san-pham/skin-nut-phim",
			"/san-pham/lighters",
			"/services",
			"/contact",
		],
		products: [
			"/san-pham/skin-laptop",
			"/san-pham/skin-nut-phim",
			"/san-pham/lighters",
			"/contact/form",
		],
		services: [
			"/services/sticker",
			"/services/ca-nhan-hoa",
			"/services/an-pham-luu-niem",
			"/services/an-pham-van-phong",
			"/contact/form",
		],
		blog: ["/san-pham", "/services", "/contact"],
	};

	const urls = prefetchMap[pageType] || prefetchMap.home;
	applyFallbackPrefetch(urls);
};

/**
 * Remove prefetch links (useful for cleanup)
 * @param urls - Optional array of URLs to remove. If not provided, removes all prefetch links.
 */
export const removePrefetchLinks = (urls?: string[]): void => {
	if (typeof document === "undefined") return;

	const selector = urls
		? urls.map((url) => `link[rel="prefetch"][href="${url}"]`).join(", ")
		: 'link[rel="prefetch"]';

	const links = document.querySelectorAll(selector);
	links.forEach((link) => link.remove());

	if (process.env.NODE_ENV === "development") {
		console.log("[prefetch-fallback] Removed", links.length, "prefetch links");
	}
};

/**
 * Prefetch on hover for links (progressive enhancement)
 * @param selector - CSS selector for links to add hover prefetch
 * @param delay - Delay in ms before prefetching on hover
 */
export const initHoverPrefetch = (selector = 'a[href^="/"]', delay = 100): (() => void) | void => {
	if (typeof document === "undefined") return;

	const prefetchedUrls = new Set<string>();
	let hoverTimer: ReturnType<typeof setTimeout> | null = null;

	const handleMouseEnter = (event: MouseEvent) => {
		const target = event.target as HTMLAnchorElement;
		if (target.tagName !== "A") return;

		const href = target.getAttribute("href");
		if (!href || href.startsWith("http") || href.startsWith("#") || prefetchedUrls.has(href))
			return;

		hoverTimer = setTimeout(() => {
			applyFallbackPrefetch([href]);
			prefetchedUrls.add(href);
		}, delay);
	};

	const handleMouseLeave = () => {
		if (hoverTimer) {
			clearTimeout(hoverTimer);
			hoverTimer = null;
		}
	};

	const links = document.querySelectorAll(selector);
	links.forEach((link) => {
		link.addEventListener("mouseenter", handleMouseEnter);
		link.addEventListener("mouseleave", handleMouseLeave);
	});

	// Return cleanup function
	return () => {
		links.forEach((link) => {
			link.removeEventListener("mouseenter", handleMouseEnter);
			link.removeEventListener("mouseleave", handleMouseLeave);
		});
		if (hoverTimer) clearTimeout(hoverTimer);
	};
};

/**
 * Initialize prefetch fallback system
 * Only applies if browser doesn't support speculation rules
 */
export const initPrefetchFallback = (): (() => void) | void => {
	if (typeof window === "undefined") return;

	// Check if speculation rules are supported
	const hasSpeculationSupport = HTMLScriptElement.supports?.("speculationrules") ?? false;

	if (hasSpeculationSupport) {
		if (process.env.NODE_ENV === "development") {
			console.log("[prefetch-fallback] Browser supports speculation rules, skipping fallback");
		}
		return;
	}

	// Apply fallback prefetch
	applyFallbackPrefetch();

	// Initialize hover prefetch for progressive enhancement
	const cleanupHover = initHoverPrefetch();

	return () => {
		if (typeof cleanupHover === "function") cleanupHover();
		removePrefetchLinks();
	};
};

const PrefetchFallback = {
	initPrefetchFallback,
	applyFallbackPrefetch,
	applyContextualPrefetch,
	removePrefetchLinks,
	initHoverPrefetch,
	supportsPrefetch,
};

export default PrefetchFallback;
