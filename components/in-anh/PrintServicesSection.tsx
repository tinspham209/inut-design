import { COLOR_CODE } from "@/utils";
import {
	Box,
	Card,
	CardContent,
	Grid,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Paper,
	Typography,
} from "@mui/material";
import Image from "next/image";
import React from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

interface PrintService {
	name: string;
	description: string;
	image: string;
}

interface PrintServicesSectionProps {
	services: PrintService[];
	sizeOptions: string[];
}

export const PrintServicesSection: React.FC<PrintServicesSectionProps> = ({
	services,
	sizeOptions,
}) => {
	return (
		<Grid container spacing={1}>
			<Grid item xs={12}>
				<Typography
					variant="h5"
					fontWeight={700}
					color="text.primary"
					gutterBottom
					sx={{ fontSize: { xs: "1.25rem", md: "1.5rem" } }}
				>
					Dịch vụ in ảnh theo mục tiêu sử dụng
				</Typography>
				<Typography color="text.secondary" sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}>
					Từ <strong style={{ color: COLOR_CODE.PRIMARY }}>ảnh kỷ niệm cá nhân</strong> đến{" "}
					<strong style={{ color: COLOR_CODE.PRIMARY }}>ảnh sự kiện và ảnh trưng bày</strong>, INUT
					hỗ trợ quy cách in linh hoạt theo đúng mục tiêu của bạn.
				</Typography>
			</Grid>
			{services.map((service) => (
				<Grid item xs={6} md={3} key={service.name}>
					<Card
						variant="outlined"
						sx={{
							bgcolor: "background.paper",
							height: "100%",
							transition: "all 0.3s ease",
							"&:hover": {
								borderColor: "primary.main",
								transform: "translateY(-4px)",
								boxShadow: 3,
							},
						}}
					>
						<Box
							sx={{
								position: "relative",
								aspectRatio: "4 / 3",
								overflow: "hidden",
								bgcolor: "rgba(255,255,255,0.05)",
							}}
						>
							<Image
								src={service.image}
								alt={service.name}
								width={800}
								height={600}
								style={{ width: "100%", height: "100%", objectFit: "contain" }}
							/>
						</Box>
						<CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
							<Typography
								variant="h6"
								fontWeight={700}
								color="text.primary"
								gutterBottom
								sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
							>
								{service.name}
							</Typography>
							<Typography
								variant="body2"
								color="text.secondary"
								sx={{ fontSize: { xs: "0.8125rem", md: "0.875rem" } }}
							>
								{service.description}
							</Typography>
						</CardContent>
					</Card>
				</Grid>
			))}
			<Grid item xs={12}>
				<Paper
					variant="outlined"
					sx={{
						p: 2,
						borderRadius: 2,
						bgcolor: "background.paper",
						mt: 1,
					}}
				>
					<Typography
						variant="h6"
						fontWeight={700}
						color="text.primary"
						gutterBottom
						sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
					>
						Tùy chọn kích thước ảnh phổ biến
					</Typography>
					<List sx={{ color: "text.primary", py: 0 }}>
						{sizeOptions.map((option) => (
							<ListItem key={option} disableGutters sx={{ py: { xs: 0.5, md: 0.75 } }}>
								<ListItemIcon sx={{ minWidth: { xs: 28, md: 32 } }}>
									<CheckCircleOutlineIcon color="primary" />
								</ListItemIcon>
								<ListItemText primary={option} />
							</ListItem>
						))}
					</List>
				</Paper>
			</Grid>
		</Grid>
	);
};
