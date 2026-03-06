import { Avatar, Box, Card, CardContent, Grid, Paper, Stack, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import React from "react";

interface Application {
	title: string;
	description: string;
	icon: React.ReactNode;
}

interface WhyInutSectionProps {
	applications: Application[];
}

export const WhyInutSection: React.FC<WhyInutSectionProps> = ({ applications }) => {
	return (
		<Grid container spacing={{ xs: 2, md: 3 }}>
			<Grid item xs={12}>
				<Typography
					variant="h5"
					fontWeight={700}
					color="text.primary"
					gutterBottom
					sx={{ fontSize: { xs: "1.25rem", md: "1.5rem" } }}
				>
					Giá trị của Skin Nút Phím INUT
				</Typography>
				<Typography
					color="text.secondary"
					sx={{ fontSize: { xs: "0.875rem", md: "1rem" }, mb: { xs: 1.5, md: 2 } }}
				>
					Hiểu được rằng bàn phím là nơi tiếp xúc nhiều nhất trên laptop, INUT áp dụng công nghệ in ấn 
					cao cấp cùng với lớp cắt chính xác, giúp miếng dán vừa vặn trên từng nút phím. 
					Trải nghiệm gõ êm ái, bảo vệ bề mặt phím nguyên zin và thể hiện dấn ấn cá nhân rõ ràng 
					qua từng ký tự.
				</Typography>
			</Grid>

			{/* Production Info */}
			<Grid item xs={12} md={4}>
				<Card
					variant="outlined"
					sx={{
						bgcolor: "background.paper",
						height: "100%",
						borderColor: "primary.main",
						borderWidth: 2,
					}}
				>
					<CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
						<Typography
							variant="h6"
							fontWeight={700}
							color="primary.main"
							gutterBottom
							sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
						>
							Chất lượng hàng đầu
						</Typography>
						<Stack
							spacing={{ xs: 1.5, md: 2 }}
							color="text.secondary"
							sx={{ mt: { xs: 1, md: 1.5 } }}
						>
							<Stack direction="row" spacing={{ xs: 1, md: 1.5 }} alignItems="flex-start">
								<LocalPrintshopIcon color="primary" sx={{ mt: 0.5, fontSize: { xs: 20, md: 24 } }} />
								<Box>
									<Typography fontWeight={600} sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}>
										Siêu mỏng, bền màu
									</Typography>
									<Typography
										variant="body2"
										sx={{ fontSize: { xs: "0.8125rem", md: "0.875rem" } }}
									>
										Không cản trở độ nảy phím, màu in bám chắc qua năm tháng
									</Typography>
								</Box>
							</Stack>
							<Stack direction="row" spacing={{ xs: 1, md: 1.5 }} alignItems="flex-start">
								<DesignServicesIcon color="primary" sx={{ mt: 0.5, fontSize: { xs: 20, md: 24 } }} />
								<Box>
									<Typography fontWeight={600} sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}>
										Độ fit chính xác
									</Typography>
									<Typography
										variant="body2"
										sx={{ fontSize: { xs: "0.8125rem", md: "0.875rem" } }}
									>
										Cắt từng phím rời bằng máy chuyên dụng cực kỳ khớp theo từng dòng laptop
									</Typography>
								</Box>
							</Stack>
							<Stack direction="row" spacing={{ xs: 1, md: 1.5 }} alignItems="flex-start">
								<AccessTimeIcon color="primary" sx={{ mt: 0.5, fontSize: { xs: 20, md: 24 } }} />
								<Box>
									<Typography fontWeight={600} sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}>
										In nhanh lấy gọn
									</Typography>
									<Typography
										variant="body2"
										sx={{ fontSize: { xs: "0.8125rem", md: "0.875rem" } }}
									>
										Thời gian chuẩn bị hàng từ 1-2 ngày với chất lượng kiểm định chặt chẽ
									</Typography>
								</Box>
							</Stack>
						</Stack>
					</CardContent>
				</Card>
			</Grid>

			{/* Applications */}
			<Grid item xs={12} md={8}>
				<Typography
					variant="h6"
					fontWeight={700}
					color="text.primary"
					gutterBottom
					sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
				>
					Mục đích đa dạng
				</Typography>
				<Typography
					color="text.secondary"
					sx={{ mb: { xs: 1.5, md: 2 }, fontSize: { xs: "0.875rem", md: "1rem" } }}
				>
					Decal nút phím có thể tùy biến linh hoạt từ phong cách dễ thương, tối giản (minimalist) cho tới 
					năng động và đậm chất công nghệ, đáp ứng mọi gu của người sử dụng.
				</Typography>
				<Grid container spacing={{ xs: 1.5, md: 2 }}>
					{applications.map((item) => (
						<Grid item xs={12} sm={6} key={item.title}>
							<Paper
								variant="outlined"
								sx={{
									p: { xs: 1.5, md: 2 },
									bgcolor: "background.paper",
									color: "text.primary",
									height: "100%",
								}}
							>
								<Stack direction="row" spacing={{ xs: 1.5, md: 2 }} alignItems="flex-start">
									<Avatar
										sx={{
											bgcolor: "rgba(255,140,0,0.12)",
											width: { xs: 36, md: 40 },
											height: { xs: 36, md: 40 },
										}}
									>
										{item.icon}
									</Avatar>
									<Box>
										<Typography
											fontWeight={700}
											gutterBottom
											sx={{ fontSize: { xs: "0.9375rem", md: "1rem" } }}
										>
											{item.title}
										</Typography>
										<Typography
											variant="body2"
											color="text.secondary"
											sx={{ fontSize: { xs: "0.8125rem", md: "0.875rem" } }}
										>
											{item.description}
										</Typography>
									</Box>
								</Stack>
							</Paper>
						</Grid>
					))}
				</Grid>
			</Grid>

			{/* Quality Assurance */}
			<Grid item xs={12}>
				<Paper
					variant="outlined"
					sx={{
						p: { xs: 2, md: 3 },
						bgcolor: "rgba(255,140,0,0.05)",
						borderColor: "primary.main",
						borderRadius: 2,
					}}
				>
					<Stack
						direction={{ xs: "column", md: "row" }}
						spacing={{ xs: 1.5, md: 2 }}
						alignItems="center"
					>
						<WorkspacePremiumIcon
							color="primary"
							sx={{ fontSize: 48, display: { xs: "none", md: "block" } }}
						/>
						<Box sx={{ flex: 1 }}>
							<Typography
								variant="h6"
								fontWeight={700}
								color="text.primary"
								gutterBottom
								sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
							>
								Chế độ mua hàng & Hỗ trợ
							</Typography>
							<Typography color="text.secondary" sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}>
								Đội ngũ tư vấn INUT Design luôn sẵn sàng giúp bạn đo ni đóng giày, phân bổ layout 
								hình ảnh cực chuẩn xác lên bộ phím. Lớp decal dễ bóc, dễ vệ sinh, đảm bảo không 
								làm tróc lớp sơn zin của phím. Cung cấp file hướng dẫn dán tại nhà đi kèm.
							</Typography>
						</Box>
					</Stack>
				</Paper>
			</Grid>
		</Grid>
	);
};
