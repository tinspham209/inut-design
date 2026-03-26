import { onCLS, onFCP, onINP, onLCP, onTTFB } from "web-vitals";
import { umami } from "./umamiAnalytics";
import { isBFCacheRestoration } from "./bfcache-monitor";
import { getSpeculationStatus } from "./speculation-monitor";

type MetricName = "CLS" | "FCP" | "INP" | "LCP" | "TTFB";

/**
 * Sends web vitals metrics to Umami analytics.
 * CLS is multiplied by 1000 to store as an integer (Umami convention for float metrics).
 * Includes bfcache and prerender context for richer analytics.
 */
function sendToUmami(name: MetricName, value: number) {
	const roundedValue = Math.round(name === "CLS" ? value * 1000 : value);
	const isRestored = isBFCacheRestoration();
	const { prerendered } = getSpeculationStatus();

	umami.track(name, {
		value: roundedValue,
		bfcache_restored: isRestored,
		prerendered: prerendered,
	});
}

/**
 * Initializes web-vitals reporting.
 * Should be called once in _app.tsx.
 */
export function reportWebVitals() {
	if (typeof window === "undefined") return;

	onCLS(({ name, value }) => sendToUmami(name as MetricName, value));
	onFCP(({ name, value }) => sendToUmami(name as MetricName, value));
	onINP(({ name, value }) => sendToUmami(name as MetricName, value));
	onLCP(({ name, value }) => sendToUmami(name as MetricName, value));
	onTTFB(({ name, value }) => sendToUmami(name as MetricName, value));
}
