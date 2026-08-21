import { bannerApi } from "@/api-client/banner";
import { productTypeApi } from "@/api-client/productType";
import { productsApi } from "@/api-client/products";
import { sanityImageUrl } from "@/api-client/sanity-image";
import { Seo } from "@/components/common";
import { MainLayout } from "@/components/layout";
import { ProductCard } from "@/components/product";
import { useInfiniteCatalog } from "@/hooks/useInfiniteCatalog";
import { Banner } from "@/models/banner";
import { NextPageWithLayout } from "@/models/common";
import { ProductType, Products } from "@/models/products";
import { COLOR_CODE, trackCatalogPagination, trackSearch } from "@/utils";
import { SITE_URL } from "@/utils/siteUrl";
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
import isEmpty from "lodash/isEmpty";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import dynamic from "next/dynamic";
const CountUp = dynamic(() => import("react-countup"), { ssr: false });
const Search: NextPageWithLayout = ({ products, productTypes, banner, total, page, pageSize }: Props) => {
	const router = useRouter();
	const { q } = router.query;
	const activeSearch = typeof q === "string" ? q : "";
	const handleOnChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = (event.target as HTMLInputElement).value;
		setCurrentFilter(value);
		router.push(
			{
				pathname: "/search",
				query: value ? { q: value } : {},
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

	React.useEffect(() => {
		if (q) {
			setCurrentFilter(q);
			// Track search query
			trackSearch(q as string);
		}
	}, [q]);

	const theme = useTheme();
	const isMobileScreen = useMediaQuery(theme.breakpoints.down("md"));

	const [expandedFilter, setExpandedFilter] = React.useState<boolean>(true);
	const [currentFilter, setCurrentFilter] = React.useState(q || "");

	React.useEffect(() => {
		if (isMobileScreen) {
			setExpandedFilter(false);
		} else {
			setExpandedFilter(true);
		}
	}, [isMobileScreen]);

	const loadPage = React.useCallback(
		async (nextPage: number) => {
			const catalog = await productsApi.getProductsBatch({
				page: nextPage,
				pageSize,
				search: activeSearch,
			});

			return catalog
				.filter((product) => !product._id.includes("drafts"))
				.map((product) => ({
					...product,
					type:
						productTypes.find((productType) => productType._id === product.productType?._ref)
							?.slug?.current || "",
				}));
		},
		[activeSearch, pageSize, productTypes]
	);

	const onPageLoad = React.useCallback((nextPage: number) => {
		trackCatalogPagination("search", nextPage);
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
		resetKey: activeSearch,
		loadPage,
		onPageLoad,
	});

	return (
		<Box component={"section"} bgcolor="secondary.dark" pt={4} pb={4}>
			<Seo
				data={{
					title: "Tìm kiếm - INUT Design",
					description:
						"Thiết kế & In ấn - Skin Laptop - Sticker - Decal - Thiệp - Card - Tem Nhãn, skin laptop da nang, skin laptop đà nẵng",
					url: `${SITE_URL}/search`,
					thumbnailUrl:
						(banner && !isEmpty(banner) && sanityImageUrl(banner[0]?.image, "seo")) ||
						"https://res.cloudinary.com/dmspucdtf/image/upload/v1663573733/294864835_731768937929745_7146257828673250026_n_fv3uhz.webp",
					noindex: !!q,
				}}
			/>

			<Container>
				<Box>
					<Breadcrumbs>
						<Link href={"/"} passHref>
							<MuiLink>Trang chủ</MuiLink>
						</Link>

						<Typography>Tìm kiếm</Typography>
					</Breadcrumbs>
					<Box mt={3} id="title">
						<Typography variant="h2" fontWeight="bold" textAlign="center" letterSpacing="10px">
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
							{loadedProducts.map((product) => (
								<Grid item xs={6} md={4} key={product._id}>
									<ProductCard product={product} productTypes={productTypes} />
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
										maxHeight: "80vh",
										overflowY: "auto",
										border: `1px solid ${COLOR_CODE.BORDER}`,
										borderRadius: "8px 4px 4px 8px !important",
									}}
								>
									<AccordionSummary
										expandIcon={<ExpandMoreIcon color="primary" />}
										aria-controls="panel1a-content"
										id="panel1a-header"
									>
										<Typography variant="h4" fontWeight="bold">
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
													<FormControlLabel value={""} control={<Radio />} label={"Tất cả"} />
													{productTypes.map((productType) => {
														return (
															<FormControlLabel
																key={productType._id}
																value={productType.slug.current}
																control={<Radio />}
																label={productType.name}
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

Search.Layout = MainLayout;

type Props = {
	products: Products;
	productTypes: ProductType[];
	banner: Banner[];
	total: number;
	page: number;
	pageSize: number;
};

export const getServerSideProps: GetServerSideProps<Props> = async ({ query, res }) => {
	const search = typeof query.q === "string" ? query.q : "";
	const page = 1;
	const pageSize = 24;
	res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");

	const [catalog, productTypes, banner] = await Promise.all([
		productsApi.getProductsPage({ page, pageSize, search }),
		productTypeApi.getAll(),
		bannerApi.getBannerPage("products-page"),
	]);
	const products: Products = catalog.items;

	const formatProducts = products
		.filter((product) => !product._id.includes("drafts"))
		.map((product) => {
			return {
				...product,
				type:
					productTypes.find((productType) => productType._id === product.productType?._ref)?.slug
						?.current || "",
			};
		});

	const formatProductTypes = productTypes
		.filter((productType) => productType?.name !== "Macnut")
		.filter((product) => !product._id.includes("drafts"));

	return {
		props: {
			products: formatProducts,
			productTypes: formatProductTypes,
			banner,
			total: catalog.total,
			page: catalog.page,
			pageSize: catalog.pageSize,
		},
	};
};

export default Search;
