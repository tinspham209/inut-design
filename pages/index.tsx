import { bannerApi } from "@/api-client/banner";
import { productsApi } from "@/api-client/products";
import { urlFor } from "@/api-client/sanity-client";
import { Seo } from "@/components/common";
import { BlogsHome, HeroImage, InfoSection, ListSpecialProducts } from "@/components/home";
import { Services } from "@/components/home/services";
import { MainLayout } from "@/components/layout";
import { Post } from "@/models";
import { Banner } from "@/models/banner";
import { NextPageWithLayout } from "@/models/common";
import { Products } from "@/models/products";
import { COLOR_CODE, getPostList } from "@/utils";
import { Box } from "@mui/material";
import { GetStaticProps } from "next";

const Home: NextPageWithLayout = ({ products, macnuts, blogs, banner }: Props) => {
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
			<Box mt={2} bgcolor={COLOR_CODE.BACKGROUND}>
				<HeroImage imgUrl="/cover-web.webp" />
			</Box>
			{/* <InfoSection imgUrl={banner && urlFor(banner[0].image).url()} /> */}
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
	totalProducts?: number;
	blogs: Post[];
	banner: Banner[];
};

export const getStaticProps: GetStaticProps<Props> = async () => {
	const products: Products = await productsApi.getAllProducts();
	const macnuts: Products = await productsApi.getAllProductsMacnut();
	const postList = await getPostList();

	const specialProducts = products.filter((product) => product.special);
	const specialMacnuts = macnuts.filter((product) => product.special);

	const banner: Banner[] = await bannerApi.getBannerPage("homepage");

	return {
		props: {
			products: [...specialProducts],
			macnuts: [...specialMacnuts],
			blogs: postList.sort((a, b) => (a.publishedDate < b.publishedDate ? 1 : -1)).slice(0, 5),
			banner: banner,
		},
	};
};

export default Home;
