import { urlFor } from "@/api-client/sanity-client";
import { Product, ProductType } from "@/models/products";
import { trackSelectProduct } from "@/utils/analytics";
import { COLOR_CODE } from "@/utils/theme";
import { Box, Card, CardContent, Link as MuiLink, Stack, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

export interface ProductItemProps {
	product: Product;
	productTypes: ProductType[];
	isMacnut?: boolean;
}

export function ProductItem({ product, productTypes, isMacnut = false }: ProductItemProps) {
	const [hovered, setHovered] = useState(false);

	const primaryImage = useMemo(() => product.image?.[0], [product.image]);
	const secondaryImage = useMemo(
		() => (product.image && product.image.length > 1 ? product.image[1] : undefined),
		[product.image]
	);
	const primaryUrl = useMemo(
		() => (primaryImage ? urlFor(primaryImage).width(500).url() : ""),
		[primaryImage]
	);
	const secondaryUrl = useMemo(
		() => (secondaryImage ? urlFor(secondaryImage).width(500).url() : undefined),
		[secondaryImage]
	);

	const productType = isMacnut
		? productTypes.find((type) => type._id === product.macnutType._ref)
		: productTypes.find((type) => type._id === product.productType._ref);

	const handleProductClick = () => {
		trackSelectProduct(
			{
				id: product._id,
				name: product.name,
				category: productType?.name || (isMacnut ? "Macnut" : "Products"),
				brand: "INUT Design",
			},
			isMacnut ? "Macnut" : "Products"
		);
	};

	return (
		<Card
			sx={{
				transition: "border-color 200ms, transform 200ms cubic-bezier(0.16,1,0.3,1)",
				"&:hover": {
					transform: "translateY(-3px)",
					borderColor: "rgba(255,77,0,0.25)",
				},
				borderRadius: { xs: "12px", md: "16px" },
				display: "flex",
				flexDirection: "column",
				height: "100%",
				backgroundColor: COLOR_CODE.INK_3,
				border: `1px solid ${COLOR_CODE.INK_4}`,
			}}
			id={product.slug.current}
		>
			<CardContent
				sx={{
					p: 0,
					"&:last-child": { pb: 0 },
					flex: 1,
					display: "flex",
					flexDirection: "column",
				}}
			>
				<Link
					href={
						isMacnut
							? `/san-pham/skin-nut-phim/${product.slug.current}`
							: `/san-pham/skin-laptop/${product.slug.current}`
					}
					passHref
				>
					<MuiLink sx={{ textDecoration: "none" }} onClick={() => handleProductClick()}>
						<Box>
							<Box
								sx={{
									position: "relative",
									backgroundColor: "transparent",
									borderRadius: { xs: "12px 12px 0 0", md: "16px 16px 0 0" },
									overflow: "hidden",
									p: 1,
								}}
								onMouseEnter={() => secondaryUrl && setHovered(true)}
								onMouseLeave={() => secondaryUrl && setHovered(false)}
							>
								<Image
									src={hovered && secondaryUrl ? secondaryUrl : primaryUrl}
									width="100%"
									height={"100%"}
									unoptimized
									layout="responsive"
									alt={product.name}
									priority={true}
									style={{
										borderRadius: 8,
										transition: "opacity 0.3s ease",
									}}
								/>
							</Box>

							{/* Product Info Section */}
							<Box sx={{ px: 1 }}>
								<Typography
									variant="caption"
									sx={{
										fontSize: { xs: "0.7rem", md: "0.75rem" },
										color: COLOR_CODE.TEXT_MUTED,
										fontWeight: 600,
									}}
								>
									{productType?.name || (isMacnut ? "Macnut" : "Products")}
								</Typography>
								<Typography
									variant="h6"
									sx={{
										fontWeight: "bold",
										fontSize: { xs: "0.95rem", md: "1rem" },
										lineHeight: 1.3,
										color: COLOR_CODE.WHITE,
									}}
								>
									{product.name}
								</Typography>
							</Box>
						</Box>
						<Stack
							sx={{
								p: 1,
								pt: 0,
							}}
							direction="row"
							alignItems="center"
							justifyContent="space-between"
						></Stack>
					</MuiLink>
				</Link>
			</CardContent>
		</Card>
	);
}
