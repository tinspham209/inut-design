import { productsApi } from '@/api-client/products';
import { productTypeApi } from '@/api-client/productType';
import { Seo } from '@/components/common';
import { MainLayout } from '@/components/layout';
import { ProductCard } from '@/components/product';
import { NextPageWithLayout } from '@/models/common';
import { Products, ProductType } from '@/models/products';
import { Box, Breadcrumbs, Container, Grid, Link as MuiLink, Typography } from '@mui/material';
import Link from 'next/link';

const Home: NextPageWithLayout = ({ products, productTypes }: Props) => {
	return (
		<Box component={'section'} bgcolor="secondary.light" pt={4} pb={4}>
			<Seo
				data={{
					title: 'Sản phẩm- INUT Design - Tiệm may đo skin laptop theo yêu cầu',
					description: 'Tiệm may đo skin laptop theo yêu cầu',
					url: 'https://inut-design.vercel.app',
					thumbnailUrl:
						'https://res.cloudinary.com/dmspucdtf/image/upload/v1663573733/294864835_731768937929745_7146257828673250026_n_fv3uhz.webp',
				}}
			/>

			<Container>
				<Breadcrumbs>
					<Link href={'/'} passHref>
						<MuiLink>Trang chủ</MuiLink>
					</Link>

					<Typography color="text.primary">Sản phẩm</Typography>
				</Breadcrumbs>
				<Grid container spacing={3} mt={3}>
					{products.map((product) => (
						<Grid item xs={6} sm={4} md={3} key={product._id}>
							<ProductCard product={product} productTypes={productTypes} />
						</Grid>
					))}
				</Grid>
			</Container>
		</Box>
	);
};

Home.Layout = MainLayout;

type Props = {
	products: Products;
	productTypes: ProductType[];
};

export const getServerSideProps = async () => {
	const products: Products = await productsApi.getAllProducts();
	const productTypes: ProductType[] = await productTypeApi.getAll();

	return {
		props: {
			products,
			productTypes,
		},
	};
};

export default Home;
