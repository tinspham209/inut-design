import { FAQItem } from "@/utils/seo-constants";
import Head from "next/head";
import React from "react";

interface FAQSchemaProps {
	items: FAQItem[];
}

export function FAQSchema({ items }: FAQSchemaProps) {
	if (!items || items.length === 0) return null;

	const schema = {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: items.map((item) => ({
			"@type": "Question",
			name: item.question,
			acceptedAnswer: {
				"@type": "Answer",
				text: item.answer,
			},
		})),
	};

	return (
		<Head>
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
			/>
		</Head>
	);
}
