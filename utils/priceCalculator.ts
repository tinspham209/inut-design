import { PriceTier } from "@/models/cart";

/**
 * Calculate the unit price based on quantity and price tiers
 * Uses tiered pricing: applies the price of the highest tier that the quantity meets
 *
 * Example:
 * - Tiers: [{ quantity: 1, price: 10000 }, { quantity: 5, price: 9000 }, { quantity: 10, price: 8000 }]
 * - Quantity: 7 → Returns 9000 (5pc tier)
 * - Quantity: 15 → Returns 8000 (10pc tier)
 *
 * @param priceTiers - Array of price tiers sorted by quantity ascending
 * @param quantity - Quantity being purchased
 * @returns Unit price in VND for the given quantity
 */
export function calculateUnitPrice(priceTiers: PriceTier[], quantity: number): number {
	if (!priceTiers || priceTiers.length === 0) {
		console.error("No price tiers provided");
		return 0;
	}

	if (quantity <= 0) {
		console.error("Invalid quantity:", quantity);
		return 0;
	}

	// Sort tiers by quantity descending to find the highest applicable tier
	const sortedTiers = [...priceTiers].sort((a, b) => b.quantity - a.quantity);

	// Find the first tier where quantity >= tier.quantity
	const applicableTier = sortedTiers.find((tier) => quantity >= tier.quantity);

	if (!applicableTier) {
		// Fallback to the lowest tier if quantity is less than minimum
		const lowestTier = [...priceTiers].sort((a, b) => a.quantity - b.quantity)[0];
		console.warn(`Quantity ${quantity} is below minimum tier. Using base price.`);
		return lowestTier?.price || 0;
	}

	return applicableTier.price;
}

/**
 * Calculate subtotal for a cart item
 * @param unitPrice - Price per unit in VND
 * @param quantity - Quantity being purchased
 * @returns Total price (unitPrice × quantity)
 */
export function calculateItemTotal(unitPrice: number, quantity: number): number {
	if (unitPrice < 0 || quantity < 0) {
		console.error("Invalid price or quantity:", { unitPrice, quantity });
		return 0;
	}
	return unitPrice * quantity;
}

/**
 * Calculate the total amount for all items in cart
 * @param items - Array of items with subtotal property
 * @returns Sum of all subtotals
 */
export function calculateCartTotal(items: { subtotal: number }[]): number {
	return items.reduce((total, item) => total + item.subtotal, 0);
}

/**
 * Calculate total number of items in cart
 * @param items - Array of items with quantity property
 * @returns Sum of all quantities
 */
export function calculateCartItemCount(items: { quantity: number }[]): number {
	return items.reduce((count, item) => count + item.quantity, 0);
}

/**
 * Format price in Vietnamese Dong
 * @param price - Price in VND
 * @returns Formatted string (e.g., "10.000₫")
 */
export function formatPrice(price: number): string {
	// Use explicit locale and options to ensure consistent formatting on server and client
	return `${price.toLocaleString("vi-VN", {
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	})}₫`;
}

/**
 * Calculate price breakdown with shipping and discount
 * @param totalAmount - Total amount before adjustments
 * @param shippingFee - Shipping fee (default 0)
 * @param discount - Discount amount (default 0)
 * @returns Object with breakdown and final amount
 */
export function calculatePriceBreakdown(totalAmount: number, shippingFee = 0, discount = 0) {
	const finalAmount = totalAmount + shippingFee - discount;

	return {
		subtotal: totalAmount,
		shippingFee,
		discount,
		finalAmount: Math.max(0, finalAmount), // Ensure non-negative
	};
}

/**
 * Get price tier display text
 * @param tier - Price tier object
 * @returns Display text (e.g., "5pcs - 9,000₫")
 */
export function formatPriceTier(tier: PriceTier): string {
	const unit = tier.quantity === 1 ? "pc" : "pcs";
	return `${tier.quantity}${unit} - ${formatPrice(tier.price)}`;
}

/**
 * Get all price tiers as display options
 * @param priceTiers - Array of price tiers
 * @returns Array of formatted options
 */
export function getPriceTierOptions(priceTiers: PriceTier[]): {
	quantity: number;
	price: number;
	label: string;
}[] {
	return priceTiers
		.sort((a, b) => a.quantity - b.quantity)
		.map((tier) => ({
			quantity: tier.quantity,
			price: tier.price,
			label: formatPriceTier(tier),
		}));
}
