import { bindings, defineConfig, defineWorker } from "cf/config";

const deploymentChannel = process.env.DEPLOYMENT_CHANNEL === "preview" ? "preview" : "production";
const previewSiteUrl = process.env.PREVIEW_SITE_URL || "";

export default defineConfig({
	accountId: "2b0715e3577db65f2693d4dc58fd3b61",
	worker: defineWorker({
		name: "inutdesign-web",
		entrypoint: "./worker/index.ts",
		compatibilityDate: "2026-11-24",
		observability: {
			enabled: true,
			redactQueryString: true,
			logs: {
				enabled: true,
				invocationLogs: true,
				headSamplingRate: 0.1,
				persist: true,
			},
			traces: {
				enabled: false,
			},
		},
		workersDev: true,
		previewUrls: true,
		assets: {
			htmlHandling: "none",
			notFoundHandling: "none",
			runWorkerFirst: [
				"/*",
				"!/_next/static/*",
				"!/assets/*.avif",
				"!/branding/*.avif",
				"!/branding/*.jpg",
				"!/branding/*.webp",
				"!/creativa/*.avif",
				"!/creativa/*.jpg",
				"!/keychain/*.json",
				"!/keychain/*.png",
				"!/keychain/*.svg",
				"!/models/*.glb",
				"!/policies-terms/*.png",
				"!/services/*.avif",
				"!/static/*.ico",
				"!/cover-web.webp",
				"!/favicon.ico",
				"!/llms.txt",
				"!/prism.js",
				"!/search-index.json",
				...(deploymentChannel === "production" ? ["!/robots.txt", "!/sitemap.xml"] : []),
			],
		},
		env: {
			ASSETS: bindings.assets(),
			DEPLOYMENT_CHANNEL: bindings.text(deploymentChannel),
			PREVIEW_SITE_URL: bindings.text(previewSiteUrl),
			NEXT_PUBLIC_SITE_URL: bindings.text(
				process.env.NEXT_PUBLIC_SITE_URL || "https://inutdesign.com"
			),
			NEXT_PUBLIC_ALLOWED_ORIGINS: bindings.text(
				process.env.NEXT_PUBLIC_ALLOWED_ORIGINS || "https://inutdesign.com"
			),
			NEXT_PUBLIC_KEYCHAIN_BACKGROUND_REMOVAL_ENABLED: bindings.text(
				process.env.NEXT_PUBLIC_KEYCHAIN_BACKGROUND_REMOVAL_ENABLED || "false"
			),

			NEXT_PUBLIC_ENABLE_UMAMI: bindings.text(process.env.NEXT_PUBLIC_ENABLE_UMAMI || "true"),
			NEXT_PUBLIC_UMAMI_WEBSITE_ID: bindings.text(process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID || ""),
			NEXT_PUBLIC_UMAMI_HOST_URL: bindings.text(
				process.env.NEXT_PUBLIC_UMAMI_HOST_URL || "https://cloud.umami.is"
			),

			NEXT_PUBLIC_GA_MEASUREMENT_ID: bindings.text(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ""),
			NEXT_PUBLIC_GTM_ID: bindings.text(process.env.NEXT_PUBLIC_GTM_ID || ""),

			NEXT_PUBLIC_FACEBOOK_PAGE_ID: bindings.text(process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID || ""),
			NEXT_PUBLIC_ENABLE_FB_CHAT: bindings.text(process.env.NEXT_PUBLIC_ENABLE_FB_CHAT || "true"),
			NEXT_PUBLIC_ENABLE_ZALO_PHONE_CHECK: bindings.text(
				process.env.NEXT_PUBLIC_ENABLE_ZALO_PHONE_CHECK || "true"
			),

			NEXT_PUBLIC_SANITY_PROJECT_ID: bindings.text(
				process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ""
			),
			NEXT_PUBLIC_SANITY_DATASET: bindings.text(
				process.env.NEXT_PUBLIC_SANITY_DATASET || ""
			),
			SANITY_TOKEN: bindings.secret(),

			TELEGRAM_BOT_TOKEN: bindings.secret(),
			TELEGRAM_CHAT_ID: bindings.secret(),

			CREATIVA_TELEGRAM_BOT_TOKEN: bindings.secret(),

			TELEGRAM_MAX_RETRIES: bindings.text(process.env.TELEGRAM_MAX_RETRIES || "3"),
			TELEGRAM_RETRY_BASE_DELAY: bindings.text(process.env.TELEGRAM_RETRY_BASE_DELAY || "1000"),

			SPX_SYNC_SECRET: bindings.secret(),
			SPX_SYNC_TELEGRAM_BOT_TOKEN: bindings.secret(),
			SPX_SYNC_TELEGRAM_CHAT_ID: bindings.secret(),
			SPX_SYNC_FUNCTION_TIMEOUT_MS: bindings.text(
				process.env.SPX_SYNC_FUNCTION_TIMEOUT_MS || "30000"
			),
		},
	}),
});
