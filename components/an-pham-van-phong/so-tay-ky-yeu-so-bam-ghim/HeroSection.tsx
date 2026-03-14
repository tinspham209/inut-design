import { Box, Button, Chip, Container, Grid, Stack, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";

interface HeroSectionProps {
	heroImage: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ heroImage }) => {
	return (
		<Box
			sx={{
				background: "linear-gradient(90deg, #1b1f2a 0%, #1f2a44 100%)",
				color: "white",
			}}
		>
			<Container sx={{ py: { xs: 2, md: 3 } }}>
				<Grid container spacing={{ xs: 2, md: 3 }} alignItems="center">
					<Grid item xs={12} md={6}>
						<Stack spacing={{ xs: 1.5, md: 2 }}>
							<Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: { xs: 0.5, md: 0 } }}>
								<Chip label="Đa dạng chất liệu" color="primary" size="small" />
								<Chip label="Gia công chắc chắn" color="primary" size="small" />
							</Stack>
							<Typography
								variant="h3"
								fontWeight={800}
								lineHeight={1.1}
								sx={{ fontSize: { xs: "1.75rem", md: "3rem" } }}
							>
								In Sổ Tay · Kỷ Yếu · Sổ Bấm Ghim
							</Typography>
							<Typography
								variant="body1"
								color="white"
								sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
							>
								Dịch vụ in sổ tay, kỷ yếu, sổ bấm ghim chuyên nghiệp tại Đà Nẵng với tiêu chí chất lượng cao, giá cạnh tranh, dịch vụ tận tâm. 
								Phù hợp cho doanh nghiệp, trường học, tổ chức, câu lạc bộ và workshop.
							</Typography>
							<Stack
								direction={{ xs: "column", sm: "row" }}
								spacing={{ xs: 1.5, sm: 2 }}
								sx={{ pt: { xs: 0.5, md: 1 } }}
							>
								<Button
									variant="contained"
									color="primary"
									size="large"
									href="#order"
									fullWidth
									sx={{ display: { xs: "block", sm: "inline-flex" } }}
								>
									Nhận báo giá nhanh
								</Button>
								<Button
									variant="outlined"
									size="large"
									fullWidth
									sx={{
										borderColor: "rgba(255,255,255,0.4)",
										color: "white",
										display: { xs: "block", sm: "inline-flex" },
									}}
									href="#gallery"
								>
									Xem mẫu thực tế
								</Button>
							</Stack>
						</Stack>
					</Grid>
					<Grid item xs={12} md={6}>
						<Box
							sx={{
								borderRadius: 3,
								overflow: "hidden",
								boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
							}}
						>
							<Image
								src={heroImage}
								alt="In sổ tay kỷ yếu sổ bấm ghim theo yêu cầu tại Đà Nẵng"
								width={800}
								height={600}
								style={{ width: "100%", height: "100%", objectFit: "contain" }}
							/>
						</Box>
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
};
