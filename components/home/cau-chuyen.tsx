import { COLOR_CODE } from "@/utils";
import { Box, Container, Divider, Grid, Stack, Typography } from "@mui/material";

const TIMELINE = [
	{
		year: "18",
		label: "2018",
		title: "INUT ra đời",
		description:
			"Xưởng in đầu tiên tại K574/5 Ông Ích Khiêm, Đà Nẵng. Sản phẩm đầu tiên: Skin laptop in theo yêu cầu.",
		current: false,
	},
	{
		year: "23",
		label: "2023",
		title: "Ra mắt MACNUT",
		description:
			"Dòng skin keyboard chuyên biệt cho Macbook — chính xác từng phím, bền theo thời gian. MACNUT trở thành sản phẩm song hành với Macbook.",
		current: false,
	},
	{
		year: "25",
		label: "2025",
		title: "Mở rộng đội ngũ & danh mục sản phẩm",
		description:
			"INUT tăng cường nhân sự, mở rộng dòng sản phẩm và tiếp cận nhiều tệp khách hàng hơn — từ cá nhân đến doanh nghiệp.",
		current: false,
	},
	{
		year: "26",
		label: "2026 — HIỆN TẠI",
		title: "Thành lập công ty — chương mới bắt đầu",
		description:
			"INUT chính thức hoạt động dưới mô hình công ty, kết nối ngày càng nhiều khách hàng — từ cá nhân đến doanh nghiệp. Hành trình vẫn đang tiếp diễn.",
		current: true,
	},
];

