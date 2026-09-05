import useSWRMutation from "swr/mutation";
import {
	CreateLighterOrderRequest,
	CreateLighterOrderResponse,
} from "@/models/cart";

/**
 * Fetcher function for SWR mutation
 * The second parameter (_key) is the SWR key, we don't need it here
 * The third parameter contains the argument passed to trigger()
 */
async function createOrderFetcher(
	_key: string,
	{ arg }: { arg: CreateLighterOrderRequest }
): Promise<CreateLighterOrderResponse> {
	const response = await fetch("/api/orders/lighters", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Idempotency-Key": arg.idempotencyKey,
		},
		body: JSON.stringify(arg.order),
	});
	if (!response.ok) {
		const payload = await response.json().catch(() => null);
		throw new Error(payload?.error || "Failed to create order.");
	}
	const order = await response.json();
	return {
		order,
		created: response.headers.get("X-Order-Created") === "true",
	};
}

/**
 * Custom hook to create a lighter order using SWR mutation
 *
 * @returns {Object} SWR mutation object
 * @returns {Function} trigger - Function to trigger the order creation with order data
 * @returns {CreateLighterOrderResponse | undefined} data - The created order result
 * @returns {Error | undefined} error - Error object if the request failed
 * @returns {boolean} isMutating - True if the mutation is in progress
 *
 * @example
 * ```tsx
 * const { trigger, data, error, isMutating } = useCreateLighterOrder();
 *
 * const handleSubmit = async (formData) => {
 *   try {
 *     const order = await trigger({
 *       order: {
 *         status: "pending",
 *         orderItems: [...],
 *         customerName: formData.customerName,
 *       },
 *       idempotencyKey: crypto.randomUUID(),
 *       // ... other fields
 *     });
 *
 *     console.log("Order created:", order.order);
 *     router.push(`/order-tracking/lighters/${order.order.orderNumber}`);
 *   } catch (err) {
 *     console.error("Failed to create order:", err);
 *   }
 * };
 * ```
 */
export function useCreateLighterOrder() {
	return useSWRMutation("/api/orders/lighters", createOrderFetcher, {
		// Optional: Configure mutation options
		throwOnError: true, // Throw error instead of returning it in error field
		// revalidate: false, // Don't revalidate other SWR keys after mutation
	});
}
