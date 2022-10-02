import { productsApi } from "@/api-client/products";
import { Seo } from "@/components/common";
import { InfoSection, ListSpecialProducts } from "@/components/home";
import { HeroSection2 } from "@/components/home/hero2";
import { MainLayout } from "@/components/layout";
import { NextPageWithLayout } from "@/models/common";
import { Products } from "@/models/products";
import { Box } from "@mui/material";
import { GetServerSideProps } from "next";
import React from "react";

const Home: NextPageWithLayout = ({ products }: Props) => {
	return (
		<Box>
			<Seo
				data={{
					title: "INUT Design",
					description: "Tiệm may đo skin laptop theo yêu cầu, Cửa Hàng Thời Trang Dành Cho Laptop",
					url: "https://inutdesign.com",
					thumbnailUrl:
						"https://res.cloudinary.com/dmspucdtf/image/upload/v1663573733/294864835_731768937929745_7146257828673250026_n_fv3uhz.webp",
				}}
			/>
			<HeroSection2 />
			<InfoSection />
			<ListSpecialProducts products={products} />
		</Box>
	);
};

Home.Layout = MainLayout;

type Props = {
	products: Products;
	totalProducts?: number;
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
	const products: Products = await productsApi.getAllProducts();

	const specialProducts = products.filter((product) => product.special);

	return {
		props: {
			products: specialProducts,
		},
		revalidate: 86400,
	};
};

export default Home;
