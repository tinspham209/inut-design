import axiosClient from "@/api/axios-client";
import { EmptyLayout } from "@/components/layout";
import { FacebookChatPlugin, GoogleTagSchema } from "@/components/scripts";
import { SpeculationRulesScript } from "@/components/scripts/speculation-rules";
import useEngagementTracking from "@/hooks/useEngagementTracking";
import { AppPropsWithLayout } from "@/models";
import { createEmotionCache, theme, trackPageView } from "@/utils";
import { initBFCacheMonitoring } from "@/utils/bfcache-monitor";
import { initPrefetchFallback } from "@/utils/prefetch-fallback";
import { initSpeculationMonitoring } from "@/utils/speculation-monitor";
import { initializeConsentMode } from "@/utils/consent";
import { CacheProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import Head from "next/head";
import Script from "next/script";
import { useRouter } from "next/router";
import { useEffect, useState, type ReactNode } from "react";
import { isCreativaPath, trackCreativaPage } from "@/utils/creativa/analytics";
import { SWRConfig } from "swr";
import { ProductCartWrapper } from "@/components/cart/CartWrapper";
import { DialogContainer } from "@/components/common";
import { Toaster } from "react-hot-toast";
import { getUmamiRuntimeConfig } from "@/utils/public-env";

import "../styles/globals.css";
import "../styles/prism.css";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();
const umami = getUmamiRuntimeConfig(
	process.env.NEXT_PUBLIC_ENABLE_UMAMI,
	process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
	process.env.NEXT_PUBLIC_UMAMI_HOST_URL,
);

function MountedOnly({ children }: { children: ReactNode }) {
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);
	return mounted ? children : null;
}

function MyApp({
	Component,
	pageProps: { ...pageProps },
	emotionCache = clientSideEmotionCache,
}: AppPropsWithLayout & {
	pageProps;
}) {
	const Layout = Component.Layout ?? EmptyLayout;
	const router = useRouter();

	// Engagement tracking (scroll depth + time on page per route)
	useEngagementTracking(router.pathname, !isCreativaPath(router.pathname));
	// useUmamiEngagement(router.pathname);

	// Track page views on route changes
	useEffect(() => {
		const handleRouteChange = (url: string) => {
			if (isCreativaPath(url)) trackCreativaPage(url);
			else trackPageView(url);
		};

		// Track initial page load
		if (isCreativaPath(router.pathname)) trackCreativaPage(router.asPath);
		else trackPageView(router.pathname);

		// Subscribe to route changes
		router.events.on("routeChangeComplete", handleRouteChange);

		// Cleanup
		return () => {
			router.events.off("routeChangeComplete", handleRouteChange);
		};
		// Route completion is the owner; do not repeat initialization on every pathname change.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router.events]);

	// Initialize consent mode before analytics load
	useEffect(() => {
		initializeConsentMode();
	}, []);

	// Initialize bfcache and speculation monitoring
	useEffect(() => {
		const cleanupBFCache = initBFCacheMonitoring();
		const cleanupSpeculation = initSpeculationMonitoring();
		const cleanupPrefetch = initPrefetchFallback();

		return () => {
			if (typeof cleanupBFCache === "function") cleanupBFCache();
			if (typeof cleanupSpeculation === "function") cleanupSpeculation();
			if (typeof cleanupPrefetch === "function") cleanupPrefetch();
		};
	}, []);

	return (
		<>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
			</Head>
			<CacheProvider value={emotionCache}>
				<ThemeProvider theme={theme}>
					<CssBaseline />

					<SWRConfig
						value={{
							fetcher: (url) => axiosClient.get(url),
							shouldRetryOnError: true,
							provider: () => new Map(),
						}}
					>
						<Layout>
							<Component {...pageProps} />
							<MountedOnly>
								<ProductCartWrapper />
								<Toaster />
								<DialogContainer />
							</MountedOnly>
						</Layout>
					</SWRConfig>
				</ThemeProvider>
			</CacheProvider>
			{!isCreativaPath(router.pathname) && <FacebookChatPlugin />}
			<GoogleTagSchema />
			{umami.configured && (
				<Script
					strategy="afterInteractive"
					src={umami.scriptUrl}
					data-website-id={umami.websiteId}
					data-before-send="creativaBeforeSend"
				/>
			)}
			<SpeculationRulesScript />
		</>
	);
}
export default MyApp;
