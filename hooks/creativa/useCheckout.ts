/* eslint-disable camelcase */
import { useCallback, useEffect, useReducer, useRef } from "react";
import { useRouter } from "next/router";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CreativaRequestError } from "@/api-client/creativa-checkout";
import { useHydratedCreativaCart } from "@/hooks/creativa/useBrowserState";
import { useCreativaCreate, useCreativaOptions, useCreativaResolve } from "@/hooks/creativa/useApi";
import { useCreativaQuote } from "@/hooks/creativa/useQuote";
import type { CreativaAccepted, CreativaPublicOrder, CreativaQuote } from "@/models/creativa";
import { submittedContributions, useCreativaCart } from "@/store/cart/creativaCart";
import { parseCheckout } from "@/utils/creativa/contracts";
import { creativaCheckoutSchema, type CreativaCheckoutForm } from "@/utils/creativa/forms";
import {
	checkoutCapability,
	clearAttempt,
	readAttempt,
	rememberAcceptedId,
	saveAttempt,
	type CheckoutAttempt,
} from "@/utils/creativa/storage";
import { measureCreativaLine, trackCreativa } from "@/utils/creativa/analytics";
import { dispatchCreativaPurchase } from "@/utils/creativa/purchase";

type State = {
	attempt: CheckoutAttempt | null;
	ready: boolean;
	accepted: CreativaPublicOrder | null;
	error: string | null;
	warning: string | null;
	corrupt: boolean;
};
const initialState: State = {
	attempt: null,
	ready: false,
	accepted: null,
	error: null,
	warning: null,
	corrupt: false,
};

