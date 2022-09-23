/* eslint-disable @next/next/no-img-element */
import { productsApi } from "@/api-client/products";
import { urlFor } from "@/api-client/sanity-client";
import { Seo } from "@/components/common";
import { MainLayout } from "@/components/layout";
import { Product, Products } from "@/models/products";
import {
	Breadcrumbs,
	Button,
	Container,
	Grid,
	Link as MuiLink,
	Stack,
	Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Lightbox from "react-awesome-lightbox";
import "react-awesome-lightbox/build/style.css";
import CountUp from "react-countup";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import styles from "./productItem.module.css";

type Props = {
	product: Product;
	products: Products;
	votes: number;
};

const ProductDetail = ({ product, products, votes }: Props) => {
	const [isOpenLightBox, setIsOpenLightBox] = React.useState(false);

	return (
		<>
			<Seo
				data={{
					title: `${product.name} - Sản phẩm - INUT Design`,
					description: "Tiệm may đo skin laptop theo yêu cầu, Cửa Hàng Thời Trang Dành Cho Laptop",
					url: `https://inut-design.vercel.app/products/${product.slug.current}`,
					thumbnailUrl: urlFor(product.image[0]).width(1000).url(),
				}}
			/>
			{isOpenLightBox && (
				<Lightbox
					className=""
					images={product.image.map((image) => {
						return {
							url: urlFor(image),
							title: product.name,
						};
					})}
					onClose={() => setIsOpenLightBox(false)}
				/>
			)}
			<Box component={"section"}>
				<Container>
					<Breadcrumbs
						sx={{
							mt: 1,
							mb: 2,
						}}
					>
						<Link href={"/"} passHref>
							<MuiLink>Trang chủ</MuiLink>
						</Link>
						<Link href={`/products#${product.slug.current}`} passHref>
							<MuiLink>Sản phẩm</MuiLink>
						</Link>
						<Typography color="text.primary">{product.name}</Typography>
					</Breadcrumbs>
					<Link
						href={`/products`}
						passHref
					>
						<MuiLink>
							<Button variant="outlined" color="primary" sx={{ mr: 2 }}>
								Trở về
							</Button>
						</MuiLink>
					</Link>
					<Grid
						container
						spacing={{ xs: 2, md: 4 }}
						flexDirection={{ xs: "column", md: "row" }}
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
											src={urlFor(thumbnail).width(200).url()}
											alt={"product-image-thumbnail"}
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
								{product.image.map((image) => (
									<Box
										key={image._key}
										onClick={() => {
											setIsOpenLightBox(true);
										}}
										sx={{
											cursor: "pointer",
										}}
									>
										<Image
											src={urlFor(image).width(1000).url()}
											width="100%"
											height={"100%"}
											layout="responsive"
											priority={true}
											alt="product-image"
											className={styles.productImage}
										/>
									</Box>
								))}
							</Carousel>
						</Grid>
						<Grid item xs={12} md={6}>
							<Typography variant="h3" fontWeight="bold" mt={{
								xs: 10,
								md: 2
							}}>
								{product.name}
							</Typography>
							<Stack
								flexDirection="row"
								alignItems={"center"}
								mt={2}
								sx={{
									"& svg": {
										color: "#f8e825",
									},
								}}
							>
								<AiFillStar />
								<AiFillStar />
								<AiFillStar />
								<AiFillStar />
								<AiOutlineStar />
								<Typography variant="body1" sx={{ ml: 1 }}>
									(<CountUp end={votes} duration={2} /> đánh giá)
								</Typography>
							</Stack>
							<Typography variant="h5" mt={2}>
								{product.details}
							</Typography>
							<Stack sx={{ mt: 4 }} flexDirection="row" alignItems={"center"}>
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
				</Container>
			</Box>

			<Box component={"section"} bgcolor="secondary.light" pt={2} mt={2}>
				<Container>
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
												src={urlFor(product.image[0]).width(500).url()}
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
				</Container>
			</Box>
		</>
	);
};

export const getStaticPaths = async () => {
	const products = await productsApi.getAllSlugs();

	const paths = products.map((product) => ({
		params: {
			slug: product.slug.current,
		},
	}));
	return {
		paths,
		fallback: "blocking",
	};
};

export const getStaticProps: GetStaticProps<Props> = async ({ params: { slug } }) => {
	const product = await productsApi.getProductBySlug(slug as string);
	const products = await productsApi.getAllProducts();

	const randomRange = (min: number, max: number) => {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	return {
		props: {
			product,
			products,
			votes: randomRange(1, 15),
		},
		revalidate: 86400,
	};
};

ProductDetail.Layout = MainLayout;

export default ProductDetail;
