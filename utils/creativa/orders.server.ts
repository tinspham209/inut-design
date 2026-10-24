import { randomUUID } from "crypto";
import { getCreativaPrimaryBank } from "@/api-client/creativa-catalog";
import type {
	CreativaAccepted,
	CreativaCheckoutRequest,
	CreativaPublicOrder,
	CreativaQuote,
} from "@/models/creativa";
import { creativaServerClient } from "@/api-client/creativa-server";
import {
	CreativaError,
	CREATIVA_PUBLIC_ID,
	lineIdentity,
	parseCheckout,
	parseCustomer,
	projectCreativaImage,
	safeMoney,
	safeQuantity,
} from "./contracts";
import { evaluateQuote } from "./quote.server";
import {
	conflict,
	generatePublicId,
	intentId,
	reference,
	semanticDigest,
	sha256,
	StoredIntent,
	StoredOrder,
	unavailable,
} from "./records.server";
import { dispatchNotifications, notificationSetup } from "./notifications.server";

export class QuoteChanged extends CreativaError {
	constructor(public quote: CreativaQuote) {
		super("QUOTE_CHANGED", "Báo giá đã thay đổi. Vui lòng kiểm tra và xác nhận lại.", 409);
	}
}

function shouldShowBankInstructions(
	order: Pick<StoredOrder, "paymentMethod" | "status" | "paymentStatus">
): boolean {
	return (
		order.paymentMethod === "bank_transfer" &&
		order.status !== "cancelled" &&
		(order.paymentStatus === "pending" || order.paymentStatus === "failed")
	);
}

function sameBankAccount(
	saved: NonNullable<StoredOrder["bank"]>,
	current: NonNullable<StoredOrder["bank"]>
): boolean {
	const sameAccount =
		saved.accountName.trim() === current.accountName.trim() &&
		saved.accountNumber.trim() === current.accountNumber.trim();
	const sameProfile =
		Boolean(saved.profileId) && Boolean(current.profileId) && saved.profileId === current.profileId;

	return (
		sameAccount &&
		(sameProfile || saved.bankName.trim() === current.bankName.trim())
	);
}

async function resolveLegacyBankCode(order: StoredOrder): Promise<StoredOrder> {
	const savedBank = order.bank;
	if (!shouldShowBankInstructions(order) || !savedBank || savedBank.bankCode) return order;

	try {
		const currentBank = await getCreativaPrimaryBank();
		if (!currentBank?.bankCode) return order;
		if (!sameBankAccount(savedBank, currentBank)) {
			console.warn("[Creativa] Skipped legacy bank-code fallback because the primary account changed.", {
				orderId: order.publicId,
			});
			return order;
		}
		return { ...order, bank: { ...savedBank, bankCode: currentBank.bankCode } };
	} catch (error) {
		console.error("[Creativa] Could not resolve a bank code for a legacy order.", {
			orderId: order.publicId,
			error: error instanceof Error ? error.message : "Unknown error",
		});
		return order;
	}
}

