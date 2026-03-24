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
	} = data;

	const breadcrumbStructuredData = React.useMemo(() => {
		if (!breadcrumbs || breadcrumbs.length === 0) return null;
		return JSON.stringify({
			"@context": "https://schema.org",
			"@type": "BreadcrumbList",
			itemListElement: breadcrumbs.map((crumb, index) => ({
				"@type": "ListItem",
				position: index + 1,
				name: crumb.name,
				item: crumb.item.startsWith("http") ? crumb.item : `https://inutdesign.com${crumb.item}`,
			})),
		});
	}, [breadcrumbs]);

	return (
		<Head>
			<title>{title}</title>
			<link rel="icon" href="/static/favicon.ico" />
			<link rel="shortcut icon" href="/static/favicon.ico" type="image/x-icon" />

			{canonical && <link rel="canonical" href={canonical} />}
			{!canonical && <link rel="canonical" href={url} />}

			<meta name="title" content={title} />
			<meta name="description" content={description} />
			{noindex && <meta name="robots" content="noindex,nofollow" />}
			{!noindex && <meta name="robots" content="index,follow" />}

			<meta property="og:type" content="website" />
			<meta property="og:url" content={url} />
			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />
			<meta property="og:image" content={thumbnailUrl} />

			<meta property="twitter:card" content="summary_large_image" />
			<meta property="twitter:url" content={url} />
			<meta property="twitter:title" content={title} />
			<meta property="twitter:description" content={description} />
			<meta property="twitter:image" content={thumbnailUrl} />

			{productStructuredData && (
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: productStructuredData }}
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
