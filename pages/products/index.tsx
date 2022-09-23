import { bannerApi } from "@/api-client/banner";
import { productsApi } from "@/api-client/products";
import { productTypeApi } from "@/api-client/productType";
import { urlFor } from "@/api-client/sanity-client";
import { Seo } from "@/components/common";
import { HeroSection } from "@/components/home";
import { MainLayout } from "@/components/layout";
import { ProductCard } from "@/components/product";
import { Banner } from "@/models/banner";
import { NextPageWithLayout } from "@/models/common";
import { Products, ProductType } from "@/models/products";
import { Accordion, AccordionDetails, AccordionSummary, Box, Breadcrumbs, Container, FormControl, FormControlLabel, Grid, Link as MuiLink, Radio, RadioGroup, Stack, Typography } from "@mui/material";
import { GetStaticProps } from "next";
import Link from "next/link";
import CountUp from "react-countup";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from 'react'
import { useRouter } from 'next/router'
const Home: NextPageWithLayout = ({ products, productTypes, banner }: Props) => {

	const router = useRouter();
	const { filter } = router.query;
	const handleOnChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = (event.target as HTMLInputElement).value;
		setCurrentFilter(value);
		router.push({
			pathname: '/products',
			query: { filter: value },
		}, undefined, { scroll: false })

		setTimeout(() => {
			document.getElementById('productTitle').scrollIntoView({ behavior: "smooth", block: "start", inline: "start" });
		}, 1000)
	};

	const [expandedFilter, setExpandedFilter] = React.useState<boolean>(true);
	const [currentFilter, setCurrentFilter] = React.useState(filter || "")

	return (
		<Box component={"section"} bgcolor="secondary.light" pt={4} pb={4}>
			<Seo
				data={{
					title: "Sản phẩm - INUT Design",
					description: "Tiệm may đo skin laptop theo yêu cầu, Cửa Hàng Thời Trang Dành Cho Laptop",
					url: "https://inut-design.vercel.app",
					thumbnailUrl:
						(banner && urlFor(banner[0].image).url()) ||
						"https://res.cloudinary.com/dmspucdtf/image/upload/v1663573733/294864835_731768937929745_7146257828673250026_n_fv3uhz.webp",
				}}
			/>

			<HeroSection imgUrl={banner && urlFor(banner[0].image).url()} />
			<Container>
				<Box>
					<Breadcrumbs>
						<Link href={"/"} passHref>
							<MuiLink>Trang chủ</MuiLink>
						</Link>

						<Typography color="text.primary">Sản phẩm</Typography>
					</Breadcrumbs>
					<Box mt={3}>
						<Typography variant="h2" fontWeight="bold" textAlign="center" fontFamily={'"Bangers" ,"Roboto", sans-serif'} letterSpacing="10px">
							Sản phẩm (<CountUp end={products.length} duration={2} />)
						</Typography>
					</Box>
					<Grid container spacing={2} mt={3} flexDirection={{
						xs: 'column-reverse',
						md: 'row'
					}}>
						<Grid container item xs={12} md={9} spacing={3} id="productTitle">
							{products.map((product) => {
								if (product.type.includes(currentFilter as string)) {
									return (
										<Grid item xs={6} md={4} key={product._id}>
											<ProductCard product={product} productTypes={productTypes} />
										</Grid>
									)
								} else {
									<Grid item xs={6} md={4} key={product._id}>
										<Box><Typography variant="h4" fontWeight="bold">Không có sản phẩm nào</Typography></Box>
									</Grid>
								}
							})}
						</Grid>
						<Grid container item xs={12} md={3}>
							<Box sx={{
								width: '100%',
							}}>
								<Accordion
									expanded={expandedFilter}
									onChange={() => {
										setExpandedFilter(!expandedFilter)
									}}
									TransitionProps={{ unmountOnExit: true }}
									sx={{
										position: {
											md: 'sticky'
										},
										top: {
											md: '90px'
										},
										right: {
											md: 0
										},
										minHeight: {
											md: '1px'
										}
									}}
								>
									<AccordionSummary
										expandIcon={<ExpandMoreIcon />}
										aria-controls="panel1a-content"
										id="panel1a-header"
									>
										<Typography variant="h4" fontWeight="bold">Bộ lọc</Typography>
									</AccordionSummary>
									<AccordionDetails>
										<Stack flexDirection="column">
											<FormControl >
												<RadioGroup
													name="radio-buttons-filters"
													value={currentFilter}
													onChange={handleOnChangeCheckbox}
												>
													<FormControlLabel value={""} control={<Radio />} label={"Tất cả"} />
													{productTypes.map((productType) => {
														return (
															<FormControlLabel value={productType.slug.current} control={<Radio />} label={productType.name} />
														)
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
	const products: Products = await productsApi.getAllProducts();
	const productTypes: ProductType[] = await productTypeApi.getAll();
	const banner: Banner[] = await bannerApi.getBannerProductsPage();

	const formatProducts = products.map((product) => {
		return {
			...product,
			type: productTypes.find((productType) => productType._id === product.productType._ref).slug.current
		}
	});
	return {
		props: {
			products: formatProducts,
			productTypes,
			banner,
		},
		revalidate: 120,
	};
};

export default Home;
