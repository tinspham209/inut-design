import { GlobalSchema, StaticSpeculationRules } from "@/components/scripts";
import { COLOR_CODE, createEmotionCache } from "@/utils";
import createEmotionServer from "@emotion/server/create-instance";
import Document, { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";

export default class MyDocument extends Document {
	render() {
		return (
			<Html lang="vi">
				<Head>
					{/* PWA primary color */}
					<meta name="theme-color" content={COLOR_CODE.INK} />
					<link rel="icon" href="/static/favicon.ico" />
					<link rel="shortcut icon" href="/static/favicon.ico" type="image/x-icon" />
					<meta
						content="INUT Design, Inut skin, inutdesign, inutskin, skin laptop, inutsticker, inut sticker"
						name="keywords"
					/>

					<link rel="preconnect" href="https://fonts.googleapis.com" />
					<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
					<link
						rel="preload"
						as="style"
						href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;0,800;0,900;1,300;1,400;1,500;1,700&family=Roboto+Serif:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap"
					/>
					<link
						rel="preload"
						as="style"
						href="https://fonts.googleapis.com/icon?family=Material+Icons"
					/>
					<link
						href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;0,800;0,900;1,300;1,400;1,500;1,700&family=Roboto+Serif:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap"
						rel="stylesheet"
						media="print"
						onLoad={(e: any) => {
							e.target.media = "all";
						}}
					/>
					<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
					<noscript>
						<link
							href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;0,800;0,900;1,300;1,400;1,500;1,700&family=Roboto+Serif:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap"
							rel="stylesheet"
						/>
						<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
					</noscript>

					<meta httpEquiv="X-UA-Compatible" content="ie=edge" />
					<GlobalSchema />

					{/* Facebook Chat SDK now loaded dynamically via component (see facebook-plugin.tsx) */}

					{/* Google Analytics & GTM are now loaded via GoogleTagSchema component in body */}

					<Script
						strategy="lazyOnload"
						src="https://cloud.umami.is/script.js"
						data-website-id="2d970e4e-411e-4b9e-b6ee-c48c2b040f56"
					/>

					<meta name="emotion-insertion-point" content="" />
					{(this.props as any).emotionStyleTags}

					{/* Speculation Rules for bfcache and prefetch/prerender */}
					<StaticSpeculationRules />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

MyDocument.getInitialProps = async (ctx) => {
	const originalRenderPage = ctx.renderPage;

	const cache = createEmotionCache();
	const { extractCriticalToChunks } = createEmotionServer(cache);

	ctx.renderPage = () =>
		originalRenderPage({
			enhanceApp: (App: any) =>
				function EnhanceApp(props) {
					return <App emotionCache={cache} {...props} />;
				},
		});

	const initialProps = await Document.getInitialProps(ctx);
	const emotionStyles = extractCriticalToChunks(initialProps.html);
	const emotionStyleTags = emotionStyles.styles.map((style) => (
		<style
			data-emotion={`${style.key} ${style.ids.join(" ")}`}
			key={style.key}
			// eslint-disable-next-line react/no-danger
			dangerouslySetInnerHTML={{ __html: style.css }}
		/>
	));

	return {
		...initialProps,
		emotionStyleTags,
	};
};
