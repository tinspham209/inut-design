import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Box, Card, CardContent, Link as MuiLink, Stack, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const MacnutCustomizeCard: React.FC = () => {
	return (
		<Link href="/macnut/customize" passHref>
			<MuiLink sx={{ textDecoration: "none" }}>
				<Card
					variant="outlined"
					sx={{
						transition: "all 0.2s ease",
						transform: "scale(1)",
						"&:hover": {
							transform: "scale(1.01)",
						},
						borderRadius: { xs: "12px", md: "16px" },
						display: "flex",
						flexDirection: "column",
						height: "100%",
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
									borderRadius: '4px',
									width: "100%",
									paddingTop: "100%",
									position: "relative",
									overflow: "hidden"
								}}
							>
								<Image
									src="/branding/ogImage.jpg"
									alt="Custom skin nút phím"
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
									color: "#8c8c8c",
									fontWeight: 600,
								}}
							>
								Thiết kế theo yêu cầu
							</Typography>
							<Typography
								variant="h6"
								sx={{
									fontWeight: "bold",
									fontSize: { xs: "0.95rem", md: "1rem" },
									lineHeight: 1.3,
								}}
							>
								Custom skin nút phím
							</Typography>
						</Box>
						<Stack direction="row" alignItems="center" justifyContent="space-between" p={1}>
							<Typography
								variant="caption"
								sx={{
									fontSize: { xs: "0.75rem", md: "0.85rem" },
								}}
							>
								Xem ngay
							</Typography>
							<ArrowForwardIcon fontSize="small" />
						</Stack>
					</CardContent>
				</Card>
			</MuiLink>
		</Link>
	);
};
