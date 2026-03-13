import { bannerApi } from "@/api-client/banner";
import { productsApi } from "@/api-client/products";
import { productTypeApi } from "@/api-client/productType";
import { urlFor } from "@/api-client/sanity-client";
import { Seo } from "@/components/common";
import { MainLayout } from "@/components/layout";
import { MacnutCustomizeCard, ProductCard } from "@/components/product";
import { Banner } from "@/models/banner";
import { NextPageWithLayout } from "@/models/common";
import { Products, ProductType } from "@/models/products";
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
import Link from "next/link";
import { useRouter } from "next/router";
import { GetStaticProps } from "next/types";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const CountUp = dynamic(() => import("react-countup"), { ssr: false });
const Home: NextPageWithLayout = ({ products, productTypes, banner }: Props) => {
	const router = useRouter();
	const { filter } = router.query;
	const handleOnChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = (event.target as HTMLInputElement).value;
		setCurrentFilter(value);
		router.push(
			{
				pathname: "/products",
				query: { filter: value },
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

	const theme = useTheme();
	const isMobileScreen = useMediaQuery(theme.breakpoints.down("md"));

	const [expandedFilter, setExpandedFilter] = useState<boolean>(true);
	const [currentFilter, setCurrentFilter] = useState(filter || "");

	useEffect(() => {
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
					title: "Macnut - INUT Design",
					description:
						"Thiết kế & In ấn - Skin Laptop - Sticker - Decal - Thiệp - Card - Tem Nhãn, skin laptop da nang, skin laptop đà nẵng",
					url: "https://inutdesign.com/macnut",
					thumbnailUrl:
						(banner && urlFor(banner[0].image).url()) ||
						"https://res.cloudinary.com/dmspucdtf/image/upload/v1663573733/294864835_731768937929745_7146257828673250026_n_fv3uhz.webp",
				}}
			/>

			{/* <HeroImage imgUrl={banner && urlFor(banner[0].image).url()} /> */}
			<Container>
				<Box>
					<Breadcrumbs>
						<Link href={"/"} passHref>
							<MuiLink>Trang chủ</MuiLink>
						</Link>

						<Typography>Nút Phím</Typography>
					</Breadcrumbs>
					<Box mt={3}>
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
							<Grid item xs={6} md={4}>
								<MacnutCustomizeCard />
							</Grid>
							{products.map((product) => {
								if (product.type.includes(currentFilter as string)) {
									return (
										<Grid item xs={6} md={4} key={product._id}>
											<ProductCard product={product} productTypes={productTypes} isMacnut />
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
										maxHeight: {
											xs: "100%",
											md: "80vh",
										},
										overflowY: {
											xs: "none",
											md: "auto",
										},
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

Home.Layout = MainLayout;

type Props = {
	products: Products;
	productTypes: ProductType[];
	banner: Banner[];
};

export const getStaticProps: GetStaticProps<Props> = async () => {
	const products: Products = await productsApi.getAllProductsMacnut();
	const productTypes: ProductType[] = await productTypeApi.getAllMacNut();
	const banner: Banner[] = await bannerApi.getBannerPage("macnut-page");

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
					productTypes.find((productType) => productType?._id === product.macnutType?._ref).slug
						?.current || "",
			};
		});

	return {
		props: {
			products: formatProducts,
			productTypes: productTypes.filter((product) => !product._id.includes("drafts")),
			banner,
		},
	};
};

export default Home;
