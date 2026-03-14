import {
	Box,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import React from "react";

interface ComparisonRow {
	criteria: string;
	paper: string;
	artPaper: string;
	pvc: string;
}

interface ComparisonSectionProps {
	rows: ComparisonRow[];
	recommendation: string;
}

export const ComparisonSection: React.FC<ComparisonSectionProps> = ({
	rows,
	recommendation,
}) => {
	return (
		<Box>
			<Typography
				variant="h5"
				fontWeight={700}
				color="text.primary"
				gutterBottom
				sx={{ fontSize: { xs: "1.25rem", md: "1.5rem" } }}
			>
				So sánh & Lựa chọn chất liệu
			</Typography>
			<TableContainer
				component={Paper}
				variant="outlined"
				sx={{ borderRadius: 2, overflowX: "auto", mb: 2 }}
			>
				<Table sx={{ minWidth: 600 }}>
					<TableHead sx={{ bgcolor: "rgba(255,255,255,0.02)" }}>
						<TableRow>
							<TableCell sx={{ fontWeight: 700 }}>Tiêu chí</TableCell>
							<TableCell sx={{ fontWeight: 700 }}>Giấy thông dụng</TableCell>
							<TableCell sx={{ fontWeight: 700 }}>Giấy mỹ thuật</TableCell>
							<TableCell sx={{ fontWeight: 700 }}>Nhựa PVC</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{rows.map((row, index) => (
							<TableRow key={index}>
								<TableCell sx={{ fontWeight: 600, color: "text.secondary" }}>
									{row.criteria}
								</TableCell>
								<TableCell>{row.paper}</TableCell>
								<TableCell>{row.artPaper}</TableCell>
								<TableCell>{row.pvc}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<Paper
				variant="outlined"
				sx={{
					p: 2,
					borderRadius: 2,
					bgcolor: "rgba(255,140,0,0.05)",
					borderColor: "rgba(255,140,0,0.2)",
				}}
			>
				<Typography variant="body2" color="text.primary" sx={{ fontStyle: "italic" }}>
					<strong>Lời khuyên:</strong> {recommendation}
				</Typography>
			</Paper>
		</Box>
	);
};
