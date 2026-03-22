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
			bgcolor={COLOR_CODE.BACKGROUND}
			pt={{ xs: 4, md: 6 }}
			pb={{ xs: 4, md: 6 }}
		>
			<Container maxWidth="lg">
				<Grid container spacing={{ xs: 4, md: 6 }}>
					{/* Left — story copy */}
					<Grid item xs={12} md={6}>
						<Typography
							variant="overline"
							sx={{
								color: COLOR_CODE.PRIMARY,
								letterSpacing: 3,
								fontWeight: "bold",
								mb: 2,
								display: "block",
							}}
						>
							— Câu chuyện
						</Typography>

						<Typography
							component="h2"
							sx={{
								fontSize: { xs: "2.4rem", sm: "3.2rem", md: "3.8rem" },
								fontWeight: 900,
								lineHeight: 1.05,
								color: COLOR_CODE.TEXT_DARK,
								mb: 3,
							}}
						>
							Bắt đầu từ
							<br />
							một{" "}
							<Box component="span" sx={{ color: COLOR_CODE.PRIMARY, fontStyle: "italic" }}>
								đam mê
							</Box>
						</Typography>

						<Stack spacing={2}>
							<Typography variant="body1" color="text.secondary" lineHeight={1.8}>
								INUT ra đời năm 2018 từ một xưởng nhỏ ở Đà Nẵng — không vốn lớn, không tên tuổi. Chỉ
								có một thứ: tin rằng in ấn có thể làm tốt hơn những gì đang có trên thị trường.
							</Typography>
							<Typography variant="body1" color="text.secondary" lineHeight={1.8}>
								Từ một góc nhỏ ở Đà Nẵng, qua từng năm chúng tôi không chỉ mở rộng sản phẩm — mà xây
								dựng một cách làm riêng. Không phải để phô trương, mà để mỗi sản phẩm đều nhất quán,
								có hồn, và thực sự bền.
							</Typography>
							<Typography variant="body1" color="text.secondary" lineHeight={1.8}>
								Bây giờ, INUT phục vụ cá nhân, doanh nghiệp, sản phẩm rộng hơn — nhưng cách làm thì
								không thay đổi.
							</Typography>
						</Stack>

						{/* Pull quote */}
						<Box
							sx={{
								mt: 3,
								pl: 3,
								borderLeft: `4px solid ${COLOR_CODE.PRIMARY}`,
							}}
						>
							<Typography
								variant="h5"
								fontWeight="bold"
								color={COLOR_CODE.TEXT_DARK}
								lineHeight={1.4}
								sx={{ fontSize: { xs: "1.2rem", sm: "1.4rem" } }}
							>
								&ldquo;Nhỏ không có nghĩa là ẩu.
								<br />
								Chúng tôi chứng minh điều đó mỗi ngày.&rdquo;
							</Typography>
						</Box>
					</Grid>

					{/* Right — timeline */}
					<Grid item xs={12} md={6}>
						<Stack spacing={2}>
							{TIMELINE.map((item, index) => (
								<Box key={item.year}>
									<Stack direction="row" spacing={3} alignItems="flex-start" py={2}>
										{/* Year badge */}
										<Box
											sx={{
												minWidth: 52,
												height: 52,
												bgcolor: item.current ? COLOR_CODE.PRIMARY : "transparent",
												border: `2px solid ${
													item.current ? COLOR_CODE.PRIMARY : "rgba(38,38,38,0.25)"
												}`,
												borderRadius: 1,
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												flexShrink: 0,
											}}
										>
											<Typography
												fontWeight={900}
												sx={{
													fontSize: "1.2rem",
													fontStyle: "italic",
													color: item.current ? "#fff" : COLOR_CODE.TEXT_DARK,
												}}
											>
												{item.year}
											</Typography>
										</Box>

										{/* Content */}
										<Box>
											<Typography
												variant="overline"
												sx={{
													color: COLOR_CODE.PRIMARY,
													letterSpacing: 2,
													fontWeight: 700,
													fontSize: "0.65rem",
												}}
											>
												{item.label}
											</Typography>
											<Typography
												variant="h6"
												fontWeight="bold"
												color={COLOR_CODE.TEXT_DARK}
												lineHeight={1.3}
												sx={{ mt: 0.25, mb: 0.5, fontSize: { xs: "1rem", sm: "1.1rem" } }}
											>
												{item.title}
											</Typography>
											<Typography variant="body2" color="text.secondary" lineHeight={1.7}>
												{item.description}
											</Typography>
										</Box>
									</Stack>

									{index < TIMELINE.length - 1 && (
										<Divider sx={{ borderColor: "rgba(38,38,38,0.1)" }} />
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
