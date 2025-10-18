import { MainLayout } from "@/components/layout";
import { NextPageWithLayout } from "@/models/common";
import {
	Box,
	Button,
	Card,
	CardContent,
	Container,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	TextField,
	Typography,
	Alert,
	Link as MuiLink,
} from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import Link from "next/link";
import ContactInfo from "@/components/orderTracking/lighters/ContactInfo";

type OrderType = "lighters" | "";

const OrderConfirmationSearch: NextPageWithLayout = () => {
	const router = useRouter();
	const [orderNumber, setOrderNumber] = useState("");
	const [orderType, setOrderType] = useState<OrderType>("");
	const [error, setError] = useState("");

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		// Validation
		if (!orderNumber.trim()) {
			setError("Vui lòng nhập mã đơn hàng");
			return;
		}

		if (!orderType) {
			setError("Vui lòng chọn loại đơn hàng");
			return;
		}

		// Navigate to the specific order tracking page
		router.push(`/order-tracking/${orderType}/${orderNumber.trim()}`);
	};

	return (
		<Box component="section" bgcolor="secondary.dark" minHeight="100vh" py={8}>
			<Container maxWidth="sm">
				{/* Header */}
				<Box textAlign="center" mb={6}>
					<Box
						sx={{
							display: "inline-flex",
							alignItems: "center",
							justifyContent: "center",
							width: 80,
							height: 80,
							borderRadius: "50%",
							bgcolor: "primary.light",
							mb: 3,
						}}
					>
						<ReceiptLongIcon sx={{ fontSize: 50, color: "primary.main" }} />
					</Box>
					<Typography variant="h3" fontWeight="bold" gutterBottom>
						Tra cứu đơn hàng
					</Typography>
					<Typography variant="body1" color="text.secondary">
						Nhập mã đơn hàng để xem chi tiết và trạng thái đơn hàng của bạn
					</Typography>
				</Box>

				{/* Search Form */}
				<Card>
					<CardContent sx={{ p: 4 }}>
						<form onSubmit={handleSearch}>
							<Stack spacing={3}>
								{/* Order Type Selection */}
								<FormControl fullWidth required>
									<InputLabel>Loại đơn hàng</InputLabel>
									<Select
										value={orderType}
										onChange={(e) => setOrderType(e.target.value as OrderType)}
										label="Loại đơn hàng"
									>
										<MenuItem value="">-- Chọn loại đơn hàng --</MenuItem>
										<MenuItem value="lighters">Đơn hàng Lighters</MenuItem>
										{/* Add more order types here as needed */}
									</Select>
								</FormControl>

								{/* Order Number Input */}
								<TextField
									fullWidth
									required
									label="Mã đơn hàng"
									placeholder="Ví dụ: LIGHT-1234567890123"
									value={orderNumber}
									onChange={(e) => setOrderNumber(e.target.value)}
									helperText="Mã đơn hàng được gửi qua email hoặc SMS sau khi đặt hàng thành công"
								/>

								{/* Error Message */}
								{error && (
									<Alert severity="error" onClose={() => setError("")}>
										{error}
									</Alert>
								)}

								{/* Submit Button */}
								<Button
									type="submit"
									variant="contained"
									color="primary"
									size="large"
									fullWidth
									startIcon={<SearchIcon />}
									sx={{ py: 1.5, fontWeight: "bold" }}
								>
									Tra cứu đơn hàng
								</Button>
							</Stack>
						</form>
					</CardContent>
				</Card>

				<ContactInfo />

				{/* Additional Info */}
				<Alert severity="info" sx={{ mt: 4 }}>
					<Typography variant="body2" fontWeight="bold" gutterBottom>
						💡 Lưu ý:
					</Typography>
					<Typography variant="body2" component="div">
						• Mã đơn hàng bao gồm tiền tố (LIGHT, SKIN, MAC, v.v.) và dãy số
						<br />
						• Mã đơn hàng được tạo ngay sau khi bạn đặt hàng thành công
						<br />
						• Vui lòng kiểm tra email hoặc tin nhắn SMS để tìm mã đơn hàng
						<br />• Nếu không tìm thấy đơn hàng, vui lòng liên hệ hotline để được hỗ trợ
					</Typography>
				</Alert>
			</Container>
		</Box>
	);
};

OrderConfirmationSearch.Layout = MainLayout;

export default OrderConfirmationSearch;
