import { lightersApi } from "@/api-client/lighters";
import { urlFor } from "@/api-client/sanity-client";
import { Seo } from "@/components/common";
import { MainLayout } from "@/components/layout";
import ActionButtons from "@/components/lighter-detail/ActionButtons";
import BreadcrumbsNav from "@/components/lighter-detail/BreadcrumbsNav";
import DescriptionAccordion from "@/components/lighter-detail/DescriptionAccordion";
import InfoPanel from "@/components/lighter-detail/InfoPanel";
import PriceAccordion from "@/components/lighter-detail/PriceAccordion";
import RelatedProducts from "@/components/lighter-detail/RelatedProducts";
import { LighterProduct, LighterProductWithType, LighterType } from "@/models/cart";
import { NextPageWithLayout } from "@/models/common";
import { formatPrice, getPriceTierOptions } from "@/utils/priceCalculator";
import { trackViewProduct } from "@/utils/analytics";
import { Box, Card, CardContent, Container, Grid, Typography } from "@mui/material";
import { GetStaticPaths, GetStaticProps } from "next";
import dynamic from "next/dynamic";
import React from "react";
import { staticContentEachPageApi } from "@/api-client/staticContentEachPage";
import { StaticContentEachPage } from "@/models";
import BlockContentWrapper from "@/components/common/block-content";
// Removed legacy Seo usage; using SEOHead component for meta + structured data

// Dynamically import Gallery (depends on carousel & lightbox which are browser only)
const Gallery = dynamic(() => import("@/components/lighter-detail/Gallery"), { ssr: false });

type Props = {
	lighter: LighterProductWithType;
	lighters: LighterProduct[];
	lighterType: LighterType | null;
	staticContent?: StaticContentEachPage;
};

