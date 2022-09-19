/* eslint-disable @next/next/no-img-element */
import { productsApi } from '@/api-client/products';
import { urlFor } from '@/api-client/sanity-client';
import { Seo } from '@/components/common';
import { MainLayout } from '@/components/layout';
import { Product, Products } from '@/models/products';
import {
	Breadcrumbs,
	Button,
	Container,
	Grid,
	Stack,
	Typography,
	Link as MuiLink,
} from '@mui/material';
import { Box } from '@mui/system';
import Image from 'next/image';
import React from 'react';
import Lightbox from 'react-awesome-lightbox';
import 'react-awesome-lightbox/build/style.css';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import styles from './productItem.module.css';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import Link from 'next/link';

type Props = {
	product: Product;
	products: Products;
};

const ProductDetail = ({ product, products }: Props) => {
	const [isOpenLightBox, setIsOpenLightBox] = React.useState(false);

	const randomRange = (min: number, max: number) => {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	return (
		<>
			<Seo
				data={{
					title: `${product.name} - INUT Design`,
					description: 'Tiệm may đo skin laptop theo yêu cầu',
					url: `https://inut-design.vercel.app/products/${product.slug}`,
					thumbnailUrl: urlFor(product.image[0]).url(),
				}}
			/>
			{isOpenLightBox && (
				<Lightbox
					className=""
					images={product.image.map((image, index) => {
						return {
							url: urlFor(image),
							title: product.name,
						};
					})}
					onClose={() => setIsOpenLightBox(false)}
				/>
			)}
			<Container>
				<Breadcrumbs>
					<Link href={'/'} passHref>
						<MuiLink>Trang chủ</MuiLink>
					</Link>
					<Link href={'/products'} passHref>
						<MuiLink>Sản phẩm</MuiLink>
					</Link>
					<Typography color="text.primary">{product.name}</Typography>
				</Breadcrumbs>
				<Grid
					container
					spacing={{ xs: 2, md: 4 }}
					flexDirection={{ xs: 'column', md: 'row' }}
					pt={4}
				>
					<Grid item xs={12} md={6}>
						<Carousel
							autoPlay
							infiniteLoop
							showIndicators
							showThumbs
							thumbWidth={80}
							renderThumbs={() =>
								product.image.map((thumbnail) => (
									<Image
										src={urlFor(thumbnail).url()}
										alt={'product-image-thumbnail'}
										key={thumbnail._key}
										width="100%"
										height="100%"
										layout="responsive"
										className={styles.productImage}
									/>
								))
							}
							useKeyboardArrows
							stopOnHover
							swipeable
							emulateTouch
							interval={3000}
							transitionTime={500}
							centerSlidePercentage={80}
							ariaLabel="Carousel Product Image"
						>
							{product.image.map((image, index) => (
								<Box
									key={image._key}
									onClick={() => {
										setIsOpenLightBox(true);
									}}
									sx={{
										cursor: 'pointer',
									}}
								>
									<Image
										src={urlFor(image).url()}
										width="100%"
										height={'100%'}
										layout="responsive"
										alt="product-image"
										className={styles.productImage}
									/>
								</Box>
							))}
						</Carousel>
					</Grid>
					<Grid item xs={12} md={6}>
						<Typography variant="h3" fontWeight="bold" mt={2}>
							{product.name}
						</Typography>
						<Stack
							flexDirection="row"
							alignItems={'center'}
							mt={2}
							sx={{
								'& svg': {
									color: '#f8e825',
								},
							}}
						>
							<AiFillStar />
							<AiFillStar />
							<AiFillStar />
							<AiFillStar />
							<AiOutlineStar />
							<Typography variant="body1" sx={{ ml: 1 }}>
								({randomRange(1, 15)} đánh giá)
							</Typography>
						</Stack>
						<Typography variant="h5" mt={2}>
							{product.details}
						</Typography>
						<Stack sx={{ mt: 4 }} flexDirection="row" alignItems={'center'}>
							<MuiLink
								href="https://m.me/642209429738886"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Button variant="contained" color="primary" sx={{ mr: 2 }}>
									Đặt hàng
								</Button>
							</MuiLink>
							<MuiLink
								href="https://m.me/642209429738886"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Button variant="outlined" color="primary">
									Nhận báo giá
								</Button>
							</MuiLink>
						</Stack>
					</Grid>
				</Grid>
				<Box>
					<Typography variant="h2" mt={2} fontWeight="bold" textAlign="center">
						Có thể bạn sẽ thích
					</Typography>
					<div className="">
						<div className="marquee">
							<div className="maylike-products-container track">
								{products.map((product) => (
									<Link href={`/products/${product.slug.current}`} passHref key={product._id}>
										<MuiLink>
											<img
												src={urlFor(product.image[0]).url()}
												width={250}
												height={250}
												alt="product-image"
												className={styles.productImage}
											/>
											<Typography variant="body1" mt={2} fontWeight="bold" textAlign="center">
												{product.name}
											</Typography>
										</MuiLink>
									</Link>
								))}
							</div>
						</div>
					</div>
				</Box>
			</Container>
		</>
	);
};

export const getStaticPaths = async () => {
	const query = `*[_type == "product"]{
    slug {
      current
    }
  }`;

	const products = await productsApi.getAllSlugs();

	const paths = products.map((product) => ({
		params: {
			slug: product.slug.current,
		},
	}));
	return {
		paths,
		fallback: false,
	};
};

export const getStaticProps = async ({ params: { slug } }) => {
	const product = await productsApi.getProductBySlug(slug);
	const products = await productsApi.getAllProducts();

	return {
		props: {
			product,
			products,
		},
	};
};

ProductDetail.Layout = MainLayout;
export default ProductDetail;
