import { CartItemLighter, LightersCartStore } from "@/models/cart";
import { trackRemoveFromCart } from "@/utils/analytics";
import {
	calculateCartItemCount,
	calculateCartTotal,
	calculateItemTotal,
	calculateUnitPrice,
} from "@/utils/priceCalculator";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/**
 * Lighters Cart Store
 * Manages shopping cart for lighter products with localStorage persistence
 * Storage key: 'inut-lighters-cart'
 */
const useLightersCart = create<LightersCartStore>()(
	persist(
		(set, get) => ({
			// ==================== State ====================
			items: [],

			// ==================== Computed Values ====================
			// These are computed properties that derive from items
			totalAmount: 0,
			totalItems: 0,

			// ==================== Actions ====================

			/**
			 * Add item to cart or update quantity if already exists
			 * Automatically calculates unitPrice and subtotal based on quantity
			 */
			addItem: (item) => {
				set((state) => {
					const existingItemIndex = state.items.findIndex(
						(i) => i.productId === item.productId && i.lighterTypeId === item.lighterTypeId
					);

					// Calculate price based on quantity
					const unitPrice = calculateUnitPrice(item.priceTiers, item.quantity);
					const subtotal = calculateItemTotal(unitPrice, item.quantity);

					const cartItem: CartItemLighter = {
						...item,
						unitPrice,
						subtotal,
					};

					let newItems: CartItemLighter[];

					if (existingItemIndex >= 0) {
						// Update existing item
						newItems = [...state.items];
						const existingItem = newItems[existingItemIndex];
						const newQuantity = existingItem.quantity + item.quantity;

						// Recalculate price based on new total quantity
						const newUnitPrice = calculateUnitPrice(item.priceTiers, newQuantity);
						const newSubtotal = calculateItemTotal(newUnitPrice, newQuantity);

						newItems[existingItemIndex] = {
							...existingItem,
							quantity: newQuantity,
							unitPrice: newUnitPrice,
							subtotal: newSubtotal,
						};
					} else {
						// Add new item
						newItems = [...state.items, cartItem];
					}

					// Recalculate totals
					const totalAmount = calculateCartTotal(newItems);
					const totalItems = calculateCartItemCount(newItems);

					return { items: newItems, totalAmount, totalItems };
				});
			},

			/**
			 * Remove item from cart
			 */
			removeItem: (productId, lighterTypeId) => {
				set((state) => {
					// Find item to track before removing
					const itemToRemove = state.items.find(
						(item) => item.productId === productId && item.lighterTypeId === lighterTypeId
					);

					// Track remove from cart
					if (itemToRemove) {
						trackRemoveFromCart({
							id: itemToRemove.productId,
							name: itemToRemove.productName,
							category: "Lighters",
							variant: itemToRemove.lighterTypeName,
							price: itemToRemove.unitPrice,
							quantity: itemToRemove.quantity,
						});
					}

					const newItems = state.items.filter(
						(item) => !(item.productId === productId && item.lighterTypeId === lighterTypeId)
					);

					// Recalculate totals
					const totalAmount = calculateCartTotal(newItems);
					const totalItems = calculateCartItemCount(newItems);

					return { items: newItems, totalAmount, totalItems };
				});
			},

			/**
			 * Update quantity of an existing item
			 * Recalculates unitPrice and subtotal based on new quantity
			 */
			updateQuantity: (productId, lighterTypeId, quantity) => {
				if (quantity <= 0) {
					// Remove item if quantity is 0 or negative
					get().removeItem(productId, lighterTypeId);
					return;
				}

				set((state) => {
					const newItems = state.items.map((item) => {
						if (item.productId === productId && item.lighterTypeId === lighterTypeId) {
							// Recalculate price based on new quantity
							const unitPrice = calculateUnitPrice(item.priceTiers, quantity);
							const subtotal = calculateItemTotal(unitPrice, quantity);

							return {
								...item,
								quantity,
								unitPrice,
								subtotal,
							};
						}
						return item;
					});

					// Recalculate totals
					const totalAmount = calculateCartTotal(newItems);
					const totalItems = calculateCartItemCount(newItems);

					return { items: newItems, totalAmount, totalItems };
				});
			},

			/**
			 * Clear all items from cart
			 */
			clearCart: () => {
				set({ items: [], totalAmount: 0, totalItems: 0 });
			},

			/**
			 * Set cart items (useful for hydration from server or external source)
			 */
			setItems: (items) => {
				// Recalculate totals when setting items
				const totalAmount = calculateCartTotal(items);
				const totalItems = calculateCartItemCount(items);
				set({ items, totalAmount, totalItems });
			},
		}),
		{
			name: "inut-lighters-cart", // localStorage key
			storage: createJSONStorage(() => localStorage),
			// Persist items and totals
			partialize: (state) => ({
				items: state.items,
				totalAmount: state.totalAmount,
				totalItems: state.totalItems,
			}),
			// Rehydrate and recalculate totals on load
			onRehydrateStorage: () => (state) => {
				if (state) {
					state.totalAmount = calculateCartTotal(state.items);
					state.totalItems = calculateCartItemCount(state.items);
				}
			},
		}
	)
);

export default useLightersCart;
