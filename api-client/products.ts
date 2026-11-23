import { client } from "./sanity-browser";
import { CatalogPage } from "@/models/catalog";
import { Products } from "@/models/products";
import { Banner } from "@/models/banner";
import { ProductType } from "@/models/products";
import { StaticContentEachPage } from "@/models/staticContentEachPage";

const IMAGE_PROJECTION = `_key, _type, asset, crop, hotspot`;
const PRODUCT_LIST_FIELDS = `_id, _type, name, slug{current}, image[0...2]{${IMAGE_PROJECTION}}, productType, macnutType, type, special, _createdAt`;
const PRODUCT_DETAIL_FIELDS = `_id, _type, name, slug{current}, image[]{${IMAGE_PROJECTION}}, details, productType, macnutType, type, special, _createdAt, _updatedAt, _rev`;
const DEFAULT_PAGE_SIZE = 24;

const normalizeCatalogTotal = (total: unknown): number =>
	typeof total === "number" && Number.isFinite(total) && total >= 0 ? total : 0;

const safePage = (page?: number) => Math.max(1, Math.floor(page || 1));
const safePageSize = (pageSize?: number) => Math.min(48, Math.max(1, Math.floor(pageSize || DEFAULT_PAGE_SIZE)));
const searchPattern = (search?: string) =>
	search ? `*${search.trim().replace(/[*?]/g, " ").slice(0, 80)}*` : "";

export type ProductListingContent = CatalogPage<Products[number]> & {
	types: ProductType[];
	banner: Banner[];
};

export type ProductRelatedContent = {
	products: Products;
	staticContent: StaticContentEachPage | null;
};

const BANNER_FIELDS = `_id, _rev, _type, _updatedAt, createdAt, buttonText, slug{current}, image{_type, asset, crop, hotspot}`;

const getGroupedProductListing = async (
	productType: "products" | "macnut",
	typeDocument: "productType" | "macnutType",
	bannerSlug: string,
	options: { page?: number; pageSize?: number } = {}
): Promise<ProductListingContent> => {
	const page = safePage(options.page);
	const pageSize = safePageSize(options.pageSize);
	const start = (page - 1) * pageSize;
	const where = `*[_type == "${productType}" && !(_id in path("drafts.**"))]`;
	const query = `{
		"items": ${where} | order(_createdAt desc)[${start}...${start + pageSize}]{${PRODUCT_LIST_FIELDS}},
		"total": count(${where}),
		"types": *[_type == "${typeDocument}"]{_id, _type, name, slug{current}},
		"banner": *[_type == "banner" && slug.current == $bannerSlug]{${BANNER_FIELDS}}
	}`;
	const result = await client.fetch<Pick<ProductListingContent, "items" | "total" | "types" | "banner">>(
		query,
		{ bannerSlug }
	);
	return {
		items: result.items,
		total: normalizeCatalogTotal(result.total),
		types: result.types,
		banner: result.banner,
		page,
		pageSize,
	};
};

