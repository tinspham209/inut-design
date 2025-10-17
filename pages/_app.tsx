import axiosClient from "@/api/axios-client";
import { ProductCartWrapper } from "@/components/cart/CartWrapper";
import { DialogContainer } from "@/components/common";
import { EmptyLayout } from "@/components/layout";
import { AppPropsWithLayout } from "@/models";
import { createEmotionCache, theme } from "@/utils";
import { CacheProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { Analytics } from "@vercel/analytics/react";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { SWRConfig } from "swr";
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
			<Analytics mode="auto" />
		</>
	);
}
export default MyApp;
