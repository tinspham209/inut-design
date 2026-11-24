import { DEFAULT_SITE_URL, SITE_URL, resolveSiteUrl } from "@/utils/siteUrl";
import Head from "next/head";
import * as React from "react";

export interface SeoData {
	title: string;
	description: string;
	thumbnailUrl: string;
	url: string;
	productStructuredData?: string;
	breadcrumbs?: Array<{ name: string; item: string }>;
	noindex?: boolean;
	canonical?: string;
	siteName?: string;
}

interface SeoProps {
	data: SeoData;
}

export function Seo({ data }: SeoProps) {
	const {
		description,
		thumbnailUrl,
		title,
		url,
		productStructuredData,
		breadcrumbs,
		noindex = false,
		canonical,
		siteName = "INUT Design",
	} = data;
	const resolvedUrl = resolveSiteUrl(url);
	const resolvedCanonical = canonical ? resolveSiteUrl(canonical) : resolvedUrl;

	const breadcrumbStructuredData = React.useMemo(() => {
		if (!breadcrumbs || breadcrumbs.length === 0) return null;
		return JSON.stringify({
			"@context": "https://schema.org",
			"@type": "BreadcrumbList",
			itemListElement: breadcrumbs.map((crumb, index) => ({
				"@type": "ListItem",
				position: index + 1,
				name: crumb.name,
				item: crumb.item.startsWith("http") ? crumb.item : `${SITE_URL}${crumb.item}`,
			})),
		});
	}, [breadcrumbs]);

	return (
		<Head>
			<title>{title}</title>
			<link rel="icon" href="/static/favicon.ico" />
			<link rel="shortcut icon" href="/static/favicon.ico" type="image/x-icon" />

			<link rel="canonical" href={resolvedCanonical} />

			<meta name="title" content={title} />
			<meta name="description" content={description} />
			{noindex && <meta name="robots" content="noindex,nofollow" />}
			{!noindex && <meta name="robots" content="index,follow" />}

			<meta property="og:type" content="website" />
			<meta property="og:locale" content="vi_VN" />
			<meta property="og:site_name" content={siteName} />
			<meta property="og:url" content={resolvedUrl} />
			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />
			<meta property="og:image" content={thumbnailUrl} />
			<meta property="og:image:alt" content={title} />

			<meta property="twitter:card" content="summary_large_image" />
			<meta property="twitter:url" content={resolvedUrl} />
			<meta property="twitter:title" content={title} />
			<meta property="twitter:description" content={description} />
			<meta property="twitter:image" content={thumbnailUrl} />

			{productStructuredData && (
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html:
							typeof productStructuredData === "string"
								? productStructuredData.replaceAll(DEFAULT_SITE_URL, SITE_URL)
								: JSON.stringify(productStructuredData),
					}}
				/>
			)}

			{breadcrumbStructuredData && (
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: breadcrumbStructuredData }}
				/>
			)}
		</Head>
	);
}
