/* eslint-disable camelcase */
import { MainLayout } from "@/components/layout";
import ContactInfo from "@/components/orderTracking/lighters/ContactInfo";
import { NextPageWithLayout } from "@/models/common";
import { trackSearch } from "@/utils/analytics";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import SearchIcon from "@mui/icons-material/Search";
import {
	Alert,
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
} from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { RecentCreativaOrders } from "@/components/creativa/RecentOrders";
import { CREATIVA_PUBLIC_ID } from "@/utils/creativa/contracts";
import { trackCreativa } from "@/utils/creativa/analytics";

type OrderType = "lighters" | "skin-laptop" | "";

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

		if (orderType === "skin-laptop") {
			const id = orderNumber.trim();
			if (!CREATIVA_PUBLIC_ID.test(id)) {
				setError(
					"Mã Creativa gồm đúng 10 ký tự chữ, số, dấu _ hoặc -. Chữ hoa và chữ thường được phân biệt."
				);
				return;
			}
			trackCreativa("order_tracking_search", { entry_point: "root", lookup_source: "manual" });
			void router.push({
				pathname: `/creativa/order-tracking/${encodeURIComponent(id)}`,
				query: { entry: "root", source: "manual" },
			});
			return;
		}

		// Track search event
		trackSearch(orderNumber.trim());

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
										<MenuItem value="lighters">Đơn hàng Bật lửa</MenuItem>
										<MenuItem value="skin-laptop">Skin Laptop — INUT Creativa</MenuItem>
										{/* Add more order types here as needed */}
									</Select>
								</FormControl>

								{/* Order Number Input */}
								<TextField
									fullWidth
									required
									label="Mã đơn hàng"
									placeholder={
										orderType === "skin-laptop"
											? "Mã Creativa 10 ký tự"
											: "Ví dụ: LIGHTER-1234567890123"
									}
									value={orderNumber}
									onChange={(e) => setOrderNumber(e.target.value)}
									helperText={
										orderType === "skin-laptop"
											? "Dùng mã đã hiển thị khi đặt hàng; không có tiền tố. Không đổi chữ hoa/chữ thường."
											: "Mã đơn hàng được gửi qua email hoặc SMS sau khi đặt hàng thành công"
									}
									inputProps={{ autoCapitalize: "none", autoCorrect: "off", spellCheck: false }}
								/>
								<RecentCreativaOrders entryPoint="root" />

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
						• Mã Creativa gồm 10 ký tự, không có tiền tố. Mã bật lửa giữ định dạng LIGHTER.
						<br />
						• Mã đơn hàng được tạo ngay sau khi bạn đặt hàng thành công
						<br />
						• Vui lòng kiểm tra lịch sử web để tìm mã đơn hàng
						<br />• Nếu không tìm thấy đơn hàng, vui lòng liên hệ hotline để được hỗ trợ
					</Typography>
				</Alert>
			</Container>
		</Box>
	);
};

OrderConfirmationSearch.Layout = MainLayout;

export default OrderConfirmationSearch;
