/* eslint-disable @next/next/no-img-element */
import { COLOR_CODE } from "@/utils";
import { MouseOutlined } from "@mui/icons-material";
import { IconButton, Stack, Typography, useMediaQuery } from "@mui/material";
import { Box } from "@mui/system";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import * as React from "react";
import { scroller } from "react-scroll";
import { INFO_ID_ELEMENT } from "./information";
export function HeroSection() {
	const ref = React.useRef(null);
	const { scrollYProgress } = useScroll({
		target: ref,
	});

	const isSmScreen = useMediaQuery("(max-width:600px)");

	const scale = useTransform(scrollYProgress, [0, 1], [isSmScreen ? 50 : 40, 1]);
	const translateX = useTransform(scrollYProgress, [0, 1], [-300, 0]);
	const translateY = useTransform(scrollYProgress, [0, 1], [isSmScreen ? 1000 : 0, 0]);

	return (
		<motion.div
			ref={ref}
			style={{
				position: "relative",
			}}
		>
			<IconButton
				onClick={() => {
					const inforElement = document.getElementById(INFO_ID_ELEMENT);
					if (isSmScreen) {
						inforElement.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
					} else {
						scroller.scrollTo(INFO_ID_ELEMENT, {
							smooth: true,
							duration: 1000,
							offset: -550,
						});
					}
				}}
				sx={{
					position: "fixed",
					bottom: {
						xs: "10%",
						md: "5%",
					},
					opacity: 0,
					animation: "pulse 2s infinite",
				}}
			>
				<MouseOutlined fontSize={"large"} color="info" />
			</IconButton>
			<IconButton
				sx={{
					position: "fixed",
					bottom: {
						xs: "10%",
						md: "5%",
					},
					zIndex: -1,

					animation: "pulse 2s infinite",
					"@keyframes pulse": {
						"0%": {
							transform: "translate(calc(50vw - 50%), 0)",
						},
						"50%": {
							transform: "translate(calc(50vw - 50%), 20px)",
						},
						"100%": {
							transform: "translate(calc(50vw - 50%), 0)",
						},
					},
				}}
			>
				<MouseOutlined fontSize={"large"} color="primary" />
			</IconButton>
			<Box
				component={"section"}
				mb={4}
				sx={{
					position: "relative",
					height: {
						xs: "120vh",
						md: "150vh",
					},
					zIndex: -100,

					"& video, & img": {
						objectFit: "cover",
						width: "100%",
						height: "100%",
						top: 0,
						left: 0,
						display: "block",
						position: "fixed",
						zIndex: -100,
					},
				}}
			>
				{/* <video src={"/video-banner.mp4"} autoPlay muted loop /> */}
				<Image src={"/banner.webp"} layout="fill" alt="hero" priority={true} />
				<Stack
					sx={{
						position: "fixed",
						top: {
							xs: "10%",
							md: "10%",
						},
						left: "0",
						transform: "translate(calc(50vw - 50%))",
						zIndex: -100,
					}}
				>
					<motion.div
						style={{
							scale: scale,
							translateX: translateX,
							translateY: translateY,
						}}
					>
						<Box
							zIndex={1}
							sx={{
								position: "relative",
								"&::before": {
									content: '""',
									position: "absolute",
									left: "-100vh",
									height: "300vh",
									width: "300vh",
									bgcolor: COLOR_CODE.BACKGROUND,
									top: "calc(100% - 10px)",
									zIndex: -100,
								},
								"&::after": {
									content: '""',
									position: "absolute",
									left: "-100vh",
									height: "300vh",
									width: "300vh",
									bgcolor: COLOR_CODE.BACKGROUND,
									bottom: "calc(100% - 5px)",
									zIndex: -100,
								},
							}}
						>
							<Box
								sx={{
									position: "relative",
									display: "flex",
									maxWidth: {
										xs: "95%",
										md: "100%",
									},
									margin: {
										xs: "0 auto",
										md: "auto",
									},
									flexDirection: "column",
									"&::before": {
										content: '""',
										position: "absolute",
										top: "-100vh",
										height: "300vh",
										width: "100vh",
										bgcolor: COLOR_CODE.BACKGROUND,
										left: "calc(100% - 5px)",
										zIndex: -100,
									},
									"&::after": {
										content: '""',
										position: "absolute",
										top: "-100vh",
										height: "300vh",
										width: "100vh",
										bgcolor: COLOR_CODE.BACKGROUND,
										right: "calc(100% - 5px)",
										zIndex: -100,
									},
								}}
							>
								<Box>
									<Image
										src={"/hehehehe.png"}
										alt="avatar"
										unoptimized
										width={"100%"}
										height={"40%"}
										layout="responsive"
										priority={true}
									/>
								</Box>

								<Typography
									variant="h2"
									fontWeight={"bold"}
									textAlign={"center"}
									color={COLOR_CODE.WHITE}
									fontFamily={'"Bangers" ,"Roboto", sans-serif'}
									sx={{
										bgcolor: COLOR_CODE.BACKGROUND,
										pt: 6,
										transform: "translateY(-8px)",
									}}
								>
									Cửa Hàng Thời Trang Dành Cho Laptop
								</Typography>
							</Box>
						</Box>
					</motion.div>
				</Stack>
			</Box>
		</motion.div>
	);
}
