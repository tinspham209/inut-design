import { bannerApi } from '@/api-client/banner';
import { productsApi } from '@/api-client/products';
import { productTypeApi } from '@/api-client/productType';
import { urlFor } from '@/api-client/sanity-client';
import { Seo } from '@/components/common';
import { HeroSection, InfoSection, ListSpecialProducts } from '@/components/home';
import { MainLayout } from '@/components/layout';
import { Banner } from '@/models/banner';
import { NextPageWithLayout } from '@/models/common';
import { Products, ProductType } from '@/models/products';
import { Box } from '@mui/material';

const Home: NextPageWithLayout = ({ banner, products, productTypes, totalProducts }: Props) => {
	return (
		<Box>
			<Seo
				data={{
					title: 'INUT Design',
					description: 'Tiệm may đo skin laptop theo yêu cầu, Cửa Hàng Thời Trang Dành Cho Laptop',
					url: 'https://inut-design.vercel.app',
					thumbnailUrl:
						'https://res.cloudinary.com/dmspucdtf/image/upload/v1663573733/294864835_731768937929745_7146257828673250026_n_fv3uhz.webp',
				}}
			/>
			<HeroSection imgUrl={banner && urlFor(banner[0].image).url()} />
			<InfoSection total={totalProducts} />
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
	totalProducts?: number;
};

// export const getServerSideProps = async () => {
// 	const banner: Banner = await bannerApi.getBannerHomePage();
// 	const products: Products = await productsApi.getAllProducts();
// 	const productTypes: ProductType[] = await productTypeApi.getAll();

// 	const specialProducts = products.filter((product) => product.special);

// 	return {
// 		props: {
// 			banner,
// 			products: specialProducts,
// 			productTypes,
// 			totalProducts: products.length,
// 		},
// 	};
// };

export const getStaticProps = async () => {
	const banner: Banner = await bannerApi.getBannerHomePage();
	const products: Products = await productsApi.getAllProducts();
	const productTypes: ProductType[] = await productTypeApi.getAll();

	const specialProducts = products.filter((product) => product.special);

	return {
		props: {
			banner,
			products: specialProducts,
			productTypes,
			totalProducts: products.length,
		},
		revalidate: 86400,
	};
};

export default Home;
