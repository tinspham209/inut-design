import { Product, ProductType } from "@/models/products";
import { COLOR_CODE } from "@/utils";
import { Card, CardContent, Box } from "@mui/material";
import { ProductItem } from ".";

export interface ProductCardProps {
	product: Product;
	productTypes: ProductType[];
	isMacnut?: boolean;
}

export function ProductCard({ product, productTypes, isMacnut = false }: ProductCardProps) {
	if (!product) return null;

	return (
		<Card
			sx={{
				animation: "all 2s ease-in-out",
				transform: "scale(1)",
				"&:hover": {
					transform: "scale(1.05)",
				},
				border: `1px solid ${COLOR_CODE.BORDER}`,
				borderRadius: "8px",
				display: "flex",
				flexDirection: "column",
				height: "100%",
			}}
			id={product.slug.current}
		>
			<CardContent
				sx={{
					pb: "8px !important",
					flex: 1,
					display: "flex",
					flexDirection: "column",
				}}
			>
				<Box sx={{ flex: 1 }}>
					<ProductItem product={product} productTypes={productTypes} isMacnut={isMacnut} />
				</Box>
			</CardContent>
		</Card>
	);
}
