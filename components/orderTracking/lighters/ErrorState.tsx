import { Box, Container, Typography, Stack, Button, Alert } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import React from "react";
import { useRouter } from "next/router";

interface ErrorStateProps {
	error?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
	const router = useRouter();
	return (
		<Box component="section" bgcolor="secondary.dark" minHeight="100vh" py={8}>
			<Container maxWidth="sm">
				<Box textAlign="center" mb={4}>
					<Box
						sx={{
							display: "inline-flex",
							alignItems: "center",
							justifyContent: "center",
							width: 80,
							height: 80,
							borderRadius: "50%",
							bgcolor: "error.light",
							mb: 3,
						}}
					>
						<ErrorOutlineIcon sx={{ fontSize: 50, color: "error.dark" }} />
					</Box>
					<Typography variant="h4" fontWeight="bold" gutterBottom>
						Không tìm thấy đơn hàng
					</Typography>
					<Typography variant="body1" color="text.secondary" paragraph>
						{error || "Đơn hàng không tồn tại hoặc đã bị xóa"}
					</Typography>
				</Box>
				<Stack spacing={2}>
					<Button
						variant="contained"
						color="primary"
						size="large"
						fullWidth
						onClick={() => router.push("/order-tracking")}
					>
						Tra cứu đơn hàng khác
					</Button>
					<Button
						variant="outlined"
						size="large"
						fullWidth
						onClick={() => router.push("/lighters")}
					>
						Về trang Lighters
					</Button>
					<Button variant="outlined" size="large" fullWidth onClick={() => router.push("/")}>
						Về trang chủ
					</Button>
				</Stack>
				<Alert severity="info" sx={{ mt: 4 }}>
					<Typography variant="body2">
						Nếu bạn vừa đặt hàng và không tìm thấy đơn hàng, vui lòng liên hệ:{" "}
						<strong>0123-456-789</strong>
					</Typography>
				</Alert>
			</Container>
		</Box>
	);
};

export default ErrorState;
