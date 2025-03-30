import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";

const gtag = "G-0FFVD3N1QG";

export function GoogleTagSchema() {
	return (
		<>
			<GoogleAnalytics gaId={gtag} />
			<GoogleTagManager gtmId="GT-KDTMJQL" />
		</>
	);
}
