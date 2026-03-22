import { ProductPageData } from "@/models/product-page";
import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { SectionWrapper, SectionHeader, colors, typography } from "./shared";

interface ProcessSectionProps {
	data: ProductPageData["whyInut"];
}

export const ProcessSection: React.FC<ProcessSectionProps> = ({ data }) => {
	const [activeStep, setActiveStep] = useState(0);
	const steps = data.productionProcess?.items || [];
	const applications = data.applications?.items || [];

	const applicationIcons = ["⚡", "🔄", "🏆", "🌟", "🔥"];

	return (
		<SectionWrapper
			id="process"
			aria-labelledby="process-h2"
			bgcolor={colors.cream}
			color={colors.ink}
		>
			<Grid container spacing={{ xs: 6, md: 10 }}>
				<Grid item xs={12} md={5}>
					<Box sx={{ position: { md: "sticky" }, top: 100 }}>
						<SectionHeader
							eyebrow={data.eyebrow || "Quy trình làm việc"}
							title={data.productionProcess?.title || "Chuyên nghiệp —<br /><em>Từng bước</em>"}
							description={
								data.description ||
								"Từ khi nhận yêu cầu đến khi giao thành phẩm, mỗi giai đoạn được kiểm soát chặt chẽ."
							}
						>
							<Button
								variant="contained"
								href="#contact"
								sx={{
									bgcolor: colors.orange,
									color: "white",
									borderRadius: "8px",
									fontFamily: typography.syne,
									fontWeight: 700,
									px: 4,
									py: 1.5,
									width: "fit-content",
									"&:hover": { bgcolor: colors.orangeHi },
								}}
							>
								Bắt đầu dự án →
							</Button>
						</SectionHeader>
					</Box>
				</Grid>

				<Grid item xs={12} md={7}>
					<Stack spacing={1}>
						{steps.map((step, idx) => (
							<Box
								key={idx}
								onClick={() => setActiveStep(idx)}
								onKeyDown={(e) => e.key === "Enter" && setActiveStep(idx)}
								tabIndex={0}
								sx={{
									display: "grid",
									gridTemplateColumns: "56px 1fr",
									gap: 2.5,
									p: 2.5,
									borderRadius: "12px",
									border: `1.5px solid ${activeStep === idx ? colors.orange : "#e8e2d8"}`,
									bgcolor: "white",
									transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
									position: "relative",
									overflow: "hidden",
									cursor: "pointer",
									"&::before": {
										content: '""',
										position: "absolute",
										inset: 0,
										bgcolor: colors.orange,
										transform: activeStep === idx ? "scaleX(1)" : "scaleX(0)",
										transformOrigin: "left",
										transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
										zIndex: 0,
									},
									"&:hover": {
										borderColor: colors.orange,
										"&::before": { transform: "scaleX(1)" },
									},
								}}
							>
								<Box
									sx={{
										position: "relative",
										zIndex: 1,
										width: 44,
										height: 44,
										borderRadius: "10px",
										bgcolor:
											activeStep === idx ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 77, 0, 0.1)",
										color: activeStep === idx ? "white" : colors.orange,
										fontFamily: typography.syne,
										fontSize: "0.8rem",
										fontWeight: 800,
										display: "grid",
										placeItems: "center",
										letterSpacing: "0.04em",
										transition: "all 0.3s",
										alignSelf: "center",
									}}
								>
									{String(idx + 1).padStart(2, "0")}
								</Box>
								<Box sx={{ position: "relative", zIndex: 1, alignSelf: "center" }}>
									<Typography
										variant="h6"
										sx={{
											fontFamily: typography.syne,
											fontSize: "0.95rem",
											fontWeight: 700,
											color: activeStep === idx ? "white" : colors.ink,
											mb: 0.5,
											transition: "color 0.3s",
										}}
									>
										{step.title}
									</Typography>
									<Typography
										variant="body2"
										sx={{
											fontSize: "0.8rem",
											color: activeStep === idx ? "rgba(255, 255, 255, 0.75)" : "#8a7e72",
											lineHeight: 1.55,
											transition: "color 0.3s",
										}}
									>
										{step.description}
									</Typography>
								</Box>
							</Box>
						))}
					</Stack>

					<Stack spacing={1.5} sx={{ mt: 2.5 }}>
						{applications.slice(0, 3).map((app, idx) => (
							<Box
								key={idx}
								sx={{
									borderRadius: "12px",
									border: `1.5px solid ${idx === 2 ? colors.ink : "#e8e2d8"}`,
									p: 3.5,
									bgcolor: idx === 2 ? colors.ink : "white",
									color: idx === 2 ? "white" : "inherit",
									display: "flex",
									gap: 2.5,
									alignItems: "center",
									transition: "all 0.3s",
									"&:hover": {
										borderColor: colors.orange,
										transform: "translateX(6px)",
										boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)",
									},
								}}
							>
								<Box
									sx={{
										width: 52,
										height: 52,
										borderRadius: "12px",
										bgcolor: "rgba(255, 77, 0, 0.08)",
										color: colors.orange,
										fontSize: "1.4rem",
										display: "grid",
										placeItems: "center",
										flexShrink: 0,
										transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
										".MuiBox-root:hover &": { transform: "scale(1.12) rotate(-6deg)" },
									}}
								>
									{applicationIcons[idx % applicationIcons.length]}
								</Box>
								<Box>
									<Typography
										variant="h6"
										sx={{
											fontFamily: typography.syne,
											fontSize: "1rem",
											fontWeight: 700,
											color: idx === 2 ? "white" : colors.ink,
											mb: 0.5,
										}}
									>
										{app.title}
									</Typography>
									<Typography
										variant="body2"
										sx={{
											fontSize: "0.82rem",
											color: idx === 2 ? colors.smoke : "#8a7e72",
											lineHeight: 1.55,
										}}
									>
										{app.description}
									</Typography>
								</Box>
							</Box>
						))}
					</Stack>
				</Grid>
			</Grid>
		</SectionWrapper>
	);
};
