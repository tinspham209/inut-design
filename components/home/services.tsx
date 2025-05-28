import { COLOR_CODE } from "@/utils";
import { Box, Button, Container, Grid, Link as MuiLink, Stack, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

export const servicesOptions = [
	{
		label: "Skin Laptop",
		url: "/products",
		img: "/branding/services/skin-laptop.avif",
	},
	{
		label: "Skin Nút Phím",
		url: "/macnut",
		img: "/branding/services/skin-nut-phim.avif",
	},
	{
		label: "Sticker",
		url: "/contact",
		img: "/branding/services/sticker.avif",
	},
	{
		label: "Nhãn chai sản phẩm",
		url: "/contact",
		img: "/branding/services/nhan-chai-san-pham.avif",
	},
	{
		label: "Thiết kế & In ấn",
		url: "/contact",
		img: "/branding/services/thiet-ke-in-an.avif",
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

				<Grid container spacing={3} my={2}>
					{servicesOptions.map((service, index) => (
						<Grid item xs={12} sm={2.4} key={`${service.label}-${index}`}>
							<Link href={service.url} passHref>
								<MuiLink
									sx={{
										position: "relative",
										display: "flex",
										flexDirection: "column",
										justifyContent: "center",

										"& span": {
											margin: "0 auto !important",
										},
									}}
								>
									<Image
										src={service.img}
										width={"80px"}
										height={"80px"}
										alt="service item"
										priority={true}
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

				<Stack flexDirection={"row"} justifyContent={"center"} mt={4}>
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
