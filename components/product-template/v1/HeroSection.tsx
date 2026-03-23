import { Box, Button, Chip, Container, Grid, Stack, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";

interface HeroSectionProps {
	title: string;
	description: string;
	image: string;
	chips?: string[];
	ctaLabel?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
	title,
	description,
	image,
	chips = [],
	ctaLabel = "Đặt in ngay",
}) => {
	return (
		<Box
			sx={{
				bgcolor: "#1a1f2b", // Dark navy background matching screenshot
				color: "white",
				overflow: "hidden",
			}}
		>
			<Container sx={{ py: { xs: 4, md: 6 } }}>
				<Grid container spacing={{ xs: 4, md: 8 }} alignItems="center">
					<Grid item xs={12} md={6}>
						<Stack spacing={{ xs: 2, md: 3 }}>
							{chips.length > 0 && (
								<Stack direction="row" spacing={1} flexWrap="wrap">
									{chips.map((chip, index) => (
										<Chip
											key={index}
											label={chip}
											size="small"
											sx={{
												bgcolor: "primary.main",
												color: "white",
												fontWeight: 600,
												fontSize: "0.7rem",
												height: 20,
											}}
										/>
									))}
								</Stack>
							)}
							<Typography
								variant="h3"
								fontWeight={800}
								lineHeight={1.2}
								sx={{ fontSize: { xs: "1.75rem", md: "2.5rem" } }}
							>
								{title}
							</Typography>
							<Typography
								variant="body1"
								sx={{
									color: "rgba(255,255,255,0.8)",
									fontSize: { xs: "0.875rem", md: "1rem" },
									maxWidth: 500,
								}}
							>
								{description}
							</Typography>
							<Stack
								direction={{ xs: "column", sm: "row" }}
								spacing={2}
								sx={{ pt: { xs: 1, md: 2 } }}
							>
								<Button
									variant="contained"
									color="primary"
									size="large"
									href="#order"
									sx={{
										fontWeight: 700,
										px: 4,
										textTransform: "uppercase",
										fontSize: "0.9rem",
									}}
								>
									{ctaLabel}
								</Button>
								<Button
									variant="outlined"
									size="large"
									href="#gallery"
									sx={{
										borderColor: "rgba(255,255,255,0.3)",
										color: "white",
										fontWeight: 700,
										px: 4,
										textTransform: "uppercase",
										fontSize: "0.9rem",
										"&:hover": {
											borderColor: "white",
											bgcolor: "rgba(255,255,255,0.1)",
										},
									}}
								>
									Xem mẫu sản phẩm
								</Button>
							</Stack>
						</Stack>
					</Grid>
					<Grid item xs={12} md={6}>
						<Box
							sx={{
								position: "relative",
								width: "100%",
								pt: "75%", // 4:3 Aspect Ratio
								borderRadius: 2,
								overflow: "hidden",
								boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
							}}
						>
							<Image
								src={image}
								alt={title}
								layout="fill"
								objectFit="cover"
								unoptimized
								priority={true}
							/>
						</Box>
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
};
