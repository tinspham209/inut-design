import { bannerApi } from "@/api-client/banner";
import { lightersApi } from "@/api-client/lighters";
import { productsApi } from "@/api-client/products";
import { urlFor } from "@/api-client/sanity-client";
import { Seo } from "@/components/common";
import { ROUTE_LIST } from "@/components/common/header/routes";
import {
	BlogsHome,
	CauChuyen,
	ChotDon,
	FeaturedProductsSection,
	HeroSection,
	ServiceChildrenGrid,
	ServicesSection,
} from "@/components/home";
import { MainLayout } from "@/components/layout";
import { LighterProduct, Post } from "@/models";
import { Banner } from "@/models/banner";
import { NextPageWithLayout } from "@/models/common";
import { Products } from "@/models/products";
import { getPostListLimit } from "@/utils";
import { Box } from "@mui/material";
import { GetStaticProps } from "next";

const servicesRoute = ROUTE_LIST.find((r) => r.path === "/services");
const stickerChildren =
	servicesRoute?.children?.find((r) => r.path === "/services/sticker")?.children ?? [];

const Home: NextPageWithLayout = ({ products, macnuts, lighters, blogs, banner }: Props) => {
	return (
		<Box>
			<Seo
				data={{
					title: "INUT Design — In Skin Laptop, Sticker, Bật lửa Tại Đà Nẵng",
					description:
						"Xưởng in Đà Nẵng: skin laptop, MACNUT, sticker, decal, namecard, banner, backdrop. Giao nhanh — báo giá trong 15 phút. Zalo: 0327 124 321.",
					url: "https://inutdesign.com",
					thumbnailUrl: urlFor(banner.image).url() || "/branding/ogImage.jpg",
				}}
			/>
			{/* <Box pt={2} bgcolor={COLOR_CODE.BACKGROUND}>
				<HeroImage imgUrl="/cover-web.webp" />
			</Box> */}
			<Box>
				<HeroSection />
			</Box>

			{/* Bật lửa — 8 special items, light bg, above-fold priority */}
			<FeaturedProductsSection
				id="lighters"
				title="Bật lửa"
				items={lighters}
				viewAllHref="/san-pham/lighters"
				itemHref={(slug) => `/san-pham/lighters/${slug}`}
				analyticsCategory="Bật lửa"
				priorityCount={2}
			/>

			{/* Sticker — 4 sub-types from ROUTE_LIST, dark bg */}
			<ServiceChildrenGrid
				title="Sticker"
				id="sticker"
				titleHref="/services/sticker"
				items={stickerChildren}
				maxItems={4}
				darkMode
			/>

			{/* Dịch vụ — all service sub-categories with children */}
			<ServicesSection id="services" />

			{/* Skin Nút Phím — 8 special items, light bg */}
			<FeaturedProductsSection
				id="macnuts"
				title="Skin Nút Phím"
				items={macnuts}
				viewAllHref="/san-pham/skin-nut-phim"
				itemHref={(slug) => `/san-pham/skin-nut-phim/${slug}`}
				analyticsCategory="Skin Nút Phím"
			/>

			{/* Skin Laptop — 8 special items, dark bg */}
			<FeaturedProductsSection
				title="Skin Laptop"
				id="skin-laptop"
				items={products}
				viewAllHref="/san-pham/skin-laptop"
				itemHref={(slug) => `/san-pham/skin-laptop/${slug}`}
				analyticsCategory="Skin Laptop"
				darkMode
			/>

			{/* Tin tức — 3 latest blog posts */}
			<BlogsHome posts={blogs} />

			{/* Câu chuyện — brand story + timeline */}
			<CauChuyen />

			{/* Chốt đơn — contact CTA */}
			<ChotDon />
		</Box>
	);
};

Home.Layout = MainLayout;

type Props = {
	products: Products;
	macnuts: Products;
	lighters: LighterProduct[];
	blogs: Post[];
	banner: Banner;
};

export const getStaticProps: GetStaticProps<Props> = async () => {
	const blogs = await getPostListLimit(3);
	const banner: Banner = await bannerApi.getBannerPage("contact-page");

	const [specialProducts, specialMacnuts, specialLighters] = await Promise.all([
		productsApi.getSpecialProducts(8),
		productsApi.getSpecialProductsMacnut(8),
		lightersApi.getSpecialLighters(8),
	]);

	return {
		props: {
			products: specialProducts,
			macnuts: specialMacnuts,
			lighters: specialLighters,
			blogs,
			banner: banner ? banner[0] : [],
		},
	};
};

export default Home;
