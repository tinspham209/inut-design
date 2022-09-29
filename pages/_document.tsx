/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import createEmotionServer from "@emotion/server/create-instance";
import { createEmotionCache, theme } from "@/utils";
import Script from "next/script";

export default class MyDocument extends Document {
	render() {
		return (
			<Html lang="en">
				<Head>
					{/* PWA primary color */}
					<meta name="theme-color" content={theme.palette.primary.main} />
					<link rel="icon" href="/static/favicon.ico" />
					<link rel="shortcut icon" href="/static/favicon.ico" type="image/x-icon" />

					<link
						rel="stylesheet"
						href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
					/>
					<link
						href="https://fonts.googleapis.com/css2?family=Bangers&display=swap"
						rel="stylesheet"
					/>

					<meta httpEquiv="X-UA-Compatible" content="ie=edge" />

					<Script strategy="afterInteractive" id="schema" dangerouslySetInnerHTML={{
						__html: `{
							"@context": "http://schema.org",
							"@type": "WebSite",
							"name": "INUT Design - Tiệm may đo skin laptop theo yêu cầu, Cửa Hàng Thời Trang Dành Cho Laptop",
							"url": "https://inutdesign.com",
							"potentialAction": {
								"@type": "SearchAction",
							"target": "https://inutdesign.com/search?q={search_term_string}",
							"query-input": "required name=search_term_string"
						}`}}></Script>

					<meta name="emotion-insertion-point" content="" />
					{(this.props as any).emotionStyleTags}
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
