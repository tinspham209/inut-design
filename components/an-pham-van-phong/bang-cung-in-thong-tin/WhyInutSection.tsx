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
					Vì sao nên chọn bảng cứng in thông tin tại INUT Design?
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
										Số lượng tối thiểu: từ 10 bảng
									</Typography>
									<Typography
										variant="body2"
										sx={{ fontSize: { xs: "0.8125rem", md: "0.875rem" } }}
									>
										Phù hợp cho cửa hàng, doanh nghiệp và đơn vị sự kiện cần sản xuất nhanh.
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
										Dễ bám tiến độ cho lịch khai trương, workshop hoặc triển khai POSM.
									</Typography>
								</Box>
							</Stack>
							<Stack direction="row" spacing={{ xs: 1, md: 1.5 }} alignItems="flex-start">
								<AccessTimeIcon color="primary" sx={{ mt: 0.5, fontSize: { xs: 20, md: 24 } }} />
								<Box>
									<Typography fontWeight={600} sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}>
										Quy trình: in - bồi - cán - cắt - QC
									</Typography>
									<Typography
										variant="body2"
										sx={{ fontSize: { xs: "0.8125rem", md: "0.875rem" } }}
									>
										Kiểm soát chất lượng ở từng bước để thành phẩm sắc nét, chắc tay và bền đẹp.
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
					Ứng dụng giúp nâng cao trải nghiệm tại điểm bán
				</Typography>
				<Typography
					color="text.secondary"
					sx={{ mb: { xs: 1.5, md: 2 }, fontSize: { xs: "0.875rem", md: "1rem" } }}
				>
					Bảng cứng in thông tin hỗ trợ truyền tải nội dung nhanh, dễ nhìn và đồng bộ hình ảnh
					thương hiệu ở nhiều không gian: quầy tư vấn, khu trưng bày, cửa hàng và sự kiện.
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
								INUT Design đồng hành từ ý tưởng đến thành phẩm
							</Typography>
							<Typography color="text.secondary" sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}>
								Chúng tôi tư vấn rõ vật liệu, bố cục thông tin, kích thước phù hợp và tiến độ để bạn
								triển khai bảng cứng in thông tin hiệu quả ngay từ đợt in đầu tiên.
							</Typography>
						</Box>
					</Stack>
				</Paper>
			</Grid>
		</Grid>
	);
};
