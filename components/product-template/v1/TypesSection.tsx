import { ComparisonRow, ProductType } from "@/models/product-page";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
	Box,
	Card,
	CardContent,
	Grid,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import Image from "next/image";
import React from "react";

interface TypesSectionProps {
	title?: string;
	description?: string;
	items: ProductType[];
	specOptions?: string[];
	comparisonItems?: string[];
	comparisonRows?: ComparisonRow[];
	comparisonRecommendation?: string;
}

export const TypesSection: React.FC<TypesSectionProps> = ({
	title = "Các dòng sản phẩm",
	description,
	items,
	specOptions,
	comparisonItems,
	comparisonRows,
	comparisonRecommendation,
}) => {
	return (
		<Box>
			<Typography variant="h5" fontWeight={800} gutterBottom sx={{ fontSize: "1.5rem" }}>
				{title}
			</Typography>
			{description && (
				<Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
					{description}
				</Typography>
			)}

			<Grid container spacing={2}>
				{items.map((type, index) => (
					<Grid item xs={6} sm={4} md={3} key={index}>
						<Card
							sx={{
								height: "100%",
								boxShadow: "none",
								border: "1px solid",
								borderColor: "divider",
								borderRadius: 1,
								"&:hover": { borderColor: "primary.main" },
							}}
						>
							<Box sx={{ position: "relative", pt: "75%", bgcolor: "grey.100" }}>
								<Image src={type.image} alt={type.name} layout="fill" objectFit="cover" />
							</Box>
							<CardContent sx={{ p: 1.5 }}>
								<Typography variant="subtitle2" fontWeight={700} gutterBottom noWrap>
									{type.name}
								</Typography>
								<Typography
									variant="caption"
									color="text.secondary"
									sx={{
										display: "-webkit-box",
										WebkitLineClamp: 2,
										WebkitBoxOrient: "vertical",
										overflow: "hidden",
										lineHeight: 1.4,
									}}
								>
									{type.description}
								</Typography>
							</CardContent>
						</Card>
					</Grid>
				))}
			</Grid>

			{specOptions && (
				<Box sx={{ mt: 4, p: 3, border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
					<Typography variant="subtitle1" fontWeight={800} gutterBottom>
						Tùy chọn bổ sung
					</Typography>
					<Stack spacing={1} sx={{ mt: 2 }}>
						{specOptions.map((spec, index) => (
							<Stack key={index} direction="row" spacing={1.5} alignItems="center">
								<CheckCircleIcon sx={{ color: "#f57c00", fontSize: 18 }} />
								<Typography variant="body2">{spec}</Typography>
							</Stack>
						))}
					</Stack>
				</Box>
			)}

			{comparisonItems && (
				<Box sx={{ mt: 4 }}>
					<Typography variant="subtitle1" fontWeight={800} gutterBottom>
						So sánh và lựa chọn
					</Typography>
					<Stack spacing={1.5} sx={{ mt: 2 }}>
						{comparisonItems.map((item, index) => (
							<Stack key={index} direction="row" spacing={1.5} alignItems="flex-start">
								<Box
									sx={{
										width: 6,
										height: 6,
										borderRadius: "50%",
										bgcolor: "primary.main",
										mt: 1,
										flexShrink: 0,
									}}
								/>
								<Typography variant="body2">{item}</Typography>
							</Stack>
						))}
					</Stack>
				</Box>
			)}

			{comparisonRows && (
				<Box sx={{ mt: 4 }}>
					<Typography variant="subtitle1" fontWeight={800} gutterBottom sx={{ mb: 2 }}>
						Bảng so sánh chất liệu
					</Typography>
					<TableContainer sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1 }}>
						<Table size="small">
							<TableHead sx={{ bgcolor: "grey.50" }}>
								<TableRow>
									<TableCell sx={{ fontWeight: 700, fontSize: "0.85rem" }}>Đặc điểm</TableCell>
									{Object.keys(comparisonRows[0])
										.filter((key) => key !== "criteria")
										.map((key) => (
											<TableCell
												key={key}
												align="center"
												sx={{ fontWeight: 700, fontSize: "0.85rem" }}
											>
												{key.charAt(0).toUpperCase() + key.slice(1)}
											</TableCell>
										))}
								</TableRow>
							</TableHead>
							<TableBody>
								{comparisonRows.map((row, index) => (
									<TableRow key={index}>
										<TableCell sx={{ fontWeight: 600, fontSize: "0.8rem" }}>
											{row.criteria}
										</TableCell>
										{Object.keys(row)
											.filter((key) => key !== "criteria")
											.map((key) => (
												<TableCell key={key} align="center" sx={{ fontSize: "0.8rem" }}>
													{row[key]}
												</TableCell>
											))}
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
					{comparisonRecommendation && (
						<Box
							sx={{
								mt: 2,
								p: 2,
								bgcolor: "rgba(245, 124, 0, 0.05)",
								borderLeft: "4px solid",
								borderColor: "#f57c00",
								borderRadius: "0 4px 4px 0",
							}}
						>
							<Typography variant="caption" sx={{ fontStyle: "italic", color: "text.primary" }}>
								<strong>Khuyên dùng:</strong> {comparisonRecommendation}
							</Typography>
						</Box>
					)}
				</Box>
			)}
		</Box>
	);
};
