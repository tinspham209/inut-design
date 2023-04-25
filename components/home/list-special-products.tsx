import { urlFor } from "@/api-client/sanity-client";
import { Products } from "@/models/products";
import { COLOR_CODE } from "@/utils";
import {
	Button,
	Container,
	Grid,
	Icon,
	Link as MuiLink,
	Stack,
	Tooltip,
	Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { HiDuplicate } from "react-icons/hi";
import styles from "../product/product-item.module.css";
type Props = {
	products: Products;
	isMacnut?: boolean;
};

export function ListSpecialProducts({ products, isMacnut = false }: Props) {
	return (
		<Box
			component={"section"}
			bgcolor={isMacnut ? COLOR_CODE.BACKGROUND : COLOR_CODE.BACKGROUND_CARD}
			pt={2}
			pb={4}
			zIndex={999}
		>
			<Container>
				<Stack direction="row" py={3} justifyContent={"center"} alignItems={"center"}>
					<Typography
						variant="h3"
						fontWeight={"bold"}
						textAlign={"center"}
						color={"white"}
						fontFamily={'"Zawtturee", "Bangers" ,"Roboto", sans-serif'}
						letterSpacing="10px"
					>
						{isMacnut ? "MACNUT" : "Sản phẩm nổi bật"}
					</Typography>
				</Stack>

				<Grid container spacing={2}>
					{products.map((product, index) => (
						<Grid item xs={6} sm={4} key={`${product._id}-${index}`}>
							<Link href={`/${isMacnut ? "macnut" : "products"}/${product.slug.current}`} passHref>
								<MuiLink
									sx={{
										position: "relative",
									}}
								>
									<Image
										src={`${urlFor(product.image[0]).width(800).url()}`}
										width="100%"
										height={"100%"}
										layout="responsive"
										alt="avatar"
										priority={true}
										className={styles.productImage}
									/>
									<Tooltip title="Xem chi tiết" placement="right-end" arrow>
										<Icon
											sx={{
												position: "absolute",
												top: "8px",
												right: "8px",
											}}
										>
											<HiDuplicate color="#fff" />
										</Icon>
									</Tooltip>
								</MuiLink>
							</Link>
						</Grid>
					))}

					<Grid item xs={12} container justifyContent={"center"}>
						<Link href={`/${isMacnut ? "macnut" : "products"}`} passHref>
							<MuiLink>
								<Button variant="contained">Xem thêm sản phẩm</Button>
							</MuiLink>
						</Link>
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
}
