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
					Tại sao Sticker Sheet giúp bạn tăng nhận diện và doanh thu?
				</Typography>
			</Grid>

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
							Thông tin sản xuất
						</Typography>
						<Stack
							spacing={{ xs: 1.5, md: 2 }}
							color="text.secondary"
							sx={{ mt: { xs: 1, md: 1.5 } }}
						>
							<Stack direction="row" spacing={{ xs: 1, md: 1.5 }} alignItems="flex-start">
								<LocalPrintshopIcon
									color="primary"
									sx={{ mt: 0.5, fontSize: { xs: 20, md: 24 } }}
								/>
								<Box>
									<Typography fontWeight={600} sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}>
										Số lượng tối thiểu: 10 cái/sản phẩm
									</Typography>
									<Typography
										variant="body2"
										sx={{ fontSize: { xs: "0.8125rem", md: "0.875rem" } }}
									>
										Phù hợp để thử nghiệm mẫu mới hoặc chạy chiến dịch nhanh với ngân sách linh
										hoạt.
									</Typography>
								</Box>
							</Stack>
							<Stack direction="row" spacing={{ xs: 1, md: 1.5 }} alignItems="flex-start">
								<DesignServicesIcon
									color="primary"
									sx={{ mt: 0.5, fontSize: { xs: 20, md: 24 } }}
								/>
								<Box>
									<Typography fontWeight={600} sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}>
										Thời gian sản xuất: từ 3 - 4 ngày làm việc
									</Typography>
									<Typography
										variant="body2"
										sx={{ fontSize: { xs: "0.8125rem", md: "0.875rem" } }}
									>
										Đáp ứng tốt các kế hoạch sự kiện, quà tặng hoặc ra mắt sản phẩm đúng tiến độ.
									</Typography>
								</Box>
							</Stack>
							<Stack direction="row" spacing={{ xs: 1, md: 1.5 }} alignItems="flex-start">
								<AccessTimeIcon color="primary" sx={{ mt: 0.5, fontSize: { xs: 20, md: 24 } }} />
								<Box>
									<Typography fontWeight={600} sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}>
										Quy trình in - cán màng - cắt kỹ thuật số
									</Typography>
									<Typography
										variant="body2"
										sx={{ fontSize: { xs: "0.8125rem", md: "0.875rem" } }}
									>
										Đảm bảo đường cắt chính xác, bề mặt đẹp và đồng đều trên toàn bộ sticker sheet.
									</Typography>
								</Box>
							</Stack>
						</Stack>
					</CardContent>
				</Card>
			</Grid>

			<Grid item xs={12} md={8}>
				<Typography
					variant="h6"
					fontWeight={700}
					color="text.primary"
					gutterBottom
					sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
				>
					Ứng dụng tạo doanh thu
				</Typography>
				<Typography
					color="text.secondary"
					sx={{ mb: { xs: 1.5, md: 2 }, fontSize: { xs: "0.875rem", md: "1rem" } }}
				>
					Sticker Sheet có ưu điểm nổi bật là tích hợp nhiều thiết kế khác nhau trên một bề mặt.
					Điều này không chỉ giúp bạn tiết kiệm không gian mà còn mang đến sự linh hoạt trong việc
					lựa chọn hình ảnh.
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
								Tại sao chọn INUT Design?
							</Typography>
							<Typography color="text.secondary" sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}>
								Chúng tôi cam kết mang đến sản phẩm chất lượng cao với giá thành cạnh tranh nhất.
								Hãy liên hệ ngay để được tư vấn và nhận mẫu thử miễn phí, sau đó đặt in nhanh qua
								website của INUT Design.
							</Typography>
						</Box>
					</Stack>
				</Paper>
			</Grid>
		</Grid>
	);
};
