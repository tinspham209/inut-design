import { bannerApi } from "@/api-client/banner";
import { productTypeApi } from "@/api-client/productType";
import { productsApi } from "@/api-client/products";
import { urlFor } from "@/api-client/sanity-client";
import { Seo } from "@/components/common";
import { MainLayout } from "@/components/layout";
import { ProductCard } from "@/components/product";
import { Banner } from "@/models/banner";
import { NextPageWithLayout } from "@/models/common";
import { ProductType, Products } from "@/models/products";
import { COLOR_CODE } from "@/utils";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Breadcrumbs,
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
import _ from "lodash";
import { GetStaticProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import CountUp from "react-countup";
const Search: NextPageWithLayout = ({ products, productTypes, banner }: Props) => {
	const router = useRouter();
	const { q } = router.query;
	const handleOnChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = (event.target as HTMLInputElement).value;
		setCurrentFilter(value);
		router.push(
			{
				pathname: "/search",
				query: { q: value },
			},
			undefined,
			{ scroll: false }
		);

		setTimeout(() => {
			document
				.getElementById("title")
				.scrollIntoView({ behavior: "smooth", block: "start", inline: "start" });
		}, 500);
	};

	React.useEffect(() => {
		if (q) {
			setCurrentFilter(q);
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

	return (
		<Box component={"section"} bgcolor="secondary.dark" pt={4} pb={4}>
			<Seo
				data={{
					title: "Tìm kiếm - INUT Design",
					description:
						"Thiết kế & In ấn - Skin Laptop - Sticker - Decal - Thiệp - Card - Tem Nhãn, skin laptop da nang, skin laptop đà nẵng",
					url: "https://inutdesign.com/products",
					thumbnailUrl:
						(banner && !_.isEmpty(banner) && urlFor(banner[0]?.image || "").url()) ||
						"https://res.cloudinary.com/dmspucdtf/image/upload/v1663573733/294864835_731768937929745_7146257828673250026_n_fv3uhz.webp",
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
							Sản phẩm (<CountUp end={products.length} duration={2} />)
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
							{products.map((product) => {
								if (product.type.includes(currentFilter as string)) {
									return (
										<Grid item xs={6} md={4} key={product._id}>
											<ProductCard product={product} productTypes={productTypes} />
										</Grid>
									);
								} else {
									<Grid item xs={6} md={4} key={product._id}>
										<Box>
											<Typography variant="h4" fontWeight="bold">
												Không có sản phẩm nào
											</Typography>
										</Box>
									</Grid>;
								}
							})}
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
};

export const getStaticProps: GetStaticProps<Props> = async () => {
	const products: Products = await productsApi.getAllProducts();
	const productTypes: ProductType[] = await productTypeApi.getAll();
	const banner: Banner[] = await bannerApi.getBannerPage("products-page");

	const formatProducts = products
		.filter((product) => !product._id.includes("drafts"))
		.map((product) => {
			return {
				...product,
				type:
					productTypes.find((productType) => productType._id === product.productType._ref).slug
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
		},
	};
};

export default Search;
