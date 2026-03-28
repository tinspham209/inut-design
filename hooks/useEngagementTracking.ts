import { trackTimeOnPage } from "@/utils/analytics";
import { useEffect } from "react";

/**
 * Hook: useEngagementTracking
 * Tracks scroll depth (25%, 50%, 75%, 100%) and time on page (when unmounts)
 * Dual tracking: GA4 + Umami
 *
 * Usage:
 * const start = useEngagementTracking("product_detail");
 */
export const useEngagementTracking = (pageName: string) => {
	useEffect(() => {
		const startTime = Date.now();
		let maxDepthReported = 0; // Highest milestone reported

		const milestones = [25, 50, 75, 100];

		const handleScroll = () => {
			const scrollTop = window.scrollY || document.documentElement.scrollTop;
			const docHeight = document.documentElement.scrollHeight - window.innerHeight;
			if (docHeight <= 0) return; // Avoid division by zero
			const scrolledPercent = Math.round((scrollTop / docHeight) * 100);

			// Find the highest milestone reached but not yet reported
			for (let i = milestones.length - 1; i >= 0; i--) {
				const m = milestones[i];
				if (scrolledPercent >= m && m > maxDepthReported) {
					maxDepthReported = m;
					// Only track at 100% for GA4 to reduce noise
					if (m === 100) {
						// trackUmamiScrollDepth(m);

						// GA4 custom event mapping using existing generic event tracking
						// We send as engagement event
						// eslint-disable-next-line camelcase
						window.gtag && window.gtag("event", "scroll_depth", { depth_percentage: 100 });
					}
					break;
				}
			}
		};

		window.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			window.removeEventListener("scroll", handleScroll);
			const durationSeconds = Math.floor((Date.now() - startTime) / 1000);
			trackTimeOnPage(pageName, durationSeconds);
		};
	}, [pageName]);

	return null; // Just a behavioral hook
};

export default useEngagementTracking;
