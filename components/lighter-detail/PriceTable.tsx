import React from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Typography,
	Box,
} from "@mui/material";

export interface PriceTier {
	quantity: number;
	price: number;
}

interface PriceTableProps {
	priceTiers: PriceTier[];
	formatPrice: (price: number) => string;
}

const PriceTable: React.FC<PriceTableProps> = ({ priceTiers, formatPrice }) => {
	if (!priceTiers.length) return null;
	return (
		<Box>
			<Typography variant="h6" fontWeight="bold" mb={2}>
				Bảng giá:
			</Typography>
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>
								<strong>Số lượng</strong>
							</TableCell>
							<TableCell align="right">
								<strong>Đơn giá</strong>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{priceTiers.map((tier) => (
							<TableRow key={tier.quantity}>
								<TableCell>{tier.quantity} cái</TableCell>
								<TableCell align="right">{formatPrice(tier.price)}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
				* Giá có thể thay đổi tùy theo số lượng và yêu cầu đặc biệt
			</Typography>
		</Box>
	);
};

export default PriceTable;
