import { urlFor } from "@/api-client/sanity-client";
import { useLightersCart } from "@/store";
import { trackRemoveFromCart } from "@/utils/analytics";
import { formatPrice } from "@/utils/priceCalculator";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
	Box,
	Button,
	Divider,
	IconButton,
	Stack,
	TextField,
	Typography,
	alpha,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";

export interface LighterCartContentProps {
	onActionComplete?: () => void;
	showTitle?: boolean;
}

export function LighterCartContent({
	onActionComplete,
	showTitle = false,
}: LighterCartContentProps) {
	const router = useRouter();
	const { items, totalItems, totalAmount, updateQuantity, removeItem, clearCart } =
		useLightersCart();

	const handleCheckout = () => {
		onActionComplete?.();
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
		<Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
			{showTitle && (
				<Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
					<Typography variant="h5" fontWeight="bold">
						Giỏ hàng Bật lửa
					</Typography>
				</Box>
			)}

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
									{/* Show design image if available, otherwise fall back to product image */}
									{item.designImage ? (
										<Box
											sx={{
												width: 80,
												height: 80,
												flexShrink: 0,
												borderRadius: 1,
												overflow: "hidden",
												border: 2,
												borderColor: "primary.main",
											}}
										>
											{/* eslint-disable-next-line @next/next/no-img-element */}
											<img
												src={item.designImage}
												alt="Thiết kế"
												width={80}
												height={80}
												style={{ width: "100%", height: "100%", objectFit: "cover" }}
											/>
										</Box>
									) : (
										item.productImage && (
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
										)
									)}

									{/* Product Info */}
									<Box sx={{ flex: 1, minWidth: 0 }}>
										<Typography variant="subtitle2" fontWeight="bold" noWrap sx={{ mb: 0.5 }}>
											{item.productName}
										</Typography>
										<Typography variant="caption" color="text.secondary" noWrap>
											Loại: {item.lighterTypeName}
										</Typography>
										{item.designImage && (
											<Typography variant="caption" color="primary" display="block">
												🎨 Thiết kế theo yêu cầu
											</Typography>
										)}
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
	);
}
