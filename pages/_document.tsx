/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	FacebookChatPlugin,
	GoogleTagSchema,
	jsonSearchSchema,
	scriptFacebookChatPlugin,
} from "@/components/scripts";
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

					<meta httpEquiv="X-UA-Compatible" content="ie=edge" />
					{/* <SearchSchema /> */}
					<Script strategy="afterInteractive" id="schema" type="application/ld+json">
						{`${jsonSearchSchema}`}
					</Script>

					<Script strategy="afterInteractive" id="fb-chatbox-sdk">
						{`${scriptFacebookChatPlugin}`}
					</Script>

					<Script
						strategy="afterInteractive"
						async
						src={`https://www.googletagmanager.com/gtag/js?id=G-0FFVD3N1QG`}
					/>

					<Script
						id="gtag-init"
						strategy="afterInteractive"
						dangerouslySetInnerHTML={{
							__html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-0FFVD3N1QG', {
              page_path: window.location.pathname,
            });
          `,
						}}
					/>

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
