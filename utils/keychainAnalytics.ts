import { trackEvent } from "@/utils/analytics";
import { trackUmamiEvent } from "@/utils/umamiAnalytics";

type SafeValue = string | number | boolean;
const ALLOWED = new Set(["ring_id", "shape_type", "acrylic_id", "print_sides", "mode", "variant", "scale", "result"]);
export function trackKeychainAction(name: string, values: Record<string, SafeValue>) {
	const properties = Object.fromEntries(Object.entries(values).filter(([key]) => ALLOWED.has(key)));
	trackEvent(name, properties);
	trackUmamiEvent(name, properties);
}
