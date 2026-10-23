/* eslint-disable camelcase */
import { useRef } from "react";
import { useRouter } from "next/router";
import { CreativaRequestError } from "@/api-client/creativa-checkout";
import { useCreativaOrder } from "@/hooks/creativa/useApi";
import { CREATIVA_PUBLIC_ID } from "@/utils/creativa/contracts";
import { trackCreativa } from "@/utils/creativa/analytics";

export function useCreativaTracking() {
	const router = useRouter();
	const id = typeof router.query.slug === "string" ? router.query.slug : "";
	const valid = CREATIVA_PUBLIC_ID.test(id);
	const previous = useRef("");
	const context = {
		entry_point: router.query.entry === "root" ? "root" : "creativa",
		lookup_source: router.query.source === "history" ? "history" : "manual",
	};
	const request = useCreativaOrder(id, router.isReady && valid, {
		onSuccess: () => {
			if (previous.current === id) return;
			previous.current = id;
			trackCreativa("order_tracking_result", { ...context, outcome: "found" });
		},
		onError: (error) =>
			trackCreativa("order_tracking_result", {
				...context,
				outcome:
					error instanceof CreativaRequestError && error.status === 404 ? "not_found" : "error",
			}),
	});
	return {
		id,
		order: valid && router.isReady && !request.error ? request.data : undefined,
		error: router.isReady && !valid ? "Mã đơn hàng không hợp lệ." : request.error?.message,
		retry: request.retry,
	};
}
