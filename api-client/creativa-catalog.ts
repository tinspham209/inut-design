import sanityClient from "@sanity/client";
import type {
	CoverageCode,
	CreativaBank,
	CreativaBankIssue,
	CreativaCatalogPage,
	CreativaCoverage,
	CreativaImage,
	CreativaModel,
	CreativaOptions,
	CreativaProduct,
} from "@/models/creativa";
import {
	CreativaError,
	isRecord,
	RESERVED_SKIN_SLUGS,
	safeMoney,
	validCreativaDocumentId,
	validCreativaImageRef,
	validCreativaPrintPath,
} from "@/utils/creativa/contracts";
import { parseCreativaDescription } from "@/utils/creativa/content";

export const CREATIVA_IMAGE_PROJECTION = `{_type,_key,asset{_type,_ref},alt,view}`;
export const CREATIVA_PRODUCT_PROJECTION = `{
	_id,_rev,_createdAt,name,slug{current},active,description,
	images[]${CREATIVA_IMAGE_PROJECTION}
}`;
const PRODUCT_SOURCE_PROJECTION = `{
	_id,_rev,_createdAt,name,slug{current},active,description,printAssetPath,
	images[]${CREATIVA_IMAGE_PROJECTION}
}`;
export const CREATIVA_PRIMARY_BANK_QUERY = `*[
	_type == "creativaBankSettings" && isActive == true && isPrimary == true &&
	!(_id in path("drafts.**")) && !(_id in path("versions.**"))
][0...2]{
	_id,_type,name,isActive,isPrimary,bankName,bankShortName,accountNumber,accountHolderName,
	image{_type,asset{_type,_ref}}
}`;
const ELIGIBLE = `_type == "creativaSkinProduct" && !(_id in path("drafts.**")) &&
	!(_id in path("versions.**")) && active == true && defined(printAssetPath) &&
	defined(slug.current) && !(slug.current in $reserved) &&
	count(images[defined(asset._ref) && defined(alt)]) >= 3 &&
	count(images[view == "top" && defined(asset._ref)]) > 0 &&
	count(images[view == "bottom" && defined(asset._ref)]) > 0 &&
	count(images[view == "interior" && defined(asset._ref)]) > 0`;

function publicClient() {
	const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
	const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
	if (!projectId || !dataset)
		throw new CreativaError("SERVICE_UNAVAILABLE", "Không thể tải dữ liệu Creativa.", 503);
	return sanityClient({
		projectId,
		dataset,
		apiVersion: "2022-09-19",
		useCdn: false,
		timeout: 10000,
	});
}

export function validImage(value: unknown): value is CreativaImage {
	return (
		isRecord(value) &&
		value._type === "image" &&
		isRecord(value.asset) &&
		value.asset._type === "reference" &&
		validCreativaImageRef(value.asset._ref) &&
		typeof value.alt === "string" &&
		!!value.alt.trim() &&
		typeof value.view === "string" &&
		["top", "bottom", "interior", "other"].includes(value.view) &&
		(value._key === undefined || (typeof value._key === "string" && !!value._key.trim()))
	);
}

export function commerceConfigurationError(): CreativaError {
	return new CreativaError("CONFIGURATION_ERROR", "Cấu hình sản phẩm Creativa chưa hợp lệ.", 503);
}

export function configuredText(value: unknown): string {
	if (typeof value !== "string" || !value.trim()) throw commerceConfigurationError();
	return value;
}

export function parseCreativaProduct(value: unknown, card = false): CreativaProduct {
	if (!isRecord(value)) throw commerceConfigurationError();
	const images: unknown[] = Array.isArray(value.images) ? value.images : [];
	if (
		!validCreativaDocumentId(value._id) ||
		value.active !== true ||
		!isRecord(value.slug) ||
		typeof value.slug.current !== "string" ||
		!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.slug.current) ||
		RESERVED_SKIN_SLUGS.includes(value.slug.current) ||
		!validCreativaPrintPath(value.printAssetPath) ||
		images.length < (card ? 2 : 3) ||
		!images.every(validImage) ||
		(!card &&
			!["top", "bottom", "interior"].every((view) =>
				images.some((image) => isRecord(image) && image.view === view)
			))
	)
		throw commerceConfigurationError();
	const createdAt = configuredText(value._createdAt);
	if (!Number.isFinite(Date.parse(createdAt))) throw commerceConfigurationError();
	const description = card ? undefined : parseCreativaDescription(value.description);
	return {
		_id: value._id,
		...(value._rev !== undefined && { _rev: configuredText(value._rev) }),
		_createdAt: createdAt,
		name: configuredText(value.name),
		slug: { current: value.slug.current },
		active: true,
		...(description !== undefined && { description }),
		images: (card ? images.slice(0, 2) : images).map((image) => ({
			_type: "image",
			asset: { _type: "reference", _ref: image.asset._ref },
			alt: image.alt,
			view: image.view,
			...(image._key && { _key: image._key }),
		})),
	};
}

