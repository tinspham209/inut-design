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

	return <ProductItem product={product} productTypes={productTypes} isMacnut={isMacnut} />;
}
