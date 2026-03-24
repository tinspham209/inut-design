import { ReactNode } from "react";

export interface ProductHighlight {
	title: string;
	description: string;
	icon: ReactNode;
}

export interface ProductType {
	name: string;
	description: string;
	image: string;
}

export interface ProductApplication {
	title: string;
	description: string;
	icon: ReactNode;
}

export interface ProductionStep {
	title: string;
	description: string;
	icon: ReactNode;
}

export interface ComparisonRow {
	criteria: string;
	[key: string]: string;
}

export interface Testimonial {
	name: string;
	role: string;
	text: string;
	initials?: string;
	color?: string;
}

export interface ProductStat {
	value: string;
	unit: string;
	label: string;
}

export interface ProductPageData {
	id: string;
	name: string;
	category: string;
	external?: boolean;
	seo: {
		title: string;
		description: string;
		url: string;
		thumbnailUrl: string;
		productStructuredData?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
		breadcrumbs?: Array<{ name: string; item: string }>;
		canonical?: string;
		noindex?: boolean;
	};
	hero: {
		title: string;
		description: string;
		image: string;
		chips?: string[];
		ctaLabel?: string;
		secondaryCtaLabel?: string;
		ticker?: string[];
		stats?: ProductStat[];
	};
	introduction: {
		title?: string;
		eyebrow?: string;
		description?: string;
		bullets: string[];
		highlights: ProductHighlight[];
	};
	types: {
		title?: string;
		eyebrow?: string;
		description?: string;
		items: ProductType[];
		specOptions?: string[];
		comparisonItems?: string[];
		comparisonRows?: ComparisonRow[];
		comparisonRecommendation?: string;
	};
	whyInut: {
		title?: string;
		eyebrow?: string;
		description?: string;
		productionProcess?: {
			title: string;
			items: ProductionStep[];
		};
		applications: {
			title: string;
			description: string;
			items: ProductApplication[];
		};
		commitment?: {
			title: string;
			description: string;
			icon: ReactNode;
		};
	};
	testimonials?: {
		title?: string;
		eyebrow?: string;
		items: Testimonial[];
		score?: string;
		countText?: string;
	};
	contact: {
		title?: string;
		eyebrow?: string;
		description: string;
		type?: string;
		address?: string;
		persons?: Array<{
			name: string;
			role: string;
			phone: string;
			initial: string;
		}>;
	};
	gallery: {
		title?: string;
		eyebrow?: string;
		images: string[];
		filters?: string[];
	};
}
