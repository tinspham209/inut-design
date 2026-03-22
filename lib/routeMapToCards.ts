import { ROUTE_LIST, RouteItem } from "@/components/common/header/routes";
import { ServiceCardProps } from "@/components/common/ServiceCard";

/**
 * Finds a specific route node by its path in the hierarchical ROUTE_LIST.
 */
export const findRouteByPath = (
	path: string,
	routes: RouteItem[] = ROUTE_LIST
): RouteItem | undefined => {
	// Remove trailing slash for consistent comparison
	const normalizedSearchPath = path.replace(/\/$/, "");

	for (const route of routes) {
		const normalizedRoutePath = route.path.replace(/\/$/, "");

		if (normalizedRoutePath === normalizedSearchPath) {
			return route;
		}

		if (route.children) {
			const found = findRouteByPath(normalizedSearchPath, route.children);
			if (found) return found;
		}
	}
	return undefined;
};

/**
 * Resolves an icon name to a Material UI icon name string.
 * This can be extended to return actual React elements or custom SVGs.
 */
export const resolveIcon = (iconName?: string): string => {
	const defaultIcon = "settings"; // Fallback icon
	if (!iconName) return defaultIcon;

	// This is a simple resolver that assumes the iconName matches a Material Icon name.
	// You can add mapping here if needed.
	return iconName;
};

/**
 * Maps child routes of a given path to ServiceCard properties.
 */
export const mapChildRoutesToCards = (parentPath: string): ServiceCardProps[] => {
	const parentRoute = findRouteByPath(parentPath);

	if (!parentRoute || !parentRoute.children) {
		return [];
	}

	return parentRoute.children.map((child) => ({
		title: child.label,
		description:
			child.meta?.description || "Khám phá các giải pháp in ấn chuyên nghiệp tại INUT Design.",
		icon: resolveIcon(child.meta?.icon),
		href: child.path,
		badge: child.meta?.badge || null,
		image: child.meta?.image || null,
	}));
};
