/* eslint-disable @next/next/no-img-element */
import { priceLaptopApi } from "@/api-client/priceLaptop";
import { productsApi } from "@/api-client/products";
import { urlFor } from "@/api-client/sanity-client";
import { Seo } from "@/components/common";
import { MainLayout } from "@/components/layout";
import { PriceLaptop } from "@/models/price-laptop";
import { Product, Products } from "@/models/products";
import {
	Box,
	Breadcrumbs,
	Button,
	Container,
	Divider,
	Grid,
	Link as MuiLink,
	Stack,
	Typography,
} from "@mui/material";
import { sendGAEvent } from "@next/third-parties/google";
import { GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import Router from "next/router";
import React from "react";
import Lightbox from "react-awesome-lightbox";
import "react-awesome-lightbox/build/style.css";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import styles from "./productItem.module.css";
type Props = {
	product: Product;
	products: Products;
	priceLaptop: PriceLaptop;
};

const ProductDetail = ({ product, products, priceLaptop }: Props) => {
	const [isOpenLightBox, setIsOpenLightBox] = React.useState(false);

	const price = React.useMemo(() => {
		if (priceLaptop) {
			return priceLaptop.price;
		} else {
			return "XXX";
		}
	}, [priceLaptop]);

	return (
		<>
			<Seo
				data={{
					title: `${product.name} - Nút Phím - INUT Design`,
					description: `Skin Nút Phím ${product.name} dành cho laptop, Giá chỉ ${price}`,
					url: `https://inutdesign.com/macnut/${product.slug.current}`,
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
							mt: 2,
							mb: 2,
						}}
					>
						<Link href={"/"} passHref>
							<MuiLink>Trang chủ</MuiLink>
						</Link>
						<Link href={`/macnut#${product.slug.current}`} passHref>
							<MuiLink>Nút Phím</MuiLink>
						</Link>
						<Typography color="text.primary">{product.name}</Typography>
					</Breadcrumbs>

					<Button
						variant="outlined"
						color="primary"
						onClick={() => {
							Router.back();
						}}
					>
						Trở về
					</Button>
					<Grid
						container
						spacing={{ xs: 2, md: 4 }}
						flexDirection={{ xs: "column", md: "row" }}
						pt={2}
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
											unoptimized
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
											unoptimized
											alt="product-image"
											className={styles.productImage}
										/>
									</Box>
								))}
							</Carousel>
						</Grid>
						<Grid item xs={12} md={6}>
							<Typography
								variant="h3"
								fontWeight="bold"
								mt={{
									xs: 22,
									md: 2,
								}}
							>
								{product.name}
							</Typography>

							<Stack flexDirection={"row"} alignItems={"center"} mt={2}>
								<Typography variant="body1" fontWeight={"bold"}>
									Tình trạng:
								</Typography>
								<Typography variant="body1" fontWeight={"bold"} color={"success.light"} ml={2}>
									Còn hàng
								</Typography>
							</Stack>
							<Stack mt={2}>
								<Typography variant="body1" mb={2}>
									Freeship toàn quốc 0Đ
								</Typography>
							</Stack>
							<Stack flexDirection="row" alignItems={"center"}>
								<MuiLink
									href={`https://m.me/642209429738886?text=${encodeURI(
										`I want to order product macnut ${product.name}. Can you support me?`
									)}`}
									target="_blank"
									rel="noopener noreferrer"
								>
									<Button
										variant="contained"
										color="primary"
										sx={{ mr: 2 }}
										onClick={() => {
											sendGAEvent("event", "buttonClicked", {
												value: product.name,
												category: "skin macnut",
											});
										}}
									>
										Đặt hàng
									</Button>
								</MuiLink>
								<Link href="/contact" passHref>
									<MuiLink>
										<Button variant="outlined" color="primary">
											Liên hệ tư vấn
										</Button>
									</MuiLink>
								</Link>
							</Stack>
							<Box py={3}>
								<Typography variant="h6" fontWeight={"bold"}>
									Mô tả sản phẩm:
								</Typography>
								<Typography variant="body1" mt={1}>
									<b>Chất liệu</b>: Film Vinyl chuyên ứng dụng trong ngành ô tô, dùng để bảo vệ sơn
									tránh khỏi trầy xước, tác động của ngoại lực trong thời gian sử dụng
								</Typography>
								<Typography variant="body1" mt={1}>
									<b>Chống nước</b>: Có
								</Typography>
								<Typography variant="body1" mt={1}>
									<b>Loại máy phù hợp</b>: Cắt theo kích thước laptop, in hình, chọn phối màu tuỳ ý
								</Typography>
								<Typography variant="body1" mt={1}>
									<b>Vệ sinh máy</b>: Có, sẽ vệ sinh vỏ ngoài. Không vệ sinh bên trong máy.
								</Typography>
								<Typography variant="body1" mt={1}>
									<b>Dữ liệu máy tính</b>: Không mất dữ liệu, không can thiệp vào bên trong máy cũng
									như không mở máy. Chỉ vệ sinh và dán ở vỏ ngoài.
								</Typography>
								<Typography variant="body1" mt={1}>
									<b>Mô tả thêm</b>: {product.details}
								</Typography>
							</Box>
						</Grid>
					</Grid>
				</Container>
			</Box>

			<Box component={"section"} bgcolor="secondary.dark">
				<Box mt={2}>
					<Divider />
				</Box>
				<Container>
					<Box py={4}>
						<Typography variant="h6" fontWeight={"bold"}>
							Cam Kết Mua Sản Phẩm tại INUT
						</Typography>
						<Typography variant="body1" mt={1}>
							1. Cam kết sản phẩm chất lượng 100% so với hình ảnh quảng cáo <br />
							2. Mọi thông tin quảng cáo đều phù hợp với sản phẩm thực tế <br />
							3. Nếu sản phẩm bị lỗi hoặc xảy ra sự cố trong quá trình vận chuyển, sử dụng. Chúng
							tôi sẽ hỗ trợ ngay cho quý khách hàng và sẽ chịu trách nhiệm hoàn toàn để phục vụ
							khách hàng tốt nhất
							<br />
							4. Cam kết bảo hành mọi vấn đề trong vòng 2 tháng sử dụng sản phẩm <br />
						</Typography>
					</Box>
				</Container>
				<Box mt={2}>
					<Divider />
				</Box>
			</Box>

			<Box component={"section"} pt={2} mt={2}>
				<Typography variant="h3" mt={2} fontWeight="bold" textAlign="center">
					Có thể bạn sẽ thích
				</Typography>
				<div className="">
					<div className="marquee">
						<div className="maylike-products-container track macnut">
							{products.map((product) => (
								<Link href={`/macnut/${product.slug.current}`} passHref key={product._id}>
									<MuiLink>
										<img
											src={urlFor(product.image[0]).width(500).url()}
											width={250}
											height={250}
											alt="product-image"
											className={styles.productImage}
										/>
										<Typography
											variant="h6"
											mt={1}
											fontWeight="bold"
											textAlign="center"
											sx={{
												mt: 1,
												fontWeight: "bold",
												textAlign: "center",
												whiteSpace: "nowrap",
												textOverflow: "ellipsis",
												overflow: "hidden",
											}}
										>
											{product.name}
										</Typography>
									</MuiLink>
								</Link>
							))}
						</div>
					</div>
				</div>
				<Divider />
			</Box>
		</>
	);
};

export const getStaticPaths = async () => {
	const products = await productsApi.getAllSlugsMacnut();

	const paths = products
		.filter((product) => product.slug !== null)
		.map((product) => ({
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
	const product = await productsApi.getProductBySlugMacnut(slug as string);
	const products = await productsApi.getAllProductsMacnut();
	const priceLaptop = await priceLaptopApi.getBySlug("mat-phim");

	return {
		props: {
			product,
			products: products.filter((product) => !product._id.includes("drafts")),
			priceLaptop: priceLaptop,
		},
		revalidate: 86400,
	};
};

ProductDetail.Layout = MainLayout;

export default ProductDetail;
