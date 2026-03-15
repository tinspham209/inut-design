import React from "react";
import {
	Box,
	Typography,
	Divider,
	Link as MuiLink,
	useTheme,
	useMediaQuery,
	Grid,
} from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";

const Carousel = dynamic(() => import("react-material-ui-carousel"), { ssr: false });

interface RelatedProduct {
	_id: string;
	name: string;
	slug: { current: string };
	image: any[];
	imageUrl: string;
}

interface RelatedProductsProps {
	products: RelatedProduct[];
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => {
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
		<Box component="section" pt={2} mt={2}>
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
							{chunk.map((product) => (
								<Grid item xs={12} sm={4} md={2.4} key={product._id}>
									<Link
										href={`/lighters/${product.slug.current}`}
										passHref
										style={{ textDecoration: "none" }}
									>
										<MuiLink sx={{ textDecoration: "none", display: "block" }}>
											<Box
												sx={{
													position: "relative",
													width: "100%",
													pt: "100%",
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
													src={product.imageUrl}
													layout="fill"
													objectFit="cover"
													alt={product.name}
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
												{product.name}
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
	);
};

export default RelatedProducts;
