import sanityClient from "@sanity/client";
import type {
	CreativaBank, CreativaCatalogPage, CreativaCoverage, CreativaImage,
	CreativaModel, CreativaOptions, CreativaProduct,
} from "@/models/creativa";
import { CreativaError, isRecord, RESERVED_SKIN_SLUGS, safeMoney } from "@/utils/creativa/contracts";

export const CREATIVA_IMAGE_PROJECTION = `{_type,_key,asset{_type,_ref},alt,view}`;
export const CREATIVA_PRODUCT_PROJECTION = `{
	_id,_rev,_createdAt,name,slug{current},active,description,artworkId,artworkVersion,
	images[]${CREATIVA_IMAGE_PROJECTION}
}`;
const ELIGIBLE = `_type == "creativaSkinProduct" && !(_id in path("drafts.**")) &&
	!(_id in path("versions.**")) && active == true && productionVerified == true &&
	defined(artworkId) && defined(artworkVersion) && defined(printAsset.asset._ref) &&
	defined(slug.current) && !(slug.current in $reserved) &&
	count(images[defined(asset._ref) && defined(alt)]) >= 3 &&
	count(images[view == "top" && defined(asset._ref)]) > 0 &&
	count(images[view == "bottom" && defined(asset._ref)]) > 0 &&
	count(images[view == "interior" && defined(asset._ref)]) > 0`;

function publicClient() {
	const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
	const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
	if (!projectId || !dataset) throw new CreativaError("SERVICE_UNAVAILABLE", "Không thể tải dữ liệu Creativa.", 503);
	return sanityClient({ projectId, dataset, apiVersion: "2022-09-19", useCdn: false, timeout: 10000 });
}

export function validImage(value: unknown): value is CreativaImage {
	return isRecord(value) && value._type === "image" && isRecord(value.asset) &&
		value.asset._type === "reference" && typeof value.asset._ref === "string" &&
		value.asset._ref.startsWith("image-") && typeof value.alt === "string" && !!value.alt.trim() &&
		["top", "bottom", "interior", "other"].includes(String(value.view));
}

export function readBank(value: unknown): CreativaBank | null {
	if (!isRecord(value) || value._type !== "creativaBankSettings" || value.active !== true) return null;
	for (const key of ["bankName", "accountName", "accountNumber"]) {
		if (typeof value[key] !== "string" || !String(value[key]).trim() || String(value[key]).length > 200) return null;
	}
	return {
		bankName: String(value.bankName), accountName: String(value.accountName),
		accountNumber: String(value.accountNumber),
		...(typeof value.transferInstructions === "string" && { transferInstructions: value.transferInstructions }),
	};
}

function ordered<T extends { _id: string; sortOrder: number }>(items: T[]): T[] {
	return items.sort((a, b) => a.sortOrder - b.sortOrder || (a._id < b._id ? -1 : a._id > b._id ? 1 : 0));
}

export function parseOptions(models: CreativaModel[], coverages: CreativaCoverage[], bank: unknown): CreativaOptions {
	const validModels = models.filter((m) => m.active === true && m.fitVerified === true &&
		typeof m.fitReference === "string" && !!m.fitReference.trim() &&
		typeof m.code === "string" && !!m.code.trim() && typeof m.name === "string" &&
		Number.isSafeInteger(m.sortOrder));
	for (const c of coverages) {
		if (!["top", "bottom", "interior", "full"].includes(c.code) || !c.name?.trim() ||
			!c.description?.trim() || !Number.isSafeInteger(c.sortOrder) || safeMoney(c.price) === 0) {
			throw new CreativaError("CONFIGURATION_ERROR", "Cấu hình phạm vi dán chưa hợp lệ.", 503);
		}
	}
	if (new Set(coverages.map((c) => c.code)).size !== coverages.length) {
		throw new CreativaError("CONFIGURATION_ERROR", "Cấu hình phạm vi dán bị trùng.", 503);
	}
	return { models: ordered(validModels), coverages: ordered(coverages), bankAvailable: !!readBank(bank) };
}

