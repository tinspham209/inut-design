import useSWR from "swr";
import { shippingFeeApi } from "@/api-client/shippingFee";
import { ShippingFee } from "@/models/shippingFee";

export function useShippingFees(enabled = true) {
	const { data, error, isLoading, mutate } = useSWR<ShippingFee[]>(
		enabled ? "shippingFees" : null,
		() => shippingFeeApi.getAll(),
		{
			revalidateOnFocus: false,
			dedupingInterval: 5 * 60 * 1000,
		}
	);
	return {
		fees: data || [],
		error,
		loading: !data && !error,
		isLoading,
		mutate,
	};
}
