import { ShippingFee } from "@/models/shippingFee";

function normalizeAddress(str: string) {
	return str
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "") // remove diacritics
		.replace(/đ/g, "d")
		.trim();
}

export function detectShippingFee(address: string, fees: ShippingFee[]): ShippingFee | undefined {
	if (!address) return undefined;
	const norm = normalizeAddress(address);
	const isDaNang = /(\b|\s)da\s*nang(\b|\s)/.test(norm) || norm.includes("danang");
	if (isDaNang) return fees.find((f) => f.slug === "da-nang");
	// Fallback preference order
	return fees.find((f) => f.slug === "toan-quoc") || fees[0];
}

export function formatShippingFee(fee?: number) {
	if (fee == null) return "—";
	return fee.toLocaleString("vi-VN") + "₫";
}
