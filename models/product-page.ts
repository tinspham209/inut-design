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

export interface ProductPageData {
	id: string;
	name: string;
	category: string;
	seo: {
		title: string;
		description: string;
		url: string;
		thumbnailUrl: string;
	};
	hero: {
		title: string;
		description: string;
		image: string;
		chips?: string[];
		ctaLabel?: string;
	};
	introduction: {
		title?: string;
		bullets: string[];
		highlights: ProductHighlight[];
	};
	types: {
		title?: string;
		description?: string;
		items: ProductType[];
		specOptions?: string[];
		comparisonItems?: string[];
		comparisonRows?: ComparisonRow[];
		comparisonRecommendation?: string;
	};
	whyInut: {
		title?: string;
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
	contact: {
		title?: string;
		description: string;
		type?: string;
	};
	gallery: {
		title?: string;
		images: string[];
	};
}
