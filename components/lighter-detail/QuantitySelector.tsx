import React from "react";
import {
	Box,
	Typography,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	TextField,
	Stack,
	IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { PriceTier } from "./PriceTable";

interface QuantitySelectorProps {
	priceTiers: PriceTier[];
	quantity: number;
	setQuantity: (q: number) => void;
	formatPrice: (price: number) => string;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
	priceTiers,
	quantity,
	setQuantity,
	formatPrice,
}) => {
	const isCustomQuantity = !priceTiers.some((tier) => tier.quantity === quantity);

	const customPrice = React.useMemo(() => {
		return priceTiers[priceTiers.length - 1]?.price || null;
	}, [priceTiers]);

	return (
		<Box my={3}>
			<Typography variant="subtitle1" fontWeight="bold" gutterBottom>
				Số lượng:
			</Typography>
			<FormControl fullWidth>
				<InputLabel id="quantity-select-label">Chọn số lượng</InputLabel>
				<Select
					labelId="quantity-select-label"
					value={quantity}
					label="Chọn số lượng"
					onChange={(e) => setQuantity(Number(e.target.value))}
				>
					{priceTiers.map((tier) => (
						<MenuItem key={tier.quantity} value={tier.quantity}>
							{tier.quantity} cái - {formatPrice(tier.price)}/cái
						</MenuItem>
					))}
					{isCustomQuantity && (
						<MenuItem value={quantity}>
							{quantity} cái - {formatPrice(customPrice)}/cái
						</MenuItem>
					)}
				</Select>
			</FormControl>
			<Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
				Hoặc nhập số lượng tùy chỉnh:
			</Typography>
			<Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
				<IconButton
					size="small"
					onClick={() => setQuantity(Math.max(1, quantity - 1))}
					disabled={quantity <= 1}
					sx={{ border: 1, borderColor: "divider" }}
				>
					<RemoveIcon fontSize="small" />
				</IconButton>
				<TextField
					type="number"
					value={quantity}
					onChange={(e) => {
						const value = parseInt(e.target.value);
						if (!isNaN(value) && value > 0 && value <= 9999) {
							setQuantity(value);
						}
					}}
					inputProps={{ min: 1, max: 9999, style: { textAlign: "center" } }}
					sx={{ width: 80 }}
					size="small"
				/>
				<IconButton
					size="small"
					onClick={() => setQuantity(Math.min(9999, quantity + 1))}
					disabled={quantity >= 9999}
					sx={{ border: 1, borderColor: "divider" }}
				>
					<AddIcon fontSize="small" />
				</IconButton>
			</Stack>
		</Box>
	);
};

export default QuantitySelector;
