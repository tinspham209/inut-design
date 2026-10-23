import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { creativaApi } from "@/api-client/creativa-checkout";
import type {
	CreativaCheckoutRequest,
	CreativaOptions,
	CreativaProduct,
	CreativaPurchaseLine,
} from "@/models/creativa";

const mutationOptions = { revalidate: false, populateCache: false, throwOnError: true } as const;
const readOptions = { revalidateOnFocus: false, shouldRetryOnError: false } as const;

export function useCreativaOptions(enabled: boolean, onSuccess?: (data: CreativaOptions) => void) {
	return useSWR(enabled ? "/api/creativa/options" : null, creativaApi.options, {
		...readOptions,
		revalidateOnMount: true,
		dedupingInterval: 0,
		onSuccess,
	});
}

export function useCreativaProduct(
	slug: string,
	initial?: { product: CreativaProduct; options: CreativaOptions }
) {
	const request = useSWR(
		["/api/creativa/products", slug],
		async () => ({ ...(await creativaApi.product(slug)), verified: true }),
		{
			...readOptions,
			revalidateOnMount: true,
			...(initial && { fallbackData: { ...initial, verified: false } }),
		}
	);
	return {
		...request,
		retry: () => request.mutate(undefined, { revalidate: true, throwOnError: false }),
	};
}

export function useCreativaProductRetry() {
	return useSWRMutation(
		"/api/creativa/products",
		(_key, { arg }: { arg: string }) => creativaApi.product(arg),
		mutationOptions
	);
}

export function useCreativaOrder(
	id: string,
	enabled: boolean,
	callbacks: { onSuccess?: () => void; onError?: (error: Error) => void } = {}
) {
	const request = useSWR(
		enabled ? ["/api/creativa/orders", id] : null,
		() => creativaApi.order(id),
		{
			...readOptions,
			...callbacks,
			revalidateOnMount: true,
			dedupingInterval: 0,
			keepPreviousData: false,
		}
	);
	return {
		...request,
		retry: () => request.mutate(undefined, { revalidate: true, throwOnError: false }),
	};
}

export function useCreativaQuoteMutation() {
	return useSWRMutation(
		"/api/creativa/quote",
		(
			_key,
			{
				arg,
			}: {
				arg: { lines: CreativaPurchaseLine[]; address: string; payment: "cod" | "bank_transfer" };
			}
		) => creativaApi.quote(arg.lines, arg.address, arg.payment),
		mutationOptions
	);
}

export function useCreativaCreate() {
	return useSWRMutation(
		"/api/creativa/orders",
		(_key, { arg }: { arg: { body: CreativaCheckoutRequest; capability: string } }) =>
			creativaApi.create(arg.body, arg.capability),
		mutationOptions
	);
}

export function useCreativaResolve() {
	return useSWRMutation(
		"/api/creativa/orders/resolve",
		(_key, { arg }: { arg: string }) => creativaApi.resolve(arg),
		mutationOptions
	);
}

export function useCreativaClaim() {
	return useSWRMutation(
		"/api/creativa/orders/analytics-claim",
		(
			_key,
			{ arg }: { arg: { capability: string; destination: "ga4" | "umami"; eventKey: string } }
		) => creativaApi.claim(arg.capability, arg.destination, arg.eventKey),
		mutationOptions
	);
}
