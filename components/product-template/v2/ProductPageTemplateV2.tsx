import { ProductPageData } from "@/models/product-page";
import { Box, Container } from "@mui/material";
import React from "react";
import { ContactSection } from "./ContactSection";
import { HeroSection } from "./HeroSection";
import { IntroductionSection } from "./IntroductionSection";
import { ProductGallery } from "./ProductGallery";
import { TypesSection } from "./TypesSection";
import { WhyInutSection } from "./WhyInutSection";

export interface ProductPageTemplateV2Props {
	data: ProductPageData;
}

export const ProductPageTemplateV2: React.FC<ProductPageTemplateV2Props> = ({ data }) => {
	return (
		<Box sx={{ bgcolor: "white" }}>
			<HeroSection
				title={data.hero.title}
				description={data.hero.description}
				image={data.hero.image}
				chips={data.hero.chips}
				ctaLabel={data.hero.ctaLabel}
			/>

			<Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "grey.50" }}>
				<Container>
					<IntroductionSection
						title={data.introduction.title}
						bullets={data.introduction.bullets}
						highlights={data.introduction.highlights}
					/>
				</Container>
			</Box>

			<Box sx={{ py: { xs: 8, md: 12 } }}>
				<Container>
					<TypesSection
						items={data.types.items}
						title={data.types.title}
						description={data.types.description}
						specOptions={data.types.specOptions}
						comparisonItems={data.types.comparisonItems}
						comparisonRows={data.types.comparisonRows}
						comparisonRecommendation={data.types.comparisonRecommendation}
					/>
				</Container>
			</Box>

			<Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "secondary.dark", color: "white" }}>
				<Container>
					<WhyInutSection
						title={data.whyInut.title}
						description={data.whyInut.description}
						productionProcess={data.whyInut.productionProcess}
						applications={data.whyInut.applications}
						commitment={data.whyInut.commitment}
					/>
				</Container>
			</Box>

			<Box sx={{ py: { xs: 8, md: 12 } }}>
				<Container>
					<ProductGallery title={data.gallery.title} images={data.gallery.images} />
				</Container>
			</Box>

			<Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "primary.main", color: "white" }}>
				<Container>
					<ContactSection
						title={data.contact.title}
						description={data.contact.description}
						type={data.contact.type}
					/>
				</Container>
			</Box>
		</Box>
	);
};