export function CauChuyen() {
	return (
		<Box
			component="section"
			bgcolor={COLOR_CODE.INK}
			sx={{
				py: { xs: "60px", sm: "80px", md: "100px" },
				px: { xs: 2, sm: "32px" },
				position: "relative",
				overflow: "hidden",
				"&::before": {
					content: '""',
					position: "absolute",
					bottom: "-20%",
					left: "-5%",
					width: "50%",
					height: "140%",
					background: "radial-gradient(ellipse at center, rgba(255,77,0,0.07) 0%, transparent 70%)",
					pointerEvents: "none",
				},
			}}
		>
			<Container maxWidth="lg" disableGutters>
				<Grid container spacing={{ xs: 4, md: 6 }} sx={{ position: "relative" }}>
					{/* Left — story copy */}
					<Grid item xs={12} md={6}>
						{/* Eyebrow */}
						<Stack direction="row" alignItems="center" gap={1.25} mb={2}>
							<Box sx={{ width: 20, height: 2, bgcolor: COLOR_CODE.PRIMARY, flexShrink: 0 }} />
							<Typography
								sx={{
									fontWeight: 700,
									fontSize: "0.68rem",
									letterSpacing: "0.18em",
									textTransform: "uppercase",
									color: COLOR_CODE.PRIMARY,
								}}
							>
								Về Chúng Tôi
							</Typography>
						</Stack>

						<Typography
							component="h2"
							sx={{
								fontWeight: 800,
								fontSize: { xs: "1.6rem", sm: "2rem", md: "2.4rem" },
								lineHeight: 1.05,
								letterSpacing: "-0.04em",
								color: COLOR_CODE.WHITE,
								mb: 3,
							}}
						>
							Câu Chuyện{" "}
							<Box
								component="em"
								sx={{ fontStyle: "italic", color: COLOR_CODE.PRIMARY, fontWeight: 400 }}
							>
								INUT Design
							</Box>
						</Typography>

						<Typography
							sx={{
								fontSize: "1rem",
								color: COLOR_CODE.TEXT_MUTED,
								lineHeight: 1.75,
								mb: 2.5,
								fontStyle: "italic",
							}}
						>
							Xin chào! INUT Design là xưởng in ấn sáng tạo tại Đà Nẵng, chuyên cung cấp sản phẩm cá
							nhân hoá và giải pháp in ấn toàn diện.
						</Typography>

						<Stack spacing={2} mb={3.5}>
							<Typography
								sx={{ fontSize: "0.88rem", color: COLOR_CODE.TEXT_SOFT, lineHeight: 1.75 }}
							>
								Chúng tôi xây dựng INUT dựa trên{" "}
								<Box component="strong" sx={{ color: COLOR_CODE.WHITE, fontWeight: 600 }}>
									giá trị thật và trải nghiệm thật
								</Box>{" "}
								của từng khách hàng. Từ một góc nhỏ ở Đà Nẵng, qua từng năm chúng tôi không chỉ mở
								rộng sản phẩm — mà xây dựng một cách làm riêng.
							</Typography>
							<Typography
								sx={{ fontSize: "0.88rem", color: COLOR_CODE.TEXT_SOFT, lineHeight: 1.75 }}
							>
								Với triết lý{" "}
								<Box component="strong" sx={{ color: COLOR_CODE.WHITE, fontWeight: 600 }}>
									&ldquo;Chỉ sự khác biệt mới tồn tại được&rdquo;
								</Box>
								, INUT không ngừng cải tiến và mang đến sản phẩm{" "}
								<Box component="strong" sx={{ color: COLOR_CODE.WHITE, fontWeight: 600 }}>
									Chất lượng – Độc đáo – Khác biệt
								</Box>
								.
							</Typography>
						</Stack>

						{/* Pull quote */}
						<Box
							sx={{
								pl: 2.5,
								py: 1.75,
								borderLeft: `3px solid ${COLOR_CODE.PRIMARY}`,
								bgcolor: COLOR_CODE.INK_3,
								borderRadius: "0 8px 8px 0",
								mb: 3.5,
							}}
						>
							<Typography
								sx={{
									fontSize: "1.05rem",
									fontStyle: "italic",
									color: COLOR_CODE.WHITE,
									lineHeight: 1.55,
								}}
							>
								&ldquo;70% cơ thể bạn là nước — 70% công việc của INUT là thiết kế.&rdquo;
							</Typography>
						</Box>
					</Grid>

					{/* Right — timeline */}
					<Grid item xs={12} md={6}>
						<Stack spacing={0}>
							{TIMELINE.map((item, index) => (
								<Box key={item.year}>
									<Stack direction="row" spacing={3} alignItems="flex-start" py={2.5}>
										{/* Year badge */}
										<Box
											sx={{
												minWidth: 52,
												height: 52,
												bgcolor: item.current ? COLOR_CODE.PRIMARY : COLOR_CODE.INK_3,
												border: `2px solid ${item.current ? COLOR_CODE.PRIMARY : COLOR_CODE.INK_4}`,
												borderRadius: "4px",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												flexShrink: 0,
											}}
										>
											<Typography
												sx={{
													fontWeight: 900,
													fontSize: "1.2rem",
													fontStyle: "italic",
													color: item.current ? "#fff" : COLOR_CODE.TEXT_MUTED,
												}}
											>
												{item.year}
											</Typography>
										</Box>

										{/* Content */}
										<Box>
											<Typography
												sx={{
													color: COLOR_CODE.PRIMARY,
													letterSpacing: "0.1em",
													fontWeight: 700,
													fontSize: "0.65rem",
													textTransform: "uppercase",
													mb: 0.5,
												}}
											>
												{item.label}
											</Typography>
											<Typography
												sx={{
													fontWeight: 700,
													color: COLOR_CODE.WHITE,
													lineHeight: 1.3,
													fontSize: { xs: "1rem", sm: "1.1rem" },
													mb: 0.5,
												}}
											>
												{item.title}
											</Typography>
											<Typography
												sx={{
													fontSize: "0.85rem",
													color: COLOR_CODE.TEXT_SOFT,
													lineHeight: 1.7,
												}}
											>
												{item.description}
											</Typography>
										</Box>
									</Stack>

									{index < TIMELINE.length - 1 && (
										<Divider sx={{ borderColor: COLOR_CODE.INK_4 }} />
									)}
								</Box>
							))}
						</Stack>
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
}
