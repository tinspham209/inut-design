import { ProductApplication, ProductionStep } from "@/models/product-page";
import { Box, Grid, Stack, Typography } from "@mui/material";
import React, { ReactNode } from "react";

export interface WhyInutSectionProps {
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
			<Box sx={{ mb: 6, textAlign: "center" }}>
				<Typography
					variant="h3"
					fontWeight={900}
					gutterBottom
					sx={{ fontSize: { xs: "2rem", md: "2.75rem" } }}
				>
					{title || "Vì sao chọn dịch vụ tại INUT Design?"}
				</Typography>
				{description && (
					<Typography
						variant="h6"
						sx={{ maxWidth: 700, mx: "auto", fontWeight: 400, opacity: 0.8, color: "inherit" }}
					>
						{description}
					</Typography>
				)}
			</Box>

			<Grid container spacing={{ xs: 4, md: 6 }}>
				{productionProcess && (
					<Grid item xs={12} lg={4}>
						<Box
							sx={{
								p: { xs: 3, md: 4 },
								height: "100%",
								bgcolor: "rgba(255,255,255,0.05)",
								borderRadius: 4,
								border: "1px solid rgba(255,255,255,0.1)",
								backdropFilter: "blur(12px)",
							}}
						>
							<Typography variant="h6" fontWeight={800} sx={{ mb: 4, color: "primary.light" }}>
								{productionProcess.title}
							</Typography>
							<Stack spacing={4}>
								{productionProcess.items.map((step, index) => (
									<Stack key={index} direction="row" spacing={3} alignItems="flex-start">
										<Box
											sx={{
												color: "primary.light",
												bgcolor: "rgba(25, 118, 210, 0.2)",
												p: 1.5,
												borderRadius: 2,
												display: "flex",
											}}
										>
											{React.cloneElement(step.icon as React.ReactElement, { sx: { fontSize: 28 } })}
										</Box>
										<Box>
											<Typography variant="subtitle1" fontWeight={700} gutterBottom>
												{step.title}
											</Typography>
											<Typography variant="body2" sx={{ opacity: 0.7, lineHeight: 1.6 }}>
												{step.description}
											</Typography>
										</Box>
									</Stack>
								))}
							</Stack>
						</Box>
					</Grid>
				)}

				<Grid item xs={12} lg={productionProcess ? 8 : 12}>
					<Box
						sx={{
							p: { xs: 3, md: 5 },
							height: "100%",
							bgcolor: "white",
							borderRadius: 4,
							color: "text.primary",
							boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
						}}
					>
						<Typography variant="h5" fontWeight={800} gutterBottom>
							{applications.title}
						</Typography>
						<Typography variant="body1" color="text.secondary" sx={{ mb: 6, lineHeight: 1.7 }}>
							{applications.description}
						</Typography>
						<Grid container spacing={{ xs: 4, md: 5 }}>
							{applications.items.map((app, index) => (
								<Grid item xs={12} sm={6} key={index}>
									<Stack direction="row" spacing={3} alignItems="flex-start">
										<Box
											sx={{
												color: "primary.main",
												bgcolor: "primary.light",
												p: 2,
												borderRadius: 3,
												display: "flex",
											}}
										>
											{React.cloneElement(app.icon as React.ReactElement, { sx: { fontSize: 32 } })}
										</Box>
										<Box>
											<Typography variant="h6" fontWeight={700} gutterBottom sx={{ fontSize: "1.1rem" }}>
												{app.title}
											</Typography>
											<Typography
												variant="body2"
												color="text.secondary"
												sx={{ lineHeight: 1.65, fontSize: "0.95rem" }}
											>
												{app.description}
											</Typography>
										</Box>
									</Stack>
								</Grid>
							))}
						</Grid>
					</Box>
				</Grid>

				{commitment && (
					<Grid item xs={12}>
						<Box
							sx={{
								p: { xs: 4, md: 5 },
								bgcolor: "rgba(255,255,255,0.08)",
								borderRadius: 4,
								border: "1px solid rgba(255,255,255,0.15)",
								display: "flex",
								flexDirection: { xs: "column", md: "row" },
								alignItems: "center",
								gap: { xs: 3, md: 5 },
								textAlign: { xs: "center", md: "left" },
							}}
						>
							<Box
								sx={{
									color: "primary.light",
									bgcolor: "rgba(25, 118, 210, 0.25)",
									p: 3,
									borderRadius: "50%",
									display: "flex",
								}}
							>
								{React.cloneElement(commitment.icon as React.ReactElement, {
									sx: { fontSize: 48 },
								})}
							</Box>
							<Box>
								<Typography variant="h5" fontWeight={800} gutterBottom>
									{commitment.title}
								</Typography>
								<Typography variant="h6" sx={{ fontWeight: 400, opacity: 0.8, lineHeight: 1.7 }}>
									{commitment.description}
								</Typography>
							</Box>
						</Box>
					</Grid>
				)}
			</Grid>
		</Box>
	);
};
