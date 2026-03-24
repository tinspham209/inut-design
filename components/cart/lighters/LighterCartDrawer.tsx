import { urlFor } from "@/api-client/sanity-client";
import { useLightersCart } from "@/store";
import { trackBeginCheckout, trackRemoveFromCart } from "@/utils/analytics";
import { formatPrice } from "@/utils/priceCalculator";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
	Box,
	Button,
	Divider,
	Drawer,
	IconButton,
	Stack,
	TextField,
	Typography,
	alpha,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";

export interface LighterCartDrawerProps {
	isOpen: boolean;
	onClose: () => void;
}

export function LighterCartDrawer({ isOpen, onClose }: LighterCartDrawerProps) {
	const router = useRouter();
	const { items, totalItems, totalAmount, updateQuantity, removeItem, clearCart } =
		useLightersCart();

	const handleCheckout = () => {
		// Track analytics
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

		onClose();
		router.push("/checkout/lighters");
	};

	const handleRemoveItem = (productId: string, lighterTypeId: string) => {
		const item = items.find((i) => i.productId === productId && i.lighterTypeId === lighterTypeId);
		if (item) {
			trackRemoveFromCart({
				id: item.productId,
				name: item.productName,
				category: "Lighters",
				variant: item.lighterTypeName,
				price: item.unitPrice,
				quantity: item.quantity,
			});
		}
		removeItem(productId, lighterTypeId);
	};

	const handleQuantityChange = (productId: string, lighterTypeId: string, newQuantity: number) => {
		if (newQuantity > 0 && newQuantity <= 9999) {
			updateQuantity(productId, lighterTypeId, newQuantity);
		}
	};

	return (
		<Drawer
			anchor="right"
			open={isOpen}
			onClose={onClose}
			sx={{
				"& .MuiDrawer-paper": {
					width: {
						xs: "100%",
						sm: "400px",
						md: "450px",
					},
					maxWidth: "100%",
				},
			}}
		>
			<Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
				{/* Header */}
				<Box
					sx={{
						p: 2,
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						borderBottom: 1,
						borderColor: "divider",
						backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.05),
					}}
				>
					<Stack direction="row" spacing={1} alignItems="center">
						<ShoppingCartIcon color="primary" />
						<Typography variant="h6" fontWeight="bold">
							Giỏ hàng Bật lửa ({totalItems})
						</Typography>
					</Stack>
					<IconButton onClick={onClose} size="small">
						<CloseIcon />
					</IconButton>
				</Box>

				{/* Cart Items */}
				<Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
					{items.length === 0 ? (
						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								justifyContent: "center",
								height: "100%",
								py: 4,
							}}
						>
							<ShoppingCartIcon sx={{ fontSize: 80, color: "text.disabled", mb: 2 }} />
							<Typography variant="h6" color="text.secondary" gutterBottom>
								Giỏ hàng trống
							</Typography>
							<Typography variant="body2" color="text.disabled" textAlign="center">
								Thêm lighters vào giỏ hàng để bắt đầu mua sắm
							</Typography>
						</Box>
					) : (
						<Stack spacing={2}>
							{items.map((item) => (
								<Box
									key={`${item.productId}-${item.lighterTypeId}`}
									sx={{
										p: 2,
										border: 1,
										borderColor: "divider",
										borderRadius: 2,
										"&:hover": {
											backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.02),
										},
									}}
								>
									<Stack direction="row" spacing={2}>
										{/* Product Image */}
										{item.productImage && (
											<Box
												sx={{
													width: 80,
													height: 80,
													flexShrink: 0,
													borderRadius: 1,
													overflow: "hidden",
													border: 1,
													borderColor: "divider",
												}}
											>
												<Image
													src={urlFor(item.productImage).width(200).url()}
													alt={item.productName}
													width={80}
													height={80}
													style={{ objectFit: "cover" }}
												/>
											</Box>
										)}

										{/* Product Info */}
										<Box sx={{ flex: 1, minWidth: 0 }}>
											<Typography variant="subtitle2" fontWeight="bold" noWrap sx={{ mb: 0.5 }}>
												{item.productName}
											</Typography>
											<Typography variant="caption" color="text.secondary" noWrap>
												Loại: {item.lighterTypeName}
											</Typography>
											<Typography variant="caption" color="primary" display="block">
												{formatPrice(item.unitPrice)}/cái
											</Typography>

											{/* Quantity Controls */}
											<Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
												<IconButton
													size="small"
													onClick={() =>
														handleQuantityChange(
															item.productId,
															item.lighterTypeId,
															item.quantity - 1
														)
													}
													disabled={item.quantity <= 1}
													sx={{
														border: 1,
														borderColor: "divider",
													}}
												>
													<RemoveIcon fontSize="small" />
												</IconButton>

												<TextField
													size="small"
													type="number"
													value={item.quantity}
													onChange={(e) => {
														const value = parseInt(e.target.value);
														if (!isNaN(value)) {
															handleQuantityChange(item.productId, item.lighterTypeId, value);
														}
													}}
													inputProps={{
														min: 1,
														max: 9999,
														style: { textAlign: "center" },
													}}
													sx={{
														width: 70,
														"& input": {
															py: 0.5,
														},
													}}
												/>

												<IconButton
													size="small"
													onClick={() =>
														handleQuantityChange(
															item.productId,
															item.lighterTypeId,
															item.quantity + 1
														)
													}
													disabled={item.quantity >= 9999}
													sx={{
														border: 1,
														borderColor: "divider",
													}}
												>
													<AddIcon fontSize="small" />
												</IconButton>

												<IconButton
													size="small"
													onClick={() => handleRemoveItem(item.productId, item.lighterTypeId)}
													color="error"
													sx={{ ml: "auto !important" }}
												>
													<DeleteIcon fontSize="small" />
												</IconButton>
											</Stack>
										</Box>
									</Stack>

									{/* Price Info */}
									<Box sx={{ mt: 1, pt: 1, borderTop: 1, borderColor: "divider" }}>
										<Stack direction="row" justifyContent="space-between" alignItems="center">
											<Typography variant="caption" color="text.secondary">
												Số lượng: {item.quantity}
											</Typography>
											<Typography variant="body2" fontWeight="bold" color="primary">
												{formatPrice(item.subtotal)}
											</Typography>
										</Stack>
									</Box>
								</Box>
							))}

							{/* Clear Cart Button */}
							<Button
								variant="text"
								color="error"
								size="small"
								startIcon={<DeleteIcon />}
								onClick={clearCart}
								sx={{ alignSelf: "flex-start" }}
							>
								Xóa tất cả
							</Button>
						</Stack>
					)}
				</Box>

				{/* Footer */}
				{items.length > 0 && (
					<Box
						sx={{
							p: 2,
							borderTop: 1,
							borderColor: "divider",
							backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.05),
						}}
					>
						<Stack spacing={2}>
							{/* Totals */}
							<Box>
								<Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
									<Typography variant="body2">Tổng sản phẩm:</Typography>
									<Typography variant="body2" fontWeight="bold">
										{totalItems} cái
									</Typography>
								</Stack>
								<Divider sx={{ my: 1 }} />
								<Stack direction="row" justifyContent="space-between">
									<Typography variant="subtitle1" fontWeight="bold">
										Tạm tính:
									</Typography>
									<Typography variant="subtitle1" fontWeight="bold" color="primary">
										{formatPrice(totalAmount)}
									</Typography>
								</Stack>
								<Typography
									variant="caption"
									color="text.secondary"
									sx={{ mt: 0.5, display: "block" }}
								>
									* Giá đã bao gồm in ấn và VAT (nếu có)
								</Typography>
							</Box>

							{/* Checkout Button */}
							<Button
								variant="contained"
								color="primary"
								size="large"
								fullWidth
								endIcon={<ArrowForwardIcon />}
								onClick={handleCheckout}
								sx={{
									py: 1.5,
									fontWeight: "bold",
									borderRadius: 2,
									boxShadow: 3,
								}}
							>
								Thanh toán ngay
							</Button>
						</Stack>
					</Box>
				)}
			</Box>
		</Drawer>
	);
}
