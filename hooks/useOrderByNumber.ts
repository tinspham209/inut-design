import useSWR from "swr";
import { getOrderByNumber } from "@/api-client/sanity-client";
import { OrderLighter } from "@/models/cart";

export function useOrderByNumber(orderNumber?: string | string[]) {
	const shouldFetch = typeof orderNumber === "string" && !!orderNumber;
	const { data, error, isLoading } = useSWR<OrderLighter>(
		shouldFetch ? ["order", orderNumber] : null,
		() => getOrderByNumber(orderNumber as string)
	);
	return { data, error, isLoading };
}