export async function getCreativaOptions(): Promise<CreativaOptions> {
	const result = await publicClient().fetch<{
		models: CreativaModel[]; coverages: CreativaCoverage[]; bank: unknown;
	}>(`{
		"models": *[_type == "creativaMacbookModel" && active == true && fitVerified == true &&
			!(_id in path("drafts.**")) && !(_id in path("versions.**"))]{
			_id,name,code,sortOrder,active,fitVerified,fitReference},
		"coverages": *[_type == "creativaSkinCoverage" && active == true &&
			!(_id in path("drafts.**")) && !(_id in path("versions.**"))]{
			_id,code,name,description,sortOrder,active,price},
		"bank": *[_id == "creativa-bank-settings" && _type == "creativaBankSettings"][0]{
			_type,active,bankName,accountName,accountNumber,transferInstructions}
	}`);
	return parseOptions(result.models, result.coverages, result.bank);
}

type Cursor = { v: 1; q: string; at: string; id: string };
export function parseCatalogCursor(cursor: string | undefined, q: string): Cursor | null {
	if (!cursor) return null;
	try {
		if (cursor.length > 1000 || !/^[A-Za-z0-9_-]+$/.test(cursor)) throw new Error("cursor");
		const value: unknown = JSON.parse(Buffer.from(cursor, "base64url").toString("utf8"));
		if (!isRecord(value) || value.v !== 1 || value.q !== q ||
			typeof value.at !== "string" || !Number.isFinite(Date.parse(value.at)) ||
			typeof value.id !== "string" || !/^[A-Za-z0-9_-]{1,128}$/.test(value.id)) throw new Error("cursor");
		return { v: 1, q, at: value.at, id: value.id };
	} catch {
		throw new CreativaError("INVALID_CURSOR", "Trang sản phẩm không hợp lệ. Vui lòng tìm lại.", 400);
	}
}

export async function getCreativaCatalog(query = "", cursor?: string): Promise<CreativaCatalogPage> {
	const q = query.trim();
	if (q.length > 80) throw new CreativaError("INVALID_QUERY", "Tìm kiếm tối đa 80 ký tự.", 400);
	const after = parseCatalogCursor(cursor, q);
	const [items, options] = await Promise.all([
		publicClient().fetch<CreativaProduct[]>(`*[${ELIGIBLE} &&
			($q == "" || lower(name) match $pattern) &&
			($after == false || _createdAt < $at || (_createdAt == $at && _id < $id))
		] | order(_createdAt desc,_id desc)[0...25]{
			_id,_rev,_createdAt,name,slug{current},active,description,artworkId,artworkVersion,
			"images": images[0...2]${CREATIVA_IMAGE_PROJECTION}
		}`, {
			q, pattern: `*${q.toLowerCase().replace(/[\\*?[\]{}]/g, "\\$&")}*`,
			reserved: RESERVED_SKIN_SLUGS, after: !!after, at: after?.at || "", id: after?.id || "",
		}),
		getCreativaOptions(),
	]);
	if (!options.coverages.length) throw new CreativaError("CONFIGURATION_ERROR", "Chưa có giá Creativa khả dụng.", 503);
	const page = items.slice(0, 24);
	const last = page[page.length - 1];
	return {
		items: page,
		cursor: items.length > 24 && last ? Buffer.from(JSON.stringify({
			v: 1, q, at: last._createdAt, id: last._id,
		})).toString("base64url") : null,
		fromPrice: Math.min(...options.coverages.map((c) => c.price)),
	};
}

export async function getCreativaProduct(slug: string): Promise<{ product: CreativaProduct; options: CreativaOptions }> {
	if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || RESERVED_SKIN_SLUGS.includes(slug)) {
		throw new CreativaError("PRODUCT_NOT_FOUND", "Không tìm thấy sản phẩm.", 404);
	}
	const [products, options] = await Promise.all([
		publicClient().fetch<CreativaProduct[]>(`*[${ELIGIBLE} && slug.current == $slug][0...2]${CREATIVA_PRODUCT_PROJECTION}`,
			{ slug, reserved: RESERVED_SKIN_SLUGS }),
		getCreativaOptions(),
	]);
	if (products.length !== 1) throw new CreativaError("PRODUCT_NOT_FOUND", "Không tìm thấy sản phẩm.", 404);
	return { product: products[0], options };
}

export const creativaCatalogApi = {
	getPage: (query = "", cursor?: string | null) => getCreativaCatalog(query, cursor || undefined),
	async getProductBySlug(slug: string): Promise<CreativaProduct | null> {
		try { return (await getCreativaProduct(slug)).product; }
		catch (error) {
			if (error instanceof CreativaError && error.code === "PRODUCT_NOT_FOUND") return null;
			throw error;
		}
	},
	getOptions: getCreativaOptions,
};
