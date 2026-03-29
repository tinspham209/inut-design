import { ProductHighlight } from "@/models/product-page";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { COLOR_CODE } from "@/utils/theme";
import { Box, Grid, Stack, Typography } from "@mui/material";
import React from "react";
import { colors } from "../v3/shared";

interface IntroductionSectionProps {
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
				<Typography
					variant="h4"
					fontWeight={800}
					gutterBottom
					color={colors.white}
					sx={{ fontSize: { xs: "1.5rem", md: "2.25rem" }, mb: 4 }}
				>
					{title}
				</Typography>
			)}
			<Grid container spacing={{ xs: 4, md: 8 }}>
				<Grid item xs={12} md={6}>
					<Stack spacing={2}>
						{bullets.map((bullet, index) => (
							<Stack key={index} direction="row" spacing={1.5} alignItems="flex-start">
								<CheckCircleIcon
									sx={{ color: COLOR_CODE.PRIMARY, fontSize: 20, mt: 0.3, flexShrink: 0 }}
								/>
								<Typography
									variant="body1"
									sx={{
										fontSize: { xs: "0.9rem", md: "1rem" },
										lineHeight: 1.6,
										color: colors.smoke,
									}}
								>
									{bullet}
								</Typography>
							</Stack>
						))}
					</Stack>
				</Grid>
				<Grid item xs={12} md={6}>
					<Grid container spacing={3}>
						{highlights.map((highlight, index) => (
							<Grid item xs={12} sm={6} key={index}>
								<Stack spacing={1.5}>
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											width: 40,
											height: 40,
											borderRadius: 1,
											bgcolor: "rgba(255,77,0,0.1)",
											color: COLOR_CODE.PRIMARY,
										}}
									>
										{highlight.icon}
									</Box>
									<Box>
										<Typography
											variant="subtitle1"
											fontWeight={700}
											sx={{ fontSize: "1rem", color: COLOR_CODE.WHITE }}
										>
											{highlight.title}
										</Typography>
										<Typography
											variant="body2"
											sx={{ fontSize: "0.85rem", lineHeight: 1.5, color: COLOR_CODE.TEXT_MUTED }}
										>
											{highlight.description}
										</Typography>
									</Box>
								</Stack>
							</Grid>
						))}
					</Grid>
				</Grid>
			</Grid>
		</Box>
	);
};
