import { bannerApi } from '@/api-client/banner'
import { productsApi } from '@/api-client/products'
import { Seo } from '@/components/common'
import { HeroSection, ListSpecialProducts } from '@/components/home'
import { MainLayout } from '@/components/layout'
import { Banner } from '@/models/banner'
import { NextPageWithLayout } from '@/models/common'
import { Products } from '@/models/products'
import { Box } from '@mui/material'

const Home: NextPageWithLayout = ({ banner, products }: Props) => {
	console.log('products: ', products)
	return (
		<Box>
			<Seo
				data={{
					title: 'INUT Design - Tiệm may đo skin laptop theo yêu cầu',
					description: 'Tiệm may đo skin laptop theo yêu cầu',
					url: 'https://inut-design.vercel.app',
					thumbnailUrl:
						'https://res.cloudinary.com/dmspucdtf/image/upload/v1663573733/294864835_731768937929745_7146257828673250026_n_fv3uhz.webp',
				}}
			/>
			<HeroSection banner={banner && banner[0]} />
			<ListSpecialProducts products={products} />
			{/* <RecentPosts /> */}
			{/* <FeaturedWorks /> */}
		</Box>
	)
}

Home.Layout = MainLayout

type Props = {
	banner: Banner[]
	products: Products
}

export const getServerSideProps = async () => {
	const banner: Banner = await bannerApi.getBanner()
	const products: Products = await productsApi.getAllProducts()

	const specialProducts = products.filter((product) => product.special)

	return {
		props: {
			banner,
			products: specialProducts,
		},
	}
}

export default Home
