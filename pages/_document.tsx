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

					{/* Search Schema  */}
					<Script
						strategy="afterInteractive"
						id="schema"
						dangerouslySetInnerHTML={{
							__html: `{
							"@context": "http://schema.org/",
							"@type": "Product",
							"name": "INUT Design - Tiệm may đo skin laptop theo yêu cầu, Cửa Hàng Thời Trang Dành Cho Laptop",
							"description": "INUT Design - Cửa Hàng Thời Trang Dành Cho Laptop Tại Đà Nẵng",
							"url": "https://inutdesign.com",
							"image": [
								"https://inutdesign.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fsoud11bs%2Fproduction%2Fd8eb4f865977e824fe06dd517f11744d8df3fbf8-2048x1536.webp%3Fw%3D800&w=3840&q=75",
								"https://inutdesign.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fsoud11bs%2Fproduction%2F3744bb790c106b9557532be1813e37fbffaef6c1-2560x1920.webp%3Fw%3D800&w=3840&q=75",
								"https://inutdesign.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fsoud11bs%2Fproduction%2Fc0e739cdf286f87e92534487ae7be67ff82b4565-2560x1920.webp%3Fw%3D800&w=3840&q=75",
								"https://inutdesign.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fsoud11bs%2Fproduction%2F6fa1827094f475f9542d2a56dca9a4bcef994ad0-2560x1962.webp%3Fw%3D800&w=3840&q=75",
								"https://inutdesign.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fsoud11bs%2Fproduction%2F9a072bdd73b8d7b4c20cfed109eb3f109f99d866-2560x1924.webp%3Fw%3D800&w=3840&q=75",
								"https://inutdesign.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Fsoud11bs%2Fproduction%2F7c16454bd72f46dc28d4e5dd79720b16a83ae85a-2560x1912.webp%3Fw%3D800&w=3840&q=75"
							],
							"brand": {
								"@type": "Brand",
								"name": "inut_skin"
							},
							"offers": {
								"@type": "Offer",
								"price": "Custom skin laptop, cho tất cả các loại laptop có trên trái đất. Không giới hạn hình ảnh và idea"
							}
							"potentialAction": {
								"@type": "SearchAction",
							"target": "https://inutdesign.com/products?q={search_term_string}",
							"query-input": "required name=search_term_string"
						}`,
						}}
					></Script>

					{/* Google Tag Manager */}
					<Script
						strategy="afterInteractive"
						id="google-tag-manager"
						dangerouslySetInnerHTML={{
							__html: `{
							(function (w, d, s, l, i) {
								w[l] = w[l] || [];
								w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
								var f = d.getElementsByTagName(s)[0],
									j = d.createElement(s),
									dl = l != "dataLayer" ? "&l=" + l : "";
								j.async = true;
								j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
								f.parentNode.insertBefore(j, f);
							})(window, document, "script", "dataLayer", "GTM-T64K4T3");
						}`,
						}}
					></Script>

					<meta name="emotion-insertion-point" content="" />
					{(this.props as any).emotionStyleTags}
				</Head>
				<body>
					<Main />
					<NextScript />

					{/* Google Tag Manager */}
					<noscript>
						<iframe
							src="https://www.googletagmanager.com/ns.html?id=GTM-PZW7T9W"
							height="0"
							width="0"
							style={{
								display: "none",
								visibility: "hidden",
							}}
						></iframe>
					</noscript>
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
