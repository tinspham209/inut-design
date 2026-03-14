import { Avatar, Box, Grid, Paper, Stack, Typography } from "@mui/material";
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
					Tại sao nên chọn in card visit tại INUT Design?
				</Typography>
				<Typography color="text.secondary" sx={{ fontSize: { xs: "0.875rem", md: "1rem" }, mb: 1 }}>
					Chúng tôi hiểu rằng tấm danh thiếp là khởi đầu của mọi cuộc hội thoại kinh doanh.
					Vì vậy, từng sản phẩm đều được chăm chút tỉ mỉ từ khâu thiết kế đến thành phẩm.
				</Typography>
			</Grid>
			{applications.map((item) => (
				<Grid item xs={12} sm={6} key={item.title}>
					<Paper
						variant="outlined"
						sx={{
							p: { xs: 2, md: 2.5 },
							borderRadius: 3,
							height: "100%",
							bgcolor: "background.paper",
							transition: "all 0.3s ease",
							"&:hover": {
								borderColor: "primary.main",
								boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
							},
						}}
					>
						<Stack direction="row" spacing={2} alignItems="flex-start">
							<Avatar
								sx={{
									bgcolor: "rgba(255,140,0,0.1)",
									color: "primary.main",
									width: 48,
									height: 48,
								}}
							>
								{item.icon}
							</Avatar>
							<Box>
								<Typography variant="h6" fontWeight={700} gutterBottom sx={{ fontSize: "1.125rem" }}>
									{item.title}
								</Typography>
								<Typography variant="body2" color="text.secondary" lineHeight={1.6}>
									{item.description}
								</Typography>
							</Box>
						</Stack>
					</Paper>
				</Grid>
			))}
		</Grid>
	);
};
