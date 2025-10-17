import { MainLayout } from "@/components/layout";
import { NextPageWithLayout } from "@/models/common";
import { useLightersCart } from "@/store";
import { urlFor, createLighterOrder } from "@/api-client/sanity-client";
import { formatPrice } from "@/utils/priceCalculator";
import { CreateOrderLighterInput } from "@/models/cart";
import {
	Box,
	Button,
	Card,
	CardContent,
	Container,
	Divider,
	Grid,
	Stack,
	TextField,
	Typography,
	MenuItem,
	Select,
	FormControl,
	InputLabel,
	Alert,
	CircularProgress,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

type CheckoutFormData = {
	customerName: string;
	customerPhone: string;
	customerEmail?: string;
	deliveryAddress?: string;
	notes?: string;
	paymentMethod: "cod" | "bank_transfer";
};

const LighterCheckout: NextPageWithLayout = () => {
	const router = useRouter();
	const { items, totalItems, totalAmount, clearCart } = useLightersCart();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<CheckoutFormData>({
		defaultValues: {
			customerName: "",
			customerPhone: "",
			customerEmail: "",
			deliveryAddress: "",
			notes: "",
			paymentMethod: "cod",
		},
	});

	const onSubmit = async (data: CheckoutFormData) => {
		try {
			setIsSubmitting(true);

			// Prepare order items for Sanity (convert to reference format)
			const orderItems = items.map((item, index) => ({
				_key: `${item.productId}-${item.lighterTypeId}-${Date.now()}-${index}`, // Unique key for each item
				product: {
					_ref: item.productId,
					_type: "reference" as const,
				},
				lighterType: {
					_ref: item.lighterTypeId,
					_type: "reference" as const,
				},
				quantity: item.quantity,
				unitPrice: item.unitPrice,
				subtotal: item.subtotal,
			}));

			// Calculate final amount (can add shipping fee and discount later)
			const shippingFee = 0;
			const discount = 0;
			const finalAmount = totalAmount + shippingFee - discount;

			// Create order input for Sanity
			const orderInput: CreateOrderLighterInput = {
				status: "pending",
				orderItems,
				customerName: data.customerName,
				customerPhone: data.customerPhone,
				customerEmail: data.customerEmail,
				deliveryAddress: data.deliveryAddress,
				totalAmount,
				shippingFee,
				discount,
				finalAmount,
				notes: data.notes,
				paymentMethod: data.paymentMethod,
				paymentStatus: "pending",
			};

			// Submit order to Sanity
			const createdOrder = await createLighterOrder(orderInput);

			console.log("Order created successfully:", createdOrder);

			// Store order data in localStorage for confirmation page
			const orderData = {
				...data,
				orderNumber: createdOrder.orderNumber,
				orderDate: createdOrder.orderDate,
				orderItems: items.map((item) => ({
					productId: item.productId,
					productName: item.productName,
					lighterTypeId: item.lighterTypeId,
					lighterTypeName: item.lighterTypeName,
					quantity: item.quantity,
					unitPrice: item.unitPrice,
					subtotal: item.subtotal,
				})),
				totalItems,
				totalAmount,
				shippingFee,
				discount,
				finalAmount,
			};

			localStorage.setItem("last-lighter-order", JSON.stringify(orderData));

			// Clear cart
			clearCart();

			// Show success message
			toast.success("Đặt hàng thành công!");

			// Redirect to confirmation page
			router.push("/order-confirmation/lighters");
			return;
		} catch (error) {
			console.error("Error creating order:", error);
			toast.error("Có lỗi xảy ra. Vui lòng thử lại!");
		} finally {
			setIsSubmitting(false);
		}
	};

	// Redirect if cart is empty
	if (items.length === 0 && typeof window !== "undefined") {
		router.push("/lighters");
		return null;
	}

	return (
		<Box component="section" bgcolor="secondary.dark" minHeight="100vh" py={4}>
			<Container maxWidth="lg">
				{/* Header */}
				<Box mb={4}>
					<Button
						startIcon={<ArrowBackIcon />}
						onClick={() => router.back()}
						variant="outlined"
						sx={{ mb: 2 }}
					>
						Quay lại
					</Button>
					<Typography variant="h3" fontWeight="bold" gutterBottom>
						Đặt hàng Lighters
					</Typography>
					<Typography variant="body1" color="text.secondary">
						Hoàn tất thông tin để đặt hàng
					</Typography>
				</Box>

				<form onSubmit={handleSubmit(onSubmit)}>
					<Grid container spacing={3}>
						{/* Left Column - Customer Info */}
						<Grid item xs={12} md={7}>
							<Stack spacing={3}>
								{/* Customer Information */}
								<Card>
									<CardContent>
										<Typography variant="h6" fontWeight="bold" gutterBottom>
											Thông tin khách hàng
										</Typography>
										<Stack spacing={2} mt={2}>
											<Controller
												name="customerName"
												control={control}
												rules={{ required: "Vui lòng nhập họ tên" }}
												render={({ field }) => (
													<TextField
														{...field}
														label="Họ và tên"
														fullWidth
														required
														error={!!errors.customerName}
														helperText={errors.customerName?.message}
													/>
												)}
											/>

											<Controller
												name="customerPhone"
												control={control}
												rules={{
													required: "Vui lòng nhập số điện thoại",
													pattern: {
														value: /^[0-9]{10}$/,
														message: "Số điện thoại không hợp lệ",
													},
												}}
												render={({ field }) => (
													<TextField
														{...field}
														label="Số điện thoại"
														fullWidth
														required
														error={!!errors.customerPhone}
														helperText={errors.customerPhone?.message}
														placeholder="0123456789"
													/>
												)}
											/>

											<Controller
												name="customerEmail"
												control={control}
												rules={{
													pattern: {
														value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
														message: "Email không hợp lệ",
													},
												}}
												render={({ field }) => (
													<TextField
														{...field}
														label="Email"
														fullWidth
														type="email"
														error={!!errors.customerEmail}
														helperText={errors.customerEmail?.message}
													/>
												)}
											/>
										</Stack>
									</CardContent>
								</Card>

								{/* Delivery Information */}
								<Card>
									<CardContent>
										<Typography variant="h6" fontWeight="bold" gutterBottom>
											Địa chỉ giao hàng
										</Typography>
										<Stack spacing={2} mt={2}>
											<Controller
												name="deliveryAddress"
												control={control}
												render={({ field }) => (
													<TextField
														{...field}
														label="Địa chỉ"
														fullWidth
														multiline
														rows={2}
														placeholder="Số nhà, tên đường, phường, quận, thành phố..."
													/>
												)}
											/>
										</Stack>
									</CardContent>
								</Card>

								{/* Payment Method */}
								<Card>
									<CardContent>
										<Typography variant="h6" fontWeight="bold" gutterBottom>
											Phương thức thanh toán
										</Typography>
										<Controller
											name="paymentMethod"
											control={control}
											render={({ field }) => (
												<FormControl fullWidth sx={{ mt: 2 }}>
													<InputLabel>Chọn phương thức</InputLabel>
													<Select {...field} label="Chọn phương thức">
														<MenuItem value="cod">Thanh toán khi nhận hàng (COD)</MenuItem>
														<MenuItem value="bank_transfer">Chuyển khoản ngân hàng</MenuItem>
													</Select>
												</FormControl>
											)}
										/>
									</CardContent>
								</Card>

								{/* Notes */}
								<Card>
									<CardContent>
										<Typography variant="h6" fontWeight="bold" gutterBottom>
											Ghi chú
										</Typography>
										<Controller
											name="notes"
											control={control}
											render={({ field }) => (
												<TextField
													{...field}
													fullWidth
													multiline
													rows={3}
													placeholder="Ghi chú thêm về đơn hàng (tùy chọn)"
													sx={{ mt: 2 }}
												/>
											)}
										/>
									</CardContent>
								</Card>
							</Stack>
						</Grid>

						{/* Right Column - Order Summary */}
						<Grid item xs={12} md={5}>
							<Card
								sx={{
									position: { md: "sticky" },
									top: { md: 90 },
								}}
							>
								<CardContent>
									<Typography variant="h6" fontWeight="bold" gutterBottom>
										Đơn hàng của bạn
									</Typography>

									<Divider sx={{ my: 2 }} />

									{/* Cart Items */}
									<Stack spacing={2} sx={{ maxHeight: 400, overflowY: "auto", mb: 2 }}>
										{items.map((item) => (
											<Box key={`${item.productId}-${item.lighterTypeId}`}>
												<Stack direction="row" spacing={2}>
													{item.productImage && (
														<Box
															sx={{
																width: 60,
																height: 60,
																flexShrink: 0,
																borderRadius: 1,
																overflow: "hidden",
																border: 1,
																borderColor: "divider",
															}}
														>
															<Image
																src={urlFor(item.productImage).width(120).url()}
																alt={item.productName}
																width={60}
																height={60}
																style={{ objectFit: "cover" }}
															/>
														</Box>
													)}
													<Box flex={1}>
														<Typography variant="body2" fontWeight="bold" noWrap>
															{item.productName}
														</Typography>
														<Typography variant="caption" color="text.secondary" noWrap>
															{item.lighterTypeName}
														</Typography>
														<Typography variant="caption" color="text.secondary" display="block">
															{item.quantity} × {formatPrice(item.unitPrice)}
														</Typography>
														<Typography variant="body2" fontWeight="bold" color="primary">
															{formatPrice(item.subtotal)}
														</Typography>
													</Box>
												</Stack>
												<Divider sx={{ mt: 2 }} />
											</Box>
										))}
									</Stack>

									{/* Summary */}
									<Stack spacing={1.5}>
										<Stack direction="row" justifyContent="space-between">
											<Typography variant="body2">Tổng sản phẩm:</Typography>
											<Typography variant="body2" fontWeight="bold">
												{totalItems} cái
											</Typography>
										</Stack>

										<Divider />

										<Stack direction="row" justifyContent="space-between">
											<Typography variant="subtitle1" fontWeight="bold">
												Tổng tiền:
											</Typography>
											<Typography variant="subtitle1" fontWeight="bold" color="primary">
												{formatPrice(totalAmount)}
											</Typography>
										</Stack>

										<Alert severity="info" sx={{ mt: 2 }}>
											<Typography variant="caption">
												Giá đã bao gồm in ấn và VAT (nếu có). Chúng tôi sẽ liên hệ với bạn để xác
												nhận đơn hàng.
											</Typography>
										</Alert>
									</Stack>

									{/* Submit Button */}
									<Button
										type="submit"
										variant="contained"
										color="primary"
										fullWidth
										size="large"
										disabled={isSubmitting}
										startIcon={isSubmitting ? <CircularProgress size={20} /> : <CheckCircleIcon />}
										sx={{ mt: 3, py: 1.5, fontWeight: "bold" }}
									>
										{isSubmitting ? "Đang xử lý..." : "Xác nhận đặt hàng"}
									</Button>
								</CardContent>
							</Card>
						</Grid>
					</Grid>
				</form>
			</Container>
		</Box>
	);
};

LighterCheckout.Layout = MainLayout;

export default LighterCheckout;
