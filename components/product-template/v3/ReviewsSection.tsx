import { ProductPageData } from "@/models/product-page";
import { Box, Grid, Stack, Typography, Avatar } from "@mui/material";
import React from "react";
import { SectionWrapper, SectionHeader, WatermarkText, colors, typography } from "./shared";

interface ReviewsSectionProps {
	data?: ProductPageData["testimonials"];
}

const defaultReviews = [
	{
		name: "Nguyễn Anh Thư",
		role: "Travel Blogger · Hà Nội",
		text: "Mình order lần đầu mà rất hài lòng. Màu sắc in ra đúng như file thiết kế, giấy dày dặn, đóng gói kỹ.",
		initials: "NA",
		color: "#ff4d00",
	},
	{
		name: "Minh Hoàng Studio",
		role: "Nhiếp ảnh · Đà Nẵng",
		text: "Đặt 500 tờ cho sự kiện ra mắt sản phẩm. INUT tư vấn nhiệt tình, giao đúng hẹn và chất lượng vượt kỳ vọng.",
		initials: "MH",
		color: "#1a5c3a",
	},
	{
		name: "Lan Trinh Travel",
		role: "Lữ hành · TP.HCM",
		text: "Cần postcard gấp cho tour du lịch, INUT xử lý trong 24h và giao tận khách sạn. Quá tuyệt vời!",
		initials: "LT",
		color: "#5c1a5c",
	},
	{
		name: "Phạm Quỳnh",
		role: "Handmade Shop · Hội An",
		text: "Postcard Kraft rất phù hợp với thương hiệu handmade của mình. Màu in đẹp tự nhiên, texture giấy tuyệt hảo.",
		initials: "PQ",
		color: "#5c4b1a",
	},
];

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ data }) => {
	const items = data?.items || defaultReviews;

	return (
		<SectionWrapper id="reviews" aria-labelledby="reviews-h2" bgcolor={colors.ink2}>
			<WatermarkText
				text={data?.score || "5★"}
				sx={{
					fontSize: { xs: "10rem", md: "22rem" },
					top: "50%",
					right: "-2%",
					transform: "translateY(-50%)",
				}}
			/>

			<Grid container spacing={{ xs: 6, md: 10 }}>
				<Grid item xs={12} md={3}>
					<Box sx={{ position: { md: "sticky" }, top: 100 }}>
						<SectionHeader
							eyebrow={data?.eyebrow || "Đánh giá"}
							title={data?.title || "Khách hàng<br />nói gì<br />về <em>INUT?</em>"}
						>
							<Box>
								<Typography
									sx={{
										fontFamily: typography.syne,
										fontSize: "3.5rem",
										fontWeight: 800,
										color: "white",
										letterSpacing: "-0.04em",
										lineHeight: 1,
										"& span": { color: colors.yellow },
									}}
								>
									<span>{data?.score?.split("★")[0] || "5.0"}</span> / 5
								</Typography>
								<Stack direction="row" spacing={0.5} sx={{ my: 1 }}>
									{[1, 2, 3, 4, 5].map((i) => (
										<Typography
											key={i}
											component="span"
											sx={{ color: colors.yellow, fontSize: "0.9rem" }}
										>
											★
										</Typography>
									))}
								</Stack>
								<Typography sx={{ fontSize: "0.78rem", color: colors.dust }}>
									{data?.countText || "Dựa trên 500+ đánh giá"}
								</Typography>
							</Box>
						</SectionHeader>
					</Box>
				</Grid>

				<Grid item xs={12} md={9}>
					<Grid container spacing={2}>
						{items.map((r, idx) => (
							<Grid item xs={12} sm={6} key={idx}>
								<Box
									sx={{
										bgcolor: colors.ink3,
										border: `1.5px solid ${colors.ink4}`,
										borderRadius: "14px",
										p: 3.5,
										position: "relative",
										transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
										overflow: "hidden",
										height: "100%",
										display: "flex",
										flexDirection: "column",
										"&::before": {
											content: '""',
											position: "absolute",
											top: 0,
											left: 0,
											right: 0,
											height: "3px",
											background: `linear-gradient(90deg, ${colors.orange}, ${colors.yellow})`,
											transform: "scaleX(0)",
											transformOrigin: "left",
											transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
										},
										"&:hover": {
											borderColor: "rgba(255, 77, 0, 0.2)",
											transform: "translateY(-5px)",
											boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
											"&::before": { transform: "scaleX(1)" },
										},
									}}
								>
									<Typography
										sx={{
											fontSize: "2rem",
											lineHeight: 1,
											color: colors.orange,
											fontFamily: "Georgia, serif",
											mb: 1.5,
										}}
									>
										&quot;
									</Typography>
									<Typography
										sx={{
											fontSize: "0.88rem",
											color: colors.smoke,
											lineHeight: 1.75,
											fontStyle: "italic",
											mb: 2.5,
											flexGrow: 1,
										}}
									>
										{r.text}
									</Typography>
									<Stack direction="row" spacing={1.75} alignItems="center">
										<Avatar
											sx={{
												width: 38,
												height: 38,
												bgcolor: r.color || colors.orange,
												fontSize: "0.75rem",
												fontWeight: 800,
												fontFamily: typography.syne,
											}}
										>
											{r.initials || r.name.substring(0, 2).toUpperCase()}
										</Avatar>
										<Box>
											<Typography
												sx={{
													fontFamily: typography.syne,
													fontSize: "0.85rem",
													fontWeight: 700,
													color: "white",
												}}
											>
												{r.name}
											</Typography>
											<Typography sx={{ fontSize: "0.7rem", color: colors.dust }}>
												{r.role}
											</Typography>
										</Box>
									</Stack>
								</Box>
							</Grid>
						))}
					</Grid>
				</Grid>
			</Grid>
		</SectionWrapper>
	);
};
