import { bannerApi } from "@/api-client/banner";
import { productsApi } from "@/api-client/products";
import { productTypeApi } from "@/api-client/productType";
import { urlFor } from "@/api-client/sanity-client";
import { Seo } from "@/components/common";
import { HeroSection } from "@/components/home";
import { MainLayout } from "@/components/layout";
import { ProductCard } from "@/components/product";
import { Banner } from "@/models/banner";
import { NextPageWithLayout } from "@/models/common";
import { Products, ProductType } from "@/models/products";
import { COLOR_CODE } from "@/utils";
import { Box, Breadcrumbs, Container, Grid, Link as MuiLink, Typography } from "@mui/material";
import Link from "next/link";
import { GetStaticProps } from "next/types";
import CountUp from "react-countup";
const Home: NextPageWithLayout = ({ products, productTypes, banner }: Props) => {
	return (
		<Box component={"section"} bgcolor="secondary.dark" pt={4} pb={4}>
			<Seo
				data={{
					title: "Macnut - INUT Design",
					description:
						"Tiệm may đo skin laptop theo yêu cầu, Cửa Hàng Thời Trang Dành Cho Laptop, skin laptop da nang, skin laptop đà nẵng",
					url: "https://inutdesign.com/macnut",
					thumbnailUrl:
						(banner && urlFor(banner[0].image).url()) ||
						"https://res.cloudinary.com/dmspucdtf/image/upload/v1663573733/294864835_731768937929745_7146257828673250026_n_fv3uhz.webp",
				}}
			/>

			<HeroSection imgUrl={banner && urlFor(banner[0].image).url()} />
			<Container>
				<Box>
					<Breadcrumbs>
						<Link href={"/"} passHref>
							<MuiLink>Trang chủ</MuiLink>
						</Link>

						<Typography color={COLOR_CODE.WHITE}>Macnut</Typography>
					</Breadcrumbs>
					<Box mt={3}>
						<Typography
							variant="h2"
							fontWeight="bold"
							textAlign="center"
							fontFamily={'"Zawtturee", "Bangers" ,"Roboto", sans-serif'}
							letterSpacing="10px"
						>
							Sản phẩm (<CountUp end={products.length} duration={2} />)
						</Typography>
					</Box>
					<Grid
						container
						spacing={2}
						mt={3}
						flexDirection={{
							xs: "column-reverse",
							md: "row",
						}}
					>
						<Grid container item xs={12} spacing={3} id="productTitle">
							{products.map((product) => {
								return (
									<Grid item xs={6} md={4} key={product._id}>
										<ProductCard product={product} productTypes={productTypes} isMacnut />
									</Grid>
								);
							})}
						</Grid>
					</Grid>
				</Box>
			</Container>
		</Box>
	);
};

Home.Layout = MainLayout;

type Props = {
	products: Products;
	productTypes: ProductType[];
	banner: Banner[];
};

export const getStaticProps: GetStaticProps<Props> = async () => {
	const products: Products = await productsApi.getAllProductsMacnut();
	const productTypes: ProductType[] = await productTypeApi.getAll();
	const banner: Banner[] = await bannerApi.getBannerPage("macnut-page");

	const formatProducts = products
		.filter((product) => !product._id.includes("drafts"))
		.map((product) => {
			return {
				...product,
				type:
					productTypes.find((productType) => productType._id === product.productType._ref).slug
						?.current || "",
			};
		});

	return {
		props: {
			products: formatProducts,
			productTypes,
			banner,
		},
	};
};

export default Home;
