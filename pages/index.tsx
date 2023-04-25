import { productsApi } from "@/api-client/products";
import { Seo } from "@/components/common";
import { InfoSection, ListSpecialProducts } from "@/components/home";
import { HeroSection2 } from "@/components/home/hero2";
import { MainLayout } from "@/components/layout";
import { NextPageWithLayout } from "@/models/common";
import { Products } from "@/models/products";
import { Box } from "@mui/material";
import { GetStaticProps } from "next";

const Home: NextPageWithLayout = ({ products, macnuts }: Props) => {
	return (
		<Box>
			<Seo
				data={{
					title: "INUT Design",
					description:
						"Tiệm may đo skin laptop theo yêu cầu, Cửa Hàng Thời Trang Dành Cho Laptop, skin laptop da nang, skin laptop đà nẵng",
					url: "https://inutdesign.com",
					thumbnailUrl:
						"https://res.cloudinary.com/dmspucdtf/image/upload/v1663573733/294864835_731768937929745_7146257828673250026_n_fv3uhz.webp",
				}}
			/>
			<HeroSection2 />
			<InfoSection />
			<ListSpecialProducts products={products} />
			<ListSpecialProducts products={macnuts} isMacnut />
		</Box>
	);
};

Home.Layout = MainLayout;

type Props = {
	products: Products;
	macnuts: Products;
	totalProducts?: number;
};

export const getStaticProps: GetStaticProps<Props> = async () => {
	const products: Products = await productsApi.getAllProducts();
	const macnuts: Products = await productsApi.getAllProductsMacnut();

	const specialProducts = products.filter((product) => product.special);
	const specialMacnuts = macnuts.filter((product) => product.special);

	return {
		props: {
			products: [...specialProducts],
			macnuts: [...specialMacnuts],
		},
	};
};

export default Home;
