import { lightersApi } from "@/api-client/lighters";
import { urlFor } from "@/api-client/sanity-client";
import { Seo } from "@/components/common";
import { MainLayout } from "@/components/layout";
import { LighterProduct, LighterProductWithType, LighterType } from "@/models/cart";
import { formatPrice, getPriceTierOptions } from "@/utils/priceCalculator";
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
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from "@mui/material";
import { GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Lightbox from "react-awesome-lightbox";
import "react-awesome-lightbox/build/style.css";
import { sendGAEvent } from "@next/third-parties/google";
import { useRouter } from "next/router";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import styles from "./lighterItem.module.css";
import { AddToLighterCartButton } from "@/components/cart";

const LighterDetail = ({ lighter, lighters, lighterType }: Props) => {
	const router = useRouter();
	const [isOpenLightBox, setIsOpenLightBox] = React.useState(false);
	const [quantity, setQuantity] = React.useState(1);

	const priceTiers = React.useMemo(() => {
		if (!lighterType?.priceTiers) return [];
		return getPriceTierOptions(lighterType.priceTiers);
	}, [lighterType]);

	const getPriceRange = React.useCallback(() => {
		if (!lighterType?.priceTiers || lighterType.priceTiers.length === 0) {
			return { min: "Liên hệ", max: "Liên hệ" };
		}
		const prices = lighterType.priceTiers.map((tier) => tier.price);
		const min = Math.min(...prices);
		const max = Math.max(...prices);

		return {
			min: formatPrice(min),
			max: formatPrice(max),
		};
	}, [lighterType]);

	return (
		<>
			<Seo
				data={{
					title: `${lighter.name} - Lighters - INUT Design`,
					description: `${lighter.name} - ${lighterType?.name || "Custom Lighter"}. Giá từ ${
						getPriceRange().min
					} - ${getPriceRange().max}`,
					url: `https://inutdesign.com/lighters/${lighter.slug.current}`,
					thumbnailUrl: urlFor(lighter.image[0]).width(1000).url(),
				}}
			/>
			{isOpenLightBox && (
				<Lightbox
					images={lighter.image.map((image) => {
						return {
							url: urlFor(image).url(),
							title: lighter.name,
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
						<Link href={`/lighters#${lighter.slug.current}`} passHref>
							<MuiLink>Lighters</MuiLink>
						</Link>
						<Typography color="text.primary">{lighter.name}</Typography>
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
								infiniteLoop
								showIndicators
								showThumbs
								thumbWidth={80}
								renderThumbs={() =>
									lighter.image.map((thumbnail) => (
										<Image
											src={urlFor(thumbnail).width(200).url()}
											alt={`${lighter.name}-thumbnail`}
											key={thumbnail._key}
											unoptimized
											width="100%"
											height="100%"
											layout="responsive"
											className={styles.lighterImage}
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
								ariaLabel="Carousel Lighter Image"
							>
								{lighter.image.map((image) => (
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
											alt={lighter.name}
											className={styles.lighterImage}
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
									xs: 10,
									md: 2,
								}}
							>
								{lighter.name}
							</Typography>

							{lighterType && (
								<Stack my={2}>
									<Typography variant="body1" fontWeight={"bold"} color="primary">
										Loại: {lighterType.name}
									</Typography>
								</Stack>
							)}

							<Stack flexDirection={"row"} alignItems={"center"} my={2}>
								<Typography variant="body1" fontWeight={"bold"}>
									Tình trạng:
								</Typography>
								<Typography variant="body1" fontWeight={"bold"} color={"success.light"} ml={2}>
									Còn hàng
								</Typography>
							</Stack>

							{/* Price Tiers Table */}
							{priceTiers.length > 0 && (
								<Box my={3}>
									<Typography variant="h6" fontWeight={"bold"} mb={2}>
										Bảng giá:
									</Typography>
									<TableContainer component={Paper}>
										<Table>
											<TableHead>
												<TableRow>
													<TableCell>
														<strong>Số lượng</strong>
													</TableCell>
													<TableCell align="right">
														<strong>Đơn giá</strong>
													</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{priceTiers.map((tier) => (
													<TableRow key={tier.quantity}>
														<TableCell>{tier.quantity} cái</TableCell>
														<TableCell align="right">{formatPrice(tier.price)}</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</TableContainer>
									<Typography
										variant="caption"
										color="text.secondary"
										sx={{ mt: 1, display: "block" }}
									>
										* Giá có thể thay đổi tùy theo số lượng và yêu cầu đặc biệt
									</Typography>
								</Box>
							)}

							{/* Quantity Selector */}
							<Box my={3}>
								<Typography variant="subtitle1" fontWeight="bold" gutterBottom>
									Số lượng:
								</Typography>
								<FormControl sx={{ minWidth: 200 }}>
									<InputLabel id="quantity-select-label">Chọn số lượng</InputLabel>
									<Select
										labelId="quantity-select-label"
										value={quantity}
										label="Chọn số lượng"
										onChange={(e) => setQuantity(Number(e.target.value))}
									>
										{priceTiers.map((tier) => (
											<MenuItem key={tier.quantity} value={tier.quantity}>
												{tier.quantity} cái - {formatPrice(tier.price)}/cái
											</MenuItem>
										))}
									</Select>
								</FormControl>
								<Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
									Hoặc nhập số lượng tùy chỉnh:
								</Typography>
								<TextField
									type="number"
									value={quantity}
									onChange={(e) => {
										const value = parseInt(e.target.value);
										if (!isNaN(value) && value > 0) {
											setQuantity(value);
										}
									}}
									inputProps={{ min: 1, max: 9999 }}
									sx={{ width: 200, mt: 1 }}
									size="small"
								/>
							</Box>

							{/* Action Buttons */}
							<Stack flexDirection="row" alignItems={"center"} gap={2} flexWrap="wrap">
								{lighterType && (
									<AddToLighterCartButton
										lighter={lighter}
										lighterType={lighterType}
										quantity={quantity}
										variant="contained"
										size="large"
									/>
								)}
								<MuiLink
									href={`https://m.me/642209429738886?text=${encodeURI(
										`I want to order ${lighter.name}. Can you support me?`
									)}`}
									target="_blank"
									rel="noopener noreferrer"
								>
									<Button
										variant="outlined"
										color="primary"
										size="large"
										onClick={() => {
											sendGAEvent("event", "buttonClicked", {
												value: lighter.name,
												category: "lighters",
											});
										}}
									>
										Chat Messenger
									</Button>
								</MuiLink>
								<Link href="/contact" passHref>
									<MuiLink>
										<Button variant="outlined" color="primary" size="large">
											Liên hệ tư vấn
										</Button>
									</MuiLink>
								</Link>
							</Stack>

							<Box py={3}>
								<Typography variant="h6" fontWeight={"bold"}>
									Mô tả sản phẩm:
								</Typography>
								{lighter.details && (
									<Typography variant="body1" mt={1}>
										{lighter.details}
									</Typography>
								)}
								{lighterType?.description && (
									<Typography variant="body1" mt={1}>
										<b>Loại sản phẩm</b>: {lighterType.description}
									</Typography>
								)}
								<Typography variant="body1" mt={1}>
									<b>Chất liệu</b>: Nhựa cao cấp, bền bỉ
								</Typography>
								<Typography variant="body1" mt={1}>
									<b>In ấn</b>: In UV, màu sắc sắc nét, không phai
								</Typography>
								<Typography variant="body1" mt={1}>
									<b>Tùy chỉnh</b>: Có thể in theo thiết kế riêng
								</Typography>
								<Typography variant="body1" mt={1}>
									<b>Đơn hàng tối thiểu</b>:{" "}
									{priceTiers.length > 0 ? `${priceTiers[0].quantity} cái` : "Liên hệ"}
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
							4. Đặt hàng số lượng lớn được hỗ trợ giá tốt nhất <br />
							5. Hỗ trợ thiết kế miễn phí theo yêu cầu khách hàng <br />
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
						<div className="maylike-products-container track">
							{lighters.map((product) => (
								<Link href={`/lighters/${product.slug.current}`} passHref key={product._id}>
									<MuiLink>
										<Image
											src={urlFor(product.image[0]).width(500).url()}
											width={250}
											height={250}
											alt={product.name}
											className={styles.lighterImage}
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

type Props = {
	lighter: LighterProductWithType;
	lighters: LighterProduct[];
	lighterType: LighterType | null;
};

export const getStaticPaths = async () => {
	const lighters = await lightersApi.getAllLighterSlugs();

	const paths = lighters
		.filter((lighter) => lighter.slug !== null)
		.map((lighter) => ({
			params: {
				slug: lighter.slug.current,
			},
		}));
	return {
		paths,
		fallback: "blocking",
	};
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
	const slug = params?.slug as string;
	const lighter = await lightersApi.getLighterWithTypeBySlug(slug);
	const lighters = await lightersApi.getAllLighters(20);

	// Get the lighter type details
	let lighterType: LighterType | null = null;
	if (lighter.lighterType?._ref) {
		try {
			lighterType = await lightersApi.getLighterTypeById(lighter.lighterType._ref);
		} catch (error) {
			console.error("Error fetching lighter type:", error);
		}
	}

	return {
		props: {
			lighter,
			lighters: lighters.filter((lighter) => !lighter._id.includes("drafts")),
			lighterType,
		},
		revalidate: 86400, // Revalidate every 24 hours
	};
};

LighterDetail.Layout = MainLayout;

export default LighterDetail;
