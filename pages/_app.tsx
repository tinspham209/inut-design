import axiosClient from '@/api/axios-client';
import { EmptyLayout } from '@/components/layout';
import { AppPropsWithLayout } from '@/models';
import { createEmotionCache, theme } from '@/utils';
import { CacheProvider } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { AnimatePresence } from 'framer-motion';
import { SWRConfig } from 'swr';
import '../styles/globals.css';
import '../styles/prism.css';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

function MyApp({
	Component,
	pageProps,
	emotionCache = clientSideEmotionCache,
}: AppPropsWithLayout) {
	const Layout = Component.Layout ?? EmptyLayout;

	return (
		<CacheProvider value={emotionCache}>
			<ThemeProvider theme={theme}>
				<CssBaseline />

				<SWRConfig value={{ fetcher: (url) => axiosClient.get(url), shouldRetryOnError: false }}>
					<Layout>
						<AnimatePresence exitBeforeEnter initial={true}>
							<Component {...pageProps} />
						</AnimatePresence>
					</Layout>
				</SWRConfig>
			</ThemeProvider>
		</CacheProvider>
	);
}
export default MyApp;
