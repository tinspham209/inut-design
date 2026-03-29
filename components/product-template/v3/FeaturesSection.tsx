import { ProductPageData, ProductHighlight } from "@/models/product-page";
import { Box, Chip, Grid, Typography, Stack } from "@mui/material";
import React from "react";
import { SectionWrapper, SectionHeader, CommonCard, colors, typography } from "./shared";

interface FeaturesSectionProps {
	data: ProductPageData["introduction"];
}

interface HighlightWithBg extends ProductHighlight {
	bg?: string;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({ data }) => {
	const highlights = data.highlights || [];

	const defaultHighlights: HighlightWithBg[] = [
		{ title: "Nghệ Thuật", description: "Tái hiện màu sắc trung thực.", bg: "ART", icon: "🎨" },
		{ title: "Du Lịch", description: "Lưu giữ khoảnh khắc.", bg: "GO", icon: "✈️" },
		{ title: "Chất Liệu", description: "Tuyển chọn kỹ lưỡng.", bg: "MAT", icon: "📦" },
	];

	const displayHighlights = (highlights.length > 0 ? highlights : defaultHighlights) as HighlightWithBg[];

	return (
		<SectionWrapper id="features" aria-labelledby="features-h2">
			<Grid container spacing={6} sx={{ mb: { xs: 5, md: 10 }, alignItems: "flex-end" }}>
				<Grid item xs={12} md={7}>
					<SectionHeader
						eyebrow={data.eyebrow || "Tính năng nổi bật"}
						title={data.title}
					/>
				</Grid>
				<Grid item xs={12} md={5}>
					<Typography
						sx={{
							color: colors.smoke,
							lineHeight: 1.75,
							fontSize: "1rem",
						}}
					>
						{data.description || data.bullets?.join(". ")}
					</Typography>
				</Grid>
			</Grid>

			<Box
				sx={{
					display: "grid",
					gridTemplateColumns: "repeat(12, 1fr)",
					gridAutoRows: { xs: "auto", md: "200px" },
					gap: "0.75rem",
				}}
			>
				{/* Card 1: Main Highlight (wide) */}
				<CommonCard
					sx={{
						gridColumn: { xs: "span 12", md: "span 5" },
						gridRow: { xs: "auto", md: "span 2" },
						display: "flex",
						flexDirection: "column",
						justifyContent: "flex-end",
					}}
				>
					<Box
						sx={{
							position: "absolute",
							top: "1.5rem",
							left: "1.75rem",
							width: 44,
							height: 44,
							borderRadius: "10px",
							bgcolor: "rgba(255, 255, 255, 0.07)",
							display: "grid",
							placeItems: "center",
							fontSize: "1.2rem",
						}}
					>
						{displayHighlights[0]?.icon || "✨"}
					</Box>
					<Box>
						<Chip
							label="Bán chạy nhất"
							size="small"
							sx={{
								bgcolor: "rgba(255, 255, 255, 0.1)",
								color: "rgba(255, 255, 255, 0.7)",
								borderRadius: "99px",
								fontSize: "0.68rem",
								fontWeight: 700,
								mb: 1.5,
								height: "auto",
								"& .MuiChip-label": { px: 1.5, py: 0.5 },
							}}
						/>
						<Typography variant="h6" sx={{ fontFamily: typography.syne, fontWeight: 700, color: colors.cream, mb: 0.5 }}>
							{displayHighlights[0]?.title}
						</Typography>
						<Typography variant="body2" sx={{ color: colors.smoke, lineHeight: 1.6 }}>
							{displayHighlights[0]?.description}
						</Typography>
					</Box>
					<Typography
						sx={{
							position: "absolute",
							bottom: -20,
							right: -12,
							fontFamily: typography.syne,
							fontSize: "6rem",
							fontWeight: 800,
							color: "rgba(255, 255, 255, 0.04)",
							lineHeight: 1,
							pointerEvents: "none",
						}}
					>
						{displayHighlights[0]?.bg || "HI"}
					</Typography>
				</CommonCard>

				{/* Card 2 */}
				<CommonCard
					sx={{
						gridColumn: { xs: "span 12", md: "span 4" },
						display: "flex",
						flexDirection: "column",
						justifyContent: "flex-end",
					}}
				>
					<Box sx={{ position: "absolute", top: "1.5rem", left: "1.75rem", width: 44, height: 44, borderRadius: "10px", bgcolor: "rgba(255, 255, 255, 0.07)", display: "grid", placeItems: "center", fontSize: "1.2rem" }}>
						{displayHighlights[1]?.icon || "⚡"}
					</Box>
					<Box>
						<Typography variant="h6" sx={{ fontFamily: typography.syne, fontWeight: 700, color: colors.cream, mb: 0.5 }}>
							{displayHighlights[1]?.title}
						</Typography>
						<Typography variant="body2" sx={{ color: colors.smoke, lineHeight: 1.6 }}>
							{displayHighlights[1]?.description}
						</Typography>
					</Box>
					<Typography sx={{ position: "absolute", bottom: -20, right: -12, fontFamily: typography.syne, fontSize: "6rem", fontWeight: 800, color: "rgba(255, 255, 255, 0.04)", pointerEvents: "none" }}>
						{displayHighlights[1]?.bg || "GO"}
					</Typography>
				</CommonCard>

				{/* Card 3: Static Info Card */}
				<CommonCard
					bgcolor={colors.orange}
					sx={{
						gridColumn: { xs: "span 12", md: "span 3" },
						display: "flex",
						flexDirection: "column",
						justifyContent: "flex-end",
					}}
				>
					<Typography sx={{ fontFamily: typography.syne, fontSize: "3.5rem", fontWeight: 800, color: colors.cream, lineHeight: 1 }}>
						350+
					</Typography>
					<Typography variant="h6" sx={{ fontFamily: typography.syne, fontWeight: 700, color: colors.cream, mb: 0.5 }}>
						Mẫu thiết kế
					</Typography>
					<Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.75)", lineHeight: 1.6 }}>
						Thư viện mẫu phong phú.
					</Typography>
				</CommonCard>

				{/* Card 4 */}
				<CommonCard
					sx={{
						gridColumn: { xs: "span 12", md: "span 4" },
						display: "flex",
						flexDirection: "column",
						justifyContent: "flex-end",
					}}
				>
					<Box sx={{ position: "absolute", top: "1.5rem", left: "1.75rem", width: 44, height: 44, borderRadius: "10px", bgcolor: "rgba(255, 255, 255, 0.07)", display: "grid", placeItems: "center", fontSize: "1.2rem" }}>
						{displayHighlights[2]?.icon || "📦"}
					</Box>
					<Box>
						<Typography variant="h6" sx={{ fontFamily: typography.syne, fontWeight: 700, color: colors.cream, mb: 0.5 }}>
							{displayHighlights[2]?.title}
						</Typography>
						<Typography variant="body2" sx={{ color: colors.smoke, lineHeight: 1.6 }}>
							{displayHighlights[2]?.description}
						</Typography>
					</Box>
					<Typography sx={{ position: "absolute", bottom: -20, right: -12, fontFamily: typography.syne, fontSize: "6rem", fontWeight: 800, color: "rgba(255, 255, 255, 0.04)", pointerEvents: "none" }}>
						{displayHighlights[2]?.bg || "MAT"}
					</Typography>
				</CommonCard>

				{/* Card 5: Service Card (Yellow) */}
				<CommonCard
					bgcolor={colors.yellow}
					sx={{
						gridColumn: { xs: "span 12", md: "span 4" },
						display: "flex",
						flexDirection: "column",
						justifyContent: "flex-end",
					}}
				>
					<Box sx={{ position: "absolute", top: "1.5rem", left: "1.75rem", width: 44, height: 44, borderRadius: "10px", bgcolor: "rgba(0, 0, 0, 0.1)", display: "grid", placeItems: "center", fontSize: "1.2rem" }}>
						✏️
					</Box>
					<Box>
						<Typography variant="h6" sx={{ fontFamily: typography.syne, fontWeight: 700, color: colors.ink, mb: 0.5 }}>
							Thiết Kế Miễn Phí
						</Typography>
						<Typography variant="body2" sx={{ color: "rgba(0, 0, 0, 0.65)", lineHeight: 1.6 }}>
							Đội ngũ designer đồng hành từ ý tưởng đến thành phẩm.
						</Typography>
					</Box>
					<Typography sx={{ position: "absolute", bottom: -20, right: -12, fontFamily: typography.syne, fontSize: "6rem", fontWeight: 800, color: "rgba(0, 0, 0, 0.06)", pointerEvents: "none" }}>
						DES
					</Typography>
				</CommonCard>

				{/* Card 6 */}
				<CommonCard
					sx={{
						gridColumn: { xs: "span 12", md: "span 4" },
						display: "flex",
						flexDirection: "column",
						justifyContent: "flex-end",
					}}
				>
					<Box sx={{ position: "absolute", top: "1.5rem", left: "1.75rem", width: 44, height: 44, borderRadius: "10px", bgcolor: "rgba(255, 255, 255, 0.07)", display: "grid", placeItems: "center", fontSize: "1.2rem" }}>
						💎
					</Box>
					<Box>
						<Typography variant="h6" sx={{ fontFamily: typography.syne, fontWeight: 700, color: colors.cream, mb: 0.5 }}>
							Chất Lượng Cao
						</Typography>
						<Typography variant="body2" sx={{ color: colors.smoke, lineHeight: 1.6 }}>
							Tối ưu hóa quy trình in ấn để đạt chất lượng tốt nhất.
						</Typography>
					</Box>
					<Typography sx={{ position: "absolute", bottom: -20, right: -12, fontFamily: typography.syne, fontSize: "6rem", fontWeight: 800, color: "rgba(255, 255, 255, 0.04)", pointerEvents: "none" }}>
						HQ
					</Typography>
				</CommonCard>

				{/* Card 7: Checklist (wide) */}
				<CommonCard
					bgcolor={colors.ink3}
					sx={{
						gridColumn: { xs: "span 12", md: "span 8" },
						display: "flex",
						flexDirection: "column",
						justifyContent: "flex-end",
					}}
				>
					<Box sx={{ position: "absolute", top: "1.5rem", left: "1.75rem", width: 44, height: 44, borderRadius: "10px", bgcolor: "rgba(255, 255, 255, 0.07)", display: "grid", placeItems: "center", fontSize: "1.2rem" }}>
						🚀
					</Box>
					<Grid container spacing={4} alignItems="flex-end">
						<Grid item xs={12} sm={6}>
							<Typography variant="h6" sx={{ fontFamily: typography.syne, fontWeight: 700, color: colors.cream, mb: 0.5 }}>
								Hỗ Trợ Toàn Diện
							</Typography>
							<Typography variant="body2" sx={{ color: colors.smoke, lineHeight: 1.6 }}>
								Từ ý tưởng đầu tiên đến khi sản phẩm đến tay bạn.
							</Typography>
						</Grid>
						<Grid item xs={12} sm={6}>
							<Stack spacing={1}>
								{data.bullets.slice(0, 4).map((text, idx) => (
									<Typography
										key={idx}
										sx={{
											display: "flex",
											alignItems: "center",
											gap: 1.5,
											fontSize: "0.78rem",
											color: "rgba(255, 255, 255, 0.75)",
											"&::before": {
												content: '"✓"',
												width: 18,
												height: 18,
												bgcolor: "rgba(255, 255, 255, 0.15)",
												borderRadius: "4px",
												display: "grid",
												placeItems: "center",
												fontSize: "0.6rem",
												fontWeight: 900,
												color: colors.cream,
												flexShrink: 0,
											},
										}}
									>
										{text}
									</Typography>
								))}
							</Stack>
						</Grid>
					</Grid>
				</CommonCard>
			</Box>
		</SectionWrapper>
	);
};
