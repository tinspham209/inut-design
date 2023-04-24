/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	FacebookChatPlugin,
	GoogleTagSchemaNoScript,
	jsonSearchSchema,
	scriptFacebookChatPlugin,
	scriptgoogleTagSchema,
} from "@/components/scripts";
import { createEmotionCache, theme } from "@/utils";
import createEmotionServer from "@emotion/server/create-instance";
import Document, { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";
import * as React from "react";
import { Analytics } from "@vercel/analytics/react";

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
						content="INUT Design, Inut skin, inutdesign, inutskin, skin laptop"
						name="keywords"
					/>

					<link
						rel="stylesheet"
						href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
					/>
					<link
						href="https://fonts.googleapis.com/css2?family=Bangers&display=swap"
						rel="stylesheet"
					/>

					<meta httpEquiv="X-UA-Compatible" content="ie=edge" />
					{/* <SearchSchema /> */}
					<Script strategy="afterInteractive" id="schema" type="application/ld+json">
						{`${jsonSearchSchema}`}
					</Script>
					<Script strategy="afterInteractive" id="google-tag-manager">
						{`${scriptgoogleTagSchema}`}
					</Script>

					<Script strategy="afterInteractive" id="fb-chatbox-sdk">
						{`${scriptFacebookChatPlugin}`}
					</Script>

					<meta name="emotion-insertion-point" content="" />
					{(this.props as any).emotionStyleTags}
				</Head>
				<body>
					<Main />
					<Analytics />
					<NextScript />

					<FacebookChatPlugin />

					<GoogleTagSchemaNoScript />
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
