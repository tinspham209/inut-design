import { urlFor } from "@/api-client/sanity-client";
import { LighterProduct } from "@/models";
import { COLOR_CODE, trackSelectProduct } from "@/utils";
import {
	Box,
	Button,
	Container,
	Grid,
	Icon,
	Link as MuiLink,
	Stack,
	Tooltip,
	Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { HiDuplicate } from "react-icons/hi";
import styles from "../product/product-item.module.css";

type Props = {
	products: LighterProduct[];
};

export function ListSpecialLighters({ products }: Props) {
	return (
		<Box component={"section"} bgcolor={COLOR_CODE.BACKGROUND} pt={2} pb={4}>
			<Container>
				<Stack direction="row" py={3} justifyContent={"center"} alignItems={"center"}>
					<Typography
						variant="h3"
						fontWeight={"bold"}
						textAlign={"center"}
						color={COLOR_CODE.TEXT_DARK}
					>
						Bật lửa
					</Typography>
				</Stack>

				<Grid container spacing={3}>
					{products?.map((product, index) => (
						<Grid item xs={6} sm={3} key={`${product._id}-${index}`}>
							<Link href={`/lighters/${product.slug.current}`} passHref>
								<MuiLink
									sx={{
										position: "relative",
									}}
									onClick={() =>
										trackSelectProduct(
											{
												id: product._id,
												name: product.name,
												category: "Bật lửa",
											},
											"Homepage Featured",
											index
										)
									}
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
				</Grid>
				<Stack flexDirection={"row"} justifyContent={"center"} mt={3}>
					<Link href={`/lighters`} passHref>
						<MuiLink>
							<Button variant="contained">Xem thêm sản phẩm</Button>
						</MuiLink>
					</Link>
				</Stack>
			</Container>
		</Box>
	);
}
