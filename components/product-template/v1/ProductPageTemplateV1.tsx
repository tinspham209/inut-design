import { ProductPageData } from "@/models/product-page";
import { COLOR_CODE } from "@/utils/theme";
import { Box, Container, Divider } from "@mui/material";
import React from "react";
import { ContactSection } from "./ContactSection";
import { HeroSection } from "./HeroSection";
import { IntroductionSection } from "./IntroductionSection";
import { ProductGallery } from "./ProductGallery";
import { TypesSection } from "./TypesSection";
import { WhyInutSection } from "./WhyInutSection";

export interface ProductPageTemplateV1Props {
	data: ProductPageData;
}

export const ProductPageTemplateV1: React.FC<ProductPageTemplateV1Props> = ({ data }) => {
	return (
		<Box sx={{ bgcolor: COLOR_CODE.INK }}>
			<HeroSection
				title={data.hero.title}
				description={data.hero.description}
				image={data.hero.image}
				chips={data.hero.chips}
				ctaLabel={data.hero.ctaLabel}
			/>

			<Container sx={{ py: { xs: 4, md: 6 } }}>
				<IntroductionSection
					title={data.introduction.title}
					bullets={data.introduction.bullets}
					highlights={data.introduction.highlights}
				/>

				<Divider sx={{ my: { xs: 4, md: 6 }, borderColor: COLOR_CODE.INK_4 }} />

				<TypesSection
					items={data.types.items}
					title={data.types.title}
					description={data.types.description}
					specOptions={data.types.specOptions}
					comparisonItems={data.types.comparisonItems}
					comparisonRows={data.types.comparisonRows}
					comparisonRecommendation={data.types.comparisonRecommendation}
				/>

				<Divider sx={{ my: { xs: 4, md: 6 }, borderColor: COLOR_CODE.INK_4 }} />

				<WhyInutSection
					title={data.whyInut.title}
					description={data.whyInut.description}
					productionProcess={data.whyInut.productionProcess}
					applications={data.whyInut.applications}
					commitment={data.whyInut.commitment}
				/>

				<Divider sx={{ my: { xs: 4, md: 6 }, borderColor: COLOR_CODE.INK_4 }} />

				<ContactSection
					title={data.contact.title}
					description={data.contact.description}
					type={data.contact.type}
				/>

				<Divider sx={{ my: { xs: 4, md: 6 }, borderColor: COLOR_CODE.INK_4 }} />

				<ProductGallery title={data.gallery.title} images={data.gallery.images} />
			</Container>
		</Box>
	);
};
