import { bannerApi } from "@/api-client/banner";
import { productsApi } from "@/api-client/products";
import { productTypeApi } from "@/api-client/productType";
import { sanityImageUrl } from "@/api-client/sanity-image";
import { Seo } from "@/components/common";
import { MainLayout } from "@/components/layout";
import { MacnutCustomizeCard, ProductCard } from "@/components/product";
import { useInfiniteCatalog } from "@/hooks/useInfiniteCatalog";
import { Banner } from "@/models/banner";
import { NextPageWithLayout } from "@/models/common";
import { Products, ProductType } from "@/models/products";
import { COLOR_CODE, trackCatalogPagination } from "@/utils";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Breadcrumbs,
	Button,
	Container,
	FormControl,
	FormControlLabel,
	Grid,
	Link as MuiLink,
	Radio,
	RadioGroup,
	Stack,
	Typography,
	useMediaQuery,
	useTheme,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const CountUp = dynamic(() => import("react-countup"), { ssr: false });
const Home: NextPageWithLayout = ({ products, productTypes, banner, total, page, pageSize }: Props) => {
	const router = useRouter();
	const { filter } = router.query;
	const activeFilter = typeof filter === "string" ? filter : "";
	const handleOnChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = (event.target as HTMLInputElement).value;
		setCurrentFilter(value);
		router.push(
			{
				pathname: "/san-pham/skin-nut-phim",
				query: value ? { filter: value } : {},
			},
			undefined,
			{ scroll: false }
		);

		setTimeout(() => {
			document
				.getElementById("title")
				?.scrollIntoView({ behavior: "smooth", block: "start", inline: "start" });
		}, 500);
	};

	const theme = useTheme();
	const isMobileScreen = useMediaQuery(theme.breakpoints.down("md"));

	const [expandedFilter, setExpandedFilter] = useState<boolean>(true);
	const [currentFilter, setCurrentFilter] = useState(
		typeof filter === "string" ? filter : ""
	);

	useEffect(() => {
		setCurrentFilter(typeof filter === "string" ? filter : "");
	}, [filter]);

	useEffect(() => {
		if (isMobileScreen) {
			setExpandedFilter(false);
		} else {
			setExpandedFilter(true);
		}
	}, [isMobileScreen]);

	const loadPage = React.useCallback(
		async (nextPage: number) => {
			const catalog = await productsApi.getMacnutBatch({
				page: nextPage,
				pageSize,
				filter: activeFilter,
			});

			return catalog
				.filter((product) => !product._id.includes("drafts"))
				.map((product) => ({
					...product,
					type:
						productTypes.find((productType) => productType?._id === product.macnutType?._ref)
							?.slug?.current || "",
				}));
		},
		[activeFilter, pageSize, productTypes]
	);

	const onPageLoad = React.useCallback((nextPage: number) => {
		trackCatalogPagination("skin-nut-phim", nextPage);
	}, []);

	const {
		items: loadedProducts,
		sentinelRef,
		isLoading,
		error,
		retry,
		hasMore,
	} = useInfiniteCatalog({
		initialItems: products,
		initialPage: page,
		pageSize,
		total,
		resetKey: activeFilter,
		loadPage,
		onPageLoad,
	});

	return (
		<Box
			component={"section"}
			sx={{
				bgcolor: COLOR_CODE.INK,
				pt: { xs: "60px", sm: "80px" },
				pb: { xs: "60px", sm: "80px" },
				px: { xs: 2, sm: "32px" },
			}}
		>
			<Seo
				data={{
					title: "MACNUT — Skin Nút Phím MacBook Đà Nẵng | INUT Design",
					description:
						"Skin nút phím MacBook (MACNUT) theo yêu cầu tại Đà Nẵng. Tương thích MacBook Air M1/M2, Pro 13/14/16. Mỏng 0.1mm, không ảnh hưởng gõ phím. Giao trong ngày.",
					url: "https://inutdesign.com/san-pham/skin-nut-phim",
					thumbnailUrl:
						(banner && sanityImageUrl(banner[0]?.image, "seo")) ||
						"https://res.cloudinary.com/dmspucdtf/image/upload/v1663573733/294864835_731768937929745_7146257828673250026_n_fv3uhz.webp",
				}}
			/>

			<Container disableGutters>
				<Box>
					<Breadcrumbs
						sx={{
							mb: 2,
							"& .MuiBreadcrumbs-separator": { color: COLOR_CODE.TEXT_SOFT },
							"& li": { color: COLOR_CODE.TEXT_SOFT },
						}}
					>
						<Link href={"/"} passHref>
							<MuiLink sx={{ color: COLOR_CODE.TEXT_SOFT, "&:hover": { color: COLOR_CODE.WHITE } }}>
								Trang chủ
							</MuiLink>
						</Link>
						<Typography sx={{ color: COLOR_CODE.TEXT_MUTED }}>Nút Phím</Typography>
					</Breadcrumbs>
					<Stack direction="row" alignItems="center" gap={1.25} mb={1.5}>
						<Box sx={{ width: 20, height: 2, bgcolor: COLOR_CODE.PRIMARY }} />
						<Typography
							sx={{
								fontWeight: 700,
								fontSize: "0.68rem",
								letterSpacing: "0.18em",
								textTransform: "uppercase",
								color: COLOR_CODE.PRIMARY,
							}}
						>
							NÚT PHÍM MACNUT
						</Typography>
					</Stack>
					<Box mt={1} id="title">
						<Typography
							variant="h2"
							fontWeight="800"
							letterSpacing="-0.04em"
							sx={{ color: COLOR_CODE.WHITE }}
						>
							Sản phẩm (<CountUp end={total} duration={2} />)
						</Typography>
					</Box>
					<Grid
						container
						spacing={2}
						mt={3}
						flexDirection={{
							xs: "column-reverse",
							md: "row",
						}}
					>
						<Grid container item xs={12} md={9} spacing={3} id="productTitle">
							<Grid item xs={6} md={4}>
								<MacnutCustomizeCard />
							</Grid>
							{loadedProducts.map((product) => (
								<Grid item xs={6} md={4} key={product._id}>
									<ProductCard product={product} productTypes={productTypes} isMacnut />
								</Grid>
							))}
						{hasMore && (
							<Grid item xs={12}>
								<Box ref={sentinelRef} display="flex" justifyContent="center" py={2} minHeight={56}>
									{isLoading && <Typography color="text.secondary">Đang tải thêm sản phẩm...</Typography>}
									{error && (
										<Button color="primary" onClick={retry}>
											Không tải được. Thử lại
										</Button>
									)}
								</Box>
							</Grid>
						)}
						</Grid>
						<Grid container item xs={12} md={3}>
							<Box
								sx={{
									width: "100%",
									borderRadius: 16,
								}}
							>
								<Accordion
									expanded={expandedFilter}
									onChange={() => {
										setExpandedFilter(!expandedFilter);
									}}
									TransitionProps={{ unmountOnExit: true }}
									sx={{
										position: {
											md: "sticky",
										},
										top: {
											md: "90px",
										},
										right: {
											md: 0,
										},
										minHeight: {
											md: "1px",
										},
										maxHeight: {
											xs: "100%",
											md: "80vh",
										},
										overflowY: {
											xs: "none",
											md: "auto",
										},
										bgcolor: COLOR_CODE.INK_3,
										border: `1px solid ${COLOR_CODE.INK_4}`,
										borderRadius: "8px 4px 4px 8px !important",
									}}
								>
									<AccordionSummary
										expandIcon={<ExpandMoreIcon color="primary" />}
										aria-controls="panel1a-content"
										id="panel1a-header"
									>
										<Typography variant="h4" fontWeight="bold" sx={{ color: COLOR_CODE.WHITE }}>
											Bộ lọc
										</Typography>
									</AccordionSummary>
									<AccordionDetails>
										<Stack flexDirection="column">
											<FormControl>
												<RadioGroup
													name="radio-buttons-filters"
													value={currentFilter}
													onChange={handleOnChangeCheckbox}
												>
													<FormControlLabel
														value={""}
														control={<Radio />}
														label={"Tất cả"}
														sx={{
															"& .MuiFormControlLabel-label": { color: COLOR_CODE.TEXT_MUTED },
														}}
													/>
													{productTypes.map((productType) => {
														return (
															<FormControlLabel
																key={productType._id}
																value={productType.slug.current}
																control={<Radio />}
																label={productType.name}
																sx={{
																	"& .MuiFormControlLabel-label": { color: COLOR_CODE.TEXT_MUTED },
																}}
															/>
														);
													})}
												</RadioGroup>
											</FormControl>
										</Stack>
									</AccordionDetails>
								</Accordion>
							</Box>
						</Grid>
					</Grid>
				</Box>
			</Container>
		</Box>
	);
};

