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
					Vì sao nên in ảnh kỹ thuật số tại INUT Design?
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
										Số lượng tối thiểu: từ 10 ảnh / mẫu
									</Typography>
									<Typography
										variant="body2"
										sx={{ fontSize: { xs: "0.8125rem", md: "0.875rem" } }}
									>
										Phù hợp để in thử, in quà tặng hoặc triển khai nhanh theo từng chiến dịch.
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
										Thời gian sản xuất: từ 1 - 2 ngày làm việc
									</Typography>
									<Typography
										variant="body2"
										sx={{ fontSize: { xs: "0.8125rem", md: "0.875rem" } }}
									>
										Phù hợp các nhu cầu cần ảnh gấp cho sự kiện, quà tặng, trưng bày và bán lẻ.
									</Typography>
								</Box>
							</Stack>
							<Stack direction="row" spacing={{ xs: 1, md: 1.5 }} alignItems="flex-start">
								<AccessTimeIcon color="primary" sx={{ mt: 0.5, fontSize: { xs: 20, md: 24 } }} />
								<Box>
									<Typography fontWeight={600} sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}>
										In kỹ thuật số hiện đại, kiểm soát màu trước khi giao
									</Typography>
									<Typography
										variant="body2"
										sx={{ fontSize: { xs: "0.8125rem", md: "0.875rem" } }}
									>
										Đảm bảo ảnh sắc nét, màu ổn định và đồng đều giữa các lô in.
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
					Ứng dụng thực tế
				</Typography>
				<Typography
					color="text.secondary"
					sx={{ mb: { xs: 1.5, md: 2 }, fontSize: { xs: "0.875rem", md: "1rem" } }}
				>
					In ảnh kỹ thuật số là giải pháp linh hoạt cho cả khách hàng cá nhân và doanh nghiệp. Bạn
					có thể in nhanh ảnh kỷ niệm, ảnh sự kiện, ảnh trưng bày hoặc ảnh dùng để bán lẻ theo từng
					giai đoạn chiến dịch.
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
								Chúng tôi tập trung vào chất lượng thành phẩm, tốc độ xử lý và trải nghiệm tư vấn rõ
								ràng từ lúc nhận file đến lúc giao hàng. Liên hệ ngay để được hỗ trợ chọn quy cách
								in ảnh tối ưu nhất cho mục tiêu của bạn.
							</Typography>
						</Box>
					</Stack>
				</Paper>
			</Grid>
		</Grid>
	);
};
