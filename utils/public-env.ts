const DEFAULT_UMAMI_HOST_URL = "https://cloud.umami.is";

export function isExplicitlyEnabled(value: string | undefined, fallback = false): boolean {
	if (value === undefined || value === "") return fallback;
	return value.toLowerCase() === "true";
}

export function isExplicitlyDisabled(value: string | undefined, fallback = true): boolean {
	if (value === undefined || value === "") return fallback;
	return value.toLowerCase() !== "false";
}

export function getUmamiRuntimeConfig(
	enabledValue: string | undefined,
	websiteIdValue: string | undefined,
	hostUrlValue: string | undefined,
) {
	const enabled = isExplicitlyEnabled(enabledValue);
	const websiteId = websiteIdValue?.trim() || null;
	const hostUrl = (hostUrlValue?.trim() || DEFAULT_UMAMI_HOST_URL).replace(/\/+$/, "");
	return {
		enabled,
		websiteId,
		hostUrl,
		configured: enabled && Boolean(websiteId),
		scriptUrl: `${hostUrl}/script.js`,
	};
}
