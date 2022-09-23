/* eslint-disable @next/next/no-img-element */
import { Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { motion, useScroll, useTransform } from "framer-motion";
import * as React from "react";

export function HeroSection2() {
	const ref = React.useRef(null);
	const { scrollYProgress } = useScroll({
		target: ref,
	});
	const scale = useTransform(scrollYProgress, [0, 1], [400, 1]);
	const translate = useTransform(scrollYProgress, [0, 1], [20, 1]);

	return (
		<motion.div ref={ref}>
			<Box
				component={"section"}
				mb={4}
				sx={{
					position: "relative",
					height: "150vh",

					"& video": {
						objectFit: "cover",
						width: "100%",
						height: "100%",
						top: 0,
						left: 0,
						display: "block",
						position: "fixed",
						zIndex: -1,
					},
				}}
			>
				<video src={"/main-video1.mp4"} autoPlay muted loop />
				<Stack
					// justifyContent={"center"}
					// flexDirection="row"
					// alignItems={"center"}
					// minHeight={"100vh"}
					sx={{
						position: "fixed",
						top: "20%",
						left: "30%",
						zIndex: -1,
					}}
				>
					<motion.div
						style={{
							scale: scale,
							transform: translate,
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
									bgcolor: "#fff",
									top: "calc(100% - 10px)",
									zIndex: -1,
								},
								"&::after": {
									content: '""',
									position: "absolute",
									left: "-100vh",
									height: "300vh",
									width: "300vh",
									bgcolor: "#fff",
									bottom: "calc(100% - 5px)",
									zIndex: -1,
								},
							}}
						>
							<Box
								sx={{
									position: "relative",
									display: "flex",
									flexDirection: "column",
									"&::before": {
										content: '""',
										position: "absolute",
										top: "-100vh",
										height: "300vh",
										width: "100vh",
										bgcolor: "#fff",
										left: "calc(100% - 5px)",
										zIndex: -1,
									},
									"&::after": {
										content: '""',
										position: "absolute",
										top: "-100vh",
										height: "300vh",
										width: "100vh",
										bgcolor: "#fff",
										right: "calc(100% - 5px)",
										zIndex: -1,
									},
								}}
							>
								<img src={"/hero22.png"} alt="avatar" />
								<Typography
									variant="button"
									textAlign={"center"}
									fontSize={64}
									sx={{ bgcolor: "white", transform: "translateY(-8px)" }}
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
