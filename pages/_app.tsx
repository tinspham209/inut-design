import axiosClient from "@/api/axios-client";
import { ProductCartWrapper } from "@/components/cart/CartWrapper";
import { DialogContainer } from "@/components/common";
import { EmptyLayout } from "@/components/layout";
import { AppPropsWithLayout } from "@/models";
import { createEmotionCache, theme, trackPageView } from "@/utils";
import { useUmamiEngagement } from "@/hooks/useUmamiEngagement";
import { CacheProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { Analytics } from "@vercel/analytics/react";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { SWRConfig } from "swr";

import "../styles/globals.css";
import "../styles/prism.css";
import useEngagementTracking from "@/hooks/useEngagementTracking";

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

					<AnimatePresence mode="wait" initial={true}>
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
					</AnimatePresence>
				</ThemeProvider>
			</CacheProvider>
			<Analytics mode="production" />
		</>
	);
}
export default MyApp;
