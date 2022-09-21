import { bannerApi } from '@/api-client/banner';
import { productsApi } from '@/api-client/products';
import { productTypeApi } from '@/api-client/productType';
import { urlFor } from '@/api-client/sanity-client';
import { Seo } from '@/components/common';
import { HeroSection } from '@/components/home';
import { MainLayout } from '@/components/layout';
import { ProductCard } from '@/components/product';
import { Banner } from '@/models/banner';
import { NextPageWithLayout } from '@/models/common';
import { Products, ProductType } from '@/models/products';
import { Box, Breadcrumbs, Container, Grid, Link as MuiLink, Typography } from '@mui/material';
import Link from 'next/link';
import CountUp from 'react-countup';

const Home: NextPageWithLayout = ({ products, productTypes, banner }: Props) => {
	return (
		<Box component={'section'} bgcolor="secondary.light" pt={4} pb={4}>
			<Seo
				data={{
					title: 'Sản phẩm - INUT Design',
					description: 'Tiệm may đo skin laptop theo yêu cầu, Cửa Hàng Thời Trang Dành Cho Laptop',
					url: 'https://inut-design.vercel.app',
					thumbnailUrl:
						'https://res.cloudinary.com/dmspucdtf/image/upload/v1663573733/294864835_731768937929745_7146257828673250026_n_fv3uhz.webp',
				}}
			/>

			<HeroSection imgUrl={banner && urlFor(banner[0].image).url()} />
			<Container>
				<Box>
					<Breadcrumbs>
						<Link href={'/'} passHref>
							<MuiLink>Trang chủ</MuiLink>
						</Link>

						<Typography color="text.primary">Sản phẩm</Typography>
					</Breadcrumbs>
					<Box mt={3}>
						<Typography variant="h2" fontWeight="bold" textAlign="center">
							Sản phẩm (<CountUp end={products.length} duration={2} />)
						</Typography>
					</Box>
					<Grid container spacing={3} mt={3}>
						{products.map((product) => (
							<Grid item xs={6} sm={4} md={3} key={product._id}>
								<ProductCard product={product} productTypes={productTypes} />
							</Grid>
						))}
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

// export const getServerSideProps = async () => {
// 	const products: Products = await productsApi.getAllProducts();
// 	const productTypes: ProductType[] = await productTypeApi.getAll();
// 	const banner: Banner = await bannerApi.getBannerProductsPage();

// 	return {
// 		props: {
// 			products,
// 			productTypes,
// 			banner,
// 		},
// 	};
// };

export const getStaticProps = async () => {
	const products: Products = await productsApi.getAllProducts();
	const productTypes: ProductType[] = await productTypeApi.getAll();
	const banner: Banner = await bannerApi.getBannerProductsPage();

	return {
		props: {
			products,
			productTypes,
			banner,
		},
		revalidate: 120,
	};
};

export default Home;
