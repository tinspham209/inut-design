import { ProductHighlight } from "@/models/product-page";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Box, Grid, Stack, Typography } from "@mui/material";
import React from "react";

export interface IntroductionSectionProps {
	title?: string;
	bullets: string[];
	highlights: ProductHighlight[];
}

export const IntroductionSection: React.FC<IntroductionSectionProps> = ({
	title,
	bullets,
	highlights,
}) => {
	return (
		<Box>
			{title && (
				<Box sx={{ mb: 6, textAlign: "center" }}>
					<Typography
						variant="h3"
						fontWeight={900}
						gutterBottom
						sx={{ fontSize: { xs: "2rem", md: "2.75rem" } }}
					>
						{title}
					</Typography>
					<Box
						sx={{
							width: 60,
							height: 4,
							bgcolor: "primary.main",
							mx: "auto",
							borderRadius: 2,
						}}
					/>
				</Box>
			)}

			<Grid container spacing={{ xs: 4, md: 8 }}>
				<Grid item xs={12} lg={5}>
					<Stack
						spacing={3}
						sx={{
							p: { xs: 3, md: 5 },
							bgcolor: "white",
							borderRadius: 4,
							boxShadow: "0 20px 40px rgba(0,0,0,0.07)",
							height: "100%",
						}}
					>
						{bullets.map((bullet, index) => (
							<Stack key={index} direction="row" spacing={2} alignItems="flex-start">
								<Box
									sx={{
										width: 28,
										height: 28,
										borderRadius: "50%",
										bgcolor: "primary.main",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										color: "white",
										flexShrink: 0,
										mt: 0.3,
									}}
								>
									<CheckCircleIcon sx={{ fontSize: 18 }} />
								</Box>
								<Typography
									variant="body1"
									fontWeight={500}
									sx={{
										fontSize: { xs: "1rem", md: "1.1rem" },
										lineHeight: 1.7,
										color: "text.primary",
									}}
								>
									{bullet}
								</Typography>
							</Stack>
						))}
					</Stack>
				</Grid>
				<Grid item xs={12} lg={7}>
					<Grid container spacing={{ xs: 2, md: 3 }}>
						{highlights.map((highlight, index) => (
							<Grid item xs={12} sm={6} key={index}>
								<Box
									sx={{
										p: { xs: 3, md: 4 },
										height: "100%",
										bgcolor: "white",
										borderRadius: 4,
										border: "1px solid",
										borderColor: "grey.200",
										transition: "all 0.3s ease",
										"&:hover": {
											borderColor: "primary.main",
											transform: "translateY(-5px)",
											boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
										},
									}}
								>
									<Stack spacing={2}>
										<Box
											sx={{
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												width: 52,
												height: 52,
												borderRadius: 3,
												bgcolor: "primary.light",
												color: "primary.main",
												mb: 1,
											}}
										>
											{React.cloneElement(highlight.icon as React.ReactElement, {
												sx: { fontSize: 28 },
											})}
										</Box>
										<Box>
											<Typography variant="h6" fontWeight={800} gutterBottom sx={{ fontSize: "1.2rem" }}>
												{highlight.title}
											</Typography>
											<Typography
												variant="body2"
												color="text.secondary"
												sx={{ fontSize: "0.95rem", lineHeight: 1.65 }}
											>
												{highlight.description}
											</Typography>
										</Box>
									</Stack>
								</Box>
							</Grid>
						))}
					</Grid>
				</Grid>
			</Grid>
		</Box>
	);
};
