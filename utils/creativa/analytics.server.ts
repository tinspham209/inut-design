/* eslint-disable camelcase -- External analytics field names are provider contracts. */
import type { CreativaAnalyticsClaim } from "@/models/creativa";
import { creativaServerClient } from "@/api-client/creativa-server";
import { CreativaError, isRecord } from "./contracts";
import { acceptedOrderForCapability } from "./orders.server";
import { conflict, sha256, StoredOrder } from "./records.server";

type Destination = "ga4" | "umami";
type Payload = Omit<CreativaAnalyticsClaim, "claimed">;

export function analyticsPayload(
	order: StoredOrder,
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
		transaction_id: order.analyticsId,
	};
	let payload: Payload;
	if (eventKey === "purchase") {
		payload = {
			event: "purchase",
			transactionId: order.analyticsId,
			data: {
				...base,
				value: order.merchandiseTotal,
				shipping: order.shippingFee,
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
					model_id: line.selection.modelId,
					coverage_id: line.selection.coverageId,
					item_variant: line.selection.coverageCode,
					quantity: line.quantity,
					price: line.unitPrice,
				})),
			}),
		};
	} else {
		const line = order.lines.find((item) => `purchase_item.${item.lineKey}` === eventKey);
		if (!line)
			throw new CreativaError("INVALID_ANALYTICS_EVENT", "Không tìm thấy dòng sự kiện.", 400);
		payload = {
			event: "purchase_item",
			transactionId: order.analyticsId,
			data: {
				...base,
				product_type: line.productType,
				product_id: line.productId,
				product_name: line.productName,
				model_id: line.selection.modelId,
				coverage_id: line.selection.coverageId,
				quantity: line.quantity,
				unit_price: line.unitPrice,
				subtotal: line.subtotal,
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
		Buffer.byteLength(JSON.stringify(payload), "utf8") > 16000
	) {
		throw new CreativaError(
			"ANALYTICS_PAYLOAD_UNREPRESENTABLE",
			"Dữ liệu đo lường vượt giới hạn; đơn hàng vẫn được giữ nguyên.",
			422
		);
	}
	return payload;
}

export async function claimCreativaAnalytics(body: unknown): Promise<CreativaAnalyticsClaim> {
	if (
		!isRecord(body) ||
		(body.destination !== "ga4" && body.destination !== "umami") ||
		typeof body.eventKey !== "string"
	) {
		throw new CreativaError("INVALID_ANALYTICS_EVENT", "Yêu cầu đo lường không hợp lệ.", 400);
	}
	const destination = body.destination;
	const eventKey = body.eventKey;
	for (let attempt = 0; attempt < 5; attempt++) {
		const order = await acceptedOrderForCapability(body.capability);
		const payload = analyticsPayload(order, destination, eventKey);
		const enabled =
			destination === "ga4"
				? !!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
				: process.env.NEXT_PUBLIC_ENABLE_UMAMI === "true";
		if (!enabled) return { claimed: false, event: payload.event };
		const key = sha256(`${destination}:${eventKey}`);
		if (order.analyticsReceipts.some((receipt) => receipt._key === key))
			return { claimed: false, event: payload.event };
		try {
			await creativaServerClient()
				.patch(order._id)
				.ifRevisionId(order._rev)
				.set({
					analyticsReceipts: [
						...order.analyticsReceipts,
						{
							_type: "analyticsReceipt",
							_key: key,
							destination,
							eventKey,
							claimedAt: new Date().toISOString(),
						},
					],
				})
				.commit({ visibility: "sync", returnDocuments: false });
			return { claimed: true, ...payload };
		} catch (error) {
			if (!conflict(error)) {
				throw new CreativaError(
					"ANALYTICS_CLAIM_UNKNOWN",
					"Chưa xác định được quyền gửi đo lường; không gửi lại tự động.",
					503
				);
			}
		}
	}
	throw new CreativaError("ANALYTICS_CLAIM_UNAVAILABLE", "Đo lường tạm thời chưa khả dụng.", 503);
}
