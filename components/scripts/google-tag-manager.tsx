import envConst from "@/utils/env-const";
import Script from "next/script";
import React from "react";

const GA_MEASUREMENT_ID = envConst.GA_MEASUREMENT_ID;
const GTM_ID = envConst.GTM_ID;

export function GoogleTagSchema() {
	// Only render in production
	if (envConst.NODE_ENV !== "production") {
		return null;
	}

	return (
		<>
			{GA_MEASUREMENT_ID && (
				<>
					<Script
						strategy="lazyOnload"
						src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
					/>
					<Script
						id="ga-script"
						strategy="lazyOnload"
						dangerouslySetInnerHTML={{
							__html: `
								window.dataLayer = window.dataLayer || [];
								function gtag(){dataLayer.push(arguments);}
								gtag('js', new Date());
								gtag('config', '${GA_MEASUREMENT_ID}', {
									page_path: window.location.pathname,
								});
							`,
						}}
					/>
				</>
			)}
			{GTM_ID && (
				<Script
					id="gtm-script"
					strategy="lazyOnload"
					dangerouslySetInnerHTML={{
						__html: `
							(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
							new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
							j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
							'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
							})(window,document,'script','dataLayer','${GTM_ID}');
						`,
					}}
				/>
			)}
		</>
	);
}