const LighterDetail: NextPageWithLayout = ({
	lighter,
	lighters,
	lighterType,
	staticContent,
}: Props) => {
	const priceTiers = React.useMemo(() => {
		if (!lighterType?.priceTiers) return [];
		return getPriceTierOptions(lighterType.priceTiers);
	}, [lighterType]);

	const priceRange = React.useMemo(() => {
		if (!lighterType?.priceTiers || lighterType.priceTiers.length === 0) {
			return { min: "Liên hệ", max: "Liên hệ" };
		}
		const prices = lighterType.priceTiers.map((tier) => tier.price);
		return { min: formatPrice(Math.min(...prices)), max: formatPrice(Math.max(...prices)) };
	}, [lighterType]);

	const [quantity, setQuantity] = React.useState(
		priceTiers.length > 0 ? priceTiers[0].quantity : 1
	);

	const galleryImages = React.useMemo(() => {
		return lighter.image.map((img) => ({
			_key: img._key,
			url: urlFor(img).width(1000).url(),
			alt: lighter.name,
			thumbUrl: urlFor(img).width(200).url(),
		}));
	}, [lighter.image, lighter.name]);

	const relatedProducts = React.useMemo(() => {
		return lighters.slice(0, 12).map((product) => ({
			_id: product._id,
			name: product.name,
			slug: product.slug,
			image: product.image,
			imageUrl: urlFor(product.image[0]).width(500).url(),
		}));
	}, [lighters]);

	type SanityChild = { text?: string };
	const productStructuredData = React.useMemo(() => {
		const descriptionText = lighter.details
			? lighter.details[0]?.children?.map((c: SanityChild) => c.text || "").join(" ")
			: "";
		return JSON.stringify({
			"@context": "https://schema.org/",
			"@type": "Product",
			name: lighter.name,
			image: galleryImages.map((img) => img.url),
			description: descriptionText,
			brand: { "@type": "Brand", name: "INUT Design" },
			offers: {
				"@type": "AggregateOffer",
				lowPrice: priceTiers.length > 0 ? priceTiers[0].price : undefined,
				highPrice: priceTiers.length > 0 ? priceTiers[priceTiers.length - 1].price : undefined,
				priceCurrency: "VND",
				offerCount: priceTiers.length,
				availability: "https://schema.org/InStock",
			},
		});
	}, [lighter.name, lighter.details, galleryImages, priceTiers]);

	// Track product view on mount
	React.useEffect(() => {
		if (lighter && lighterType) {
			const avgPrice =
				priceTiers.length > 0
					? priceTiers.reduce((sum, tier) => sum + tier.price, 0) / priceTiers.length
					: 0;
			trackViewProduct({
				id: lighter._id,
				name: lighter.name,
				category: "Lighters",
				variant: lighterType.name,
				price: avgPrice,
			});
		}
	}, [lighter, lighterType, priceTiers]);

	return (
		<>
			<Seo
				data={{
					title: `${lighter.name} - Lighters - INUT Design`,
					description: `${lighter.name} - ${lighterType?.name || "Bật lửa Custom"}. Giá từ ${
						priceRange.min
					} - ${priceRange.max}`,
					url: `https://inutdesign.com/san-pham/lighters/${lighter.slug.current}`,
					thumbnailUrl: galleryImages[0]?.url,
					productStructuredData: productStructuredData,
				}}
			/>
			<Box component="section" sx={{ pt: 2 }}>
				<Container maxWidth="lg">
					<BreadcrumbsNav lighterName={lighter.name} lighterSlug={lighter.slug.current} />
					<Grid container spacing={3}>
						<Grid item xs={12} md={6}>
							<Gallery images={galleryImages} productName={lighter.name} />
							<Card variant="outlined" sx={{ mt: 3, borderRadius: 2 }}>
								<CardContent>
									<Typography variant="subtitle1" fontWeight={600} gutterBottom>
										Cam Kết Mua Sản Phẩm tại INUT
									</Typography>
									<Box mt={1}>
										<BlockContentWrapper blocks={staticContent?.camKetMuaHang} />
									</Box>
								</CardContent>
							</Card>
						</Grid>
						<Grid item xs={12} md={6}>
							<Box
								sx={{
									position: { md: "sticky" },
									top: { md: 90 },
									border: "1px solid",
									borderColor: "divider",
									borderRadius: 2,
									p: 2.5,
									backgroundColor: "background.paper",
								}}
							>
								<InfoPanel lighter={lighter} lighterType={lighterType} priceRange={priceRange} />
								<Box mb={1}>
									<DescriptionAccordion
										details={lighter.details}
										lighterTypeDescription={lighterType?.description}
									/>
									<PriceAccordion
										priceTiers={priceTiers}
										quantity={quantity}
										setQuantity={setQuantity}
									/>
								</Box>

								<ActionButtons lighter={lighter} lighterType={lighterType} quantity={quantity} />
							</Box>
						</Grid>
					</Grid>
				</Container>
			</Box>
			<RelatedProducts products={relatedProducts} />
		</>
	);
};

interface LighterSlugDoc {
	slug: { current: string } | null;
}
export const getStaticPaths: GetStaticPaths = async () => {
	const lighters: LighterSlugDoc[] = await lightersApi.getAllLighterSlugs();
	const paths = lighters
		.filter((lighter): lighter is { slug: { current: string } } => lighter.slug !== null)
		.map((lighter) => ({ params: { slug: lighter.slug.current } }));
	return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
	const slug = params?.slug as string;
	if (!slug) {
		return { notFound: true };
	}
	try {
		const lighter = await lightersApi.getLighterWithTypeBySlug(slug);
		if (!lighter) {
			return { notFound: true };
		}
		const lighters = await lightersApi.getAllLighters(20);
		let lighterType: LighterType | null = null;
		if (lighter.lighterType?._ref) {
			try {
				lighterType = await lightersApi.getLighterTypeById(lighter.lighterType._ref);
			} catch (e) {
				console.error("Error fetching lighter type", e);
			}
		}
		const staticContent = await staticContentEachPageApi.getStaticContentBySlug("lighters");

		return {
			props: {
				lighter,
				lighters: lighters.filter((l: LighterProduct) => !l._id.includes("drafts")),
				lighterType,
				staticContent,
			},
			revalidate: 86400,
		};
	} catch (error) {
		console.error("Error in getStaticProps", error);
		return { notFound: true };
	}
};

LighterDetail.Layout = MainLayout;
export default LighterDetail;
