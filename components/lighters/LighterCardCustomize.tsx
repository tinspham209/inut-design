import { trackEvent } from "@/utils/analytics";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, Card, CardContent, Link as MuiLink, Stack, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { COLOR_CODE } from "@/utils/theme";

const LighterCardCustomize: React.FC = () => {
	const handleTrackClick = () => {
		trackEvent("click_lighter_customize", {
			category: "engagement",
			label: "Lighter Customize Card",
		});
	};

	return (
		<Link href="/services/ca-nhan-hoa/skin-bat-lua-customize" passHref>
			<MuiLink sx={{ textDecoration: "none" }} onClick={handleTrackClick}>
				<Card
					sx={{
						transition: "border-color 200ms, transform 200ms cubic-bezier(0.16,1,0.3,1)",
						transform: "scale(1)",
						"&:hover": {
							transform: "translateY(-3px)",
							borderColor: "rgba(255,77,0,0.25)",
						},
						borderRadius: { xs: "12px", md: "16px" },
						display: "flex",
						flexDirection: "column",
						height: "100%",
						backgroundColor: COLOR_CODE.INK_3,
						border: `1px solid ${COLOR_CODE.INK_4}`,
					}}
				>
					<CardContent
						sx={{
							p: 0,
							"&:last-child": { pb: 0 },
							flex: 1,
							display: "flex",
							flexDirection: "column",
						}}
					>
						<Box
							sx={{
								position: "relative",
								backgroundColor: "transparent",
								borderRadius: { xs: "12px 12px 0 0", md: "16px 16px 0 0" },
								overflow: "hidden",
								p: 1,
							}}
						>
							<Box
								sx={{
									background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
									borderRadius: 8,
									width: "100%",
									paddingTop: "100%",
								}}
							>
								<Image
									src="/assets/skin-bat-lua-customize.avif"
									alt="Bật lửa theo yêu cầu"
									layout="fill"
									objectFit="cover"
									priority
								/>
							</Box>
						</Box>
						<Box sx={{ px: 1 }}>
							<Typography
								variant="caption"
								sx={{
									fontSize: { xs: "0.7rem", md: "0.75rem" },
									color: COLOR_CODE.TEXT_MUTED,
									fontWeight: 600,
								}}
							>
								Bật lửa thiết kế
							</Typography>
							<Typography
								variant="h6"
								sx={{
									fontWeight: "bold",
									fontSize: { xs: "0.95rem", md: "1rem" },
									lineHeight: 1.3,
									color: COLOR_CODE.WHITE,
								}}
							>
								Bật lửa thiết kế theo yêu cầu của bạn
							</Typography>
						</Box>
						<Stack direction="row" alignItems="center" justifyContent="space-between" p={1}>
							<Typography
								variant="caption"
								sx={{
									fontSize: { xs: "0.75rem", md: "0.85rem" },
									color: COLOR_CODE.TEXT_MUTED,
								}}
							>
								Xem ngay
							</Typography>
							<ArrowForwardIcon fontSize="small" sx={{ color: COLOR_CODE.PRIMARY }} />
						</Stack>
					</CardContent>
				</Card>
			</MuiLink>
		</Link>
	);
};

export default LighterCardCustomize;
