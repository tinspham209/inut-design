import { ProductApplication, ProductionStep } from "@/models/product-page";
import { Box, Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import { COLOR_CODE } from "@/utils/theme";
import React, { ReactNode } from "react";

interface WhyInutSectionProps {
	title?: string;
	description?: string;
	productionProcess?: {
		title: string;
		items: ProductionStep[];
	};
	applications: {
		title: string;
		description: string;
		items: ProductApplication[];
	};
	commitment?: {
		title: string;
		description: string;
		icon: ReactNode;
	};
}

export const WhyInutSection: React.FC<WhyInutSectionProps> = ({
	title,
	description,
	productionProcess,
	applications,
	commitment,
}) => {
	return (
		<Box>
			<Typography
				variant="h5"
				fontWeight={800}
				gutterBottom
				sx={{ fontSize: "1.5rem", color: COLOR_CODE.WHITE }}
			>
				{title || "Vì sao chọn dịch vụ tại INUT Design?"}
			</Typography>
			{description && (
				<Typography variant="body2" sx={{ mb: 4, maxWidth: 800, color: COLOR_CODE.TEXT_MUTED }}>
					{description}
				</Typography>
			)}

			<Grid container spacing={3}>
				{/* Production Process Box */}
				{productionProcess && (
					<Grid item xs={12} md={4}>
						<Card
							sx={{
								height: "100%",
								bgcolor: COLOR_CODE.INK_3,
								border: `1px solid ${COLOR_CODE.INK_4}`,
								boxShadow: "none",
							}}
						>
							<CardContent sx={{ p: 2.5 }}>
								<Typography
									variant="subtitle1"
									fontWeight={800}
									sx={{ color: COLOR_CODE.PRIMARY }}
									gutterBottom
								>
									{productionProcess.title}
								</Typography>
								<Stack spacing={2} sx={{ mt: 2 }}>
									{productionProcess.items.map((step, index) => (
										<Stack key={index} direction="row" spacing={1.5} alignItems="flex-start">
											<Box sx={{ color: COLOR_CODE.PRIMARY, mt: 0.2 }}>{step.icon}</Box>
											<Box>
												<Typography
													variant="body2"
													fontWeight={700}
													sx={{ fontSize: "0.85rem", color: COLOR_CODE.WHITE }}
												>
													{step.title}
												</Typography>
												<Typography variant="caption" sx={{ color: COLOR_CODE.TEXT_MUTED }}>
													{step.description}
												</Typography>
											</Box>
										</Stack>
									))}
								</Stack>
							</CardContent>
						</Card>
					</Grid>
				)}

				{/* Applications Grid */}
				<Grid item xs={12} md={productionProcess ? 8 : 12}>
					<Card
						sx={{
							height: "100%",
							border: `1px solid ${COLOR_CODE.INK_4}`,
							boxShadow: "none",
							bgcolor: COLOR_CODE.INK_3,
						}}
					>
						<CardContent sx={{ p: 2.5 }}>
							<Typography
								variant="subtitle1"
								fontWeight={800}
								gutterBottom
								sx={{ color: COLOR_CODE.WHITE }}
							>
								{applications.title}
							</Typography>
							<Typography
								variant="caption"
								sx={{ mb: 3, display: "block", color: COLOR_CODE.TEXT_MUTED }}
							>
								{applications.description}
							</Typography>
							<Grid container spacing={2}>
								{applications.items.map((app, index) => (
									<Grid item xs={12} sm={6} key={index}>
										<Stack direction="row" spacing={1.5} alignItems="flex-start">
											<Box
												sx={{
													color: COLOR_CODE.PRIMARY,
													bgcolor: "rgba(255,77,0,0.07)",
													p: 0.8,
													borderRadius: 1,
													display: "flex",
												}}
											>
												{app.icon}
											</Box>
											<Box>
												<Typography
													variant="body2"
													fontWeight={700}
													sx={{ fontSize: "0.85rem", color: COLOR_CODE.WHITE }}
												>
													{app.title}
												</Typography>
												<Typography variant="caption" sx={{ color: COLOR_CODE.TEXT_MUTED }}>
													{app.description}
												</Typography>
											</Box>
										</Stack>
									</Grid>
								))}
							</Grid>
						</CardContent>
					</Card>
				</Grid>

				{/* Commitment Box */}
				{commitment && (
					<Grid item xs={12}>
						<Card
							sx={{
								bgcolor: COLOR_CODE.INK_3,
								border: `1px solid ${COLOR_CODE.INK_4}`,
								boxShadow: "none",
							}}
						>
							<CardContent sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
								<Box sx={{ color: COLOR_CODE.PRIMARY }}>{commitment.icon}</Box>
								<Box>
									<Typography variant="subtitle2" fontWeight={800} sx={{ color: COLOR_CODE.WHITE }}>
										{commitment.title}
									</Typography>
									<Typography variant="caption" sx={{ color: COLOR_CODE.TEXT_MUTED }}>
										{commitment.description}
									</Typography>
								</Box>
							</CardContent>
						</Card>
					</Grid>
				)}
			</Grid>
		</Box>
	);
};
