import { useRouter } from "next/router";
import { useMemo } from "react";
import { useLightersCart } from "@/store";
import { getCategoryFromRoute, getCartConfigByRoute } from "@/utils/cart-routing";
import { LightersCartStore, ProductCategory } from "@/models/cart";

/**
 * Hook to get the current cart based on the active route
 * Returns the appropriate cart store for the current page
 *
 * Usage:
 * ```tsx
 * const cart = useCurrentCart();
 * const itemCount = cart?.totalItems || 0;
 * ```
 */
export function useCurrentCart(): LightersCartStore | null {
	const router = useRouter();
	const lightersCart = useLightersCart();

	const cart = useMemo(() => {
		const category = getCategoryFromRoute(router.pathname);

		switch (category) {
			case "lighters":
				return lightersCart;
			// Add more cases when other carts are implemented
			// case "skinLaptop":
			//   return skinLaptopCart;
			// case "macnut":
			//   return macnutCart;
			default:
				return null;
		}
	}, [router.pathname, lightersCart]);

	return cart;
}

/**
 * Hook to get the current product category from the route
 *
 * Usage:
 * ```tsx
 * const category = useCurrentCategory();
 * // Returns: "lighters" | "skinLaptop" | "macnut" | "stickers" | null
 * ```
 */
export function useCurrentCategory(): ProductCategory | null {
	const router = useRouter();
	return useMemo(() => getCategoryFromRoute(router.pathname), [router.pathname]);
}

/**
 * Hook to get complete cart configuration for current route
 *
 * Usage:
 * ```tsx
 * const config = useCartConfig();
 * if (config) {
 *   console.log(config.category); // "lighters"
 *   console.log(config.checkoutPath); // "/checkout/lighters"
 * }
 * ```
 */
export function useCartConfig() {
	const router = useRouter();
	return useMemo(() => getCartConfigByRoute(router.pathname), [router.pathname]);
}

/**
 * Hook to check if current route has cart support
 *
 * Usage:
 * ```tsx
 * const hasCart = useHasCartSupport();
 * // Returns true if current route has a dedicated cart
 * ```
 */
export function useHasCartSupport(): boolean {
	const config = useCartConfig();
	return config !== null;
}
