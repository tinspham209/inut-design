import { COLOR_CODE } from "@/utils";
import { Button, Container, Grid, Link as MuiLink, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import Image from "next/image";
import Link from "next/link";
import styles from "./information.module.css";

export const servicesOptions = [
	{
		label: "Skin Laptop",
		url: "/products",
		img: "/branding/logo.webp",
	},
	{
		label: "Skin Nút Phím",
		url: "/macnut",
		img: "/branding/logo.webp",
	},
	{
		label: "Sticker",
		url: "/contact",
		img: "/branding/logo.webp",
	},
	{
		label: "Nhãn chai sản phẩm",
		url: "/contact",
		img: "/branding/logo.webp",
	},
	{
		label: "Menu cửa hàng",
		url: "/contact",
		img: "/branding/logo.webp",
	},
	{
		label: "Tư vấn thiết kế",
		url: "/contact",
		img: "/branding/logo.webp",
	},
];

export function Services() {
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
						Dịch vụ
					</Typography>
				</Stack>

				<Grid container spacing={3}>
					{servicesOptions.map((service, index) => (
						<Grid item xs={6} sm={2} key={`${service.label}-${index}`}>
							<Link href={service.url} passHref>
								<MuiLink
									sx={{
										position: "relative",
									}}
								>
									<Image
										src={service.img}
										width="100%"
										height={"100%"}
										layout="responsive"
										alt="service item"
										priority={true}
										className={styles.infoImage}
									/>

									<Stack flexDirection={"row"} justifyContent={"center"} mt={2}>
										<Typography variant="body1" color={COLOR_CODE.TEXT_DARK} fontWeight={"bold"}>
											{service.label}
										</Typography>
									</Stack>
								</MuiLink>
							</Link>
						</Grid>
					))}
				</Grid>

				<Stack flexDirection={"row"} justifyContent={"center"} mt={3}>
					<Link href={`/contact`} passHref>
						<MuiLink>
							<Button variant="contained">Liên hệ tư vấn</Button>
						</MuiLink>
					</Link>
				</Stack>
			</Container>
		</Box>
	);
}
