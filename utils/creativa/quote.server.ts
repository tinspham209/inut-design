import type {
	CreativaBank,
	CreativaCoverage,
	CreativaModel,
	CreativaProduct,
	CreativaPurchaseLine,
	CreativaQuote,
	CreativaShippingRule,
} from "@/models/creativa";
import { creativaServerClient } from "@/api-client/creativa-server";
import {
	commerceConfigurationError,
	configuredText,
	parseCreativaCoverage,
	parseCreativaModel,
	readBank,
	validImage,
} from "@/api-client/creativa-catalog";
import {
	CreativaError,
	isRecord,
	lineIdentity,
	parsePayment,
	parsePurchaseLines,
	RESERVED_SKIN_SLUGS,
	safeMoney,
} from "./contracts";
import { reference, semanticDigest, sha256, StoredLine } from "./records.server";

type ProductDocument = CreativaProduct & {
	_type: "creativaSkinProduct";
	_rev: string;
	productionVerified: true;
	printAsset: NonNullable<CreativaProduct["printAsset"]>;
};
type ModelDocument = CreativaModel & { _type: "creativaMacbookModel"; _rev: string };
type CoverageDocument = CreativaCoverage & { _type: "creativaSkinCoverage"; _rev: string };
export type QuoteRecords = {
	products: unknown[];
	models: unknown[];
	coverages: unknown[];
	shipping: unknown;
	bank: unknown;
};
export type Evaluation = { quote: CreativaQuote; lines: StoredLine[]; bank: CreativaBank | null };

const publishedId = (id: string) => /^[A-Za-z0-9_-]{1,128}$/.test(id);
function add(a: number, b: number): number {
	return safeMoney(a + b);
}

function parseProductDocument(value: unknown): ProductDocument | null {
	if (!isRecord(value) || value._type !== "creativaSkinProduct") throw commerceConfigurationError();
	if (value.active === false || value.productionVerified === false) return null;
	if (value.active !== true || value.productionVerified !== true)
		throw commerceConfigurationError();
	const slug = value.slug;
	const master = value.printAsset;
	const images: unknown[] = Array.isArray(value.images) ? value.images : [];
	if (
		!isRecord(slug) ||
		typeof slug.current !== "string" ||
		!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug.current) ||
		RESERVED_SKIN_SLUGS.includes(slug.current) ||
		!isRecord(master) ||
		master._type !== "file" ||
		!isRecord(master.asset) ||
		master.asset._type !== "reference" ||
		typeof master.asset._ref !== "string" ||
		!master.asset._ref.startsWith("file-") ||
		images.length < 3 ||
		!images.every(validImage) ||
		!["top", "bottom", "interior"].every((view) => images.some((image) => image.view === view))
	) {
		throw commerceConfigurationError();
	}
	const createdAt = configuredText(value._createdAt);
	if (!Number.isFinite(Date.parse(createdAt))) throw commerceConfigurationError();
	if (
		value.description !== undefined &&
		value.description !== null &&
		typeof value.description !== "string"
	) {
		throw commerceConfigurationError();
	}
	return {
		_id: configuredText(value._id),
		_type: "creativaSkinProduct",
		_rev: configuredText(value._rev),
		_createdAt: createdAt,
		name: configuredText(value.name),
		slug: { current: slug.current },
		active: true,
		productionVerified: true,
		artworkId: configuredText(value.artworkId),
		artworkVersion: configuredText(value.artworkVersion),
		printAsset: { _type: "file", asset: reference(master.asset._ref) },
		images: images.map((image) => ({
			_type: "image",
			asset: reference(image.asset._ref),
			alt: image.alt,
			view: image.view,
			...(image._key && { _key: image._key }),
		})),
		...(typeof value.description === "string" && { description: value.description }),
	};
}

function parseModelDocument(value: unknown): ModelDocument | null {
	if (!isRecord(value) || value._type !== "creativaMacbookModel")
		throw commerceConfigurationError();
	const model = parseCreativaModel(value);
	return model
		? { ...model, _type: "creativaMacbookModel", _rev: configuredText(value._rev) }
		: null;
}

function parseCoverageDocument(value: unknown): CoverageDocument | null {
	if (!isRecord(value) || value._type !== "creativaSkinCoverage")
		throw commerceConfigurationError();
	const coverage = parseCreativaCoverage(value);
	return coverage
		? { ...coverage, _type: "creativaSkinCoverage", _rev: configuredText(value._rev) }
		: null;
}

