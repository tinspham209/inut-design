import { normalizePhone } from "@/utils/phone";

const ZALO_PROBE_URL = "https://zalo.me/";
const ZALO_MOBILE_USER_AGENT =
	"Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";
const ZALO_REGISTERED_HOST = "zalo.me";
const ZALO_APP_STORE_HOSTS = ["apps.apple.com", "itunes.apple.com"];
const PROBE_TIMEOUT_MS = 10_000;
const PROBE_MAX_RETRIES = 1;
const MAX_REDIRECTS = 5;

function classifyZaloHost(finalUrl: string): boolean | null {
	try {
		const host = new URL(finalUrl).hostname;
		if (host === ZALO_REGISTERED_HOST) {
			return true;
		}
		if (ZALO_APP_STORE_HOSTS.includes(host)) {
			return false;
		}
		return null;
	} catch {
		return null;
	}
}

async function probeOnce(phone: string): Promise<boolean | null> {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);

	try {
		let url = `${ZALO_PROBE_URL}${encodeURIComponent(phone)}`;

		for (let step = 0; step < MAX_REDIRECTS; step += 1) {
			const response = await fetch(url, {
				redirect: "manual",
				signal: controller.signal,
				headers: {
					"User-Agent": ZALO_MOBILE_USER_AGENT,
					Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
					"Accept-Language": "vi-VN,vi;q=0.9,en;q=0.8",
				},
			});

			const location = response.headers.get("location");

			if (!location || response.status < 300 || response.status >= 400) {
				return classifyZaloHost(response.url);
			}

			const nextUrl = new URL(location, url);
			if (nextUrl.protocol !== "http:" && nextUrl.protocol !== "https:") {
				return classifyZaloHost(response.url);
			}

			url = nextUrl.toString();
		}

		return classifyZaloHost(url);
	} catch {
		return null;
	} finally {
		clearTimeout(timeout);
	}
}

export async function checkZaloRegistered(phone: string): Promise<boolean | null> {
	try {
		const normalized = normalizePhone(phone);

		let result: boolean | null = null;
		for (let attempt = 0; attempt <= PROBE_MAX_RETRIES; attempt += 1) {
			result = await probeOnce(normalized);
			if (result !== null) {
				return result;
			}
		}

		return null;
	} catch {
		return null;
	}
}