export function publicOrder(order: StoredOrder): CreativaPublicOrder {
	for (const amount of [
		order.merchandiseTotal,
		order.shippingFee,
		order.discount,
		order.finalAmount,
	])
		safeMoney(amount);
	for (const line of order.lines) safeQuantity(line.quantity);
	const itemized =
		order.lines.every(
			(line) =>
				Number.isSafeInteger(line.unitPrice) &&
				line.unitPrice >= 0 &&
				Number.isSafeInteger(line.subtotal) &&
				line.subtotal === line.unitPrice * line.quantity
		) && order.lines.reduce((sum, line) => sum + line.subtotal, 0) === order.merchandiseTotal;
	const bankPrompt = shouldShowBankInstructions(order);
	const customer = parseCustomer(order.customer);
	const transferCustomer = bankPrompt && order.bank ? customer : null;
	return {
		publicId: order.publicId,
		orderDate: order.orderDate,
		status: order.status,
		paymentStatus: order.paymentStatus,
		paymentMethod: order.paymentMethod,
		customer: {
			name: customer.name,
			phone: customer.phone,
			...(customer.email && { email: customer.email }),
			...(customer.address && { address: customer.address }),
		},
		lines: order.lines.map((line) => ({
			_key: line._key,
			lineKey: line.lineKey || sha256(`staff-row:${line._key}`).slice(0, 32),
			productType: "skin-laptop",
			productId: line.productId || `staff-${sha256(line._key).slice(0, 32)}`,
			productName: line.productName,
			productSlug: line.productSlug || "",
			productImage: projectCreativaImage(line.productImage, line.productName),
			quantity: line.quantity,
			...(itemized && { unitPrice: line.unitPrice, subtotal: line.subtotal }),
			selection: {
				modelId: line.selection.modelId,
				modelName: line.selection.modelName,
				coverageId: line.selection.coverageId,
				coverageName: line.selection.coverageName,
				coverageCode: line.selection.coverageCode,
			},
		})),
		currency: "VND",
		merchandiseTotal: order.merchandiseTotal,
		shippingFee: order.shippingFee,
		discount: order.discount,
		finalAmount: order.finalAmount,
		shipping: { code: order.shipping.code, name: order.shipping.name, fee: order.shippingFee },
		bank:
			bankPrompt && order.bank
				? {
						bankName: order.bank.bankName,
						...(order.bank.bankCode && { bankCode: order.bank.bankCode }),
						accountName: order.bank.accountName,
						accountNumber: order.bank.accountNumber,
						...(order.bank.profileId && { profileId: order.bank.profileId }),
						...(order.bank.name && { name: order.bank.name }),
						...(order.bank.bankShortName && { bankShortName: order.bank.bankShortName }),
						...(order.bank.image?.asset?._ref && {
							image: {
								_type: "image",
								asset: { _type: "reference", _ref: order.bank.image.asset._ref },
							},
						}),
						...(order.bank.transferInstructions && {
							transferInstructions: order.bank.transferInstructions,
						}),
				  }
				: null,
		...(order.trackingNumber && { trackingNumber: order.trackingNumber }),
		...(transferCustomer && {
			transferContent: `${transferCustomer.name.replace(/\s+/g, " ")} ${transferCustomer.phone}`,
		}),
	};
}

async function loadIntent(id: string): Promise<StoredIntent> {
	const intent = await creativaServerClient().getDocument<StoredIntent>(id);
	if (!intent || intent._type !== "creativaCheckoutIntent") throw unavailable();
	return intent;
}

export async function acceptedOrderForCapability(capability: unknown): Promise<StoredOrder> {
	const intent = await loadIntent(intentId(capability));
	if (intent.state !== "accepted" || !intent.order?._ref?.startsWith("creativa.order.")) {
		if (intent.state === "rejected") terminalRejection(intent);
		throw new CreativaError("INTENT_PENDING", "Lần đặt hàng chưa được xác nhận.", 409);
	}
	const order = await creativaServerClient().getDocument<StoredOrder>(intent.order._ref);
	if (!order || order._type !== "creativaOrder") throw unavailable();
	return order;
}

function terminalRejection(intent: StoredIntent): never {
	const rejection = intent.rejection;
	if (rejection?.quote) {
		const error = new QuoteChanged(rejection.quote);
		error.terminal = true;
		throw error;
	}
	const code =
		rejection?.code === "ITEM_UNAVAILABLE" || rejection?.code === "INTENT_NOT_BOUND"
			? rejection.code
			: "INTENT_REJECTED";
	const error = new CreativaError(
		code,
		rejection?.message || "Lần đặt hàng đã kết thúc. Vui lòng kiểm tra trước khi đặt lại.",
		409
	);
	error.terminal = true;
	throw error;
}

