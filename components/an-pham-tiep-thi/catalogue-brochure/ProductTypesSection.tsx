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
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Image from "next/image";
import React from "react";

interface ProductType {
	name: string;
	description: string;
	image: string;
}

interface ProductTypesSectionProps {
	productTypes: ProductType[];
	specOptions: string[];
}

export const ProductTypesSection: React.FC<ProductTypesSectionProps> = ({
	productTypes,
	specOptions,
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
					Sản phẩm tiêu biểu & Thông số thiết kế
				</Typography>
				<Typography color="text.secondary" sx={{ fontSize: { xs: "0.875rem", md: "1rem" }, mb: 1 }}>
					Tùy thuộc vào lượng thông tin và cách thức tiếp cận người dùng, doanh nghiệp có thể
					chọn <strong style={{ color: COLOR_CODE.PRIMARY }}>Catalogue</strong> hoặc{" "}
					<strong style={{ color: COLOR_CODE.PRIMARY }}>Brochure</strong> để tối ưu
					hiệu quả marketing.
				</Typography>
			</Grid>
			{productTypes.map((type) => (
				<Grid item xs={12} sm={6} key={type.name}>
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
								aspectRatio: "16 / 9",
								overflow: "hidden",
								bgcolor: "rgba(255,255,255,0.05)",
							}}
						>
							<Image
								src={type.image}
								alt={type.name}
								width={800}
								height={450}
								style={{ width: "100%", height: "100%", objectFit: "contain" }}
							/>
						</Box>
						<CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
							<Typography
								variant="h6"
								fontWeight={700}
								color="text.primary"
								gutterBottom
								sx={{ fontSize: { xs: "1.125rem", md: "1.25rem" } }}
							>
								{type.name}
							</Typography>
							<Typography
								variant="body2"
								color="text.secondary"
								sx={{ fontSize: { xs: "0.875rem", md: "0.9375rem" } }}
							>
								{type.description}
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
						Thiết lập file in tiêu chuẩn
					</Typography>
					<List sx={{ color: "text.primary", py: 0 }}>
						{specOptions.map((option) => (
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
