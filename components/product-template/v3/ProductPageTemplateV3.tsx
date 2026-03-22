import { ProductPageData } from "@/models/product-page";
import { Box } from "@mui/material";
import React from "react";
import { HeroSection } from "./HeroSection";
import { FeaturesSection } from "./FeaturesSection";
import { ProductsSection } from "./ProductsSection";
import { ProcessSection } from "./ProcessSection";
import { PortfolioSection } from "./PortfolioSection";
import { ReviewsSection } from "./ReviewsSection";
import { ContactSection } from "./ContactSection";
import { NoiseOverlay, colors } from "./shared";

export interface ProductPageTemplateV3Props {
	data: ProductPageData;
}

export const ProductPageTemplateV3: React.FC<ProductPageTemplateV3Props> = ({ data }) => {
	return (
		<Box sx={{ bgcolor: colors.ink, minHeight: "100vh" }}>
			<NoiseOverlay />

			<HeroSection data={data.hero} />

			<FeaturesSection data={data.introduction} />

			<ProductsSection data={data.types} />

			<ProcessSection data={data.whyInut} />

			<PortfolioSection data={data.gallery} />

			<ReviewsSection data={data.testimonials} />

			<ContactSection data={data.contact} />
		</Box>
	);
};
