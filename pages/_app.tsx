import axiosClient from "@/api/axios-client";
import ScrollToBottom from "@/components/common/scrollToBottom";
import { EmptyLayout } from "@/components/layout";
import { AppPropsWithLayout } from "@/models";
import { createEmotionCache, theme } from "@/utils";
import { CacheProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { AnimatePresence } from "framer-motion";
import { SWRConfig } from "swr";
import { Toaster } from "react-hot-toast";
import "../styles/globals.css";
import "../styles/prism.css";
import { Analytics } from "@vercel/analytics/react";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

function MyApp({
	Component,
	pageProps,
	emotionCache = clientSideEmotionCache,
}: AppPropsWithLayout) {
	const Layout = Component.Layout ?? EmptyLayout;

	return (
		<>
			<CacheProvider value={emotionCache}>
				<ThemeProvider theme={theme}>
					<CssBaseline />

					<AnimatePresence mode="wait" initial={true}>
						<SWRConfig
							value={{ fetcher: (url) => axiosClient.get(url), shouldRetryOnError: false }}
						>
							<Layout>
								<Component {...pageProps} />
								<ScrollToBottom />
								<Toaster />
							</Layout>
						</SWRConfig>
					</AnimatePresence>
				</ThemeProvider>
			</CacheProvider>
			<Analytics />
		</>
	);
}
export default MyApp;
