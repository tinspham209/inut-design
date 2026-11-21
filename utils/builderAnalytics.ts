import type { BuilderId } from "@/data/builders";
import { trackEvent } from "@/utils/analytics";
import { trackUmamiEvent } from "@/utils/umamiAnalytics";

export type BuilderPromotionPlacement = "home_hero" | "home_feature" | "builder_index";
export type BuilderPromotionAction = "view" | "click";
export type BuilderPromotionEventName = "builder_promotion_view" | "builder_promotion_click";
export type BuilderPromotionId = BuilderId | "overview";

export interface BuilderPromotionProperties {
	builder_id: BuilderPromotionId;
	placement: BuilderPromotionPlacement;
	action: BuilderPromotionAction;
}

const ALLOWED_PROPERTIES = ["builder_id", "placement", "action"] as const;
const ALLOWED_IDS = ["keychain", "lighter", "overview"] as const;
const ALLOWED_PLACEMENTS = ["home_hero", "home_feature", "builder_index"] as const;
const ALLOWED_ACTIONS = ["view", "click"] as const;

function isAllowedEvent(
	eventName: unknown,
	properties: unknown
): properties is BuilderPromotionProperties {
	if (eventName !== "builder_promotion_view" && eventName !== "builder_promotion_click") return false;
	if (!properties || typeof properties !== "object" || Array.isArray(properties)) return false;

	const input = properties as Record<string, unknown>;
	if (Object.keys(input).length !== ALLOWED_PROPERTIES.length) return false;
	if (!Object.keys(input).every((key) => ALLOWED_PROPERTIES.includes(key as (typeof ALLOWED_PROPERTIES)[number]))) {
		return false;
	}
	if (!ALLOWED_IDS.includes(input.builder_id as BuilderPromotionId)) return false;
	if (!ALLOWED_PLACEMENTS.includes(input.placement as BuilderPromotionPlacement)) return false;
	if (!ALLOWED_ACTIONS.includes(input.action as BuilderPromotionAction)) return false;

	const expectedAction = eventName === "builder_promotion_view" ? "view" : "click";
	if (input.action !== expectedAction) return false;
	if (input.builder_id === "overview") {
		return eventName === "builder_promotion_click" && input.placement === "home_hero";
	}
	return input.placement !== "home_hero";
}

/** Dispatch only fixed Builder promotion identifiers through existing providers. */
export function trackBuilderPromotionEvent(
	eventName: BuilderPromotionEventName,
	properties: BuilderPromotionProperties
): boolean {
	if (!isAllowedEvent(eventName, properties)) return false;

	// Rebuild the object so a caller cannot smuggle additional values into either provider.
	const payload: BuilderPromotionProperties = {
		builder_id: properties.builder_id,
		placement: properties.placement,
		action: properties.action,
	};

	if (typeof window === "undefined") return false;

	if (typeof window.gtag === "function") {
		try {
			trackEvent(eventName, payload);
		} catch {
			console.error("[Builder analytics] GA4/GTM provider failed.");
		}
	}

	if (typeof window.umami?.track === "function") {
		try {
			trackUmamiEvent(eventName, payload);
		} catch {
			console.error("[Builder analytics] Umami provider failed.");
		}
	}

	return true;
}
