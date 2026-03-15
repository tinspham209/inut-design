import axiosClient from "@/api/axios-client";
import { EmptyLayout } from "@/components/layout";
import dynamic from "next/dynamic";

import { AppPropsWithLayout } from "@/models";
import { createEmotionCache, theme, trackPageView } from "@/utils";
import { CacheProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { Analytics } from "@vercel/analytics/react";
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

import useEngagementTracking from "@/hooks/useEngagementTracking";
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

	return (
		<>
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
		</>
	);
}
export default MyApp;