function configuredOrder(value: unknown): number {
	if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0)
		throw commerceConfigurationError();
	return value;
}

export function parseCreativaModel(value: unknown): CreativaModel | null {
	if (!isRecord(value)) throw commerceConfigurationError();
	if (value.active === false) return null;
	if (
		value.active !== true ||
		!validCreativaDocumentId(value._id) ||
		!isRecord(value.code) ||
		typeof value.code.current !== "string" ||
		!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.code.current)
	)
		throw commerceConfigurationError();
	return {
		_id: configuredText(value._id),
		name: configuredText(value.name),
		code: value.code.current,
		sortOrder: configuredOrder(value.sortOrder),
		active: true,
	};
}

function coverageCode(value: unknown): CoverageCode {
	if (value !== "top" && value !== "bottom" && value !== "interior" && value !== "full") {
		throw commerceConfigurationError();
	}
	return value;
}

export function parseCreativaCoverage(value: unknown): CreativaCoverage | null {
	if (!isRecord(value)) throw commerceConfigurationError();
	if (value.active === false) return null;
	if (value.active !== true) throw commerceConfigurationError();
	const price = safeMoney(value.price);
	if (price === 0) throw commerceConfigurationError();
	return {
		_id: configuredText(value._id),
		code: coverageCode(value.code),
		name: configuredText(value.name),
		description: configuredText(value.description),
		sortOrder: configuredOrder(value.sortOrder),
		active: true,
		price,
	};
}

export function readPrimaryBank(value: unknown): {
	bank: CreativaBank | null;
	issue?: CreativaBankIssue;
} {
	if (!Array.isArray(value)) throw commerceConfigurationError();
	if (value.some((profile) => !isRecord(profile))) return { bank: null, issue: "invalid_primary" };
	const primary = value.filter(
		(profile) => profile.isActive === true && profile.isPrimary === true
	);
	if (!primary.length) return { bank: null, issue: "missing_primary" };
	if (primary.length !== 1) return { bank: null, issue: "multiple_primary" };
	const profile = primary[0];
	if (profile._type !== "creativaBankSettings" || !validCreativaDocumentId(profile._id))
		return { bank: null, issue: "invalid_primary" };
	for (const key of ["name", "bankName", "bankShortName", "accountHolderName", "accountNumber"]) {
		if (typeof profile[key] !== "string" || !profile[key].trim() || profile[key].length > 200)
			return { bank: null, issue: "invalid_primary" };
	}
	const image = profile.image;
	if (
		image !== undefined &&
		image !== null &&
		(!isRecord(image) ||
			image._type !== "image" ||
			!isRecord(image.asset) ||
			image.asset._type !== "reference" ||
			!validCreativaImageRef(image.asset._ref))
	)
		return { bank: null, issue: "invalid_primary" };
	return {
		bank: {
			profileId: profile._id,
			name: profile.name,
			bankName: profile.bankName,
			bankShortName: profile.bankShortName,
			accountName: profile.accountHolderName,
			accountNumber: profile.accountNumber,
			...(isRecord(image) &&
				isRecord(image.asset) && {
					image: { _type: "image", asset: { _type: "reference", _ref: String(image.asset._ref) } },
				}),
		},
	};
}

function ordered<T extends { _id: string; sortOrder: number }>(items: T[]): T[] {
	return items.sort(
		(a, b) => a.sortOrder - b.sortOrder || (a._id < b._id ? -1 : a._id > b._id ? 1 : 0)
	);
}

export function parseOptions(models: unknown, coverages: unknown, bank: unknown): CreativaOptions {
	if (!Array.isArray(models) || !Array.isArray(coverages)) throw commerceConfigurationError();
	const validModels: CreativaModel[] = [];
	const validCoverages: CreativaCoverage[] = [];
	for (const value of models) {
		const model = parseCreativaModel(value);
		if (model) validModels.push(model);
	}
	for (const value of coverages) {
		const coverage = parseCreativaCoverage(value);
		if (coverage) validCoverages.push(coverage);
	}
	if (new Set(validCoverages.map((c) => c.code)).size !== validCoverages.length) {
		throw new CreativaError("CONFIGURATION_ERROR", "Cấu hình phạm vi dán bị trùng.", 503);
	}
	const primary = readPrimaryBank(bank);
	return {
		models: ordered(validModels),
		coverages: ordered(validCoverages),
		bankAvailable: !!primary.bank,
		...(primary.issue && { bankIssue: primary.issue }),
	};
}

