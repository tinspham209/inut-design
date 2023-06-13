import { urlFor } from "@/api-client/sanity-client";
import { Product, ProductType } from "@/models/products";
import { Box, Button, Link as MuiLink, Stack, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import styles from "./product-item.module.css";

export interface ProductItemProps {
	product: Product;
	productTypes: ProductType[];
	isMacnut?: boolean;
}

export function ProductItem({ product, productTypes, isMacnut = false }: ProductItemProps) {
	if (!product) return null;

	const productType = productTypes.find((type) => type._id === product.productType._ref);
	return (
		<Link href={`/${isMacnut ? "macnut" : "products"}/${product.slug.current}`} passHref>
			<MuiLink>
				<Box>
					<Box>
						<Image
							src={urlFor(product.image[0]).width(500).url()}
							width="100%"
							height={"100%"}
							unoptimized
							layout="responsive"
							alt="avatar"
							priority={true}
							className={styles.productImage}
						/>
					</Box>
					<Typography
						variant="h6"
						sx={{
							fontWeight: "bold",
							mt: 2,
							whiteSpace: "nowrap",
							textOverflow: "ellipsis",
							overflow: "hidden",
						}}
					>
						{product.name}
					</Typography>

					<Typography
						variant="body2"
						sx={{
							whiteSpace: "nowrap",
							textOverflow: "ellipsis",
							overflow: "hidden",
							color: "#8c8c8c",
						}}
					>
						{productType.name}
					</Typography>
					<Stack direction="row" justifyContent={"flex-end"}>
						<Button variant="text" color="primary">
							Xem chi tiết
						</Button>
					</Stack>
				</Box>
			</MuiLink>
		</Link>
	);
}
