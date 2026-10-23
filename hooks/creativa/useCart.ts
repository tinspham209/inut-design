/* eslint-disable camelcase */
import { useEffect, useRef, useState } from "react";
import { useHydratedCreativaCart } from "@/hooks/creativa/useBrowserState";
import { useCreativaQuote } from "@/hooks/creativa/useQuote";
import { CreativaRequestError } from "@/api-client/creativa-checkout";
import type { CreativaQuote } from "@/models/creativa";
import { lineIdentity } from "@/utils/creativa/contracts";
import { measureCreativaLine, trackCreativa } from "@/utils/creativa/analytics";

export function useCreativaCartPage() {
	const cart = useHydratedCreativaCart();
	const request = useCreativaQuote();
	const { refresh, invalidate } = request;
	const [reviewed, setReviewed] = useState("");
	const viewed = useRef(false);

	useEffect(() => {
		if (!cart.hydrated) return;
		function reportView(quote?: CreativaQuote, reason?: string) {
			if (viewed.current) return;
			viewed.current = true;
			const empty = !cart.error && !cart.items.length;
			trackCreativa(
				"cart_view",
				{
					item_count: cart.items.length,
					unit_count: cart.items.reduce((sum, item) => sum + item.quantity, 0),
					price_basis: quote ? "current_quote" : empty ? "empty" : "unavailable",
					...(quote ? { value: quote.merchandiseTotal } : empty && { value: 0 }),
					...(reason && { reason }),
				},
				quote
					? quote.lines.map(measureCreativaLine)
					: cart.items.map((item) => {
							const measurement = measureCreativaLine(item);
							delete measurement.price;
							return measurement;
					  })
			);
		}
		if (cart.error || !cart.items.length) {
			invalidate();
			reportView(undefined, cart.error ? "invalid_cart" : undefined);
			return;
		}
		refresh(
			{ lines: cart.items, address: "", payment: "cod" },
			{
				success: (quote) => {
					reportView(quote);
					const changed = cart.items.filter(
						(item) =>
							quote.lines.find((line) => lineIdentity(line) === lineIdentity(item))?.unitPrice !==
							item.unitPrice
					);
					if (changed.length)
						trackCreativa("cart_revalidation", {
							reason: "price_changed",
							item_count: changed.length,
						});
				},
				failure: (error) => {
					const affected = error instanceof CreativaRequestError ? error.fieldErrors || {} : {};
					const count = cart.items.filter((item) => affected[lineIdentity(item)]).length;
					if (count)
						trackCreativa("cart_revalidation", { reason: "item_unavailable", item_count: count });
					reportView(undefined, "quote_unavailable");
				},
			}
		);
		return invalidate;
	}, [cart.hydrated, cart.error, cart.items, refresh, invalidate]);

	const quote = request.matches(cart.items, "", "cod") ? request.data : null;
	const changed =
		quote &&
		cart.items.some(
			(item) =>
				quote.lines.find((line) => lineIdentity(line) === lineIdentity(item))?.unitPrice !==
				item.unitPrice
		);
	return {
		cart,
		quote,
		changed,
		reviewed,
		review: () => quote && setReviewed(quote.digest),
		error: request.error?.message || null,
		lineErrors:
			request.error instanceof CreativaRequestError ? request.error.fieldErrors || {} : {},
		loading: request.loading,
		retry: cart.hydrate,
	};
}