Home.Layout = MainLayout;

type Props = {
	products: Products;
	productTypes: ProductType[];
	banner: Banner[];
	total: number;
	page: number;
	pageSize: number;
};

export const getServerSideProps: GetServerSideProps<Props> = async ({ query, res }) => {
	const filter = typeof query.filter === "string" ? query.filter : "";
	const page = 1;
	const pageSize = 24;
	res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");

	const [catalog, productTypes, banner] = await Promise.all([
		productsApi.getMacnutPage({ page, pageSize, filter }),
		productTypeApi.getAllMacNut(),
		bannerApi.getBannerPage("macnut-page"),
	]);
	const products: Products = catalog.items;

	const productUndefined = products
		.filter((product) => !product.productType)
		.map((product) => ({
			productType: product.productType,
			name: product.name,
		}));
	if (productUndefined.length > 0) {
		// TODO: find productType undefined
		console.log("productUndefined: ", productUndefined);
	}

	const formatProducts = products
		.filter((product) => !product._id.includes("drafts"))
		.map((product) => {
			return {
				...product,
				type:
					productTypes.find((productType) => productType?._id === product.macnutType?._ref)?.slug
						?.current || "",
			};
		});

	return {
		props: {
			products: formatProducts,
			productTypes: productTypes.filter((product) => !product._id.includes("drafts")),
			banner,
			total: catalog.total,
			page: catalog.page,
			pageSize: catalog.pageSize,
		},
	};
};

export default Home;
