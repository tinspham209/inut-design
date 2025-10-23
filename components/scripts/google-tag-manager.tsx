import envConst from "@/utils/env-const";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";

const GA_MEASUREMENT_ID = envConst.GA_MEASUREMENT_ID;
const GTM_ID = envConst.GTM_ID;

export function GoogleTagSchema() {
	// Only render in production
	if (envConst.NODE_ENV !== "production") {
		return null;
	}

	return (
		<>
			{GA_MEASUREMENT_ID && <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />}
			{GTM_ID && <GoogleTagManager gtmId={GTM_ID} />}
		</>
	);
}
