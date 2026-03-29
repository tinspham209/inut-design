"use client";

import { urlFor, uploadImageToSanity } from "@/api-client/sanity-client";
import { MainLayout } from "@/components/layout";
import { useCreateLighterOrder } from "@/hooks";
import { CreateOrderLighterInput } from "@/models/cart";
import { NextPageWithLayout } from "@/models/common";
import { useLightersCart } from "@/store";
import { trackAbandonedCheckout, trackBeginCheckout, trackPurchase } from "@/utils/analytics";
import { formatPrice } from "@/utils/priceCalculator";
import {
	Alert,
	Box,
	Button,
	Card,
	CardContent,
	CircularProgress,
	Container,
	Divider,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";

import { useTelegramNotification } from "@/hooks/useTelegramNotification";
import { useShippingFees } from "@/hooks/useShippingFees";
import { detectShippingFee } from "@/utils/shippingDetection";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { debounce } from "lodash";

type CheckoutFormData = {
	customerName: string;
	customerPhone: string;
	customerEmail?: string;
	deliveryAddress?: string;
	notes?: string;
	paymentMethod: "cod" | "bank_transfer";
	selectedFeeId?: string;
};

const LighterCheckout: NextPageWithLayout = () => {
	const router = useRouter();
	const { items, totalItems, totalAmount, clearCart } = useLightersCart();
	const { trigger: createOrder, isMutating } = useCreateLighterOrder();
	const [isOrderComplete, setIsOrderComplete] = useState(false);
	const [mounted, setMounted] = useState(false);
	const { sendNotification } = useTelegramNotification();
	const {
		control,
		handleSubmit,
		watch,
		setValue,
		formState: { errors },
	} = useForm<CheckoutFormData>({
		defaultValues: {
			customerName: "",
			customerPhone: "",
			customerEmail: "",
			deliveryAddress: "",
			notes: "",
			paymentMethod: "cod",
			selectedFeeId: "",
		},
	});

	// Shipping fees state
	const { fees, loading: feesLoading } = useShippingFees(true);
	const deliveryAddress = watch("deliveryAddress");
	const selectedFeeId = watch("selectedFeeId");

	// Derive selected fee from form value
	const selectedFee = useMemo(
		() => fees.find((f) => f._id === selectedFeeId) || null,
		[fees, selectedFeeId]
	);

	// Handle hydration - set mounted flag
	useEffect(() => {
		setMounted(true);
	}, []);

	// Memoized debounced detection function
	const detectAndSetFee = useMemo(
		() =>
			debounce((address: string, feesList: typeof fees) => {
				if (!feesList.length) return;

				const getFallback = () =>
					feesList.find((f) => f.slug === "toan-quoc") || feesList[0] || null;

				if (!address) {
					const fallback = getFallback();
					setValue("selectedFeeId", fallback?._id || "");
					return;
				}

				const detected = detectShippingFee(address, feesList);
				if (detected) {
					setValue("selectedFeeId", detected._id);
				}
			}, 300),
		[setValue]
	);

	// Initialize and detect shipping fee based on address (client-side only)
	useEffect(() => {
		if (!mounted || !fees.length) return;

		const getFallback = () => fees.find((f) => f.slug === "toan-quoc") || fees[0] || null;

		// Initialize with fallback if no fee selected yet
		if (!selectedFeeId) {
			const fallback = getFallback();
			setValue("selectedFeeId", fallback?._id || "");
			return;
		}

		// Trigger debounced detection
		detectAndSetFee(deliveryAddress || "", fees);

		return () => {
			detectAndSetFee.cancel();
		};
	}, [mounted, deliveryAddress, fees, selectedFeeId, setValue, detectAndSetFee]);

	// Refs for abandoned checkout tracking
	const hasSubmittedRef = useRef(false);
	const hasFiredAbandonedRef = useRef(false);

	// Track begin checkout on mount
	useEffect(() => {
		if (items.length > 0) {
			trackBeginCheckout(
				items.map((item) => ({
					id: item.productId,
					name: item.productName,
					category: "Lighters",
					variant: item.lighterTypeName,
					price: item.unitPrice,
					quantity: item.quantity,
				})),
				totalAmount
			);
		}
	}, [items, totalAmount]);

	// Track abandoned checkout when user leaves without submitting
	useEffect(() => {
		const shouldTrack = () => {
			const customerPhone = watch("customerPhone");
			const isPhoneValid = /^[0-9]{10}$/.test(customerPhone || "");

			return (
				isPhoneValid &&
				!hasSubmittedRef.current &&
				!hasFiredAbandonedRef.current &&
				items.length > 0 &&
				!isOrderComplete
			);
		};

		const fireAbandoned = () => {
			if (!shouldTrack()) return;
			hasFiredAbandonedRef.current = true;

			const customerPhone = watch("customerPhone");
			const deliveryAddress = watch("deliveryAddress");

			trackAbandonedCheckout(
				customerPhone,
				items.map((item) => ({
					id: item.productId,
					name: item.productName,
					category: "Lighters",
					variant: item.lighterTypeName,
					price: item.unitPrice,
					quantity: item.quantity,
				})),
				deliveryAddress
			);
		};

		const handleBeforeUnload = () => fireAbandoned();
		const handleRouteChange = () => fireAbandoned();

		window.addEventListener("beforeunload", handleBeforeUnload);
		router.events.on("routeChangeStart", handleRouteChange);

		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
			router.events.off("routeChangeStart", handleRouteChange);
		};
	}, [watch, items, isOrderComplete, router.events]);

	// Calculate shipping fee and totals for display (memoized)
	const shippingFeeValue = useMemo(() => selectedFee?.fee || 0, [selectedFee]);
	const discountValue = 0; // Placeholder for future discounts
	const finalAmountDisplay = useMemo(
		() => totalAmount + shippingFeeValue - discountValue,
		[totalAmount, shippingFeeValue, discountValue]
	);

	const onSubmit = async (data: CheckoutFormData) => {
		try {
			// Prepare order items for Sanity (convert to reference format)
			const orderItems = await Promise.all(
				items.map(async (item, index) => {
					let designImage = undefined;

					// Upload design image to Sanity if available
					if (item.designImage) {
						try {
							// Fetch the image from the URL and convert to Blob
							const response = await fetch(item.designImage);
							const blob = await response.blob();
							// Upload to Sanity
							designImage = await uploadImageToSanity(blob);
						} catch (error) {
							console.error("Error uploading design image:", error);
							// Continue without design image if upload fails
						}
					}

					return {
						_key: `${item.productId}-${item.lighterTypeId}-${Date.now()}-${index}`, // Unique key for each item
						product: {
							_ref: item.productId,
							_type: "reference" as const,
						},
						productName: item.productName,
						lighterType: {
							_ref: item.lighterTypeId,
							_type: "reference" as const,
						},
						lighterTypeName: item.lighterTypeName,
						quantity: item.quantity,
						unitPrice: item.unitPrice,
						subtotal: item.subtotal,
						designImage,
					};
				})
			);

			// Calculate final amount with shipping fee & discount
			const shippingFee = selectedFee?.fee || 0;
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

			// Submit order to Sanity using SWR mutation
			const createdOrder = await createOrder(orderInput);

			await sendNotification({
				orderNumber: createdOrder.orderNumber,
				orderData: createdOrder,
				orderId: createdOrder._id,
			});

			// Track purchase conversion
			trackPurchase(
				createdOrder.orderNumber,
				items.map((item) => ({
					id: item.productId,
					name: item.productName,
					category: "Lighters",
					variant: item.lighterTypeName,
					price: item.unitPrice,
					quantity: item.quantity,
				})),
				finalAmount
			);

			// Mark order as complete BEFORE clearing cart to prevent redirect
			setIsOrderComplete(true);

			// Clear cart
			clearCart();
			// Show success message
			toast.success("Đặt hàng thành công!");

			// Redirect to order tracking page with order number and justOrdered param
			router.push(`/order-tracking/lighters/${createdOrder.orderNumber}?justOrdered=1`);
		} catch (error) {
			console.error("Error creating order:", error);
			toast.error("Có lỗi xảy ra. Vui lòng thử lại!");
		}
	};

	// Show empty state if cart is empty and not in order complete state
	if (items.length === 0 && !isOrderComplete) {
		return (
			<Box
				component="section"
				bgcolor="secondary.dark"
				minHeight="100vh"
				py={4}
				display="flex"
				alignItems="center"
				justifyContent="center"
			>
				<Container maxWidth="sm">
					<Card sx={{ textAlign: "center", py: 6, px: 2 }}>
						<CardContent>
							<Typography variant="h4" fontWeight="bold" gutterBottom>
								Giỏ hàng của bạn đang trống
							</Typography>
							<Typography variant="body1" color="text.secondary" mb={3}>
								Vui lòng chọn sản phẩm để đặt hàng.
							</Typography>
							<Button
								variant="contained"
								color="primary"
								size="large"
								onClick={() => router.push("/san-pham/lighters")}
							>
								Quay lại trang sản phẩm
							</Button>
						</CardContent>
					</Card>
				</Container>
			</Box>
		);
	}

	return (
		<Box component="section" bgcolor="secondary.dark" minHeight="100vh" py={4}>
			<Container maxWidth="lg">
				{/* Header */}
				<Box mb={2}>
					<Button
						startIcon={<ArrowBackIcon />}
						onClick={() => router.back()}
						variant="outlined"
						sx={{ mb: 1 }}
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
														id="name"
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
														id="phoneNumber"
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
														id="email"
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
														id="address"
														label="Địa chỉ"
														fullWidth
														multiline
														rows={2}
														placeholder="Số nhà, tên đường, phường, quận, thành phố..."
														helperText={errors.deliveryAddress?.message || ""}
													/>
												)}
											/>

											{/* Shipping fee detection info */}
											{mounted && (
												<>
													{feesLoading ? (
														<Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
															Đang tải phí vận chuyển...
														</Typography>
													) : deliveryAddress ? (
														selectedFee && (
															<Alert severity="info" sx={{ mt: 2 }}>
																<Typography variant="body2" fontWeight="bold">
																	Phí vận chuyển: {formatPrice(selectedFee.fee)}
																</Typography>
																<Typography variant="caption" color="text.secondary">
																	{selectedFee.name}
																	{selectedFee.note && ` - ${selectedFee.note}`}
																</Typography>
															</Alert>
														)
													) : (
														<Alert severity="warning" sx={{ mt: 2 }}>
															<Typography variant="caption">
																Nhập địa chỉ chính xác để hiển thị chi phí vận chuyển...
															</Typography>
														</Alert>
													)}
													<Alert severity="info" sx={{ mt: 2 }}>
														<Typography variant="caption">
															Nhập địa chỉ cũ trước sáp nhập để chúng tôi vận chuyển chính xác hơn
														</Typography>
													</Alert>
												</>
											)}
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
													{/* Show design image if available, otherwise show product image */}
													{item.designImage ? (
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
																src={item.designImage}
																alt={item.productName}
																width={60}
																height={60}
																style={{ objectFit: "cover" }}
															/>
														</Box>
													) : (
														item.productImage && (
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
														)
													)}
													<Box flex={1}>
														<Typography variant="body2" fontWeight="bold" noWrap>
															{item.productName}
														</Typography>
														<Typography variant="caption" color="text.secondary" noWrap>
															{item.lighterTypeName}
														</Typography>
														{item.designImage && (
															<Typography variant="caption" color="#FF4D00" display="block">
																🎨 Thiết kế theo yêu cầu
															</Typography>
														)}
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
											<Typography variant="body2">Tạm tính:</Typography>
											<Typography variant="body2" fontWeight="bold">
												{formatPrice(totalAmount)}
											</Typography>
										</Stack>

										<Stack direction="row" justifyContent="space-between">
											<Typography variant="body2">Phí vận chuyển:</Typography>
											<Typography variant="body2" fontWeight="bold">
												{formatPrice(shippingFeeValue)}
											</Typography>
										</Stack>

										<Divider />

										<Stack direction="row" justifyContent="space-between">
											<Typography variant="subtitle1" fontWeight="bold">
												Thành tiền:
											</Typography>
											<Typography variant="subtitle1" fontWeight="bold" color="primary">
												{formatPrice(finalAmountDisplay)}
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
										disabled={isMutating}
										startIcon={isMutating ? <CircularProgress size={20} /> : <CheckCircleIcon />}
										sx={{ mt: 3, py: 1.5, fontWeight: "bold" }}
									>
										{isMutating ? "Đang xử lý..." : "Xác nhận đặt hàng"}
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
