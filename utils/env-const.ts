const envConst = {
	NODE_ENV: process.env.NODE_ENV,
	GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
	GTM_ID: process.env.NEXT_PUBLIC_GTM_ID,

	FACEBOOK_PAGE_ID: process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID,
	ENABLE_FB_CHAT: process.env.NEXT_PUBLIC_ENABLE_FB_CHAT,

	ENABLE_UMAMI: process.env.NEXT_PUBLIC_ENABLE_UMAMI,
	NEXT_PUBLIC_ENABLE_ZALO_PHONE_CHECK: process.env.NEXT_PUBLIC_ENABLE_ZALO_PHONE_CHECK,
	UMAMI_WEBSITE_ID: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
	UMAMI_HOST_URL: process.env.NEXT_PUBLIC_UMAMI_HOST_URL || "https://cloud.umami.is",
};

export const isZaloPhoneCheckEnabled = (): boolean =>
	envConst.NEXT_PUBLIC_ENABLE_ZALO_PHONE_CHECK?.toLowerCase() !== "false";

export default envConst;
