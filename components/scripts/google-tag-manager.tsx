import * as React from "react";

export const scriptgoogleTagSchema = `
(function (w, d, s, l, i) {
  w[l] = w[l] || [];
  w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
  var f = d.getElementsByTagName(s)[0];
  var	j = d.createElement(s);
  var	dl = l != "dataLayer" ? "&l=" + l : "";
  j.async = true;
  j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
  f.parentNode.insertBefore(j, f);
})(window, document, "script", "dataLayer", "GTM-T64K4T3");
`;

export function GoogleTagSchemaNoScript() {
	return (
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
	);
}
