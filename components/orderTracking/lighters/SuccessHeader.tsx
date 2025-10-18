import { Box, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import React from "react";

interface SuccessHeaderProps {
	customerName?: string;
}

const SuccessHeader: React.FC<SuccessHeaderProps> = ({ customerName }) => (
	<Box textAlign="center" mb={4}>
		<Box
			sx={{
				display: "inline-flex",
				alignItems: "center",
				justifyContent: "center",
				width: 80,
				height: 80,
				borderRadius: "50%",
				bgcolor: "success.light",
				mb: 2,
			}}
		>
			<CheckCircleIcon sx={{ fontSize: 50, color: "success.dark" }} />
		</Box>
		<Typography variant="h3" fontWeight="bold" gutterBottom>
			Đặt hàng thành công!
		</Typography>
		<Typography variant="body1" color="text.secondary">
			Cảm ơn{customerName ? ` ${customerName}` : " bạn"} đã đặt hàng. Chúng tôi sẽ liên hệ với bạn
			trong thời gian sớm nhất.
		</Typography>
	</Box>
);

export default SuccessHeader;
