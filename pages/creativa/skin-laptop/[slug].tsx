/* eslint-disable camelcase */
import {
	Alert,
	Box,
	Breadcrumbs,
	Button,
	Container,
	FormControl,
	FormControlLabel,
	FormHelperText,
	Grid,
	InputLabel,
	MenuItem,
	Radio,
	RadioGroup,
	Select,
	Stack,
	TextField,
	Typography,
	useTheme,
} from "@mui/material";
import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import type { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import "yet-another-react-lightbox/styles.css";
import { CreativaLayout } from "@/components/layout";
import { CreativaSeo } from "@/components/creativa/Seo";
import { creativaApi } from "@/api-client/creativa-checkout";
import { sanityImageUrl } from "@/api-client/sanity-image";
import type { CreativaImage, CreativaOptions, CreativaProduct } from "@/models/creativa";
import type { NextPageWithLayout } from "@/models/common";
import { useHydratedCreativaCart } from "@/hooks/creativa/useBrowserState";
import { CreativaError, formatCreativaPrice, safeQuantity } from "@/utils/creativa/contracts";
import { trackCreativa } from "@/utils/creativa/analytics";
import { SITE_URL } from "@/utils/siteUrl";
import BlockContentWrapper from "@/components/common/block-content";
import { creativaDescriptionText } from "@/utils/creativa/content";

const Carousel = dynamic(() => import("react-material-ui-carousel"), { ssr: false });
const Lightbox = dynamic(() => import("yet-another-react-lightbox"), { ssr: false });
type Props = { product: CreativaProduct; options: CreativaOptions };
type UnavailableProps = { slug: string; initialError: string };

function GalleryImage({ image, priority = false }: { image: CreativaImage; priority?: boolean }) {
	const [failed, setFailed] = useState(false);
	return (
		<Box sx={{ position: "relative", aspectRatio: "1", bgcolor: "white" }}>
			{failed ? (
				<Stack alignItems="center" justifyContent="center" height="100%">
					<Typography>Ảnh tạm thời không tải được.</Typography>
				</Stack>
			) : (
				<Image
					src={sanityImageUrl(image, "hero")}
					alt={image.alt}
					layout="fill"
					objectFit="contain"
					priority={priority}
					onError={() => setFailed(true)}
				/>
			)}
		</Box>
	);
}

function ProductContent(initial: Props) {
	const theme = useTheme();
	const productSlug = initial.product.slug.current;
	const [data, setData] = useState(initial);
	const [modelId, setModelId] = useState("");
	const [coverageId, setCoverageId] = useState(initial.options.coverages[0]?._id || "");
	const [quantity, setQuantity] = useState("1");
	const measuredQuantity = useRef(1);
	const coverageChosen = useRef(false);
	const viewed = useRef(false);
	const [index, setIndex] = useState(0);
	const lightboxIndex = useRef(0);
	const [lightbox, setLightbox] = useState(false);
	const [verified, setVerified] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [notice, setNotice] = useState<string | null>(null);
	const [retry, setRetry] = useState(0);
	const cart = useHydratedCreativaCart();
	const { product, options } = data;
	const coverage = options.coverages.find((item) => item._id === coverageId);
	const model = options.models.find((item) => item._id === modelId);
	useEffect(() => {
		let current = true;
		void creativaApi
			.product(productSlug)
			.then((next) => {
				if (!current) return;
				setData(next);
				setVerified(true);
				setError(null);
				setCoverageId((previous) =>
					!coverageChosen.current
						? next.options.coverages[0]?._id || ""
						: next.options.coverages.some((item) => item._id === previous)
						? previous
						: ""
				);
				setModelId((previous) =>
					next.options.models.some((item) => item._id === previous) ? previous : ""
				);
			})
			.catch((failure: Error) => {
				if (current) {
					setVerified(false);
					setError(failure.message);
				}
			});
		return () => {
			current = false;
		};
	}, [productSlug, retry]);
	useEffect(() => {
		if (viewed.current) return;
		viewed.current = true;
		trackCreativa(
			"view_item",
			{
				product_id: initial.product._id,
				product_name: initial.product.name,
				product_type: "skin-laptop",
				...(initial.options.coverages[0] && {
					value: initial.options.coverages[0].price,
					coverage_id: initial.options.coverages[0]._id,
				}),
				price_basis: "selected_coverage",
			},
			[
				{
					item_id: initial.product._id,
					item_name: initial.product.name,
					item_category: "skin-laptop",
					quantity: 1,
					...(initial.options.coverages[0] && {
						price: initial.options.coverages[0].price,
						item_variant: initial.options.coverages[0].code,
						coverage_id: initial.options.coverages[0]._id,
					}),
				},
			]
		);
	}, [initial.product._id, initial.product.name, initial.options.coverages]);
	const priceList = options.coverages.map((item) => item.price);
	const description = creativaDescriptionText(product.description);
	const structured = JSON.stringify({
		"@context": "https://schema.org",
		"@type": "Product",
		name: product.name,
		image: product.images.map((image) => sanityImageUrl(image, "structured")),
		description: description || `Skin MacBook ${product.name}.`,
		brand: { "@type": "Brand", name: "INUT Creativa" },
		...(priceList.length > 0 &&
			options.models.length > 0 && {
				offers: {
					"@type": "AggregateOffer",
					priceCurrency: "VND",
					lowPrice: Math.min(...priceList),
					highPrice: Math.max(...priceList),
					offerCount: priceList.length,
					url: `${SITE_URL}/creativa/skin-laptop/${product.slug.current}`,
				},
			}),
	}).replace(/</g, "\\u003c");
	return (
		<>
			<CreativaSeo
				title={product.name}
				path={`/creativa/skin-laptop/${product.slug.current}`}
				image={product.images[0] ? sanityImageUrl(product.images[0], "seo") : undefined}
				structured={structured}
				description={description || `Chọn mẫu MacBook và phạm vi dán cho thiết kế ${product.name}.`}
			/>
			<Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 } }}>
				<Breadcrumbs sx={{ mb: 2, fontSize: 13 }}>
					<Link href="/creativa">Creativa</Link>
					<Link href="/creativa/skin-laptop">Skin MacBook</Link>
					<Typography variant="caption">{product.name}</Typography>
				</Breadcrumbs>
				<Grid container spacing={{ xs: 3, md: 6 }}>
					<Grid item xs={12} md={7}>
						<Carousel
							autoPlay={false}
							indicators
							navButtonsAlwaysVisible
							activeIndicatorIconButtonProps={{ style: { color: theme.palette.primary.main } }}
							index={index}
							onChange={(next) => {
								if (typeof next === "number") {
									setIndex(next);
									if (next !== index)
										trackCreativa("gallery_interaction", {
											action: "navigate",
											image_index: next,
											product_id: product._id,
										});
								}
							}}
						>
							{product.images.map((image, imageIndex) => (
								<Box
									component="button"
									aria-label={`Phóng to ảnh ${imageIndex + 1}`}
									key={image._key || image.asset._ref}
									onClick={() => {
										lightboxIndex.current = imageIndex;
										setIndex(imageIndex);
										setLightbox(true);
										trackCreativa("gallery_interaction", {
											action: "open",
											surface: "lightbox",
											image_index: imageIndex,
										});
									}}
									sx={{ width: "100%", border: 0, bgcolor: "white", p: 0, cursor: "zoom-in" }}
								>
									<GalleryImage image={image} priority={imageIndex === 0} />
								</Box>
							))}
						</Carousel>
						<Stack direction="row" gap={1} sx={{ overflowX: "auto", mt: 1 }}>
							{product.images.map((image, imageIndex) => (
								<Box
									component="button"
									key={`thumb-${image._key || imageIndex}`}
									aria-label={`Xem ảnh ${imageIndex + 1}`}
									aria-pressed={index === imageIndex}
									onClick={() => {
										setIndex(imageIndex);
										trackCreativa("gallery_interaction", {
											action: "thumbnail",
											image_index: imageIndex,
										});
									}}
									sx={{
										flexShrink: 0,
										width: 70,
										height: 70,
										position: "relative",
										bgcolor: "white",
										border: "2px solid",
										borderColor: index === imageIndex ? "primary.main" : "divider",
										cursor: "pointer",
									}}
								>
									<Image
										src={sanityImageUrl(image, "tiny")}
										alt={image.alt}
										layout="fill"
										objectFit="contain"
									/>
								</Box>
							))}
						</Stack>
						<Lightbox
							open={lightbox}
							close={() => {
								setLightbox(false);
								setIndex(lightboxIndex.current);
								trackCreativa("gallery_interaction", {
									action: "close",
									surface: "lightbox",
									image_index: lightboxIndex.current,
								});
							}}
							on={{
								view: ({ index: next }) => {
									if (!lightbox || next === lightboxIndex.current) return;
									lightboxIndex.current = next;
									trackCreativa("gallery_interaction", {
										action: "navigate",
										surface: "lightbox",
										image_index: next,
									});
								},
							}}
							index={index}
							slides={product.images.map((image) => ({
								src: sanityImageUrl(image, "hero"),
								alt: image.alt,
							}))}
						/>
					</Grid>
					<Grid item xs={12} md={5}>
						<Stack gap={2.5} sx={{ maxWidth: 510, mx: "auto", py: { md: 3 } }}>
							<Box>
								<Typography
									component="h1"
									sx={{ fontSize: { xs: 28, md: 36 }, lineHeight: 1.2, fontWeight: 400 }}
								>
									{product.name}
								</Typography>
								<Typography sx={{ fontSize: 23, mt: 2 }}>
									{coverage
										? formatCreativaPrice(coverage.price)
										: priceList.length
										? `Từ ${formatCreativaPrice(Math.min(...priceList))}`
										: "Tạm chưa có giá"}
								</Typography>
								<Typography variant="body2" color="text.secondary">
									Phí vận chuyển hiển thị khi thanh toán.
								</Typography>
							</Box>
							{(error || cart.error) && (
								<Alert
									severity="error"
									action={
										error ? (
											<Button onClick={() => setRetry((value) => value + 1)}>Thử lại</Button>
										) : undefined
									}
								>
									{error || cart.error}
								</Alert>
							)}
							{notice && (
								<Alert severity="success" action={<Link href="/creativa/cart">Xem giỏ</Link>}>
									{notice}
								</Alert>
							)}
							<FormControl fullWidth required>
								<InputLabel id="creativa-model">Mẫu MacBook</InputLabel>
								<Select
									labelId="creativa-model"
									label="Mẫu MacBook"
									value={modelId}
									onChange={(event) => {
										setModelId(event.target.value);
										setNotice(null);
										trackCreativa("product_option_change", {
											product_id: product._id,
											model_id: event.target.value,
											action: "model",
										});
									}}
								>
									{options.models.map((item) => (
										<MenuItem key={item._id} value={item._id}>
											{item.name}
										</MenuItem>
									))}
								</Select>
								<FormHelperText>
									{options.models.length
										? "Vui lòng chọn đúng mẫu máy trước khi thêm vào giỏ."
										: "Chưa có mẫu MacBook đang mở bán."}
								</FormHelperText>
							</FormControl>
							{!coverage && (
								<Typography variant="caption">
									Vui lòng chọn một phạm vi dán đang được hỗ trợ để tiếp tục.
								</Typography>
							)}
							<FormControl component="fieldset">
								<Typography id="creativa-coverage" component="legend" mb={1}>
									Phạm vi dán
								</Typography>
								<RadioGroup
									aria-labelledby="creativa-coverage"
									value={coverageId}
									onChange={(event) => {
										coverageChosen.current = true;
										setCoverageId(event.target.value);
										setNotice(null);
										trackCreativa("product_option_change", {
											product_id: product._id,
											coverage_id: event.target.value,
											action: "coverage",
										});
									}}
								>
									{options.coverages.map((item) => (
										<FormControlLabel
											key={item._id}
											value={item._id}
											control={<Radio />}
											label={
												<Box>
													<Typography>
														{item.name} — {formatCreativaPrice(item.price)}
													</Typography>
													<Typography variant="caption" color="text.secondary">
														{item.description}
													</Typography>
												</Box>
											}
											sx={{
												border: "1px solid",
												borderColor: coverageId === item._id ? "primary.main" : "divider",
												borderRadius: 1,
												mx: 0,
												mb: 1,
												py: 1,
												pr: 1,
											}}
										/>
									))}
								</RadioGroup>
							</FormControl>
							<TextField
								label="Số lượng"
								type="number"
								value={quantity}
								inputProps={{ min: 1, step: 1 }}
								onChange={(event) => setQuantity(event.target.value)}
								onBlur={() => {
									if (
										Number.isSafeInteger(Number(quantity)) &&
										Number(quantity) > 0 &&
										Number(quantity) !== measuredQuantity.current
									) {
										trackCreativa("quantity_change", {
											surface: "product",
											previous_quantity: measuredQuantity.current,
											quantity: Number(quantity),
										});
										measuredQuantity.current = Number(quantity);
									}
								}}
								sx={{ width: 130 }}
							/>
							<Button
								variant="contained"
								size="large"
								startIcon={<AddShoppingCartOutlinedIcon />}
								disabled={!verified || !model || !coverage || !cart.hydrated || !!cart.error}
								sx={{ borderRadius: 20, py: 1.6 }}
								onClick={() => {
									try {
										const count = safeQuantity(Number(quantity));
										cart.add({
											productType: "skin-laptop",
											productId: product._id,
											selection: { modelId: model._id, coverageId: coverage._id },
											quantity: count,
											productName: product.name,
											productSlug: product.slug.current,
											productImage: product.images[0],
											modelName: model.name,
											coverageName: coverage.name,
											unitPrice: coverage.price,
										});
										setNotice("Đã thêm vào giỏ hàng.");
										setError(null);
										trackCreativa(
											"add_to_cart",
											{
												product_id: product._id,
												product_name: product.name,
												product_type: "skin-laptop",
												model_id: model._id,
												coverage_id: coverage._id,
												quantity: count,
												value: count * coverage.price,
											},
											[
												{
													item_id: product._id,
													item_name: product.name,
													item_category: "skin-laptop",
													model_id: model._id,
													coverage_id: coverage._id,
													item_variant: coverage.code,
													quantity: count,
													price: coverage.price,
												},
											]
										);
									} catch (failure) {
										setError(
											failure instanceof Error ? failure.message : "Không thể thêm vào giỏ."
										);
										trackCreativa("add_to_cart_error", { reason: "invalid_or_storage" });
									}
								}}
							>
								Thêm vào giỏ hàng
							</Button>
							{!verified && !error && (
								<Typography variant="caption" color="text.secondary">
									Đang xác nhận thông tin đặt hàng…
								</Typography>
							)}
							{!cart.hydrated && (
								<Typography variant="caption" color="text.secondary">
									Đang khôi phục giỏ hàng trên trình duyệt…
								</Typography>
							)}
							{!model && (
								<Typography variant="caption" color="text.secondary">
									Chọn mẫu MacBook để tiếp tục.
								</Typography>
							)}
							{!!product.description?.length && (
								<Box
									sx={{
										borderTop: "1px solid",
										borderColor: "divider",
										pt: 3,
										"& #block-content-wrapper blockquote": { borderLeftColor: "primary.main" },
										"& #block-content-wrapper a": { color: "primary.dark" },
									}}
								>
									{typeof product.description === "string" ? (
										<Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
											{product.description}
										</Typography>
									) : (
										<BlockContentWrapper blocks={product.description} />
									)}
								</Box>
							)}
							<Link href="/creativa/skin-laptop/huong-dan-su-dung">Hướng dẫn sử dụng</Link>
						</Stack>
					</Grid>
				</Grid>
			</Container>
		</>
	);
}
function UnavailableProduct({ slug, initialError }: UnavailableProps) {
	const [result, setResult] = useState<Props | null>(null);
	const [error, setError] = useState(initialError);
	const [busy, setBusy] = useState(false);
	if (result) return <ProductContent key={result.product._id} {...result} />;
	return (
		<>
			<CreativaSeo
				title="Sản phẩm tạm thời chưa sẵn sàng"
				path={`/creativa/skin-laptop/${slug}`}
				noindex
			/>
			<Container maxWidth="md" sx={{ py: 6 }}>
				<Stack gap={2}>
					<Typography component="h1" variant="h4">
						Sản phẩm tạm thời chưa sẵn sàng
					</Typography>
					<Alert severity="error">{error}</Alert>
					<Button
						variant="contained"
						disabled={busy}
						onClick={async () => {
							setBusy(true);
							try {
								setResult(await creativaApi.product(slug));
							} catch (failure) {
								setError(failure instanceof Error ? failure.message : "Không thể tải sản phẩm.");
							} finally {
								setBusy(false);
							}
						}}
					>
						{busy ? "Đang tải…" : "Thử lại"}
					</Button>
					<Link href="/creativa/skin-laptop">Về danh sách thiết kế</Link>
				</Stack>
			</Container>
		</>
	);
}
const ProductDetail: NextPageWithLayout<Props | UnavailableProps> = (props) =>
	"initialError" in props ? (
		<UnavailableProduct key={props.slug} {...props} />
	) : (
		<ProductContent key={props.product._id} {...props} />
	);
ProductDetail.Layout = CreativaLayout;
export const getStaticPaths: GetStaticPaths = async () => ({ paths: [], fallback: "blocking" });
export const getStaticProps: GetStaticProps = async ({ params }) => {
	const slug = typeof params?.slug === "string" ? params.slug : "";
	const { getCreativaProduct } = await import("@/api-client/creativa-catalog");
	try {
		return { props: await getCreativaProduct(slug), revalidate: 60 };
	} catch (failure) {
		if (failure instanceof CreativaError && failure.code === "PRODUCT_NOT_FOUND")
			return { notFound: true, revalidate: 60 };
		console.error("[Creativa product] Rendering unavailable state.", {
			code: failure instanceof CreativaError ? failure.code : "PRODUCT_UNAVAILABLE",
		});
		return {
			props: {
				slug,
				initialError:
					failure instanceof CreativaError
						? failure.message
						: "Không thể tải sản phẩm. Vui lòng thử lại.",
			},
			revalidate: 60,
		};
	}
};
export default ProductDetail;
