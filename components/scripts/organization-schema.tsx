import React from "react";

export function GlobalSchema() {
	const organizationSchema = {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: "INUT Design",
		url: "https://inutdesign.com",
		logo: "https://inutdesign.com/branding/logo.avif",
		contactPoint: {
			"@type": "ContactPoint",
			telephone: "+84-327-124-321",
			contactType: "customer service",
			areaServed: "VN",
			availableLanguage: "Vietnamese",
		},
		sameAs: ["https://www.facebook.com/inutdesign", "https://www.instagram.com/inutdesign"],
		address: {
			"@type": "PostalAddress",
			streetAddress: "K574/5 Ông Ích Khiêm, Tổ 22, Phường Hải Châu",
			addressLocality: "Đà Nẵng",
			addressRegion: "DN",
			postalCode: "550000",
			addressCountry: "VN",
		},
	};

	const websiteSchema = {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: "INUT Design",
		url: "https://inutdesign.com",
		potentialAction: {
			"@type": "SearchAction",
			target: {
				"@type": "EntryPoint",
				urlTemplate: "https://inutdesign.com/search?q={search_term_string}",
			},
			"query-input": "required name=search_term_string",
		},
	};

	return (
		<>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
			/>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
			/>
		</>
	);
}
