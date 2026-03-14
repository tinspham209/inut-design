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

interface EnvelopeType {
	name: string;
	description: string;
	image: string;
}

interface EnvelopeTypesSectionProps {
	envelopeTypes: EnvelopeType[];
	specOptions: string[];
}

export const EnvelopeTypesSection: React.FC<EnvelopeTypesSectionProps> = ({
	envelopeTypes,
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
					Các loại bì thư phổ biến & thông số kỹ thuật
				</Typography>
				<Typography color="text.secondary" sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}>
					INUT Design hỗ trợ in bì thư theo nhiều kích thước và chất liệu phù hợp với nhu cầu
					văn phòng và thương hiệu.{" "}
					<strong style={{ color: COLOR_CODE.PRIMARY }}>Bì thư in logo</strong> giúp doanh
					nghiệp tạo ấn tượng chuyên nghiệp ngay từ lần tiếp xúc đầu tiên.
				</Typography>
			</Grid>
			{envelopeTypes.map((type) => (
				<Grid item xs={6} md={3} key={type.name}>
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
								src={type.image}
								alt={type.name}
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
								{type.name}
							</Typography>
							<Typography
								variant="body2"
								color="text.secondary"
								sx={{ fontSize: { xs: "0.8125rem", md: "0.875rem" } }}
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