export async function getCreativaOptions(): Promise<CreativaOptions> {
	const result = await publicClient().fetch<unknown>(`{
		"models": *[_type == "creativaMacbookModel" && active == true &&
			!(_id in path("drafts.**")) && !(_id in path("versions.**"))]{
			_id,name,code{current},sortOrder,active},
		"coverages": *[_type == "creativaSkinCoverage" && active == true &&
			!(_id in path("drafts.**")) && !(_id in path("versions.**"))]{
			_id,code,name,description,sortOrder,active,price},
		"bank": ${CREATIVA_PRIMARY_BANK_QUERY}
	}`);
	if (!isRecord(result)) throw commerceConfigurationError();
	return parseOptions(result.models, result.coverages, result.bank);
}

type Cursor = { v: 1; q: string; at: string; id: string };
export function parseCatalogCursor(cursor: string | undefined, q: string): Cursor | null {
	if (!cursor) return null;
	try {
		if (cursor.length > 1000 || !/^[A-Za-z0-9_-]+$/.test(cursor)) throw new Error("cursor");
		const value: unknown = JSON.parse(Buffer.from(cursor, "base64url").toString("utf8"));
		if (
			!isRecord(value) ||
			value.v !== 1 ||
			value.q !== q ||
			typeof value.at !== "string" ||
			!Number.isFinite(Date.parse(value.at)) ||
			typeof value.id !== "string" ||
			!/^[A-Za-z0-9_-]{1,128}$/.test(value.id)
		)
			throw new Error("cursor");
		return { v: 1, q, at: value.at, id: value.id };
	} catch {
		throw new CreativaError(
			"INVALID_CURSOR",
			"Trang sản phẩm không hợp lệ. Vui lòng tìm lại.",
			400
		);
	}
}

export async function getCreativaCatalog(
	query = "",
	cursor?: string
): Promise<CreativaCatalogPage> {
	const q = query.trim();
	if (q.length > 80) throw new CreativaError("INVALID_QUERY", "Tìm kiếm tối đa 80 ký tự.", 400);
	const after = parseCatalogCursor(cursor, q);
	const [items, options] = await Promise.all([
		publicClient().fetch<unknown>(
			`*[${ELIGIBLE} &&
			($q == "" || lower(name) match $pattern) &&
			($after == false || _createdAt < $at || (_createdAt == $at && _id < $id))
		] | order(_createdAt desc,_id desc)[0...25]{
			_id,_rev,_createdAt,name,slug{current},active,printAssetPath,
			"images": images[0...2]${CREATIVA_IMAGE_PROJECTION}
		}`,
			{
				q,
				pattern: `*${q.toLowerCase().replace(/[\\*?[\]{}]/g, "\\$&")}*`,
				reserved: RESERVED_SKIN_SLUGS,
				after: !!after,
				at: after?.at || "",
				id: after?.id || "",
			}
		),
		getCreativaOptions(),
	]);
	if (!options.coverages.length)
		throw new CreativaError("CONFIGURATION_ERROR", "Chưa có giá Creativa khả dụng.", 503);
	if (!Array.isArray(items)) throw commerceConfigurationError();
	const page = items.slice(0, 24).map((item) => parseCreativaProduct(item, true));
	const last = page[page.length - 1];
	return {
		items: page,
		cursor:
			items.length > 24 && last
				? Buffer.from(
						JSON.stringify({
							v: 1,
							q,
							at: last._createdAt,
							id: last._id,
						})
				  ).toString("base64url")
				: null,
		fromPrice: Math.min(...options.coverages.map((c) => c.price)),
	};
}

export async function getCreativaProduct(
	slug: string
): Promise<{ product: CreativaProduct; options: CreativaOptions }> {
	if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || RESERVED_SKIN_SLUGS.includes(slug)) {
		throw new CreativaError("PRODUCT_NOT_FOUND", "Không tìm thấy sản phẩm.", 404);
	}
	const products = await publicClient().fetch<unknown>(
		`*[${ELIGIBLE} && slug.current == $slug][0...2]${PRODUCT_SOURCE_PROJECTION}`,
		{ slug, reserved: RESERVED_SKIN_SLUGS }
	);
	if (!Array.isArray(products)) throw commerceConfigurationError();
	if (products.length !== 1)
		throw new CreativaError("PRODUCT_NOT_FOUND", "Không tìm thấy sản phẩm.", 404);
	const product = parseCreativaProduct(products[0]);
	return { product, options: await getCreativaOptions() };
}

export const creativaCatalogApi = {
	getPage: (query = "", cursor?: string | null) => getCreativaCatalog(query, cursor || undefined),
	async getProductBySlug(slug: string): Promise<CreativaProduct | null> {
		try {
			return (await getCreativaProduct(slug)).product;
		} catch (error) {
			if (error instanceof CreativaError && error.code === "PRODUCT_NOT_FOUND") return null;
			throw error;
		}
	},
	getOptions: getCreativaOptions,
};