async function accepted(intent: StoredIntent, created: boolean): Promise<CreativaAccepted> {
	if (!intent.order?._ref?.startsWith("creativa.order.")) throw unavailable();
	const order = await creativaServerClient().getDocument<StoredOrder>(intent.order._ref);
	if (!order || order._type !== "creativaOrder") throw unavailable();
	// Await a bounded handoff, but delivery failure never reverses durable acceptance.
	try {
		await dispatchNotifications(order._id);
	} catch {
		console.error("creativa_notification_state_unavailable", { orderId: order._id });
	}
	return acceptedOrderResponse(order, created);
}

export function acceptedOrderResponse(order: StoredOrder, created: boolean): CreativaAccepted {
	const view = publicOrder(order);
	const legacyIdentity =
		typeof order.analyticsId === "string" &&
		/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(order.analyticsId)
			? order.analyticsId
			: undefined;
	if (order.analyticsId && !legacyIdentity)
		console.warn("[Creativa] Invalid legacy measurement identity; deriving a safe identity.");
	return {
		created,
		order: view,
		analyticsTransactionId: legacyIdentity || sha256(`creativa-purchase-v2:${order._id}`),
	};
}

async function resume(
	intent: StoredIntent,
	fingerprint?: string,
	depth = 0
): Promise<CreativaAccepted> {
	if (depth > 4) throw unavailable();
	if (intent.fingerprint && fingerprint && intent.fingerprint !== fingerprint) {
		throw new CreativaError("INTENT_CONFLICT", "Mã đặt hàng đã gắn với thông tin khác.", 409);
	}
	if (intent.state === "accepted") return accepted(intent, false);
	if (intent.state === "rejected") terminalRejection(intent);
	if (intent.state !== "pending" || !intent.request) throw unavailable();
	const request = parseCheckout(intent.request);
	let evaluation: Awaited<ReturnType<typeof evaluateQuote>>;
	try {
		evaluation = await evaluateQuote({
			lines: request.lines,
			address: request.customer.address,
			paymentMethod: request.paymentMethod,
		});
		if (
			request.reviewedQuote.digest !== evaluation.quote.digest ||
			request.reviewedQuote.merchandiseTotal !== evaluation.quote.merchandiseTotal ||
			request.reviewedQuote.shippingFee !== evaluation.quote.shippingFee ||
			request.reviewedQuote.finalAmount !== evaluation.quote.finalAmount
		)
			throw new QuoteChanged(evaluation.quote);
	} catch (error) {
		if (!(error instanceof CreativaError) || error.status >= 500) throw error;
		const rejection = {
			code: error.code,
			message: error.message,
			status: error.status,
			...(error instanceof QuoteChanged && {
				quote: {
					...error.quote,
					lines: error.quote.lines.map((line) => ({ ...line, _type: "quoteLine" })),
				},
			}),
		};
		try {
			await creativaServerClient()
				.patch(intent._id)
				.ifRevisionId(intent._rev)
				.set({ state: "rejected", rejection })
				.unset(["request"])
				.commit({ visibility: "sync", returnDocuments: false });
		} catch {
			return resume(await loadIntent(intent._id), fingerprint, depth + 1);
		}
		error.terminal = true;
		throw error;
	}
	const setup = await notificationSetup();
	for (let attempt = 0; attempt < 5; attempt++) {
		const publicId = generatePublicId();
		const orderId = `creativa.order.${randomUUID()}`;
		const lookupId = `creativa.lookup.${sha256(publicId)}`;
		const quote = evaluation.quote;
		const document = {
			_id: orderId,
			_type: "creativaOrder",
			publicId,
			orderDate: new Date().toISOString(),
			status: "pending",
			paymentStatus: "pending",
			paymentMethod: request.paymentMethod,
			customer: request.customer,
			lines: evaluation.lines,
			currency: "VND",
			merchandiseTotal: quote.merchandiseTotal,
			shippingFee: quote.shippingFee,
			discount: 0,
			finalAmount: quote.finalAmount,
			shipping: quote.shipping,
			bank: evaluation.bank,
			notifications: setup.receipts,
			...(setup.issue && { handoffIssue: setup.issue }),
			...(setup.sales && { salesSettings: reference(setup.sales) }),
		};
		try {
			await creativaServerClient()
				.transaction()
				.create(document)
				.create({ _id: lookupId, _type: "creativaOrderLookup", order: reference(orderId) })
				.patch(intent._id, (patch) =>
					patch
						.ifRevisionId(intent._rev)
						.set({ state: "accepted", order: reference(orderId) })
						.unset(["request", "rejection"])
				)
				.commit({ visibility: "sync", returnDocuments: false });
			return accepted(await loadIntent(intent._id), true);
		} catch (error) {
			const current = await loadIntent(intent._id);
			if (current.state !== "pending" || current._rev !== intent._rev)
				return resume(current, fingerprint, depth + 1);
			if (!conflict(error)) throw unavailable();
			const collision = await creativaServerClient().getDocument(lookupId);
			if (!collision) throw unavailable();
		}
	}
	throw new CreativaError(
		"ID_ALLOCATION_UNAVAILABLE",
		"Chưa cấp được mã đơn. Vui lòng khôi phục cùng lần đặt hàng.",
		503
	);
}

