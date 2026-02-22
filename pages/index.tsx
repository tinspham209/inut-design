import { lightersApi } from "@/api-client/lighters";
import { productsApi } from "@/api-client/products";
import { Seo } from "@/components/common";
import { BlogsHome, HeroImage, ListSpecialProducts } from "@/components/home";
import { ListSpecialLighters } from "@/components/home/list-special-lighters";
import { Services } from "@/components/home/services";
import { MainLayout } from "@/components/layout";
import { LighterProduct, Post } from "@/models";
import { NextPageWithLayout } from "@/models/common";
import { Products } from "@/models/products";
import { COLOR_CODE, getPostList } from "@/utils";
import { Box } from "@mui/material";
import { GetStaticProps } from "next";

const Home: NextPageWithLayout = ({ products, macnuts, lighters, blogs }: Props) => {
	return (
		<Box>
			<Seo
				data={{
					title: "INUT Design | Skin laptop da nang",
					description:
						"Thiết kế & In ấn - Skin Laptop - Sticker - Decal - Thiệp - Card - Tem Nhãn, skin laptop da nang, skin laptop đà nẵng",
					url: "https://inutdesign.com",
					thumbnailUrl: "/branding/ogImage.jpg",
				}}
			/>
			{/* <HeroSection /> */}
			<Box pt={2} bgcolor={COLOR_CODE.BACKGROUND}>
				<HeroImage imgUrl="/cover-web.webp" />
			</Box>
			{/* <InfoSection imgUrl={banner && urlFor(banner[0].image).url()} /> */}
			<ListSpecialLighters products={lighters} />
			<ListSpecialProducts products={macnuts} isMacnut />
			<ListSpecialProducts products={products} />
			<Services />
			<BlogsHome posts={blogs} />
		</Box>
	);
};

Home.Layout = MainLayout;

type Props = {
	products: Products;
	macnuts: Products;
	lighters: LighterProduct[];
	blogs: Post[];
};

export const getStaticProps: GetStaticProps<Props> = async () => {
	const postList = await getPostList();

	const specialProducts = await productsApi.getSpecialProducts(12);
	const specialMacnuts = await productsApi.getSpecialProductsMacnut(12);
	const specialLighters = await lightersApi.getSpecialLighters(12);
	const blogs = postList.sort((a, b) => (a.publishedDate < b.publishedDate ? 1 : -1)).slice(0, 3);

	return {
		props: {
			products: specialProducts,
			macnuts: specialMacnuts,
			lighters: specialLighters,
			blogs: blogs,
		},
	};
};

export default Home;