export const productsApi = {
	async getRelatedPageContent(kind: "products" | "macnut"): Promise<ProductRelatedContent> {
		const staticSlug = kind === "products" ? "products" : "macnut";
		const query = `{
			"products": *[_type == "${kind}"]{${PRODUCT_LIST_FIELDS}} | order(_createdAt desc)[0...20],
			"staticContent": *[_type == "configStaticContentEachPage" && slug.current == $staticSlug][0]{_id,name,"slug":slug.current,camKetMuaHang,moTaSanPham}
		}`;
		return client.fetch<ProductRelatedContent>(query, { staticSlug });
	},
	async getLaptopListingContent(options: { page?: number; pageSize?: number } = {}) {
		return getGroupedProductListing("products", "productType", "products-page", options);
	},
	async getMacnutListingContent(options: { page?: number; pageSize?: number } = {}) {
		return getGroupedProductListing("macnut", "macnutType", "macnut-page", options);
	},
	async getAllProducts(limit?: number) {
		let query = `*[_type == "products"]{${PRODUCT_LIST_FIELDS}} | order(_createdAt desc)`;
		if (limit !== undefined) {
			query += `[0...${Math.max(0, Math.floor(limit))}]`;
		}
		return await client.fetch(query);
	},

	async getSpecialProducts(limit?: number) {
		let query = `*[_type == "products" && special == true]{${PRODUCT_LIST_FIELDS}} | order(_createdAt desc)`;
		if (limit !== undefined) {
			query += `[0...${Math.max(0, Math.floor(limit))}]`;
		}
		return await client.fetch(query);
	},

	async getAllSlugs() {
		const query = `*[_type == "products"]{
			slug{current}
		}`;
		return await client.fetch(query);
	},
	async getProductBySlug(slug: string) {
		const query = `*[_type == "products" && slug.current == $slug][0]{${PRODUCT_DETAIL_FIELDS}}`;
		return await client.fetch(query, { slug });
	},

	async getProductsPage(options: {
		page?: number;
		pageSize?: number;
		filter?: string;
		search?: string;
	} = {}): Promise<CatalogPage<any>> {
		const page = safePage(options.page);
		const pageSize = safePageSize(options.pageSize);
		const start = (page - 1) * pageSize;
		const filter = options.filter || "";
		const search = searchPattern(options.search);
		const params = { filter, search };
		const where = `*[_type == "products" && !(_id in path("drafts.**")) && ($filter == "" || productType->slug.current == $filter) && ($search == "" || name match $search || productType->name match $search || productType->slug.current == $search)]`;

		const [items, total] = await Promise.all([
			client.fetch(
				`${where} | order(_createdAt desc)[${start}...${start + pageSize}]{${PRODUCT_LIST_FIELDS}}`,
				params
			),
			client.fetch(`count(${where})`, params),
		]);

		return { items, total: normalizeCatalogTotal(total), page, pageSize };
	},

	async getProductsBatch(options: {
		page?: number;
		pageSize?: number;
		filter?: string;
		search?: string;
	} = {}): Promise<Products> {
		const page = safePage(options.page);
		const pageSize = safePageSize(options.pageSize);
		const start = (page - 1) * pageSize;
		const filter = options.filter || "";
		const search = searchPattern(options.search);
		const params = { filter, search };
		const where = `*[_type == "products" && !(_id in path("drafts.**")) && ($filter == "" || productType->slug.current == $filter) && ($search == "" || name match $search || productType->name match $search || productType->slug.current == $search)]`;

		return client.fetch(
			`${where} | order(_createdAt desc)[${start}...${start + pageSize}]{${PRODUCT_LIST_FIELDS}}`,
			params
		);
	},

	async getAllProductsMacnut(limit?: number) {
		let query = `*[_type == "macnut"]{${PRODUCT_LIST_FIELDS}} | order(_createdAt desc)`;
		if (limit !== undefined) {
			query += `[0...${Math.max(0, Math.floor(limit))}]`;
		}
		return await client.fetch(query);
	},
	async getSpecialProductsMacnut(limit?: number) {
		let query = `*[_type == "macnut" && special == true]{${PRODUCT_LIST_FIELDS}} | order(_createdAt desc)`;
		if (limit !== undefined) {
			query += `[0...${Math.max(0, Math.floor(limit))}]`;
		}
		return await client.fetch(query);
	},

	async getAllSlugsMacnut() {
		const query = `*[_type == "macnut"]{
			slug{current}
		}`;
		return await client.fetch(query);
	},
	async getProductBySlugMacnut(slug: string) {
		const query = `*[_type == "macnut" && slug.current == $slug][0]{${PRODUCT_DETAIL_FIELDS}}`;
		return await client.fetch(query, { slug });
	},

	async getMacnutPage(options: {
		page?: number;
		pageSize?: number;
		filter?: string;
		search?: string;
	} = {}): Promise<CatalogPage<any>> {
		const page = safePage(options.page);
		const pageSize = safePageSize(options.pageSize);
		const start = (page - 1) * pageSize;
		const filter = options.filter || "";
		const search = searchPattern(options.search);
		const params = { filter, search };
		const where = `*[_type == "macnut" && !(_id in path("drafts.**")) && ($filter == "" || macnutType->slug.current == $filter) && ($search == "" || name match $search || macnutType->name match $search || macnutType->slug.current == $search)]`;

		const [items, total] = await Promise.all([
			client.fetch(
				`${where} | order(_createdAt desc)[${start}...${start + pageSize}]{${PRODUCT_LIST_FIELDS}}`,
				params
			),
			client.fetch(`count(${where})`, params),
		]);

		return { items, total: normalizeCatalogTotal(total), page, pageSize };
	},

	async getMacnutBatch(options: {
		page?: number;
		pageSize?: number;
		filter?: string;
		search?: string;
	} = {}): Promise<Products> {
		const page = safePage(options.page);
		const pageSize = safePageSize(options.pageSize);
		const start = (page - 1) * pageSize;
		const filter = options.filter || "";
		const search = searchPattern(options.search);
		const params = { filter, search };
		const where = `*[_type == "macnut" && !(_id in path("drafts.**")) && ($filter == "" || macnutType->slug.current == $filter) && ($search == "" || name match $search || macnutType->name match $search || macnutType->slug.current == $search)]`;

		return client.fetch(
			`${where} | order(_createdAt desc)[${start}...${start + pageSize}]{${PRODUCT_LIST_FIELDS}}`,
			params
		);
	},
};
