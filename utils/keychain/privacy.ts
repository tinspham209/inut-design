import { SITE_URL } from "@/utils/siteUrl";

const KEYCHAIN_PATH = /^\/builder\/keychain(?:\/|$)/;
const SAFE_EVENT_KEYS = new Set(["ring_id", "shape_type", "acrylic_id", "print_sides", "mode", "variant", "scale", "result", "page_title"]);

export function isKeychainPath(path: string) {
	return KEYCHAIN_PATH.test(path.split(/[?#]/, 1)[0]);
}

export function safeKeychainUrl(input: string) {
	try {
		const url = new URL(input, SITE_URL);
		if (url.hostname === "cdn.sanity.io") return "";
		url.search = ""; url.hash = "";
		return /^https?:/.test(input) ? url.toString() : `${url.pathname}${url.search}${url.hash}`;
	} catch { return "/builder/keychain"; }
}

export function sanitizeKeychainProperties(properties: Record<string, unknown>) {
	return Object.fromEntries(Object.entries(properties).filter(([key, value]) =>
		SAFE_EVENT_KEYS.has(key) && (typeof value === "string" || typeof value === "number" || typeof value === "boolean")
	));
}
