/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";
import { trackUmamiScrollDepth, trackUmamiTimeOnPage } from "@/utils/umamiAnalytics";

/**
 * Hook: Tracks scroll depth percentages at thresholds (25%, 50%, 75%, 90%).
 * Sends only once per threshold.
 */
export const useUmamiScrollDepth = (): void => {
	useEffect(() => {
		const thresholds = [25, 50, 75, 90];
		const fired = new Set<number>();

		const onScroll = () => {
			const doc = document.documentElement;
			const scrollTop = window.scrollY || doc.scrollTop;
			const scrollHeight = doc.scrollHeight - doc.clientHeight;
			if (scrollHeight <= 0) return;
			const percent = Math.round((scrollTop / scrollHeight) * 100);
			thresholds.forEach((t) => {
				if (percent >= t && !fired.has(t)) {
					fired.add(t);
					trackUmamiScrollDepth(t);
				}
			});
		};

		window.addEventListener("scroll", onScroll, { passive: true });
		onScroll(); // initial check for short pages
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
};

/**
 * Hook: Tracks time on page (seconds) when component unmounts.
 * pageName: logical identifier (e.g., 'product_detail', 'homepage').
 */
export const useUmamiTimeOnPage = (pageName: string): void => {
	const startRef = useRef<number>(Date.now());
	useEffect(() => {
		const startTime = startRef.current; // capture for cleanup
		return () => {
			const seconds = Math.floor((Date.now() - startTime) / 1000);
			if (seconds >= 2) {
				trackUmamiTimeOnPage(pageName, seconds);
			}
		};
	}, [pageName]);
};

/**
 * Combined convenience hook for both scroll depth and time-on-page.
 */
export const useUmamiEngagement = (pageName: string): void => {
	// TODO: remove this due to performance concerns
	// useUmamiScrollDepth();
	useUmamiTimeOnPage(pageName);
};

export default useUmamiEngagement;