export function selectShipping(value: unknown, address = ""): CreativaShippingRule {
	if (
		!isRecord(value) ||
		value._type !== "creativaShippingSettings" ||
		!Array.isArray(value.rules)
	) {
		throw new CreativaError("CONFIGURATION_ERROR", "Chưa có cấu hình vận chuyển Creativa.", 503);
	}
	const rules: CreativaShippingRule[] = [];
	for (const rule of value.rules) {
		if (!isRecord(rule)) throw commerceConfigurationError();
		if (rule.active === false) continue;
		if (
			rule.active !== true ||
			typeof rule.isDefault !== "boolean" ||
			typeof rule.sortOrder !== "number" ||
			!Number.isSafeInteger(rule.sortOrder) ||
			rule.sortOrder < 0 ||
			(rule.note !== undefined && rule.note !== null && typeof rule.note !== "string")
		) {
			throw commerceConfigurationError();
		}
		rules.push({
			_key: configuredText(rule._key),
			code: configuredText(rule.code),
			name: configuredText(rule.name),
			active: true,
			isDefault: rule.isDefault,
			sortOrder: rule.sortOrder,
			fee: safeMoney(rule.fee),
			...(typeof rule.note === "string" && { note: rule.note }),
		});
	}
	if (
		new Set(rules.map((rule) => rule._key)).size !== rules.length ||
		new Set(rules.map((rule) => rule.code)).size !== rules.length
	) {
		throw new CreativaError("CONFIGURATION_ERROR", "Cấu hình vận chuyển bị trùng.", 503);
	}
	const defaults = rules.filter((rule) => rule.isDefault === true);
	if (defaults.length !== 1)
		throw new CreativaError("CONFIGURATION_ERROR", "Cần một phí vận chuyển mặc định.", 503);
	const normalized = address
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[đĐ]/g, "d")
		.toLowerCase();
	const regional = rules.find((rule) => rule.code === "da-nang");
	return /(^|[^a-z])da\s+nang([^a-z]|$)/.test(normalized) && regional ? regional : defaults[0];
}

export function quoteFromRecords(
	input: { lines: unknown; address?: unknown; paymentMethod: unknown },
	records: QuoteRecords
): Evaluation {
	const purchases = parsePurchaseLines(input.lines);
	const paymentMethod = parsePayment(input.paymentMethod);
	if (
		!isRecord(records) ||
		!Array.isArray(records.products) ||
		!Array.isArray(records.models) ||
		!Array.isArray(records.coverages)
	)
		throw commerceConfigurationError();
	const products: ProductDocument[] = [];
	const models: ModelDocument[] = [];
	const coverages: CoverageDocument[] = [];
	for (const value of records.products) {
		const product = parseProductDocument(value);
		if (product) products.push(product);
	}
	for (const value of records.models) {
		const model = parseModelDocument(value);
		if (model) models.push(model);
	}
	for (const value of records.coverages) {
		const coverage = parseCoverageDocument(value);
		if (coverage) coverages.push(coverage);
	}
	if (
		input.address !== undefined &&
		(typeof input.address !== "string" || input.address.length > 2000)
	) {
		throw new CreativaError("INVALID_ADDRESS", "Địa chỉ không hợp lệ.");
	}
	const shippingRule = selectShipping(
		records.shipping,
		typeof input.address === "string" ? input.address.trim() : ""
	);
	const bank = readBank(records.bank);
	if (paymentMethod === "bank_transfer" && !bank) {
		throw new CreativaError(
			"BANK_UNAVAILABLE",
			"Chuyển khoản Creativa chưa khả dụng. Vui lòng chọn COD.",
			422
		);
	}
	const selections = purchases.map((purchase) => ({
		purchase,
		product: products.find((p) => p._id === purchase.productId),
		model: models.find((m) => m._id === purchase.selection.modelId),
		coverage: coverages.find((c) => c._id === purchase.selection.coverageId),
	}));
	const unavailable: Record<string, string> = {};
	for (const { purchase, product, model, coverage } of selections) {
		if (
			!publishedId(purchase.productId) ||
			!publishedId(purchase.selection.modelId) ||
			!publishedId(purchase.selection.coverageId) ||
			!product ||
			!model ||
			!coverage
		) {
			unavailable[lineIdentity(purchase)] = "Sản phẩm, mẫu máy hoặc phạm vi dán không khả dụng.";
		}
	}
	if (Object.keys(unavailable).length)
		throw new CreativaError(
			"ITEM_UNAVAILABLE",
			"Một lựa chọn không còn khả dụng. Vui lòng kiểm tra giỏ hàng.",
			409,
			unavailable
		);
	const lines: StoredLine[] = selections.map(({ purchase, product, model, coverage }) => {
		const unitPrice = safeMoney(coverage.price);
		if (unitPrice === 0)
			throw new CreativaError("CONFIGURATION_ERROR", "Giá sản phẩm chưa khả dụng.", 503);
		const key = sha256(lineIdentity(purchase)).slice(0, 32);
		const images = product.images.map((image) => ({
			_type: "image",
			asset: reference(image.asset._ref),
			alt: image.alt,
			view: image.view,
			...(image._key && { _key: image._key }),
		}));
		return {
			...purchase,
			_type: "acceptedLine",
			_key: key,
			lineKey: key,
			productName: product.name,
			productSlug: product.slug.current,
			productImage: images[0],
			selection: {
				...purchase.selection,
				modelName: model.name,
				modelCode: model.code,
				fitReference: model.fitReference,
				coverageName: coverage.name,
				coverageCode: coverage.code,
				coverageMeaning: coverage.description,
			},
			artwork: {
				identity: product.artworkId,
				version: product.artworkVersion,
				printAsset: { _type: "file", asset: reference(product.printAsset.asset._ref) },
			},
			unitPrice,
			subtotal: safeMoney(unitPrice * purchase.quantity),
			product: reference(product._id),
			model: reference(model._id),
			coverage: reference(coverage._id),
			retainedImages: images.map((image, index) => ({ ...image, _key: `${key}-${index}` })),
			sourceRevisions: { product: product._rev || "", model: model._rev, coverage: coverage._rev },
		};
	});
	const merchandiseTotal = lines.reduce((sum, line) => add(sum, line.subtotal), 0);
	const shipping = { code: shippingRule.code, name: shippingRule.name, fee: shippingRule.fee };
	const quoteLines = lines.map((line) => ({
		productType: line.productType,
		productId: line.productId,
		quantity: line.quantity,
		_key: line._key,
		lineKey: line.lineKey,
		productName: line.productName,
		productSlug: line.productSlug,
		productImage: line.productImage,
		selection: line.selection,
		artwork: { identity: line.artwork.identity, version: line.artwork.version },
		unitPrice: line.unitPrice,
		subtotal: line.subtotal,
	}));
	const semantic = {
		version: "creativa-quote-v1",
		lines: lines.map((line) => ({
			productType: line.productType,
			productId: line.productId,
			selection: {
				modelId: line.selection.modelId,
				modelCode: line.selection.modelCode,
				fitReference: line.selection.fitReference,
				coverageId: line.selection.coverageId,
				coverageCode: line.selection.coverageCode,
				coverageMeaning: line.selection.coverageMeaning,
			},
			quantity: line.quantity,
			artwork: {
				identity: line.artwork.identity,
				version: line.artwork.version,
				printAssetRef: line.artwork.printAsset?.asset._ref,
			},
			unitPrice: line.unitPrice,
			subtotal: line.subtotal,
		})),
		shipping: { code: shipping.code, fee: shipping.fee },
		merchandiseTotal,
		shippingFee: shipping.fee,
		discount: 0,
		finalAmount: add(merchandiseTotal, shipping.fee),
		paymentMethod,
		...(paymentMethod === "bank_transfer" && { bank }),
	};
	return {
		lines,
		bank,
		quote: {
			lines: quoteLines,
			currency: "VND",
			merchandiseTotal,
			shippingFee: shipping.fee,
			discount: 0,
			finalAmount: semantic.finalAmount,
			shipping,
			paymentMethod,
			bankAvailable: !!bank,
			digest: semanticDigest(semantic),
		},
	};
}

