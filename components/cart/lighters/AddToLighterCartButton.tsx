import { LighterProductWithType, LighterType } from "@/models/cart";
import { Button, CircularProgress } from "@mui/material";
import { useState } from "react";
import { useLightersCart } from "@/store";
import toast from "react-hot-toast";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { calculateUnitPrice } from "@/utils/priceCalculator";

export interface AddToLighterCartButtonProps {
	lighter: LighterProductWithType;
	lighterType: LighterType;
	quantity?: number;
	variant?: "contained" | "outlined" | "text";
	fullWidth?: boolean;
	size?: "small" | "medium" | "large";
	onSuccess?: () => void;
}

export function AddToLighterCartButton({
	lighter,
	lighterType,
	quantity = 1,
	variant = "contained",
	fullWidth = false,
	size = "medium",
	onSuccess,
}: AddToLighterCartButtonProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [isAdded, setIsAdded] = useState(false);
	const addItem = useLightersCart((state) => state.addItem);

	const handleAddToCart = async () => {
		try {
			setIsLoading(true);

			// Calculate unit price based on quantity and price tiers
			const priceTiers = lighterType.priceTiers || [];
			const unitPrice = calculateUnitPrice(priceTiers, quantity);

			// Add to cart with calculated unitPrice
			addItem({
				productId: lighter._id,
				productName: lighter.name,
				productImage: lighter.image?.[0],
				productSlug: lighter.slug.current,
				lighterTypeId: lighterType._id,
				lighterTypeName: lighterType.name,
				priceTiers: priceTiers,
				quantity: quantity,
				unitPrice: unitPrice,
			});

			// Show success state
			setIsAdded(true);
			toast.success(`Đã thêm "${lighter.name}" vào giỏ hàng!`);

			// Call success callback
			onSuccess?.();

			// Reset success state after 2 seconds
			setTimeout(() => {
				setIsAdded(false);
			}, 2000);
		} catch (error) {
			console.error("Error adding to cart:", error);
			toast.error("Có lỗi xảy ra. Vui lòng thử lại!");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button
			variant={variant}
			color={isAdded ? "success" : "primary"}
			fullWidth={fullWidth}
			size={size}
			onClick={handleAddToCart}
			disabled={isLoading || isAdded}
			startIcon={
				isLoading ? (
					<CircularProgress size={20} color="inherit" />
				) : isAdded ? (
					<CheckCircleIcon />
				) : (
					<ShoppingCartIcon />
				)
			}
			sx={{
				transition: "all 0.3s ease",
				"&:hover": {
					transform: "translateY(-2px)",
					boxShadow: 3,
				},
			}}
		>
			{isLoading ? "Đang thêm..." : isAdded ? "Đã thêm!" : "Thêm vào giỏ"}
		</Button>
	);
}
