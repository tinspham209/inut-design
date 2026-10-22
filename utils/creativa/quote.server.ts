import type {
	CreativaBank, CreativaCoverage, CreativaModel, CreativaProduct,
	CreativaPurchaseLine, CreativaQuote, CreativaShippingRule,
} from "@/models/creativa";
import { creativaServerClient } from "@/api-client/creativa-server";
import { readBank, validImage } from "@/api-client/creativa-catalog";
import {
	CreativaError, isRecord, lineIdentity, parsePayment, parsePurchaseLines,
	RESERVED_SKIN_SLUGS, safeMoney,
} from "./contracts";
import { reference, semanticDigest, sha256, StoredLine } from "./records.server";

type ProductDocument = CreativaProduct & { _type: string; productionVerified: boolean };
type ModelDocument = CreativaModel & { _type: string; _rev: string };
type CoverageDocument = CreativaCoverage & { _type: string; _rev: string };
export type QuoteRecords = {
	products: ProductDocument[];
	models: ModelDocument[];
	coverages: CoverageDocument[];
	shipping: { _type: string; rules: CreativaShippingRule[] } | null;
	bank: unknown;
};
export type Evaluation = { quote: CreativaQuote; lines: StoredLine[]; bank: CreativaBank | null };

const publishedId = (id: string) => /^[A-Za-z0-9_-]{1,128}$/.test(id);
function add(a: number, b: number): number { return safeMoney(a + b); }

export function selectShipping(value: QuoteRecords["shipping"], address = ""): CreativaShippingRule {
	if (value?._type !== "creativaShippingSettings" || !Array.isArray(value.rules)) {
		throw new CreativaError("CONFIGURATION_ERROR", "Chưa có cấu hình vận chuyển Creativa.", 503);
	}
	const rules = value.rules.filter((rule) => rule.active === true);
	if (new Set(rules.map((rule) => rule._key)).size !== rules.length ||
		new Set(rules.map((rule) => rule.code)).size !== rules.length) {
		throw new CreativaError("CONFIGURATION_ERROR", "Cấu hình vận chuyển bị trùng.", 503);
	}
	for (const rule of rules) {
		if (!rule._key || !rule.code || !rule.name || !Number.isSafeInteger(rule.sortOrder)) {
			throw new CreativaError("CONFIGURATION_ERROR", "Cấu hình vận chuyển chưa hợp lệ.", 503);
		}
		safeMoney(rule.fee);
	}
	const defaults = rules.filter((rule) => rule.isDefault === true);
	if (defaults.length !== 1) throw new CreativaError("CONFIGURATION_ERROR", "Cần một phí vận chuyển mặc định.", 503);
	const normalized = address.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[đĐ]/g, "d").toLowerCase();
	const regional = rules.find((rule) => rule.code === "da-nang");
	return /(^|[^a-z])da\s+nang([^a-z]|$)/.test(normalized) && regional ? regional : defaults[0];
}

