import useSWRMutation from "swr/mutation";
import { createLighterOrder } from "@/api-client/sanity-client";
import { CreateOrderLighterInput, OrderLighter } from "@/models/cart";

/**
 * Fetcher function for SWR mutation
 * The second parameter (_key) is the SWR key, we don't need it here
 * The third parameter contains the argument passed to trigger()
 */
async function createOrderFetcher(
	_key: string,
	{ arg }: { arg: CreateOrderLighterInput }
): Promise<OrderLighter> {
	return await createLighterOrder(arg);
}

/**
 * Custom hook to create a lighter order using SWR mutation
 *
 * @returns {Object} SWR mutation object
 * @returns {Function} trigger - Function to trigger the order creation with order data
 * @returns {OrderLighter | undefined} data - The created order data
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
 *       status: "pending",
 *       orderItems: [...],
 *       customerName: formData.customerName,
 *       // ... other fields
 *     });
 *
 *     console.log("Order created:", order);
 *     router.push(`/order-tracking/lighters/${order.orderNumber}`);
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
