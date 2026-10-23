/* eslint-disable camelcase -- External analytics field names are provider contracts. */
import type {
	CreativaAccepted,
	CreativaPublicOrder,
	CreativaPurchaseEvent,
} from "@/models/creativa";
import { CreativaError } from "./contracts";
import { creativaTrackingAllowed, safeCreativaUrl } from "./analytics";
import { gtag } from "@/utils/analytics";
import { trackUmamiEvent } from "@/utils/umamiAnalytics";

type Destination = "ga4" | "umami";
type Payload = CreativaPurchaseEvent;

export function analyticsPayload(
	order: CreativaPublicOrder,
	transactionId: string,
	destination: Destination,
	eventKey: string
): Payload {
	if (
		eventKey !== "purchase" &&
		!(destination === "umami" && /^purchase_item\.[a-f0-9]{32}$/.test(eventKey))
	) {
		throw new CreativaError("INVALID_ANALYTICS_EVENT", "Sự kiện không hợp lệ.", 400);
	}
	const base = {
		storefront: "creativa",
		currency: "VND",
		order_state: "placed",
		transaction_id: transactionId,
	};
	let payload: Payload;
	if (eventKey === "purchase") {
		payload = {
			event: "purchase",
			transactionId,
			data: {
				...base,
				value: order.merchandiseTotal,
				shipping: order.shippingFee,
				discount: order.discount,
				...(destination === "umami" && {
					merchandise_value: order.merchandiseTotal,
					final_amount: order.finalAmount,
				}),
				item_count: order.lines.length,
				quantity: order.lines.reduce((sum, line) => sum + line.quantity, 0),
			},
			...(destination === "ga4" && {
				items: order.lines.map((line) => ({
					item_id: line.productId,
					item_name: line.productName,
					item_category: line.productType,
					...(line.selection.modelId && { model_id: line.selection.modelId }),
					...(line.selection.coverageId && { coverage_id: line.selection.coverageId }),
					...(line.selection.coverageCode && { item_variant: line.selection.coverageCode }),
					quantity: line.quantity,
					...(line.unitPrice !== undefined && { price: line.unitPrice }),
				})),
			}),
		};
	} else {
		const line = order.lines.find((item) => `purchase_item.${item.lineKey}` === eventKey);
		if (!line)
			throw new CreativaError("INVALID_ANALYTICS_EVENT", "Không tìm thấy dòng sự kiện.", 400);
		payload = {
			event: "purchase_item",
			transactionId,
			data: {
				...base,
				product_type: line.productType,
				product_id: line.productId,
				product_name: line.productName,
				...(line.selection.modelId && { model_id: line.selection.modelId }),
				...(line.selection.coverageId && { coverage_id: line.selection.coverageId }),
				quantity: line.quantity,
				...(line.unitPrice !== undefined && { unit_price: line.unitPrice }),
				...(line.subtotal !== undefined && { subtotal: line.subtotal }),
			},
		};
	}
	// Conservative local budgets; actual hosted collector settings still require deployment verification.
	const values = [
		...Object.values(payload.data || {}),
		...(payload.items || []).flatMap(Object.values),
	];
	if (
		(payload.items?.length || 0) > 200 ||
		Object.keys(payload.data || {}).length > 25 ||
		values.some(
			(value) => typeof value === "string" && value.length > (destination === "ga4" ? 100 : 500)
		) ||
		new TextEncoder().encode(JSON.stringify(payload)).length > 16000
	) {
		throw new CreativaError(
			"ANALYTICS_PAYLOAD_UNREPRESENTABLE",
			"Dữ liệu đo lường vượt giới hạn; đơn hàng vẫn được giữ nguyên.",
			422
		);
	}
	return payload;
}

const dispatched = new Set<string>();

function reserve(transactionId: string, destination: Destination, eventKey: string): boolean {
	const key = `inut-creativa-measurement:${transactionId}:${destination}:${eventKey}`;
	if (dispatched.has(key)) return false;
	dispatched.add(key);
	try {
		if (sessionStorage.getItem(key) === "1") return false;
		sessionStorage.setItem(key, "1");
	} catch {
		console.warn("[Creativa] Session measurement dedup unavailable; using tab memory.");
	}
	return true;
}

export function dispatchCreativaPurchase(result: CreativaAccepted): void {
	if (!creativaTrackingAllowed()) return;
	const transactionId = result.analyticsTransactionId;
	if (
		!transactionId ||
		!/^(?:[a-f0-9]{64}|[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})$/i.test(
			transactionId
		)
	) {
		console.warn("[Creativa] Accepted measurement identity unavailable; order is unchanged.");
		return;
	}
	const order = result.order;
	const failures = new Set<Destination>();
	const send = (destination: Destination, eventKey: string) => {
		try {
			const payload = analyticsPayload(order, transactionId, destination, eventKey);
			if (!reserve(transactionId, destination, eventKey)) return;
			if (destination === "ga4") {
				gtag("event", payload.event, {
					...payload.data,
					items: payload.items,
					page_location: safeCreativaUrl(window.location.href),
					page_referrer: safeCreativaUrl(document.referrer || "/"),
				});
			} else trackUmamiEvent(payload.event, payload.data);
		} catch {
			failures.add(destination);
		}
	};
	if (typeof window.gtag === "function") send("ga4", "purchase");
	if (
		process.env.NEXT_PUBLIC_ENABLE_UMAMI === "true" &&
		typeof window.umami?.track === "function"
	) {
		send("umami", "purchase");
		for (const line of order.lines) send("umami", `purchase_item.${line.lineKey}`);
	}
	if (failures.size)
		console.warn("[Creativa] Measurement delivery incomplete; accepted order is unchanged.", {
			destinations: [...failures],
		});
}
