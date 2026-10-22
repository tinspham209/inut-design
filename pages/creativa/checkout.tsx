/* eslint-disable camelcase */
import {
	Alert,
	Box,
	Button,
	Container,
	Divider,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { CreativaLayout } from "@/components/layout";
import { CreativaSeo } from "@/components/creativa/Seo";
import { useHydratedCreativaCart } from "@/hooks/creativa/useBrowserState";
import { creativaApi, CreativaRequestError } from "@/api-client/creativa-checkout";
import type {
	CreativaAccepted,
	CreativaCustomer,
	CreativaPublicOrder,
	CreativaQuote,
} from "@/models/creativa";
import type { NextPageWithLayout } from "@/models/common";
import { submittedContributions } from "@/store/cart/creativaCart";
import { formatCreativaPrice, parseCheckout } from "@/utils/creativa/contracts";
import {
	checkoutCapability,
	clearAttempt,
	readAttempt,
	rememberAcceptedId,
	saveAttempt,
	type CheckoutAttempt,
} from "@/utils/creativa/storage";
import {
	creativaTrackingAllowed,
	measureCreativaLine,
	safeCreativaUrl,
	trackCreativa,
} from "@/utils/creativa/analytics";
import { gtag } from "@/utils/analytics";
import { trackUmamiEvent } from "@/utils/umamiAnalytics";

async function dispatchPurchase(capability: string, order: CreativaPublicOrder) {
	if (!creativaTrackingAllowed()) return;
	const context = {
		page_location: safeCreativaUrl(window.location.href),
		page_referrer: safeCreativaUrl(document.referrer || "/"),
	};
	const failures: string[] = [];
	if (typeof window.gtag === "function") {
		try {
			const claim = await creativaApi.claim(capability, "ga4", "purchase");
			if (claim.claimed)
				gtag("event", "purchase", { ...claim.data, ...context, items: claim.items });
		} catch {
			failures.push("ga4");
		}
	}
	if (
		process.env.NEXT_PUBLIC_ENABLE_UMAMI === "true" &&
		typeof window.umami?.track === "function"
	) {
		for (const eventKey of [
			"purchase",
			...order.lines.map((line) => `purchase_item.${line._key}`),
		]) {
			try {
				const claim = await creativaApi.claim(capability, "umami", eventKey);
				if (claim.claimed) trackUmamiEvent(claim.event, claim.data);
			} catch {
				failures.push("umami");
				break;
			}
		}
	}
	if (failures.length)
		console.warn("[Creativa] Measurement delivery incomplete; accepted order is unchanged.", {
			destinations: [...new Set(failures)],
		});
}

const Checkout: NextPageWithLayout = () => {
	const router = useRouter();
	const cart = useHydratedCreativaCart();
	const [customer, setCustomer] = useState<CreativaCustomer>({
		name: "",
		phone: "",
		email: "",
		address: "",
		note: "",
	});
	const [payment, setPayment] = useState<"cod" | "bank_transfer">("bank_transfer");
	const [bankAvailable, setBankAvailable] = useState<boolean | null>(null);
	const [quote, setQuote] = useState<CreativaQuote | null>(null);
	const [quoteLoading, setQuoteLoading] = useState(false);
	const [quoteRetry, setQuoteRetry] = useState(0);
	const [attempt, setAttempt] = useState<CheckoutAttempt | null>(null);
	const [attemptReady, setAttemptReady] = useState(false);
	const [accepted, setAccepted] = useState<CreativaPublicOrder | null>(null);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [warning, setWarning] = useState<string | null>(null);
	const [journalCorrupt, setJournalCorrupt] = useState(false);
	const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
	const lock = useRef(false);
	const completed = useRef(new Set<string>());
	const began = useRef(false);
	const abandoned = useRef(false);
	const acceptanceKnown = useRef(false);
	const methodChosen = useRef(false);
	const measuredShipping = useRef("");
	const measuredPayment = useRef<"cod" | "bank_transfer" | null>(null);
	const quoteSource = useRef<{
		quote: CreativaQuote;
		items: typeof cart.items;
		address: string;
		payment: typeof payment;
	} | null>(null);
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

	function reportPayment(method: "cod" | "bank_transfer") {
		if (measuredPayment.current === method) return;
		measuredPayment.current = method;
		trackCreativa("add_payment_info", { payment_method: method });
	}

	function acceptedCompletion(result: CreativaAccepted, current: CheckoutAttempt) {
		acceptanceKnown.current = true;
		setAccepted(result.order);
		setError(null);
		if (completed.current.has(current.capability)) return;
		const latest = readAttempt();
		if (
			!latest.value ||
			latest.value.capability !== current.capability ||
			(latest.error && !latest.unavailable)
		) {
			setWarning(
				latest.error ||
					"Tiến trình cục bộ đã được xử lý hoặc thay đổi. Đơn đã được tiếp nhận; không đặt lại."
			);
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
			// Checkpoint before the optional append so later callbacks cannot resurrect forgotten tags.
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
		setAttempt(progress);
		if (progress.cartHandled && progress.historyHandled) {
			const failure = clearAttempt(progress.capability);
			if (failure) warnings.push(failure);
			else {
				completed.current.add(progress.capability);
				setAttempt(null);
			}
		}
		if (warnings.length) setWarning([...new Set(warnings)].join(" "));
		void dispatchPurchase(progress.capability, result.order);
		// Keep acceptance visible if local recovery needs attention; do not wait for measurement.
		if (!warnings.length)
			void router.push(`/creativa/order-tracking/${encodeURIComponent(result.order.publicId)}`);
	}

	async function resolve(current: CheckoutAttempt) {
		if (lock.current) return;
		lock.current = true;
		setBusy(true);
		setError(null);
		try {
			acceptedCompletion(await creativaApi.resolve(current.capability), current);
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
				if (cleared) setWarning(cleared);
				else setAttempt(null);
				setQuote(null);
				setQuoteRetry((value) => value + 1);
			}
			setError(
				failure instanceof Error
					? failure.message
					: "Chưa xác định được kết quả. Hãy khôi phục cùng tiến trình, không đặt lại."
			);
		} finally {
			lock.current = false;
			setBusy(false);
		}
	}

	useEffect(() => {
		const previous = readAttempt();
		setAttemptReady(true);
		if (previous.error) {
			setWarning(previous.error);
			setJournalCorrupt(!previous.unavailable);
		}
		if (previous.value) {
			setAttempt(previous.value);
			void resolve(previous.value);
		}
		// Recovery owns the original capability; form state is intentionally not a dependency.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		let current = true;
		void creativaApi
			.options()
			.then((options) => {
				if (!current) return;
				setBankAvailable(options.bankAvailable);
				if (!methodChosen.current && !options.bankAvailable) setPayment("cod");
			})
			.catch((failure: Error) => {
				if (current) setError(failure.message);
			});
		return () => {
			current = false;
		};
	}, []);

	useEffect(() => {
		if (
			!cart.hydrated ||
			!attemptReady ||
			cart.error ||
			!cart.items.length ||
			attempt ||
			accepted ||
			journalCorrupt
		)
			return;
		let current = true;
		setQuoteLoading(true);
		const timer = window.setTimeout(() => {
			void creativaApi
				.quote(cart.items, customer.address || "", payment)
				.then((next) => {
					if (!current) return;
					quoteSource.current = {
						quote: next,
						items: cart.items,
						address: customer.address || "",
						payment,
					};
					setQuote(next);
					setError(null);
					const shippingSignature = JSON.stringify([next.shipping.code, next.shippingFee]);
					if (measuredShipping.current !== shippingSignature) {
						measuredShipping.current = shippingSignature;
						trackCreativa("add_shipping_info", {
							shipping_rule: next.shipping.code,
							shipping_fee: next.shippingFee,
						});
					}
					reportBegin(next);
				})
				.catch((failure: Error) => {
					if (current) {
						setQuote(null);
						setError(failure.message);
						reportBegin();
					}
				})
				.finally(() => {
					if (current) setQuoteLoading(false);
				});
		}, 300);
		return () => {
			current = false;
			window.clearTimeout(timer);
		};
	}, [
		cart.hydrated,
		cart.items,
		cart.error,
		customer.address,
		payment,
		attemptReady,
		attempt,
		accepted,
		journalCorrupt,
		quoteRetry,
		reportBegin,
	]);

	useEffect(() => {
		if (
			!cart.hydrated ||
			!attemptReady ||
			!cart.items.length ||
			cart.error ||
			journalCorrupt ||
			accepted ||
			attempt ||
			busy
		)
			return;
		const abandon = () => {
			if (lock.current || acceptanceKnown.current) return;
			reportBegin();
			if (!abandoned.current) {
				abandoned.current = true;
				const source = quoteSource.current;
				const currentQuote =
					source?.quote === quote &&
					source.items === cart.items &&
					source.address === (customer.address || "") &&
					source.payment === payment
						? quote
						: null;
				trackCreativa("abandoned_checkout", {
					item_count: cart.items.length,
					unit_count: cart.items.reduce((sum, item) => sum + item.quantity, 0),
					...(currentQuote
						? { value: currentQuote.merchandiseTotal, price_basis: "current_quote" }
						: { price_basis: "unavailable" }),
					phase: "form",
				});
			}
		};
		window.addEventListener("pagehide", abandon);
		router.events.on("routeChangeStart", abandon);
		return () => {
			window.removeEventListener("pagehide", abandon);
			router.events.off("routeChangeStart", abandon);
		};
	}, [
		accepted,
		attempt,
		busy,
		cart.hydrated,
		cart.error,
		cart.items,
		attemptReady,
		journalCorrupt,
		quote,
		customer.address,
		payment,
		reportBegin,
		router.events,
	]);

	async function submit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const form = event.currentTarget;
		if (
			lock.current ||
			attempt ||
			!quote ||
			quoteLoading ||
			accepted ||
			journalCorrupt ||
			cart.error
		)
			return;
		let current: CheckoutAttempt | null = null;
		try {
			const body = parseCheckout({
				lines: cart.items,
				customer,
				paymentMethod: payment,
				reviewedQuote: quote,
			});
			const existing = readAttempt();
			if (existing.value) {
				setAttempt(existing.value);
				setError("Vui lòng khôi phục lần đặt hàng trước.");
				return;
			}
			if (existing.error && !existing.unavailable) {
				setJournalCorrupt(true);
				setWarning(existing.error);
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
					setAttempt(latest.value);
					setError(storageWarning);
					return;
				}
				setWarning(storageWarning);
			}
			setAttempt(current);
			lock.current = true;
			setBusy(true);
			setFieldErrors({});
			setError(null);
			reportPayment(payment);
			trackCreativa("checkout_submit", { item_count: body.lines.length, value: quote.finalAmount });
			const result = await creativaApi.create(body, current.capability);
			acceptedCompletion(result, current);
		} catch (failure) {
			const updatedQuote = failure instanceof CreativaRequestError ? failure.quote : undefined;
			if (updatedQuote) setQuote(updatedQuote);
			const isDefiniteRejection = failure instanceof CreativaRequestError && failure.terminal;
			if (current && isDefiniteRejection) {
				const clearing = clearAttempt(current.capability);
				if (!clearing) setAttempt(null);
				else setWarning(clearing);
			}
			const details = failure as Error & { fieldErrors?: Record<string, string> };
			setError(details.message || "Không thể xác định kết quả đặt hàng.");
			if (details.fieldErrors) {
				setFieldErrors(details.fieldErrors);
				for (const field of ["name", "phone", "email", "address", "note"]) {
					if (!details.fieldErrors[field]) continue;
					const control = form.elements.namedItem(field);
					if (control instanceof HTMLElement) control.focus();
					break;
				}
			}
			trackCreativa(current ? "checkout_error" : "checkout_validation_error", {
				reason: updatedQuote ? "quote_changed" : current ? "submit_failed" : "invalid_form",
			});
		} finally {
			lock.current = false;
			setBusy(false);
		}
	}

	function changeField(field: keyof CreativaCustomer, value: string) {
		setCustomer((current) => ({ ...current, [field]: value }));
		setFieldErrors((current) => ({ ...current, [field]: "" }));
	}
	return (
		<>
			<CreativaSeo title="Thanh toán" path="/creativa/checkout" noindex />
			<Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
				<Stack gap={2.5}>
					<Typography component="h1" variant="h3">
						Thanh toán
					</Typography>
					{warning && <Alert severity="warning">{warning}</Alert>}
					{(error || cart.error) && (
						<Alert
							severity="error"
							action={
								!attempt && !accepted ? (
									<Button
										onClick={() => {
											cart.hydrate();
											setQuoteRetry((value) => value + 1);
										}}
									>
										Thử lại
									</Button>
								) : undefined
							}
						>
							{error || cart.error}
						</Alert>
					)}
					{!cart.hydrated || !attemptReady ? (
						<Typography>Đang khôi phục tiến trình…</Typography>
					) : accepted ? (
						<Box sx={{ p: 3, bgcolor: "white" }}>
							<Typography component="h2" variant="h5">
								Đơn hàng đã được tiếp nhận
							</Typography>
							<Typography sx={{ fontFamily: "monospace", userSelect: "all", fontSize: 26, my: 2 }}>
								{accepted.publicId}
							</Typography>
							<Typography variant="body2" mb={2}>
								Lỗi lưu trữ hoặc đo lường không làm hủy đơn đã tiếp nhận. Không đặt lại đơn này.
							</Typography>
							<Link href={`/creativa/order-tracking/${accepted.publicId}`} passHref>
								<Button component="a" variant="contained">
									Xem đơn và sao chép mã
								</Button>
							</Link>
							{attempt && (
								<Button disabled={busy} onClick={() => void resolve(attempt)} sx={{ mt: 1 }}>
									Thử khôi phục giỏ cục bộ (không đặt lại)
								</Button>
							)}
						</Box>
					) : attempt ? (
						<Alert
							severity="info"
							action={
								<Button disabled={busy} onClick={() => void resolve(attempt)}>
									Khôi phục kết quả
								</Button>
							}
						>
							{busy
								? "Đang xác nhận kết quả của lần đặt hàng này…"
								: "Lần đặt hàng trước chưa được xác định. Khôi phục cùng tiến trình trước khi đặt tiếp."}
						</Alert>
					) : !cart.items.length ? (
						<Alert severity="info">
							Giỏ hàng chưa có sản phẩm. <Link href="/creativa/skin-laptop">Khám phá thiết kế</Link>
						</Alert>
					) : (
						<Box component="form" onSubmit={submit} noValidate>
							<Grid container spacing={4}>
								<Grid item xs={12} md={7}>
									<Stack gap={2}>
										<Typography component="h2" variant="h5">
											Thông tin khách hàng
										</Typography>
										<TextField
											label="Họ và tên"
											name="name"
											autoComplete="name"
											required
											value={customer.name}
											onChange={(event) => changeField("name", event.target.value)}
											error={!!fieldErrors.name}
											helperText={fieldErrors.name}
											inputProps={{ maxLength: 200 }}
										/>
										<TextField
											label="Số điện thoại"
											name="phone"
											type="tel"
											autoComplete="tel"
											required
											value={customer.phone}
											onChange={(event) => changeField("phone", event.target.value)}
											error={!!fieldErrors.phone}
											helperText={fieldErrors.phone || "Gồm đúng 10 chữ số."}
											inputProps={{ pattern: "[0-9]{10}", inputMode: "numeric", maxLength: 32 }}
										/>
										<TextField
											label="Email (không bắt buộc)"
											name="email"
											type="email"
											autoComplete="email"
											value={customer.email}
											onChange={(event) => changeField("email", event.target.value)}
											error={!!fieldErrors.email}
											helperText={fieldErrors.email}
											inputProps={{ maxLength: 254 }}
										/>
										<TextField
											label="Địa chỉ giao hàng (không bắt buộc)"
											name="address"
											autoComplete="street-address"
											multiline
											rows={2}
											value={customer.address}
											onChange={(event) => changeField("address", event.target.value)}
											inputProps={{ maxLength: 2000 }}
										/>
										{!customer.address && (
											<Typography variant="caption">
												Nếu chưa nhập địa chỉ, phí vận chuyển mặc định được áp dụng. Nhân viên sẽ
												xác nhận thông tin giao hàng với bạn.
											</Typography>
										)}
										<FormControl fullWidth>
											<InputLabel id="creativa-payment">Phương thức thanh toán</InputLabel>
											<Select
												labelId="creativa-payment"
												label="Phương thức thanh toán"
												value={payment}
												onChange={(event) => {
													const method = event.target.value === "cod" ? "cod" : "bank_transfer";
													methodChosen.current = true;
													setPayment(method);
													reportPayment(method);
												}}
											>
												<MenuItem value="bank_transfer" disabled={bankAvailable === false}>
													Chuyển khoản ngân hàng
												</MenuItem>
												<MenuItem value="cod">Thanh toán khi nhận hàng (COD)</MenuItem>
											</Select>
										</FormControl>
										{bankAvailable === false && (
											<Alert severity="info">
												Thông tin chuyển khoản chưa sẵn sàng. Bạn có thể chọn COD khi cấu hình vận
												chuyển hợp lệ.
											</Alert>
										)}
										<TextField
											label="Ghi chú (không bắt buộc)"
											name="note"
											multiline
											rows={2}
											value={customer.note}
											onChange={(event) => changeField("note", event.target.value)}
											inputProps={{ maxLength: 2000 }}
										/>
									</Stack>
								</Grid>
								<Grid item xs={12} md={5}>
									<Stack gap={2} sx={{ bgcolor: "white", p: 3, border: "1px solid #eadfd8" }}>
										<Typography component="h2" variant="h5">
											Đơn hàng của bạn
										</Typography>
										{quoteLoading && (
											<Typography variant="body2">Đang xác nhận giá và phí vận chuyển…</Typography>
										)}
										{(quote?.lines || cart.items).map((line) => (
											<Stack key={"lineKey" in line ? line.lineKey : line.instanceId} gap={0.5}>
												<Typography fontWeight={500}>{line.productName}</Typography>
												<Typography variant="body2">
													{"modelName" in line ? line.modelName : line.selection.modelName} /{" "}
													{"coverageName" in line ? line.coverageName : line.selection.coverageName}{" "}
													× {line.quantity}
												</Typography>
												<Typography variant="body2">
													{formatCreativaPrice(line.unitPrice * line.quantity)}
												</Typography>
											</Stack>
										))}
										{quote && (
											<>
												<Divider />
												<Stack direction="row" justifyContent="space-between">
													<Typography>Sản phẩm</Typography>
													<Typography>{formatCreativaPrice(quote.merchandiseTotal)}</Typography>
												</Stack>
												<Stack direction="row" justifyContent="space-between">
													<Typography>Vận chuyển: {quote.shipping.name}</Typography>
													<Typography>{formatCreativaPrice(quote.shippingFee)}</Typography>
												</Stack>
												<Stack direction="row" justifyContent="space-between">
													<Typography fontWeight={700}>Tổng thanh toán</Typography>
													<Typography fontWeight={700}>
														{formatCreativaPrice(quote.finalAmount)}
													</Typography>
												</Stack>
											</>
										)}
										<Button
											type="submit"
											variant="contained"
											size="large"
											disabled={busy || quoteLoading || !quote || !!cart.error || journalCorrupt}
										>
											Đặt hàng
										</Button>
										<Typography variant="caption">
											Bạn đặt một đơn Creativa cho toàn bộ sản phẩm trong giỏ. Đặt hàng không đồng
											nghĩa thanh toán đã được xác nhận.
										</Typography>
									</Stack>
								</Grid>
							</Grid>
						</Box>
					)}
					<Stack direction="row" gap={2}>
						<Link href="/creativa/cart">Về giỏ hàng</Link>
						<Link href="/creativa/order-tracking">Tra cứu đơn</Link>
						<Link href="/contact">
							<a
								onClick={() =>
									trackCreativa("contact_click", { method: "form", surface: "checkout" })
								}
							>
								Liên hệ hỗ trợ
							</a>
						</Link>
					</Stack>
				</Stack>
			</Container>
		</>
	);
};
Checkout.Layout = CreativaLayout;
export default Checkout;
