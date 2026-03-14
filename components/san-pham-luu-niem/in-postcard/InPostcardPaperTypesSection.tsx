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
import React from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

interface PaperType {
	name: string;
	description: string;
	pros: string[];
	bestFor: string;
}

interface InPostcardPaperTypesSectionProps {
	paperTypes: PaperType[];
}

export const InPostcardPaperTypesSection: React.FC<InPostcardPaperTypesSectionProps> = ({
	paperTypes,
}) => {
	return (
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<Typography
					variant="h5"
					fontWeight={700}
					color="text.primary"
					gutterBottom
					sx={{ fontSize: { xs: "1.25rem", md: "1.5rem" } }}
				>
					Lựa chọn chất liệu giấy in Postcard
				</Typography>
				<Typography color="text.secondary" sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}>
					Tùy thuộc vào <strong style={{ color: COLOR_CODE.PRIMARY }}>ngân sách</strong> và{" "}
					<strong style={{ color: COLOR_CODE.PRIMARY }}>concept thiết kế</strong>, bạn có thể lựa chọn
					giữa giấy thông dụng để tối ưu chi phí, hoặc giấy mỹ thuật để tăng cảm giác cao cấp.
				</Typography>
			</Grid>
			{paperTypes.map((type) => (
				<Grid item xs={12} md={6} key={type.name}>
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
						<CardContent sx={{ p: { xs: 2, md: 3 } }}>
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
								paragraph
								sx={{ fontSize: { xs: "0.875rem", md: "0.9375rem" } }}
							>
								{type.description}
							</Typography>

							<Typography fontWeight={600} gutterBottom sx={{ mt: 2, fontSize: "0.9375rem" }}>
								Ưu điểm nổi bật:
							</Typography>
							<List sx={{ pt: 0, pb: 2 }}>
								{type.pros.map((pro) => (
									<ListItem key={pro} disableGutters sx={{ py: 0.5 }}>
										<ListItemIcon sx={{ minWidth: 32 }}>
											<CheckCircleOutlineIcon color="primary" fontSize="small" />
										</ListItemIcon>
										<ListItemText 
											primary={pro} 
											primaryTypographyProps={{ variant: "body2", fontSize: "0.875rem" }} 
										/>
									</ListItem>
								))}
							</List>

							<Paper
								variant="outlined"
								sx={{
									p: 1.5,
									bgcolor: "rgba(255,140,0,0.05)",
									borderColor: "primary.light",
									borderRadius: 1,
								}}
							>
								<Typography variant="body2" fontWeight={600} color="primary.main">
									Phù hợp nhất cho:
								</Typography>
								<Typography variant="body2" color="text.secondary">
									{type.bestFor}
								</Typography>
							</Paper>
						</CardContent>
					</Card>
				</Grid>
			))}
		</Grid>
	);
};
