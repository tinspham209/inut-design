import {
	Grid,
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
	fort: string;
	couche: string;
	kraft: string;
}

interface ComparisonSectionProps {
	rows: ComparisonRow[];
	recommendation: string;
}

export const ComparisonSection: React.FC<ComparisonSectionProps> = ({ rows, recommendation }) => {
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
					So sánh chất liệu bì thư
				</Typography>
				<Typography
					color="text.secondary"
					sx={{ fontSize: { xs: "0.875rem", md: "1rem" }, mb: { xs: 1.5, md: 2 } }}
				>
					Việc lựa chọn chất liệu phù hợp sẽ ảnh hưởng trực tiếp đến cảm giác cầm nắm, khả
					năng sử dụng và hình ảnh thương hiệu của doanh nghiệp.
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
					<Table>
						<TableHead>
							<TableRow sx={{ bgcolor: "rgba(255,140,0,0.08)" }}>
								<TableCell sx={{ fontWeight: 700 }}>Tiêu chí</TableCell>
								<TableCell sx={{ fontWeight: 700 }}>Bì thư Fort</TableCell>
								<TableCell sx={{ fontWeight: 700 }}>Bì thư Couche</TableCell>
								<TableCell sx={{ fontWeight: 700 }}>Bì thư Kraft</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{rows.map((row) => (
								<TableRow key={row.criteria}>
									<TableCell sx={{ fontWeight: 600 }}>{row.criteria}</TableCell>
									<TableCell>{row.fort}</TableCell>
									<TableCell>{row.couche}</TableCell>
									<TableCell>{row.kraft}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Grid>
			<Grid item xs={12}>
				<Typography
					color="text.secondary"
					sx={{ fontSize: { xs: "0.875rem", md: "1rem" }, fontStyle: "italic" }}
				>
					{recommendation}
				</Typography>
			</Grid>
		</Grid>
	);
};
