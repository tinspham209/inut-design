import React from "react";
import { Box, Typography, Stack, Chip } from "@mui/material";
import { LighterType, LighterProductWithType } from "@/models/cart";

interface InfoPanelProps {
	lighter: LighterProductWithType;
	lighterType: LighterType | null;
	priceRange: { min: string; max: string };
}

const InfoPanel: React.FC<InfoPanelProps> = ({ lighter, lighterType, priceRange }) => {
	return (
		<Box>
			<Typography variant="h5" fontWeight={700}>
				{lighter.name}
			</Typography>
			{lighterType && (
				<Typography variant="subtitle1" fontWeight={600} color="primary" mb={0.5}>
					Loại: {lighterType.name}
				</Typography>
			)}
			<Stack direction="row" spacing={1} mb={1.5} alignItems="center">
				<Chip label="Còn hàng" color="success" size="small" />
				{priceRange.min !== "Liên hệ" && (
					<Chip
						label={`Giá: ${priceRange.min} - ${priceRange.max}`}
						color="default"
						size="small"
						variant="outlined"
					/>
				)}
			</Stack>
			<Typography variant="body2" color="text.secondary" mb={2}>
				Giá thay đổi theo số lượng. Thêm số lượng để xem đơn giá tốt hơn.
			</Typography>
		</Box>
	);
};

export default InfoPanel;
