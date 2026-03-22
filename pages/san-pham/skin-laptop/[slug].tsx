/* eslint-disable @next/next/no-img-element */
import { productsApi } from "@/api-client/products";
import { urlFor } from "@/api-client/sanity-client";
import { Seo } from "@/components/common";
import { MainLayout } from "@/components/layout";
import { Product, Products } from "@/models/products";
import { trackViewProduct, trackOrderButtonClick } from "@/utils/analytics";
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
	useMediaQuery,
	useTheme,
} from "@mui/material";
import { GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import "yet-another-react-lightbox/styles.css";
import { Portal } from "@/components/common/Portal";
// import CountUp from "react-countup";
// import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import styles from "./productItem.module.css";

const Carousel = dynamic(() => import("react-material-ui-carousel"), { ssr: false });
const Lightbox = dynamic(() => import("yet-another-react-lightbox"), { ssr: false });
import { staticContentEachPageApi } from "@/api-client/staticContentEachPage";
import { StaticContentEachPage } from "@/models";
import BlockContentWrapper from "@/components/common/block-content";

const ProductDetail = ({ product, products, staticContent }: Props) => {
	const router = useRouter();
	const [isOpenLightBox, setIsOpenLightBox] = React.useState(false);
	const [lightboxIndex, setLightboxIndex] = React.useState(0);

	// Track product view on mount
	React.useEffect(() => {
		if (product) {
			trackViewProduct({
				id: product._id,
				name: product.name,
				category: "Laptop Skin",
				brand: "INUT Design",
			});
		}
	}, [product]);

	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
	const isTablet = useMediaQuery(theme.breakpoints.down("md"));
	const itemsPerPage = isMobile ? 1 : isTablet ? 3 : 5;

	const chunkedProducts = React.useMemo(() => {
		const chunks = [];
		for (let i = 0; i < products.length; i += itemsPerPage) {
			chunks.push(products.slice(i, i + itemsPerPage));
		}
		return chunks;
	}, [products, itemsPerPage]);

	return (
		<>
			<Seo
				data={{
					title: `${product.name} - Sản phẩm - INUT Design`,
					description: `Skin ${product.name} dành cho laptop`,
					url: `https://inutdesign.com/san-pham/skin-laptop/${product.slug.current}`,
					thumbnailUrl: urlFor(product.image[0]).width(1000).url(),
				}}
			/>
			{isOpenLightBox && (
				<Portal>
					<Lightbox
						open={isOpenLightBox}
						close={() => setIsOpenLightBox(false)}
						index={lightboxIndex}
						slides={product.image.map((image) => ({
							src: urlFor(image).url(),
						}))}
					/>
				</Portal>
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
						<Link href={`/san-pham/skin-laptop#${product.slug.current}`} passHref>
							<MuiLink>Sản phẩm</MuiLink>
						</Link>
						<Typography color="text.primary">{product.name}</Typography>
					</Breadcrumbs>

					<Button
						variant="outlined"
						color="primary"
						onClick={() => {
							router.back();
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
								indicators={true}
								navButtonsAlwaysVisible={true}
								index={lightboxIndex}
								onChange={(now) => setLightboxIndex(now as number)}
							>
								{product.image.map((image, idx) => (
									<Box
										key={image._key}
										onClick={() => {
											setIsOpenLightBox(true);
										}}
										sx={{
											cursor: "pointer",
											position: "relative",
											height: { xs: 300, md: 500 },
										}}
									>
										<Image
											src={urlFor(image).width(1000).url()}
											layout="fill"
											priority={idx === 0}
											unoptimized
											alt="product-image"
											className={styles.productImage}
											style={{ objectFit: "cover" }}
										/>
									</Box>
								))}
							</Carousel>
							{/* Thumbnails */}
							<Box sx={{ display: "flex", gap: 1, mt: 2, overflowX: "auto", pb: 1 }}>
								{product.image.map((thumbnail, idx) => (
									<Box
										key={`thumb-${thumbnail._key}`}
										onClick={() => setLightboxIndex(idx)}
										sx={{
											width: 80,
											height: 80,
											flexShrink: 0,
											cursor: "pointer",
											border: "2px solid",
											borderColor: lightboxIndex === idx ? "primary.main" : "transparent",
											borderRadius: "8px",
											overflow: "hidden",
											opacity: lightboxIndex === idx ? 1 : 0.6,
											transition: "all 0.2s",
											"&:hover": { opacity: 1 },
										}}
									>
										<Image
											src={urlFor(thumbnail).width(200).url()}
											alt={"product-image-thumbnail"}
											width={80}
											height={80}
											unoptimized
											style={{ objectFit: "cover" }}
										/>
									</Box>
								))}
							</Box>
						</Grid>
						<Grid item xs={12} md={6}>
							<Typography
								variant="h3"
								fontWeight="bold"
								mt={{
									xs: 2,
									md: 2,
								}}
							>
								{product.name}
							</Typography>
							<Stack flexDirection={"row"} alignItems={"center"} my={2}>
								<Typography variant="body1" fontWeight={"bold"}>
									Tình trạng:
								</Typography>
								<Typography variant="body1" fontWeight={"bold"} color={"success.light"} ml={2}>
									Còn hàng
								</Typography>
							</Stack>

							<Stack flexDirection="row" alignItems={"center"}>
								<MuiLink
									href={`https://m.me/642209429738886?text=${encodeURI(
										`I want to order product laptop ${product.name}. Can you support me?`
									)}`}
									target="_blank"
									rel="noopener noreferrer"
								>
									<Button
										variant="contained"
										color="primary"
										sx={{ mr: 2 }}
										onClick={() => {
											trackOrderButtonClick(product.name, "skin laptop");
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
								<Box mt={1}>
									<BlockContentWrapper blocks={staticContent?.moTaSanPham} />
								</Box>
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
						<Box mt={1}>
							<BlockContentWrapper blocks={staticContent?.camKetMuaHang} />
						</Box>
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
				<Box sx={{ maxWidth: "100%", overflow: "hidden", px: { xs: 2, md: 4 }, py: 4 }}>
					<Carousel
						autoPlay
						animation="slide"
						indicators={chunkedProducts.length > 1}
						navButtonsAlwaysVisible={!isMobile && chunkedProducts.length > 1}
						cycleNavigation
						interval={5000}
						duration={1000}
						sx={{
							minHeight: 350,
							"& .MuiButtonBase-root": {
								backgroundColor: "rgba(0,0,0,0.1)",
								color: "black",
								"&:hover": {
									backgroundColor: "rgba(0,0,0,0.2)",
								},
							},
						}}
					>
						{chunkedProducts.map((chunk, chunkIdx) => (
							<Grid container spacing={2} key={chunkIdx} justifyContent="center">
								{chunk.map((relatedProduct) => (
									<Grid item xs={12} sm={4} md={2.4} key={relatedProduct._id}>
										<Link
											href={`/san-pham/skin-laptop/${relatedProduct.slug.current}`}
											passHref
											style={{ textDecoration: "none" }}
										>
											<MuiLink sx={{ textDecoration: "none", display: "block" }}>
												<Box
													sx={{
														position: "relative",
														width: "100%",
														pt: "100%", // 1:1 Aspect Ratio
														borderRadius: "8px",
														overflow: "hidden",
														boxShadow: 1,
														transition: "transform 0.3s",
														"&:hover": {
															transform: "scale(1.05)",
														},
													}}
												>
													<Image
														src={urlFor(relatedProduct.image[0]).width(500).url()}
														layout="fill"
														objectFit="cover"
														unoptimized
														alt={relatedProduct.name}
													/>
												</Box>
												<Typography
													variant="h6"
													mt={1}
													fontWeight="bold"
													textAlign="center"
													sx={{
														color: "text.primary",
														whiteSpace: "nowrap",
														textOverflow: "ellipsis",
														overflow: "hidden",
													}}
												>
													{relatedProduct.name}
												</Typography>
											</MuiLink>
										</Link>
									</Grid>
								))}
							</Grid>
						))}
					</Carousel>
				</Box>
				<Divider />
			</Box>
		</>
	);
};

type Props = {
	product: Product;
	products: Products;
	staticContent: StaticContentEachPage;
};

export const getStaticPaths = async () => {
	const products = await productsApi.getAllSlugs();

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
	const product = await productsApi.getProductBySlug(slug as string);
	const products = await productsApi.getAllProducts(20);
	const staticContent = await staticContentEachPageApi.getStaticContentBySlug("products");

	return {
		props: {
			product,
			products: products.filter((product) => !product._id.includes("drafts")),
			staticContent,
		},
		revalidate: 86400,
	};
};

ProductDetail.Layout = MainLayout;

export default ProductDetail;
