import { bannerApi } from "@/api-client/banner";
import { lightersApi } from "@/api-client/lighters";
import { productsApi } from "@/api-client/products";
import { urlFor } from "@/api-client/sanity-client";
import { Seo } from "@/components/common";
import { ROUTE_LIST, RouteItem } from "@/components/common/header/routes";
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

const anPhamLuuNiemChildren =
	servicesRoute?.children?.find((r) => r.path === "/services/an-pham-luu-niem")?.children ?? [];

const caNhanHoaChildren =
	servicesRoute?.children?.find((r) => r.path === "/services/ca-nhan-hoa")?.children ?? [];

const cloneRouteItem = (item?: RouteItem, label?: string): RouteItem | undefined => {
	if (!item) return undefined;

	return {
		...item,
		label: label || item.label,
	};
};

const featuredGiftItems = [
	cloneRouteItem(stickerChildren.find((item) => item.path === "/services/sticker/sticker-sheet")),
	cloneRouteItem(stickerChildren.find((item) => item.path === "/services/sticker/sticker-diecut")),
	cloneRouteItem(stickerChildren.find((item) => item.path === "/services/sticker/sticker-pack")),
	cloneRouteItem(stickerChildren.find((item) => item.path === "/services/sticker/sticker-magnet")),
	cloneRouteItem(
		anPhamLuuNiemChildren.find((item) => item.path === "/services/an-pham-luu-niem/acrylic-magnet")
	),
	cloneRouteItem(
		anPhamLuuNiemChildren.find((item) => item.path === "/services/an-pham-luu-niem/moc-khoa-mica"),
		"Móc Khoá Mica"
	),
	cloneRouteItem(
		anPhamLuuNiemChildren.find(
			(item) => item.path === "/services/an-pham-luu-niem/pin-cai-ao-mica"
		),
		"Pin Cài Áo Mica"
	),
	cloneRouteItem(
		caNhanHoaChildren.find((item) => item.path === "/services/ca-nhan-hoa/skin-bat-lua-customize"),
		"Bật lửa custom"
	),
].filter((item): item is RouteItem => Boolean(item));

const Home: NextPageWithLayout = ({ products, macnuts, lighters, blogs, banner }: Props) => {
	return (
		<Box>
			<Seo
				data={{
					title: "INUT Design — In Sticker, Bật lửa, Skin Laptop Tại Đà Nẵng",
					description:
						"Xưởng in ấn cá nhân hóa tại Đà Nẵng: Sticker, Bật lửa, skin laptop, skin nút phím. Báo giá 15 phút, giao toàn quốc. Zalo: 0327 124 321.",
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

			<ServiceChildrenGrid
				title="In ấn quà tặng"
				eyebrow="SẢN PHẨM NỔI BẬT"
				id="featured-gift-products"
				titleHref="/services"
				items={featuredGiftItems}
				maxItems={8}
			/>

			{/* Dịch vụ — all service sub-categories with children */}
			<ServicesSection id="services" />

			{/* Bật lửa — 8 special items, light bg, above-fold priority */}
			<FeaturedProductsSection
				id="lighters"
				title="Bật lửa"
				eyebrow="CÁ NHÂN HOÁ"
				items={lighters}
				viewAllHref="/san-pham/lighters"
				itemHref={(slug) => `/san-pham/lighters/${slug}`}
				analyticsCategory="Bật lửa"
				priorityCount={2}
			/>

			{/* Skin Nút Phím — 8 special items, light bg */}
			<FeaturedProductsSection
				id="macnuts"
				title="Skin Nút Phím"
				eyebrow="CÁ NHÂN HOÁ"
				items={macnuts}
				viewAllHref="/san-pham/skin-nut-phim"
				itemHref={(slug) => `/san-pham/skin-nut-phim/${slug}`}
				analyticsCategory="Skin Nút Phím"
			/>

			{/* Skin Laptop — 8 special items, dark bg */}
			<FeaturedProductsSection
				title="Skin Laptop"
				eyebrow="CÁ NHÂN HOÁ"
				id="skin-laptop"
				items={products}
				viewAllHref="/san-pham/skin-laptop"
				itemHref={(slug) => `/san-pham/skin-laptop/${slug}`}
				analyticsCategory="Skin Laptop"
				darkMode
			/>

			{/* Câu chuyện — brand story + timeline */}
			<CauChuyen />

			{/* Tin tức — 3 latest blog posts */}
			<BlogsHome posts={blogs} />

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
	const banner: Banner = await bannerApi.getBannerPage("homepage");

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
