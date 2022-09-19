import { Box } from '@mui/system';
import * as React from 'react';
import Head from 'next/head';

export interface SeoData {
	title: string;
	description: string;
	thumbnailUrl: string;
	url: string;
}

interface SeoProps {
	data: SeoData;
}

export function Seo({ data }: SeoProps) {
	const { description, thumbnailUrl, title, url } = data;
	return (
		<Head>
			<title>{title}</title>
			<link rel="icon" href="/static/favicon.ico" />
			<link rel="shortcut icon" href="/static/favicon.ico" type="image/x-icon" />

			<meta name="title" content={title} />
			<meta name="description" content={description} />

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
		</Head>
	);
}
