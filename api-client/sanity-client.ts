import sanityClient from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { CreateOrderLighterInput, OrderLighter } from "@/models/cart";
import envConst from "@/utils/env-const";

export const client = sanityClient({
	token: envConst.SANITY_TOKEN,
	projectId: envConst.SANITY_PROJECT_ID,
	dataset: envConst.SANITY_DATASET,
	apiVersion: "2022-09-19",
	useCdn: true,
	ignoreBrowserTokenWarning: true,
});

const builder = imageUrlBuilder(client);

export const urlFor = (source: any) => {
	return builder.image(source);
};

/**
 * Generate unique order number with prefix
 * @param prefix - Order prefix (e.g., "LIGHTER", "SKIN", "MAC")
 * @returns Unique order number (e.g., "LIGHTER-1234567890")
 */
function generateOrderNumber(prefix: string): string {
	const currentTime = new Date();
	const dateStr =
		currentTime.getFullYear().toString() +
		(currentTime.getMonth() + 1).toString().padStart(2, "0") +
		currentTime.getDate().toString().padStart(2, "0") +
		currentTime.getHours().toString().padStart(2, "0") +
		currentTime.getMinutes().toString().padStart(2, "0") +
		currentTime.getSeconds().toString().padStart(2, "0");
	const randomDigit = Math.floor(Math.random() * 11);

	return `${prefix}-${dateStr}${randomDigit}`;
}

/**
 * Create a new Lighter order in Sanity
 * @param orderData - Order data without _type, orderNumber, and orderDate
 * @returns Created order document
 */
export async function createLighterOrder(
	orderData: CreateOrderLighterInput
): Promise<OrderLighter> {
	try {
		const orderNumber = generateOrderNumber("LIGHTER");
		const orderDate = orderData.orderDate || new Date().toISOString();

		const newOrder = {
			_type: "ordersLighter",
			orderNumber,
			orderDate,
			...orderData,
		};

		const result = await client.create(newOrder);
		return result as OrderLighter;
	} catch (error) {
		console.error("Error creating lighter order:", error);
		throw new Error("Failed to create order. Please try again.");
	}
}

/**
 * Get an order by order number
 * @param orderNumber - Unique order number
 * @returns Order document or null
 */
export async function getOrderByNumber(orderNumber: string): Promise<OrderLighter | null> {
	try {
		const query = `*[_type == "ordersLighter" && orderNumber == $orderNumber][0]{
			...,
			orderItems[]{
				...,
				product->,
				lighterType->
			}
		}`;

		const result = await client.fetch(query, { orderNumber });
		return result;
	} catch (error) {
		console.error("Error fetching order:", error);
		return null;
	}
}

/**
 * Update order status
 * @param orderId - Sanity document ID
 * @param status - New status
 * @returns Updated order
 */
export async function updateOrderStatus(
	orderId: string,
	status: OrderLighter["status"]
): Promise<unknown> {
	try {
		const result = await client.patch(orderId).set({ status }).commit();
		return result;
	} catch (error) {
		console.error("Error updating order status:", error);
		throw new Error("Failed to update order status.");
	}
}