export async function submitCreativaOrder(
	capability: unknown,
	body: unknown
): Promise<CreativaAccepted> {
	const id = intentId(capability);
	const request: CreativaCheckoutRequest = parseCheckout(body);
	const fingerprint = semanticDigest({ version: "creativa-intent-v1", request });
	try {
		await creativaServerClient().createIfNotExists(
			{
				_id: id,
				_type: "creativaCheckoutIntent",
				state: "pending",
				fingerprint,
				request: {
					...request,
					lines: request.lines.map((line) => ({
						...line,
						_type: "purchaseLine",
						_key: sha256(lineIdentity(line)).slice(0, 32),
					})),
				},
			},
			{ visibility: "sync", returnDocuments: false }
		);
	} catch {
		// A lost mutation response is not a rejection; the direct read resolves its binding.
		return resume(await loadIntent(id), fingerprint);
	}
	return resume(await loadIntent(id), fingerprint);
}

export async function resolveCreativaOrder(capability: unknown): Promise<CreativaAccepted> {
	const id = intentId(capability);
	try {
		await creativaServerClient().createIfNotExists(
			{
				_id: id,
				_type: "creativaCheckoutIntent",
				state: "rejected",
				rejection: {
					code: "INTENT_NOT_BOUND",
					message: "Lần đặt hàng chưa được gửi và đã đóng an toàn.",
					status: 409,
				},
			},
			{ visibility: "sync", returnDocuments: false }
		);
	} catch {
		return resume(await loadIntent(id));
	}
	return resume(await loadIntent(id));
}

export async function getCreativaOrder(value: string): Promise<CreativaPublicOrder> {
	const publicId = value.trim();
	if (!CREATIVA_PUBLIC_ID.test(publicId))
		throw new CreativaError("INVALID_ORDER_ID", "Mã đơn phải gồm đúng 10 ký tự.", 400);
	const lookup = await creativaServerClient().getDocument<{
		_type: string;
		order: { _ref: string };
	}>(`creativa.lookup.${sha256(publicId)}`);
	if (!lookup) throw new CreativaError("ORDER_NOT_FOUND", "Không tìm thấy đơn hàng.", 404);
	if (lookup._type !== "creativaOrderLookup" || !lookup.order?._ref?.startsWith("creativa.order."))
		throw unavailable();
	const order = await creativaServerClient().getDocument<StoredOrder>(lookup.order._ref);
	if (!order || order._type !== "creativaOrder" || order.publicId !== publicId) throw unavailable();
	return publicOrder(await resolveLegacyBankCode(order));
}
