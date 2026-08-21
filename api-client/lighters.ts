import { client } from "./sanity-browser";
import { LighterProduct, LighterType, LighterProductWithType } from "@/models/cart";
import { CatalogPage } from "@/models/catalog";

const IMAGE_PROJECTION = `_key, _type, asset, crop, hotspot`;
const LIGHTER_LIST_FIELDS = `_id, _type, name, slug{current}, image[0...2]{${IMAGE_PROJECTION}}, lighterType, special, _createdAt`;
const LIGHTER_DETAIL_FIELDS = `_id, _type, name, slug{current}, image[]{${IMAGE_PROJECTION}}, details, lighterType, special, _createdAt, _updatedAt`;
const LIGHTER_TYPE_LIST_FIELDS = `_id, _type, name, slug{current}, priceTiers[]{quantity, price}, _createdAt, _updatedAt`;
const LIGHTER_TYPE_DETAIL_FIELDS = `${LIGHTER_TYPE_LIST_FIELDS}, description`;
const DEFAULT_PAGE_SIZE = 24;

const safePage = (page?: number) => Math.max(1, Math.floor(page || 1));
const safePageSize = (pageSize?: number) => Math.min(48, Math.max(1, Math.floor(pageSize || DEFAULT_PAGE_SIZE)));

export const lightersApi = {
	// ==================== Lighter Products ====================

	/**
	 * Get all lighter products
	 */
	async getAllLighters(limit?: number): Promise<LighterProduct[]> {
		let query = `*[_type == "lighterProducts"]{${LIGHTER_LIST_FIELDS}} | order(_createdAt desc)`;
		if (limit !== undefined) {
			query += `[0...${Math.max(0, Math.floor(limit))}]`;
		}
		return await client.fetch(query);
	},

	async getLightersPage(options: {
		page?: number;
		pageSize?: number;
		filter?: string;
	} = {}): Promise<CatalogPage<LighterProduct>> {
		const page = safePage(options.page);
		const pageSize = safePageSize(options.pageSize);
		const start = (page - 1) * pageSize;
		const filter = options.filter || "";
		const params = { filter };
		const where = `*[_type == "lighterProducts" && !(_id in path("drafts.**")) && ($filter == "" || lighterType->slug.current == $filter)]`;

		const [items, total] = await Promise.all([
			client.fetch(
				`${where} | order(_createdAt desc)[${start}...${start + pageSize}]{${LIGHTER_LIST_FIELDS}}`,
				params
			),
			client.fetch(`count(${where})`, params),
		]);

		return { items, total, page, pageSize };
	},

	async getLightersBatch(options: {
		page?: number;
		pageSize?: number;
		filter?: string;
	} = {}): Promise<LighterProduct[]> {
		const page = safePage(options.page);
		const pageSize = safePageSize(options.pageSize);
		const start = (page - 1) * pageSize;
		const filter = options.filter || "";
		const where = `*[_type == "lighterProducts" && !(_id in path("drafts.**")) && ($filter == "" || lighterType->slug.current == $filter)]`;

		return client.fetch(
			`${where} | order(_createdAt desc)[${start}...${start + pageSize}]{${LIGHTER_LIST_FIELDS}}`,
			{ filter }
		);
	},

	/**
	 * Get all lighter product slugs (for static path generation)
	 */
	async getAllLighterSlugs() {
		const query = `*[_type == "lighterProducts"]{
			slug{current}
		}`;
		return await client.fetch(query);
	},

	/**
	 * Get a single lighter product by slug
	 */
	async getLighterBySlug(slug: string): Promise<LighterProduct> {
		const query = `*[_type == "lighterProducts" && slug.current == $slug][0]{${LIGHTER_DETAIL_FIELDS}}`;
		return await client.fetch(query, { slug });
	},

	/**
	 * Get a lighter product with its type details populated
	 */
	async getLighterWithTypeBySlug(slug: string): Promise<LighterProductWithType> {
		const query = `*[_type == "lighterProducts" && slug.current == $slug][0]{
			${LIGHTER_DETAIL_FIELDS},
			"lighterTypeDetails": lighterType->{${LIGHTER_TYPE_DETAIL_FIELDS}}
		}`;
		return await client.fetch(query, { slug });
	},

	// ==================== Lighter Types ====================

	/**
	 * Get all lighter types
	 */
	async getAllLighterTypes(): Promise<LighterType[]> {
		const query = `*[_type == "lighterType"]{${LIGHTER_TYPE_LIST_FIELDS}} | order(name asc)`;
		return await client.fetch(query);
	},

	/**
	 * Get a single lighter type by ID
	 */
	async getLighterTypeById(id: string): Promise<LighterType> {
		const query = `*[_type == "lighterType" && _id == $id][0]{${LIGHTER_TYPE_DETAIL_FIELDS}}`;
		return await client.fetch(query, { id });
	},

	/**
	 * Get a single lighter type by slug
	 */
	async getLighterTypeBySlug(slug: string): Promise<LighterType> {
		const query = `*[_type == "lighterType" && slug.current == $slug][0]{${LIGHTER_TYPE_DETAIL_FIELDS}}`;
		return await client.fetch(query, { slug });
	},

	// ==================== Special/Featured Products ====================

	/**
	 * Get special/featured lighter products for homepage
	 */
	async getSpecialLighters(limit?: number): Promise<LighterProduct[]> {
		let query = `*[_type == "lighterProducts" && special == true]{${LIGHTER_LIST_FIELDS}} | order(_createdAt desc)`;
		if (limit !== undefined) {
			query += `[0...${Math.max(0, Math.floor(limit))}]`;
		}
		return await client.fetch(query);
	},

	/**
	 * Get a lighter product by exact name (for custom builder)
	 */
	async getLighterByName(name: string): Promise<LighterProductWithType> {
		const query = `*[_type == "lighterProducts" && name == $name][0]{
			${LIGHTER_DETAIL_FIELDS},
			"lighterTypeDetails": lighterType->{${LIGHTER_TYPE_DETAIL_FIELDS}}
		}`;
		return await client.fetch(query, { name });
	},
};
