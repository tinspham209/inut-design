/* eslint-disable @typescript-eslint/no-explicit-any */
import { FacebookChatPlugin, GoogleTagSchema, jsonSearchSchema } from "@/components/scripts";
import { createEmotionCache, theme } from "@/utils";
import createEmotionServer from "@emotion/server/create-instance";
import Document, { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";
import * as React from "react";

export default class MyDocument extends Document {
	render() {
		return (
			<Html lang="en">
				<Head>
					{/* PWA primary color */}
					<meta name="theme-color" content={theme.palette.primary.main} />
					<link rel="icon" href="/static/favicon.ico" />
					<link rel="shortcut icon" href="/static/favicon.ico" type="image/x-icon" />
					<meta
						content="INUT Design, Inut skin, inutdesign, inutskin, skin laptop, inutsticker, inut sticker"
						name="keywords"
					/>

					<link rel="preconnect" href="https://fonts.googleapis.com" />
					<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
					<link
						href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
						rel="stylesheet"
					/>
					<link
						href="https://fonts.googleapis.com/icon?family=Material+Icons"
						rel="stylesheet"
					/>
					<link
						href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Serif+Display:ital@0;1&display=swap"
						rel="stylesheet"
					/>

					<meta httpEquiv="X-UA-Compatible" content="ie=edge" />
					{/* <SearchSchema /> */}
					<Script strategy="afterInteractive" id="schema" type="application/ld+json">
						{`${jsonSearchSchema}`}
					</Script>

					{/* Facebook Chat SDK now loaded dynamically via component (see facebook-plugin.tsx) */}

					{/* Google Analytics & GTM are now loaded via GoogleTagSchema component in body */}

					<Script
						strategy="afterInteractive"
						defer
						src="https://cloud.umami.is/script.js"
						data-website-id="2d970e4e-411e-4b9e-b6ee-c48c2b040f56"
					/>

					<meta name="emotion-insertion-point" content="" />
					{(this.props as any).emotionStyleTags}
				</Head>
				<body>
					<Main />
					<NextScript />
					<FacebookChatPlugin />
					<GoogleTagSchema />
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
