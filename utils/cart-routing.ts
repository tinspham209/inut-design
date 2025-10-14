import { CartRouteConfig, ProductCategory } from "@/models/cart";

/**
 * Route-to-Cart mapping configuration
 * Maps URL patterns to their corresponding product categories and order types
 */
export const CART_ROUTES: CartRouteConfig[] = [
	{
		routePattern: /^\/lighters/,
		category: "lighters",
		orderType: "ordersLighter",
		orderPrefix: "LIGHT",
		checkoutPath: "/checkout/lighters",
	},
	{
		routePattern: /^\/products/,
		category: "skinLaptop",
		orderType: "ordersSkinLaptop",
		orderPrefix: "SKIN",
		checkoutPath: "/checkout/skin-laptop",
	},
	{
		routePattern: /^\/macnut/,
		category: "macnut",
		orderType: "ordersMacnut",
		orderPrefix: "MAC",
		checkoutPath: "/checkout/macnut",
	},
	{
		routePattern: /^\/stickers/,
		category: "stickers",
		orderType: "ordersSticker",
		orderPrefix: "STICK",
		checkoutPath: "/checkout/stickers",
	},
];

/**
 * Determine which cart to use based on the current route
 * @param pathname - Current route pathname (e.g., "/lighters", "/products")
 * @returns Cart configuration for the current route, or null if no match
 */
export function getCartConfigByRoute(pathname: string): CartRouteConfig | null {
	for (const config of CART_ROUTES) {
		if (config.routePattern.test(pathname)) {
			return config;
		}
	}
	return null;
}

/**
 * Get product category from pathname
 * @param pathname - Current route pathname
 * @returns Product category or null
 */
export function getCategoryFromRoute(pathname: string): ProductCategory | null {
	const config = getCartConfigByRoute(pathname);
	return config?.category || null;
}

/**
 * Get checkout path for current route
 * @param pathname - Current route pathname
 * @returns Checkout path or default checkout
 */
export function getCheckoutPath(pathname: string): string {
	const config = getCartConfigByRoute(pathname);
	return config?.checkoutPath || "/checkout";
}

/**
 * Check if a route has a dedicated cart
 * @param pathname - Route pathname to check
 * @returns True if route has a cart configuration
 */
export function hasCartSupport(pathname: string): boolean {
	return getCartConfigByRoute(pathname) !== null;
}

/**
 * Get all available cart categories
 * @returns Array of all product categories with cart support
 */
export function getAllCartCategories(): ProductCategory[] {
	return CART_ROUTES.map((config) => config.category);
}