export async function evaluateQuote(input: {
	lines: unknown;
	address?: unknown;
	paymentMethod: unknown;
}): Promise<Evaluation> {
	const purchases: CreativaPurchaseLine[] = parsePurchaseLines(input.lines);
	const ids = [
		...new Set(
			purchases.flatMap((line) => [
				line.productId,
				line.selection.modelId,
				line.selection.coverageId,
			])
		),
	];
	if (!ids.every(publishedId))
		throw new CreativaError("ITEM_UNAVAILABLE", "Lựa chọn sản phẩm không hợp lệ.", 409);
	const documents = await creativaServerClient().getDocuments<Record<string, unknown>>([
		...ids,
		"creativa-shipping-settings",
		"creativa-bank-settings",
	]);
	const records: QuoteRecords = {
		products: [],
		models: [],
		coverages: [],
		shipping: null,
		bank: null,
	};
	// Documents are private validation inputs; only explicitly rebuilt quote fields leave this module.
	for (const document of documents) {
		if (!document) continue;
		if (!isRecord(document)) throw commerceConfigurationError();
		if (document._type === "creativaSkinProduct") records.products.push(document);
		if (document._type === "creativaMacbookModel") records.models.push(document);
		if (document._type === "creativaSkinCoverage") records.coverages.push(document);
		if (document._id === "creativa-shipping-settings") records.shipping = document;
		if (document._id === "creativa-bank-settings") records.bank = document;
	}
	return quoteFromRecords(input, records);
}

export function parseQuoteBody(body: unknown): {
	lines: unknown;
	address?: unknown;
	paymentMethod: unknown;
} {
	if (!isRecord(body))
		throw new CreativaError("INVALID_INPUT", "Yêu cầu báo giá không hợp lệ.", 400);
	return { lines: body.lines, address: body.address, paymentMethod: body.paymentMethod };
}
