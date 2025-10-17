"use client";

import { MainLayout } from "@/components/layout";
import { NextPageWithLayout } from "@/models/common";
import { formatPrice } from "@/utils/priceCalculator";
import { bankInfoApi } from "@/api-client/bankInfo";
import { BankInfo } from "@/models/bankInfo";
import { urlFor } from "@/api-client/sanity-client";
import {
	Box,
	Button,
	Card,
	CardContent,
	Container,
	Divider,
	Grid,
	Stack,
	Typography,
	Alert,
	Chip,
	Paper,
} from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import PrintIcon from "@mui/icons-material/Print";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { format } from "date-fns";
import { toast } from "react-hot-toast";

type OrderItem = {
	productId: string;
	productName: string;
	lighterTypeId: string;
	lighterTypeName: string;
	quantity: number;
	unitPrice: number;
	subtotal: number;
};

type OrderData = {
	customerName: string;
	customerPhone: string;
	customerEmail?: string;
	deliveryAddress?: string;
	notes?: string;
	paymentMethod: string;
	orderItems: OrderItem[];
	totalItems: number;
	totalAmount: number;
	orderDate: string;
	orderNumber?: string; // Optional, from Sanity
	shippingFee?: number;
	discount?: number;
	finalAmount?: number;
};

const LighterOrderConfirmation: NextPageWithLayout = () => {
	const router = useRouter();
	const [orderData, setOrderData] = useState<OrderData | null>(null);
	const [bankInfo, setBankInfo] = useState<BankInfo | null>(null);
	const [loadingBankInfo, setLoadingBankInfo] = useState(false);

	useEffect(() => {
		// Get order data from localStorage
		const storedOrder = localStorage.getItem("last-lighter-order");
		if (storedOrder) {
			const data = JSON.parse(storedOrder);
			setOrderData(data);

			// Fetch bank info if payment method is bank transfer
			if (data.paymentMethod === "bank_transfer") {
				fetchBankInfo();
			}
		} else {
			// Redirect to lighters page if no order data
			router.push("/lighters");
		}
	}, [router]);

	const fetchBankInfo = async () => {
		try {
			setLoadingBankInfo(true);
			const primaryBank = await bankInfoApi.getPrimaryBankAccount();
			if (primaryBank) {
				setBankInfo(primaryBank);
			}
		} catch (error) {
			console.error("Error fetching bank info:", error);
		} finally {
			setLoadingBankInfo(false);
		}
	};

	const handleCopyToClipboard = (text: string, label: string) => {
		navigator.clipboard.writeText(text);
		toast.success(`Đã sao chép ${label}!`);
	};

	const handlePrint = () => {
		window.print();
	};

	if (!orderData) {
		return null;
	}

	const paymentMethodLabels: Record<string, string> = {
		cod: "Thanh toán khi nhận hàng (COD)",
		// eslint-disable-next-line camelcase
		bank_transfer: "Chuyển khoản ngân hàng",
	};

	return (
		<Box component="section" bgcolor="secondary.dark" minHeight="100vh" py={4}>
			<Container maxWidth="md">
				{/* Success Header */}
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
						Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
					</Typography>
				</Box>

				{/* Alert */}
				<Alert severity="success" sx={{ mb: 3 }}>
					<Typography variant="body2" fontWeight="bold">
						Đơn hàng lighter của bạn đã được ghi nhận thành công!
					</Typography>
					<Typography variant="body2">
						Chúng tôi sẽ liên hệ qua số điện thoại <strong>{orderData.customerPhone}</strong> để xác
						nhận và chuẩn bị đơn hàng.
					</Typography>
				</Alert>

				<Grid container spacing={3}>
					{/* Order Information */}
					<Grid item xs={12}>
						<Card>
							<CardContent>
								<Typography variant="h6" fontWeight="bold" gutterBottom>
									Thông tin đơn hàng
								</Typography>
								<Divider sx={{ my: 2 }} />

								<Grid container spacing={2}>
									{orderData.orderNumber && (
										<Grid item xs={12} sm={6}>
											<Typography variant="body2" color="text.secondary">
												Mã đơn hàng:
											</Typography>
											<Typography variant="body1" fontWeight="bold" color="primary.main">
												{orderData.orderNumber}
											</Typography>
										</Grid>
									)}
									<Grid item xs={12} sm={orderData.orderNumber ? 6 : 6}>
										<Typography variant="body2" color="text.secondary">
											Ngày đặt:
										</Typography>
										<Typography variant="body1" fontWeight="medium">
											{format(new Date(orderData.orderDate), "dd/MM/yyyy HH:mm")}
										</Typography>
									</Grid>
									<Grid item xs={12} sm={6}>
										<Typography variant="body2" color="text.secondary">
											Trạng thái:
										</Typography>
										<Chip label="Đang chờ xử lý" color="warning" size="small" sx={{ mt: 0.5 }} />
									</Grid>
								</Grid>
							</CardContent>
						</Card>
					</Grid>

					{/* Customer Information */}
					<Grid item xs={12}>
						<Card>
							<CardContent>
								<Typography variant="h6" fontWeight="bold" gutterBottom>
									Thông tin khách hàng
								</Typography>
								<Divider sx={{ my: 2 }} />

								<Stack spacing={1.5}>
									<Box>
										<Typography variant="body2" color="text.secondary">
											Họ và tên:
										</Typography>
										<Typography variant="body1" fontWeight="medium">
											{orderData.customerName}
										</Typography>
									</Box>
									<Box>
										<Typography variant="body2" color="text.secondary">
											Số điện thoại:
										</Typography>
										<Typography variant="body1" fontWeight="medium">
											{orderData.customerPhone}
										</Typography>
									</Box>
									{orderData.customerEmail && (
										<Box>
											<Typography variant="body2" color="text.secondary">
												Email:
											</Typography>
											<Typography variant="body1" fontWeight="medium">
												{orderData.customerEmail}
											</Typography>
										</Box>
									)}
									{orderData.deliveryAddress && (
										<Box>
											<Typography variant="body2" color="text.secondary">
												Địa chỉ giao hàng:
											</Typography>
											<Typography variant="body1" fontWeight="medium">
												{orderData.deliveryAddress}
											</Typography>
										</Box>
									)}
									<Box>
										<Typography variant="body2" color="text.secondary">
											Phương thức thanh toán:
										</Typography>
										<Typography variant="body1" fontWeight="medium">
											{paymentMethodLabels[orderData.paymentMethod] || orderData.paymentMethod}
										</Typography>
									</Box>
									{orderData.notes && (
										<Box>
											<Typography variant="body2" color="text.secondary">
												Ghi chú:
											</Typography>
											<Typography variant="body1" fontWeight="medium">
												{orderData.notes}
											</Typography>
										</Box>
									)}
								</Stack>
							</CardContent>
						</Card>
					</Grid>

					{/* Bank Transfer Information - Only show if payment method is bank_transfer */}
					{orderData.paymentMethod === "bank_transfer" && bankInfo && (
						<Grid item xs={12}>
							<Card
								sx={{
									border: "2px solid",
									borderColor: "primary.main",
									bgcolor: "primary.light",
									"@media print": {
										borderColor: "#000",
									},
								}}
							>
								<CardContent>
									<Stack direction="row" alignItems="center" spacing={1} mb={2}>
										<AccountBalanceIcon color="primary" />
										<Typography variant="h6" fontWeight="bold" color="primary.dark">
											Thông tin chuyển khoản
										</Typography>
									</Stack>

									<Alert severity="info" sx={{ mb: 3 }}>
										<Typography variant="body2" fontWeight="bold" gutterBottom>
											📝 Hướng dẫn thanh toán:
										</Typography>
										<Typography variant="body2" component="div">
											1. Chuyển khoản đúng số tiền:{" "}
											<strong>{formatPrice(orderData.totalAmount)}</strong>
											<br />
											2. Nội dung chuyển khoản: <strong>{orderData.customerPhone}</strong> (Số điện
											thoại của bạn)
											<br />
											3. Gửi ảnh chụp màn hình chuyển khoản qua Zalo/Facebook:{" "}
											<strong>0123-456-789</strong>
											<br />
											4. Chúng tôi sẽ xác nhận và xử lý đơn hàng ngay sau khi nhận được thanh toán
										</Typography>
									</Alert>

									<Grid container spacing={3}>
										{/* QR Code - if available */}
										{bankInfo.image && (
											<Grid item xs={12} md={5}>
												<Paper
													elevation={3}
													sx={{
														p: 2,
														textAlign: "center",
														bgcolor: "white",
													}}
												>
													<Typography variant="subtitle2" fontWeight="bold" gutterBottom>
														Quét mã QR để thanh toán
													</Typography>
													<Box
														sx={{
															mx: "auto",
															mt: 1,
															textAlign: "center",
														}}
													>
														{/* eslint-disable-next-line @next/next/no-img-element */}
														<img
															src={urlFor(bankInfo.image).width(400).url()}
															alt="QR Code"
															style={{
																width: "100%",
																maxWidth: "300px",
																height: "auto",
																display: "block",
																margin: "0 auto",
															}}
														/>
													</Box>
													<Typography
														variant="caption"
														color="text.secondary"
														sx={{ mt: 1, display: "block" }}
													>
														Sử dụng app ngân hàng để quét mã
													</Typography>
												</Paper>
											</Grid>
										)}

										{/* Bank Details */}
										<Grid item xs={12} md={bankInfo.image ? 7 : 12}>
											<Paper
												elevation={2}
												sx={{
													p: 2.5,
													bgcolor: "white",
													height: "100%",
												}}
											>
												<Typography
													variant="subtitle2"
													fontWeight="bold"
													gutterBottom
													color="primary.dark"
												>
													Hoặc chuyển khoản thủ công:
												</Typography>

												<Stack spacing={2} mt={2}>
													{/* Bank Name */}
													<Box>
														<Typography variant="caption" color="text.secondary">
															Ngân hàng:
														</Typography>
														<Stack
															direction="row"
															alignItems="center"
															justifyContent="space-between"
														>
															<Typography variant="body1" fontWeight="bold">
																{bankInfo.bankName} ({bankInfo.bankShortName})
															</Typography>
														</Stack>
													</Box>

													<Divider />

													{/* Account Number */}
													<Box>
														<Typography variant="caption" color="text.secondary">
															Số tài khoản:
														</Typography>
														<Stack
															direction="row"
															alignItems="center"
															justifyContent="space-between"
															spacing={1}
														>
															<Typography variant="h6" fontWeight="bold" color="primary.main">
																{bankInfo.accountNumber}
															</Typography>
															<Button
																size="small"
																startIcon={<ContentCopyIcon />}
																onClick={() =>
																	handleCopyToClipboard(bankInfo.accountNumber, "số tài khoản")
																}
																sx={{ minWidth: "auto" }}
															>
																Sao chép
															</Button>
														</Stack>
													</Box>

													<Divider />

													{/* Account Holder */}
													<Box>
														<Typography variant="caption" color="text.secondary">
															Chủ tài khoản:
														</Typography>
														<Stack
															direction="row"
															alignItems="center"
															justifyContent="space-between"
															spacing={1}
														>
															<Typography variant="body1" fontWeight="bold">
																{bankInfo.accountHolderName}
															</Typography>
															<Button
																size="small"
																startIcon={<ContentCopyIcon />}
																onClick={() =>
																	handleCopyToClipboard(
																		bankInfo.accountHolderName,
																		"tên chủ tài khoản"
																	)
																}
																sx={{ minWidth: "auto" }}
															>
																Sao chép
															</Button>
														</Stack>
													</Box>

													<Divider />

													{/* Transfer Amount */}
													<Box>
														<Typography variant="caption" color="text.secondary">
															Số tiền cần chuyển:
														</Typography>
														<Stack
															direction="row"
															alignItems="center"
															justifyContent="space-between"
															spacing={1}
														>
															<Typography variant="h6" fontWeight="bold" color="error.main">
																{formatPrice(orderData.totalAmount)}
															</Typography>
															<Button
																size="small"
																startIcon={<ContentCopyIcon />}
																onClick={() =>
																	handleCopyToClipboard(orderData.totalAmount.toString(), "số tiền")
																}
																sx={{ minWidth: "auto" }}
															>
																Sao chép
															</Button>
														</Stack>
													</Box>

													<Divider />

													{/* Transfer Content */}
													<Box>
														<Typography variant="caption" color="text.secondary">
															Nội dung chuyển khoản:
														</Typography>
														<Stack
															direction="row"
															alignItems="center"
															justifyContent="space-between"
															spacing={1}
														>
															<Typography variant="body1" fontWeight="bold">
																{orderData.customerPhone}
															</Typography>
															<Button
																size="small"
																startIcon={<ContentCopyIcon />}
																onClick={() =>
																	handleCopyToClipboard(
																		orderData.customerPhone,
																		"nội dung chuyển khoản"
																	)
																}
																sx={{ minWidth: "auto" }}
															>
																Sao chép
															</Button>
														</Stack>
														<Typography
															variant="caption"
															color="error.main"
															sx={{ mt: 0.5, display: "block" }}
														>
															⚠️ Vui lòng ghi đúng nội dung để chúng tôi xác nhận nhanh nhất
														</Typography>
													</Box>
												</Stack>
											</Paper>
										</Grid>
									</Grid>

									<Alert severity="warning" sx={{ mt: 3 }}>
										<Typography variant="body2">
											<strong>Lưu ý quan trọng:</strong> Sau khi chuyển khoản, vui lòng chụp ảnh màn
											hình và gửi cho chúng tôi qua Zalo/Facebook để được xác nhận nhanh chóng. Đơn
											hàng sẽ được xử lý ngay sau khi thanh toán được xác nhận.
										</Typography>
									</Alert>
								</CardContent>
							</Card>
						</Grid>
					)}

					{/* Loading Bank Info */}
					{orderData.paymentMethod === "bank_transfer" && !bankInfo && loadingBankInfo && (
						<Grid item xs={12}>
							<Card>
								<CardContent>
									<Typography variant="body2" textAlign="center" color="text.secondary">
										Đang tải thông tin chuyển khoản...
									</Typography>
								</CardContent>
							</Card>
						</Grid>
					)}

					{/* Order Items */}
					<Grid item xs={12}>
						<Card>
							<CardContent>
								<Typography variant="h6" fontWeight="bold" gutterBottom>
									Sản phẩm đã đặt ({orderData.totalItems} cái)
								</Typography>
								<Divider sx={{ my: 2 }} />

								<Stack spacing={2}>
									{orderData.orderItems.map((item, index) => (
										<Box key={`${item.productId}-${item.lighterTypeId}-${index}`}>
											<Stack direction="row" spacing={2} alignItems="start">
												<Box
													sx={{
														width: 60,
														height: 60,
														flexShrink: 0,
														borderRadius: 1,
														bgcolor: "grey.200",
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
													}}
												>
													<ShoppingBagIcon sx={{ color: "grey.500" }} />
												</Box>
												<Box flex={1}>
													<Typography variant="body1" fontWeight="bold">
														{item.productName}
													</Typography>
													<Typography variant="caption" color="text.secondary">
														Loại: {item.lighterTypeName}
													</Typography>
													<Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
														{item.quantity} cái × {formatPrice(item.unitPrice)}
													</Typography>
												</Box>
												<Box textAlign="right">
													<Typography variant="body1" fontWeight="bold" color="primary">
														{formatPrice(item.subtotal)}
													</Typography>
												</Box>
											</Stack>
											{index < orderData.orderItems.length - 1 && <Divider sx={{ mt: 2 }} />}
										</Box>
									))}
								</Stack>

								<Divider sx={{ my: 3 }} />

								<Stack spacing={1}>
									<Stack direction="row" justifyContent="space-between">
										<Typography variant="body2">Tổng sản phẩm:</Typography>
										<Typography variant="body2" fontWeight="medium">
											{orderData.totalItems} cái
										</Typography>
									</Stack>
									<Stack direction="row" justifyContent="space-between">
										<Typography variant="subtitle1" fontWeight="bold">
											Tổng cộng:
										</Typography>
										<Typography variant="subtitle1" fontWeight="bold" color="primary">
											{formatPrice(orderData.totalAmount)}
										</Typography>
									</Stack>
								</Stack>

								<Alert severity="info" sx={{ mt: 2 }}>
									<Typography variant="caption">
										Giá đã bao gồm in ấn và VAT (nếu có). Vui lòng chờ cuộc gọi xác nhận từ chúng
										tôi.
									</Typography>
								</Alert>
							</CardContent>
						</Card>
					</Grid>
				</Grid>

				{/* Action Buttons */}
				<Stack
					direction={{ xs: "column", sm: "row" }}
					spacing={2}
					sx={{ mt: 4 }}
					justifyContent="center"
				>
					<Button variant="outlined" startIcon={<PrintIcon />} onClick={handlePrint} size="large">
						In đơn hàng
					</Button>
					<Button
						variant="outlined"
						startIcon={<ShoppingBagIcon />}
						onClick={() => router.push("/lighters")}
						size="large"
					>
						Tiếp tục mua sắm
					</Button>
					<Button
						variant="contained"
						startIcon={<HomeIcon />}
						onClick={() => router.push("/")}
						size="large"
					>
						Về trang chủ
					</Button>
				</Stack>

				{/* Contact Info */}
				<Box sx={{ mt: 4, textAlign: "center" }}>
					<Typography variant="body2" color="text.secondary" gutterBottom>
						Cần hỗ trợ? Liên hệ với chúng tôi
					</Typography>
					<Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 1 }} flexWrap="wrap">
						<Typography variant="body2" fontWeight="bold">
							📞 Hotline: 0123-456-789
						</Typography>
						<Typography variant="body2" fontWeight="bold">
							📧 Email: contact@inutdesign.com
						</Typography>
					</Stack>
				</Box>
			</Container>
		</Box>
	);
};

LighterOrderConfirmation.Layout = MainLayout;

export default LighterOrderConfirmation;
