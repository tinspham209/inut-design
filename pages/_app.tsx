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
import { CacheProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { Analytics } from "@vercel/analytics/react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { SWRConfig } from "swr";

const ProductCartWrapper = dynamic(
	() => import("@/components/cart/CartWrapper").then((mod) => mod.ProductCartWrapper),
	{ ssr: false }
);
const DialogContainer = dynamic(
	() => import("@/components/common").then((mod) => mod.DialogContainer),
	{
		ssr: false,
	}
);
const Toaster = dynamic(() => import("react-hot-toast").then((mod) => mod.Toaster), {
	ssr: false,
});

import "../styles/globals.css";
import "../styles/prism.css";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

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
	useEngagementTracking(router.pathname);
	// useUmamiEngagement(router.pathname);

	// Track page views on route changes
	useEffect(() => {
		const handleRouteChange = (url: string) => {
			trackPageView(url);
		};

		// Track initial page load
		trackPageView(router.pathname);

		// Subscribe to route changes
		router.events.on("routeChangeComplete", handleRouteChange);

		// Cleanup
		return () => {
			router.events.off("routeChangeComplete", handleRouteChange);
		};
	}, [router.events, router.pathname]);

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
							<ProductCartWrapper />
							<Toaster />
							<DialogContainer />
						</Layout>
					</SWRConfig>
				</ThemeProvider>
			</CacheProvider>
			<Analytics mode="production" />
			<FacebookChatPlugin />
			<GoogleTagSchema />
			<SpeculationRulesScript />
		</>
	);
}
export default MyApp;
