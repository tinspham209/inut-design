export const DEFAULT_SITE_URL = "https://inutdesign.com";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(
	/\/+$/,
	"",
);

export function resolveSiteUrl(input: string): string {
	if (!input) return input;
	try {
		const url = new URL(input, SITE_URL);
		const defaultOrigin = new URL(DEFAULT_SITE_URL).origin;
		if (url.origin === defaultOrigin || url.origin === new URL(SITE_URL).origin) {
			return `${SITE_URL}${url.pathname}${url.search}${url.hash}`;
		}
		return input;
	} catch {
		return input;
	}
}