export function quoteFromRecords(
	input: { lines: unknown; address?: unknown; paymentMethod: unknown }, records: QuoteRecords
): Evaluation {
	const purchases = parsePurchaseLines(input.lines);
	const paymentMethod = parsePayment(input.paymentMethod);
	if (input.address !== undefined && (typeof input.address !== "string" || input.address.length > 2000)) {
		throw new CreativaError("INVALID_ADDRESS", "Địa chỉ không hợp lệ.");
	}
	const shippingRule = selectShipping(records.shipping, typeof input.address === "string" ? input.address.trim() : "");
	const bank = readBank(records.bank);
	if (paymentMethod === "bank_transfer" && !bank) {
		throw new CreativaError("BANK_UNAVAILABLE", "Chuyển khoản Creativa chưa khả dụng. Vui lòng chọn COD.", 422);
	}
	const lines: StoredLine[] = purchases.map((purchase) => {
		const product = records.products.find((p) => p._id === purchase.productId);
		const model = records.models.find((m) => m._id === purchase.selection.modelId);
		const coverage = records.coverages.find((c) => c._id === purchase.selection.coverageId);
		if (!publishedId(purchase.productId) || !publishedId(purchase.selection.modelId) ||
			!publishedId(purchase.selection.coverageId) ||
			product?._type !== "creativaSkinProduct" || product.active !== true || product.productionVerified !== true ||
			!product.name?.trim() || !product.artworkId?.trim() || !product.artworkVersion?.trim() ||
			!product.slug?.current || RESERVED_SKIN_SLUGS.includes(product.slug.current) ||
			product.printAsset?._type !== "file" || product.printAsset.asset?._type !== "reference" ||
			!product.printAsset.asset._ref?.startsWith("file-") ||
			!Array.isArray(product.images) || product.images.length < 3 || !product.images.every(validImage) ||
			!["top", "bottom", "interior"].every((view) => product.images.some((image) => image.view === view)) ||
			model?._type !== "creativaMacbookModel" || model.active !== true || model.fitVerified !== true ||
			!model.code?.trim() || !model.name?.trim() || !model.fitReference?.trim() ||
			coverage?._type !== "creativaSkinCoverage" || coverage.active !== true ||
			!["top", "bottom", "interior", "full"].includes(coverage.code) ||
			!coverage.name?.trim() || !coverage.description?.trim()) {
			throw new CreativaError("ITEM_UNAVAILABLE", "Một lựa chọn không còn khả dụng. Vui lòng kiểm tra giỏ hàng.", 409,
				{ [lineIdentity(purchase)]: "Sản phẩm, mẫu máy hoặc phạm vi dán không khả dụng." });
		}
		const unitPrice = safeMoney(coverage.price);
		if (unitPrice === 0) throw new CreativaError("CONFIGURATION_ERROR", "Giá sản phẩm chưa khả dụng.", 503);
		const key = sha256(lineIdentity(purchase)).slice(0, 32);
		const images = product.images.map((image) => ({
			_type: "image", asset: reference(image.asset._ref), alt: image.alt, view: image.view,
			...(image._key && { _key: image._key }),
		}));
		return {
			...purchase, _type: "acceptedLine", _key: key, lineKey: key,
			productName: product.name, productSlug: product.slug.current, productImage: images[0],
			selection: {
				...purchase.selection, modelName: model.name, modelCode: model.code, fitReference: model.fitReference,
				coverageName: coverage.name, coverageCode: coverage.code, coverageMeaning: coverage.description,
			},
			artwork: {
				identity: product.artworkId, version: product.artworkVersion,
				printAsset: { _type: "file", asset: reference(product.printAsset.asset._ref) },
			},
			unitPrice, subtotal: safeMoney(unitPrice * purchase.quantity),
			product: reference(product._id), model: reference(model._id), coverage: reference(coverage._id),
			retainedImages: images.map((image, index) => ({ ...image, _key: `${key}-${index}` })),
			sourceRevisions: { product: product._rev || "", model: model._rev, coverage: coverage._rev },
		};
	});
	const merchandiseTotal = lines.reduce((sum, line) => add(sum, line.subtotal), 0);
	const shipping = { code: shippingRule.code, name: shippingRule.name, fee: shippingRule.fee };
	const quoteLines = lines.map((line) => ({
		productType: line.productType, productId: line.productId, quantity: line.quantity,
		_key: line._key, lineKey: line.lineKey, productName: line.productName, productSlug: line.productSlug,
		productImage: line.productImage, selection: line.selection,
		artwork: { identity: line.artwork.identity, version: line.artwork.version },
		unitPrice: line.unitPrice, subtotal: line.subtotal,
	}));
	const semantic = {
		version: "creativa-quote-v1",
		lines: lines.map((line) => ({
			productType: line.productType, productId: line.productId, selection: {
				modelId: line.selection.modelId, modelCode: line.selection.modelCode,
				fitReference: line.selection.fitReference, coverageId: line.selection.coverageId,
				coverageCode: line.selection.coverageCode, coverageMeaning: line.selection.coverageMeaning,
			},
			quantity: line.quantity, artwork: {
				identity: line.artwork.identity, version: line.artwork.version,
				printAssetRef: line.artwork.printAsset?.asset._ref,
			}, unitPrice: line.unitPrice, subtotal: line.subtotal,
		})),
		shipping: { code: shipping.code, fee: shipping.fee }, merchandiseTotal,
		shippingFee: shipping.fee, discount: 0, finalAmount: add(merchandiseTotal, shipping.fee),
		paymentMethod, ...(paymentMethod === "bank_transfer" && { bank }),
	};
	return {
		lines, bank,
		quote: {
			lines: quoteLines, currency: "VND", merchandiseTotal, shippingFee: shipping.fee, discount: 0,
			finalAmount: semantic.finalAmount, shipping, paymentMethod, bankAvailable: !!bank,
			digest: semanticDigest(semantic),
		},
	};
}

export async function evaluateQuote(input: { lines: unknown; address?: unknown; paymentMethod: unknown }): Promise<Evaluation> {
	const purchases: CreativaPurchaseLine[] = parsePurchaseLines(input.lines);
	const ids = [...new Set(purchases.flatMap((line) => [line.productId, line.selection.modelId, line.selection.coverageId]))];
	if (!ids.every(publishedId)) throw new CreativaError("ITEM_UNAVAILABLE", "Lựa chọn sản phẩm không hợp lệ.", 409);
	const documents = await creativaServerClient().getDocuments<{
		_id: string; _type: string; _rev: string; [key: string]: unknown;
	}>([...ids, "creativa-shipping-settings", "creativa-bank-settings"]);
	const records: QuoteRecords = { products: [], models: [], coverages: [], shipping: null, bank: null };
	// Documents are private validation inputs; only explicitly rebuilt quote fields leave this module.
	for (const document of documents) {
		if (!document) continue;
		if (document._type === "creativaSkinProduct") records.products.push(document as unknown as ProductDocument);
		if (document._type === "creativaMacbookModel") records.models.push(document as unknown as ModelDocument);
		if (document._type === "creativaSkinCoverage") records.coverages.push(document as unknown as CoverageDocument);
		if (document._id === "creativa-shipping-settings" && document._type === "creativaShippingSettings" &&
			Array.isArray(document.rules)) records.shipping = { _type: document._type, rules: document.rules as CreativaShippingRule[] };
		if (document._id === "creativa-bank-settings") records.bank = document;
	}
	return quoteFromRecords(input, records);
}

export function parseQuoteBody(body: unknown): { lines: unknown; address?: unknown; paymentMethod: unknown } {
	if (!isRecord(body)) throw new CreativaError("INVALID_INPUT", "Yêu cầu báo giá không hợp lệ.", 400);
	return { lines: body.lines, address: body.address, paymentMethod: body.paymentMethod };
}
