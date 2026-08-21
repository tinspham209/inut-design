import { client } from "./sanity-browser";
import { CatalogPage } from "@/models/catalog";
import { Products } from "@/models/products";

const IMAGE_PROJECTION = `_key, _type, asset, crop, hotspot`;
const PRODUCT_LIST_FIELDS = `_id, _type, name, slug{current}, image[0...2]{${IMAGE_PROJECTION}}, productType, macnutType, type, special, _createdAt`;
const PRODUCT_DETAIL_FIELDS = `_id, _type, name, slug{current}, image[]{${IMAGE_PROJECTION}}, details, productType, macnutType, type, special, _createdAt, _updatedAt, _rev`;
const DEFAULT_PAGE_SIZE = 24;

const safePage = (page?: number) => Math.max(1, Math.floor(page || 1));
const safePageSize = (pageSize?: number) => Math.min(48, Math.max(1, Math.floor(pageSize || DEFAULT_PAGE_SIZE)));
const searchPattern = (search?: string) =>
	search ? `*${search.trim().replace(/[*?]/g, " ").slice(0, 80)}*` : "";

export const productsApi = {
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

		return { items, total, page, pageSize };
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

		return { items, total, page, pageSize };
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
