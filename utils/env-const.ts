const envConst = {
	NODE_ENV: process.env.NODE_ENV,
	SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,

	GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
	GTM_ID: process.env.NEXT_PUBLIC_GTM_ID,

	FACEBOOK_PAGE_ID: process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID,
	ENABLE_FB_CHAT: process.env.NEXT_PUBLIC_ENABLE_FB_CHAT,

	ENABLE_UMAMI: process.env.NEXT_PUBLIC_ENABLE_UMAMI,
	ENABLE_ZALO_PHONE_CHECK:
		process.env.NEXT_PUBLIC_ENABLE_ZALO_PHONE_CHECK || process.env.ENABLE_ZALO_PHONE_CHECK,
	UMAMI_WEBSITE_ID: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
	UMAMI_HOST_URL: process.env.NEXT_PUBLIC_UMAMI_HOST_URL || "https://cloud.umami.is",
};

export const isZaloPhoneCheckEnabled = (): boolean =>
	envConst.ENABLE_ZALO_PHONE_CHECK?.toLowerCase() !== "false";

export default envConst;
