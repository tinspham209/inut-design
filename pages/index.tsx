import { bannerApi } from '@/api-client/banner';
import { productsApi } from '@/api-client/products';
import { productTypeApi } from '@/api-client/productType';
import { Seo } from '@/components/common';
import { HeroSection, ListSpecialProducts } from '@/components/home';
import { MainLayout } from '@/components/layout';
import { Banner } from '@/models/banner';
import { NextPageWithLayout } from '@/models/common';
import { Products, ProductType } from '@/models/products';
import { Box } from '@mui/material';

const Home: NextPageWithLayout = ({ banner, products, productTypes }: Props) => {
	return (
		<Box>
			<Seo
				data={{
					title: 'INUT Design',
					description: 'Tiệm may đo skin laptop theo yêu cầu',
					url: 'https://inut-design.vercel.app',
					thumbnailUrl:
						'https://res.cloudinary.com/dmspucdtf/image/upload/v1663573733/294864835_731768937929745_7146257828673250026_n_fv3uhz.webp',
				}}
			/>
			<HeroSection banner={banner && banner[0]} />
			<ListSpecialProducts products={products} productTypes={productTypes} />
			{/* <RecentPosts /> */}
			{/* <FeaturedWorks /> */}
		</Box>
	);
};

Home.Layout = MainLayout;

type Props = {
	banner: Banner[];
	products: Products;
	productTypes: ProductType[];
};

export const getServerSideProps = async () => {
	const banner: Banner = await bannerApi.getBanner();
	const products: Products = await productsApi.getAllProducts();
	const productTypes: ProductType[] = await productTypeApi.getAll();

	const specialProducts = products.filter((product) => product.special);

	return {
		props: {
			banner,
			products: specialProducts,
			productTypes,
		},
	};
};

export default Home;
