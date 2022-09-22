import React from "react";
import { bannerApi } from "@/api-client/banner";
import { productsApi } from "@/api-client/products";
import { urlFor } from "@/api-client/sanity-client";
import { Seo } from "@/components/common";
import { HeroSection, InfoSection, ListSpecialProducts } from "@/components/home";
import { HeroSection2 } from "@/components/home/hero2";
import { MainLayout } from "@/components/layout";
import { Banner } from "@/models/banner";
import { NextPageWithLayout } from "@/models/common";
import { Products } from "@/models/products";
import { Box } from "@mui/material";
import { GetStaticProps } from "next";
import { motion, useScroll } from "framer-motion";

const Home: NextPageWithLayout = ({ banner, products }: Props) => {
	const ref = React.useRef(null);
	const { scrollYProgress } = useScroll({ target: ref, offset: [1, 0] });

	return (
		<div ref={ref}>
			<Seo
				data={{
					title: "INUT Design",
					description: "Tiệm may đo skin laptop theo yêu cầu, Cửa Hàng Thời Trang Dành Cho Laptop",
					url: "https://inut-design.vercel.app",
					thumbnailUrl:
						"https://res.cloudinary.com/dmspucdtf/image/upload/v1663573733/294864835_731768937929745_7146257828673250026_n_fv3uhz.webp",
				}}
			/>
			<HeroSection2 scrollYProgress={scrollYProgress} />
			<InfoSection />
			<ListSpecialProducts products={products} />
		</div>
	);
};

Home.Layout = MainLayout;

type Props = {
	banner: Banner[];
	products: Products;
	totalProducts?: number;
};

export const getStaticProps: GetStaticProps<Props> = async () => {
	const banner: Banner[] = await bannerApi.getBannerHomePage();
	const products: Products = await productsApi.getAllProducts();

	const specialProducts = products.filter((product) => product.special);

	return {
		props: {
			banner,
			products: specialProducts,
		},
		revalidate: 86400,
	};
};

export default Home;
