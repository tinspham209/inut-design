import React from "react";
import { Box, Typography, Divider, Link as MuiLink } from "@mui/material";
import Link from "next/link";
import Image from "next/image";

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

const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => (
	<Box component="section" pt={2} mt={2}>
		<Typography variant="h3" mt={2} fontWeight="bold" textAlign="center">
			Có thể bạn sẽ thích
		</Typography>
		<div className="marquee">
			<div className="maylike-products-container track">
				{products.map((product) => (
					<Link href={`/lighters/${product.slug.current}`} passHref key={product._id}>
						<MuiLink>
							<Image
								src={product.imageUrl}
								width={250}
								height={250}
								alt={product.name}
								style={{ borderRadius: 8, objectFit: "cover" }}
							/>
							<Typography
								variant="h6"
								mt={1}
								fontWeight="bold"
								textAlign="center"
								sx={{
									mt: 1,
									fontWeight: "bold",
									textAlign: "center",
									whiteSpace: "nowrap",
									textOverflow: "ellipsis",
									overflow: "hidden",
								}}
							>
								{product.name}
							</Typography>
						</MuiLink>
					</Link>
				))}
			</div>
		</div>
		<Divider />
	</Box>
);

export default RelatedProducts;
