const VIETNAMESE_MOBILE_PATTERN = /^0(3|5|7|8|9)\d{8}$/;

export function normalizePhone(input: string): string {
	const cleaned = (input || "").replace(/[\s\-()]/g, "");
	if (cleaned.startsWith("+84")) {
		return `0${cleaned.slice(3)}`;
	}
	return cleaned;
}

export function isValidVietnamesePhone(input: string): boolean {
	return VIETNAMESE_MOBILE_PATTERN.test(normalizePhone(input));
}
