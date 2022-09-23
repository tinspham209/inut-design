import { bannerApi } from "@/api-client/banner";
import { productsApi } from "@/api-client/products";
import { urlFor } from "@/api-client/sanity-client";
import { Seo } from "@/components/common";
import { HeroSection, InfoSection, ListSpecialProducts } from "@/components/home";
import { MainLayout } from "@/components/layout";
import { Banner } from "@/models/banner";
import { NextPageWithLayout } from "@/models/common";
import { Products } from "@/models/products";
import { Box } from "@mui/material";
import { GetStaticProps } from "next";
import React from "react";

const Home: NextPageWithLayout = ({ banner, products }: Props) => {
	return (
		<Box>
			<Seo
				data={{
					title: "INUT Design",
					description: "Tiệm may đo skin laptop theo yêu cầu, Cửa Hàng Thời Trang Dành Cho Laptop",
					url: "https://inut-design.vercel.app",
					thumbnailUrl:
						"https://res.cloudinary.com/dmspucdtf/image/upload/v1663573733/294864835_731768937929745_7146257828673250026_n_fv3uhz.webp",
				}}
			/>
			<HeroSection imgUrl={urlFor(banner.image).width(1440).url()} />
			<InfoSection />
			<ListSpecialProducts products={products} />
		</Box>
	);
};

Home.Layout = MainLayout;

type Props = {
	banner: Banner;
	products: Products;
	totalProducts?: number;
};

export const getStaticProps: GetStaticProps<Props> = async () => {
	const banner: Banner[] = await bannerApi.getBannerHomePage();
	const products: Products = await productsApi.getAllProducts();

	const specialProducts = products.filter((product) => product.special);

	return {
		props: {
			banner: banner[0],
			products: specialProducts,
		},
		revalidate: 86400,
	};
};

export default Home;
