import { Seo } from "@/components/common";
import { ProductPageData } from "@/models/product-page";
import { trackViewProduct } from "@/utils/analytics";
import { Box, Fade } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ProductPageTemplateV1 } from "./v1/ProductPageTemplateV1";
import { ProductPageTemplateV2 } from "./v2/ProductPageTemplateV2";
import { ProductPageTemplateV3 } from "./v3/ProductPageTemplateV3";

/**
 * ProductLayoutVersion defines the available UI variants for product pages.
 */
export type ProductLayoutVersion = "v1" | "v2" | "v3";

interface ProductPageTemplateProps {
	data: ProductPageData;
	version?: ProductLayoutVersion;
}

/**
 * ProductPageTemplate acts as the main entry point for product pages.
 * It dynamically renders the appropriate version-specific layout based on the version prop.
 */
export const ProductPageTemplate: React.FC<ProductPageTemplateProps> = ({
	data,
	version = "v1",
}) => {
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		trackViewProduct({
			id: data.id,
			name: data.name,
			category: data.category,
		});
		setIsVisible(true);
	}, [data, version]);

	const renderSeo = () => (
		<Seo
			data={{
				title: data.seo.title,
				description: data.seo.description,
				url: data.seo.url,
				thumbnailUrl: data.seo.thumbnailUrl,
				productStructuredData: data.seo.productStructuredData,
				breadcrumbs: data.seo.breadcrumbs,
				canonical: data.seo.canonical,
				noindex: data.seo.noindex,
			}}
		/>
	);

	const renderLayout = () => {
		switch (version) {
			case "v3":
				return <ProductPageTemplateV3 data={data} />;
			case "v2":
				return <ProductPageTemplateV2 data={data} />;
			case "v1":
			default:
				return <ProductPageTemplateV1 data={data} />;
		}
	};

	return (
		<>
			{renderSeo()}
			<Fade in={isVisible} timeout={500}>
				<Box>{renderLayout()}</Box>
			</Fade>
		</>
	);
};
