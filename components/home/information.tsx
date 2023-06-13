import { LaptopCanvas } from "@/components/canvas";
import { Container, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import Image from "next/image";
import { Element } from "react-scroll";

export const INFO_ID_ELEMENT = "information";
export function InfoSection() {
	return (
		<Element name={INFO_ID_ELEMENT}>
			<Box
				component={"section"}
				pt={2}
				pb={4}
				id={INFO_ID_ELEMENT}
				sx={{
					minHeight: "50vh",
					position: "relative",
					"&:before": {
						content: '""',
						position: "absolute",
						top: 0,
						left: 0,
						width: "100%",
						height: "100%",
						zIndex: "-1",
						backgroundImage: `url(/branding/hero.webp)`,
						backgroundSize: "cover",
						backgroundRepeat: "no-repeat",
						backgroundPosition: {
							xs: "bottom 150px left 0px",
							sm: '"bottom 150px left 0px"',
						},
						backgroundColor: "rgba(0,0,0,0.5)",
						backgroundAttachment: "fixed",
						filter: "blur(2px)",
					},
				}}
			>
				<Box
					sx={{
						position: "absolute",
						zIndex: "-1",
						right: {
							xs: "5%",
							md: "25%",
						},
						top: {
							xs: "57%",
							md: "15%",
						},
						width: "100%",
						height: "80%",
						overflow: "hidden",
						backgroundImage: `url(/branding/hero-bg.webp)`,
						transform: "scaleX(-1)",
						backgroundRepeat: "no-repeat",
						backgroundSize: "contain",
						filter: "blur(1px)",
						opacity: "0.9",
					}}
				/>
				<Container>
					<Stack
						justifyContent={"center"}
						flexDirection={{
							xs: "column",
							md: "row",
						}}
						alignItems={"center"}
						sx={{
							mt: {
								xs: 1,
								sm: 5,
							},
						}}
					>
						<Stack
							justifyContent={"center"}
							mr={{
								xs: 6,
								md: 12,
							}}
						>
							<LaptopCanvas />
						</Stack>

						<Box
							maxWidth={480}
							sx={{
								mt: {
									xs: 1,
									sm: 0,
								},
							}}
						>
							<Stack flexDirection={"row"} alignItems="center" justifyContent={"space-between"}>
								<Image src={"/branding/logo.webp"} alt="INUT logo" width={"193px"} height="60px" />
							</Stack>

							<Typography variant="h3" sx={{ mt: 3 }} fontWeight="bold" color="white">
								Cửa Hàng Thời Trang
								<br /> Dành Cho Laptop
								<br />
								Tại Đà Nẵng
							</Typography>
							<Typography variant="body1" sx={{ mt: 3 }} color="white">
								Custom skin cho tất cả các loại laptop có trên trái đất.
								<br />
								Không giới hạn hình ảnh và idea!!!!
							</Typography>
						</Box>
					</Stack>
				</Container>
			</Box>
		</Element>
	);
}
