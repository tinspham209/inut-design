import { urlFor } from "@/api-client/sanity-client";
import { Product, ProductType } from "@/models/products";
import { Box, Button, Chip, Link as MuiLink, Stack, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import styles from "./product-item.module.css";

export interface ProductItemProps {
	product: Product;
	productTypes: ProductType[];
}

export function ProductItem({ product, productTypes }: ProductItemProps) {
	if (!product) return null;

	const productType = productTypes.find((type) => type._id === product.productType._ref);
	return (
		<Link href={`/products/${product.slug.current}`} passHref>
			<MuiLink>
				<Box bgcolor="#1c1f26">
					<Box>
						<Image
							src={urlFor(product.image[0]).width(500).url()}
							width="100%"
							height={"100%"}
							layout="responsive"
							alt="avatar"
							priority={true}
							className={styles.productImage}
						/>
					</Box>
					<Typography
						variant="h5"
						fontWeight="bold"
						mt={2}
						fontFamily={'"Zawtturee", "Bangers" ,"Roboto", sans-serif'}
					>
						{product.name}
					</Typography>
					<Box mt={1}>
						<Chip label={productType.name} variant="outlined" color="primary" size="small" />
					</Box>
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