export function useCreativaCheckout() {
	const router = useRouter();
	const cart = useHydratedCreativaCart();
	const form = useForm<CreativaCheckoutForm>({
		resolver: yupResolver(creativaCheckoutSchema),
		defaultValues: {
			name: "",
			phone: "",
			email: "",
			address: "",
			note: "",
			paymentMethod: "bank_transfer",
		},
	});
	const address = useWatch({ control: form.control, name: "address" });
	const payment = useWatch({ control: form.control, name: "paymentMethod" });
	const [state, patch] = useReducer(
		(current: State, next: Partial<State>) => ({ ...current, ...next }),
		initialState
	);
	const create = useCreativaCreate();
	const recovery = useCreativaResolve();
	const request = useCreativaQuote();
	const { refresh, invalidate } = request;
	const lock = useRef(false);
	const completed = useRef(new Set<string>());
	const began = useRef(false);
	const abandoned = useRef(false);
	const acceptanceKnown = useRef(false);
	const methodChosen = useRef(false);
	const measuredShipping = useRef("");
	const measuredPayment = useRef<"cod" | "bank_transfer" | null>(null);
	const busy = create.isMutating || recovery.isMutating;
	const quote = request.matches(cart.items, address, payment) ? request.data : null;
	const reportBegin = useCallback(
		(currentQuote?: CreativaQuote) => {
			if (began.current) return;
			began.current = true;
			trackCreativa(
				"begin_checkout",
				{
					item_count: cart.items.length,
					unit_count: cart.items.reduce((sum, item) => sum + item.quantity, 0),
					price_basis: currentQuote ? "current_quote" : "unavailable",
					...(currentQuote && { value: currentQuote.merchandiseTotal }),
				},
				currentQuote
					? currentQuote.lines.map(measureCreativaLine)
					: cart.items.map((item) => {
							const measurement = measureCreativaLine(item);
							delete measurement.price;
							return measurement;
					  })
			);
		},
		[cart.items]
	);

	const requestQuote = useCallback(
		(nextAddress: string, nextPayment: typeof payment) => {
			const currentCart = useCreativaCart.getState();
			if (
				!currentCart.hydrated ||
				!state.ready ||
				currentCart.error ||
				!currentCart.items.length ||
				state.attempt ||
				state.accepted ||
				state.corrupt
			) {
				invalidate();
				return;
			}
			refresh(
				{ lines: currentCart.items, address: nextAddress, payment: nextPayment },
				{
					success: (next) => {
						patch({ error: null });
						const signature = JSON.stringify([next.shipping.code, next.shippingFee]);
						if (measuredShipping.current !== signature) {
							measuredShipping.current = signature;
							trackCreativa("add_shipping_info", {
								shipping_rule: next.shipping.code,
								shipping_fee: next.shippingFee,
							});
						}
						reportBegin(next);
					},
					failure: () => reportBegin(),
				}
			);
		},
		[state.ready, state.attempt, state.accepted, state.corrupt, refresh, invalidate, reportBegin]
	);

	const options = useCreativaOptions(
		state.ready && !state.attempt && !state.accepted && !state.corrupt,
		(next) => {
			if (
				!methodChosen.current &&
				!next.bankAvailable &&
				form.getValues("paymentMethod") !== "cod"
			) {
				form.setValue("paymentMethod", "cod");
				requestQuote(form.getValues("address"), "cod");
			}
		}
	);
	const bankAvailable = quote?.bankAvailable ?? options.data?.bankAvailable ?? null;

	function reportPayment(method: typeof payment) {
		if (measuredPayment.current === method) return;
		measuredPayment.current = method;
		trackCreativa("add_payment_info", { payment_method: method });
	}

	function acceptedCompletion(result: CreativaAccepted, current: CheckoutAttempt) {
		acceptanceKnown.current = true;
		patch({ accepted: result.order, error: null });
		if (completed.current.has(current.capability)) return;
		const latest = readAttempt();
		if (
			!latest.value ||
			latest.value.capability !== current.capability ||
			(latest.error && !latest.unavailable)
		) {
			patch({
				warning:
					latest.error ||
					"Tiến trình cục bộ đã được xử lý hoặc thay đổi. Đơn đã được tiếp nhận; không đặt lại.",
			});
			return;
		}
		const progress = { ...latest.value };
		const warnings: string[] = [];
		if (!progress.cartHandled) {
			try {
				cart.reconcile(progress.submitted);
				progress.cartHandled = true;
				const failure = saveAttempt(progress);
				if (failure) warnings.push(failure);
			} catch (failure) {
				warnings.push(
					failure instanceof Error ? failure.message : "Không thể cập nhật giỏ sau khi đặt hàng."
				);
			}
		}
		if (!progress.historyHandled) {
			// Checkpoint before append prevents a delayed callback resurrecting forgotten history.
			progress.historyHandled = true;
			const checkpoint = saveAttempt(progress);
			if (checkpoint) warnings.push(checkpoint);
			const history = rememberAcceptedId(result.order.publicId);
			if (history.error) {
				warnings.push(history.error);
				trackCreativa("order_history_storage_error", {
					phase: "write",
					reason: "storage_unavailable",
				});
			}
		}
		patch({ attempt: progress });
		if (progress.cartHandled && progress.historyHandled) {
			const failure = clearAttempt(progress.capability);
			if (failure) warnings.push(failure);
			else {
				completed.current.add(progress.capability);
				patch({ attempt: null });
			}
		}
		if (warnings.length) patch({ warning: [...new Set(warnings)].join(" ") });
		dispatchCreativaPurchase(result);
		if (!warnings.length)
			void router.push(`/creativa/order-tracking/${encodeURIComponent(result.order.publicId)}`);
	}

	async function resolve(current: CheckoutAttempt) {
		if (lock.current) return;
		lock.current = true;
		patch({ error: null });
		try {
			acceptedCompletion(await recovery.trigger(current.capability), current);
		} catch (failure) {
			trackCreativa("checkout_error", {
				phase: "resolve",
				reason:
					failure instanceof CreativaRequestError && failure.terminal
						? "terminal_rejection"
						: "resolve_failed",
			});
			if (failure instanceof CreativaRequestError && failure.terminal) {
				const cleared = clearAttempt(current.capability);
				if (cleared) patch({ warning: cleared });
				else patch({ attempt: null });
				invalidate();
			}
			patch({
				error:
					failure instanceof Error
						? failure.message
						: "Chưa xác định được kết quả. Hãy khôi phục cùng tiến trình, không đặt lại.",
			});
		} finally {
			lock.current = false;
		}
	}

	useEffect(() => {
		const previous = readAttempt();
		patch({ ready: true });
		if (previous.error) patch({ warning: previous.error, corrupt: !previous.unavailable });
		if (previous.value) {
			patch({ attempt: previous.value });
			void resolve(previous.value);
		}
		// Recovery binds the original capability once, independently of current form/configuration.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		requestQuote(form.getValues("address"), form.getValues("paymentMethod"));
		return invalidate;
	}, [cart.hydrated, cart.items, cart.error, requestQuote, form.getValues, invalidate]);

	useEffect(() => {
		if (
			!cart.hydrated ||
			!state.ready ||
			!cart.items.length ||
			cart.error ||
			state.corrupt ||
			state.accepted ||
			state.attempt ||
			busy
		)
			return;
		const abandon = () => {
			if (lock.current || acceptanceKnown.current) return;
			reportBegin();
			if (abandoned.current) return;
			abandoned.current = true;
			trackCreativa("abandoned_checkout", {
				item_count: cart.items.length,
				unit_count: cart.items.reduce((sum, item) => sum + item.quantity, 0),
				...(quote
					? { value: quote.merchandiseTotal, price_basis: "current_quote" }
					: { price_basis: "unavailable" }),
				phase: "form",
			});
		};
		window.addEventListener("pagehide", abandon);
		router.events.on("routeChangeStart", abandon);
		return () => {
			window.removeEventListener("pagehide", abandon);
			router.events.off("routeChangeStart", abandon);
		};
	}, [
		cart.hydrated,
		cart.items,
		cart.error,
		state.ready,
		state.corrupt,
		state.accepted,
		state.attempt,
		busy,
		quote,
		reportBegin,
		router.events,
	]);

	const submit = form.handleSubmit(
		async (values) => {
			if (
				lock.current ||
				state.attempt ||
				!quote ||
				request.loading ||
				state.accepted ||
				state.corrupt ||
				cart.error
			)
				return;
			let current: CheckoutAttempt | null = null;
			try {
				const body = parseCheckout({
					lines: cart.items,
					customer: values,
					paymentMethod: values.paymentMethod,
					reviewedQuote: quote,
				});
				const existing = readAttempt();
				if (existing.value) {
					patch({ attempt: existing.value, error: "Vui lòng khôi phục lần đặt hàng trước." });
					return;
				}
				if (existing.error && !existing.unavailable) {
					patch({ corrupt: true, warning: existing.error });
					return;
				}
				current = {
					version: 1,
					capability: checkoutCapability(),
					submitted: submittedContributions(cart.items),
					historyHandled: false,
					cartHandled: false,
				};
				const storageWarning = saveAttempt(current);
				if (storageWarning) {
					const latest = readAttempt();
					if (latest.value && latest.value.capability !== current.capability) {
						patch({ attempt: latest.value, error: storageWarning });
						return;
					}
					patch({ warning: storageWarning });
				}
				patch({ attempt: current, error: null });
				lock.current = true;
				reportPayment(values.paymentMethod);
				trackCreativa("checkout_submit", {
					item_count: body.lines.length,
					value: quote.finalAmount,
				});
				acceptedCompletion(await create.trigger({ body, capability: current.capability }), current);
			} catch (failure) {
				const updatedQuote = failure instanceof CreativaRequestError ? failure.quote : undefined;
				if (updatedQuote)
					request.replace(updatedQuote, {
						lines: cart.items,
						address: values.address,
						payment: values.paymentMethod,
					});
				if (current && failure instanceof CreativaRequestError && failure.terminal) {
					const clearing = clearAttempt(current.capability);
					if (clearing) patch({ warning: clearing });
					else patch({ attempt: null });
				}
				const details =
					failure instanceof Error ? failure : new Error("Không thể xác định kết quả đặt hàng.");
				patch({ error: details.message });
				if (failure instanceof CreativaRequestError && failure.fieldErrors) {
					for (const field of ["name", "phone", "email", "address", "note"] as const) {
						if (failure.fieldErrors[field])
							form.setError(field, { message: failure.fieldErrors[field] });
					}
					const first = (["name", "phone", "email", "address", "note"] as const).find(
						(field) => failure.fieldErrors[field]
					);
					if (first) form.setFocus(first);
				}
				trackCreativa(current ? "checkout_error" : "checkout_validation_error", {
					reason: updatedQuote ? "quote_changed" : current ? "submit_failed" : "invalid_form",
				});
			} finally {
				lock.current = false;
			}
		},
		() => {
			if (
				lock.current ||
				state.attempt ||
				!quote ||
				request.loading ||
				state.accepted ||
				state.corrupt ||
				cart.error
			)
				return;
			patch({ error: "Vui lòng kiểm tra thông tin khách hàng." });
			trackCreativa("checkout_validation_error", { reason: "invalid_form" });
		}
	);

	return {
		...state,
		cart,
		form,
		quote,
		bankAvailable,
		busy,
		address,
		payment,
		quoteLoading: request.loading,
		error: state.error || request.error?.message || options.error?.message || null,
		submit,
		resolve,
		changeAddress: (value: string) => requestQuote(value, form.getValues("paymentMethod")),
		changePayment: (method: typeof payment) => {
			methodChosen.current = true;
			form.setValue("paymentMethod", method);
			reportPayment(method);
			requestQuote(form.getValues("address"), method);
		},
		retry: () => {
			patch({ error: null });
			cart.hydrate();
			requestQuote(form.getValues("address"), form.getValues("paymentMethod"));
			void options.mutate(undefined, { revalidate: true, throwOnError: false });
		},
	};
}
