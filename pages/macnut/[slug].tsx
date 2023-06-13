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
	Divider,
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
import Router from "next/router";
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
					title: `${product.name} - Macnut - INUT Design`,
					description:
						"Tiệm may đo skin laptop theo yêu cầu, Cửa Hàng Thời Trang Dành Cho Laptop, skin laptop da nang, skin laptop đà nẵng",
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
							mt: 1,
							mb: 2,
						}}
					>
						<Link href={"/"} passHref>
							<MuiLink>Trang chủ</MuiLink>
						</Link>
						<Link href={`/products#${product.slug.current}`} passHref>
							<MuiLink>Nút Phím</MuiLink>
						</Link>
						<Typography color="text.primary">{product.name}</Typography>
					</Breadcrumbs>

					<Button
						variant="outlined"
						color="primary"
						sx={{ mr: 2 }}
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
								variant="h1"
								fontWeight="bold"
								mt={{
									xs: 10,
									md: 2,
								}}
							>
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
							<Stack flexDirection={"row"} alignItems={"center"} mt={1}>
								<Typography variant="h6">Tình trạng:</Typography>
								<Typography variant="h6" color={"success.light"} ml={2}>
									Còn hàng
								</Typography>
							</Stack>
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

			<Box component={"section"} bgcolor="secondary.dark">
				<Box mt={2}>
					<Divider />
				</Box>
				<Container>
					<Box py={4}>
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
							khách hàng.
						</Typography>
						<Typography variant="body1" mt={1}>
							<b>Vệ sinh máy</b>: Có, chúng tôi sẽ vệ sinh vỏ ngoài của laptop trước khi dán. Không
							vệ sinh bên trong máy.
						</Typography>
						<Typography variant="body1" mt={1}>
							<b>Dữ liệu máy tính</b>: Không mất dữ liệu, không can thiệp vào bên trong máy cũng như
							không mở máy. Chỉ vệ sinh và dán ở vỏ ngoài.
						</Typography>
						<Typography variant="body1" mt={1}>
							<b>Mô tả thêm</b>: {product.details}
						</Typography>
					</Box>
					<Divider />
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
				<Container>
					<Typography variant="h2" mt={2} fontWeight="bold" textAlign="center">
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
				</Container>
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

	const randomRange = (min: number, max: number) => {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	return {
		props: {
			product,
			products: products.filter((product) => !product._id.includes("drafts")),
			votes: randomRange(1, 15),
		},
		revalidate: 86400,
	};
};

ProductDetail.Layout = MainLayout;

export default ProductDetail;
