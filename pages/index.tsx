import { productsApi } from "@/api-client/products";
import { Seo } from "@/components/common";
import { BlogsHome, INFO_ID_ELEMENT, InfoSection, ListSpecialProducts } from "@/components/home";
import { HeroSection } from "@/components/home/hero";
import { MainLayout } from "@/components/layout";
import { Post } from "@/models";
import { NextPageWithLayout } from "@/models/common";
import { Products } from "@/models/products";
import { getPostList } from "@/utils";
import { Box, useMediaQuery } from "@mui/material";
import { GetStaticProps } from "next";
import React from "react";
import { scroller } from "react-scroll";

const Home: NextPageWithLayout = ({ products, macnuts, blogs }: Props) => {
	const isSmScreen = useMediaQuery("(max-width:600px)");

	React.useEffect(() => {
		const infoElement = document.getElementById(INFO_ID_ELEMENT);

		setTimeout(() => {
			if (isSmScreen) {
				infoElement.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
			} else {
				scroller.scrollTo(INFO_ID_ELEMENT, {
					smooth: true,
					duration: 1000,
					offset: -550,
				});
			}
		}, 3000);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<Box>
			<Seo
				data={{
					title: "INUT Design | Skin laptop da nang",
					description:
						"Tiệm may đo skin laptop theo yêu cầu, Cửa Hàng Thời Trang Dành Cho Laptop, skin laptop da nang, skin laptop đà nẵng",
					url: "https://inutdesign.com",
					thumbnailUrl:
						"https://res.cloudinary.com/dmspucdtf/image/upload/v1663573733/294864835_731768937929745_7146257828673250026_n_fv3uhz.webp",
				}}
			/>
			<HeroSection />
			<InfoSection />
			<ListSpecialProducts products={products} />
			<ListSpecialProducts products={macnuts} isMacnut />
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
};

export const getStaticProps: GetStaticProps<Props> = async () => {
	const products: Products = await productsApi.getAllProducts();
	const macnuts: Products = await productsApi.getAllProductsMacnut();
	const postList = await getPostList();

	const specialProducts = products.filter((product) => product.special);
	const specialMacnuts = macnuts.filter((product) => product.special);

	return {
		props: {
			products: [...specialProducts],
			macnuts: [...specialMacnuts],
			blogs: postList,
		},
	};
};

export default Home;
