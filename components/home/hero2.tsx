import { Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import * as React from "react";
import Image from "next/image";
import { MotionValue, motion } from "framer-motion";

type Props = {
	scrollYProgress: MotionValue<number>;
};

export function HeroSection2({ scrollYProgress }: Props) {
	return (
		<Box
			component={"section"}
			mb={4}
			sx={{
				position: "relative",
				height: "1000vh",

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
				justifyContent={"center"}
				flexDirection="row"
				alignItems={"center"}
				minHeight={"100vh"}
				style={{
					transform: "scale(5) ",
				}}
			>
				<motion.div
					style={{
						scale: scrollYProgress,
					}}
				>
					<Box
						zIndex={100}
						sx={{
							position: "relative",
							"&::before": {
								content: '""',
								position: "absolute",
								left: "-100vh",
								height: "300vh",
								width: "300vh",
								bgcolor: "#000",
								top: "calc(100% - 10px)",
							},
							"&::after": {
								content: '""',
								position: "absolute",
								left: "-100vh",
								height: "300vh",
								width: "300vh",
								bgcolor: "#000",
								bottom: "calc(100% - 5px)",
							},
						}}
					>
						<Box
							sx={{
								position: "relative",
								"&::before": {
									content: '""',
									position: "absolute",
									top: "-100vh",
									height: "300vh",
									width: "100vh",
									bgcolor: "#000",
									left: "calc(100% - 5px)",
								},
								"&::after": {
									content: '""',
									position: "absolute",
									top: "-100vh",
									height: "300vh",
									width: "100vh",
									bgcolor: "#000",
									right: "calc(100% - 5px)",
								},
							}}
						>
							<img src={"/hero2.webp"} alt="avatar" />
						</Box>
					</Box>
				</motion.div>
			</Stack>
		</Box>
	);
}
