import { client } from "./sanity-client";

export const productsApi = {
	async getAllProducts(limit?: number) {
		let query = '*[_type == "products"]';
		if (limit) {
			query += ` | order(_createdAt desc)[0...${limit}]`;
		}
		return await client.fetch(query);
	},

	async getSpecialProducts(limit?: number) {
		let query = '*[_type == "products" && special == true] | order(_createdAt desc)';
		if (limit) {
			query += ` | order(_createdAt desc)[0...${limit}]`;
		}
		return await client.fetch(query);
	},

	async getAllSlugs() {
		const query = `*[_type == "products"]{
			slug {
				current
			}
		}`;
		return await client.fetch(query);
	},
	async getProductBySlug(slug: string) {
		const query = `*[_type == "products" && slug.current == '${slug}'][0]`;
		return await client.fetch(query);
	},

	async getAllProductsMacnut(limit?: number) {
		let query = '*[_type == "macnut"]';
		if (limit) {
			query += ` | order(_createdAt desc)[0...${limit}]`;
		}
		return await client.fetch(query);
	},
	async getSpecialProductsMacnut(limit?: number) {
		let query = '*[_type == "macnut" && special == true] | order(_createdAt desc)';
		if (limit) {
			query += ` | order(_createdAt desc)[0...${limit}]`;
		}
		return await client.fetch(query);
	},

	async getAllSlugsMacnut() {
		const query = `*[_type == "macnut"]{
			slug {
				current
			}
		}`;
		return await client.fetch(query);
	},
	async getProductBySlugMacnut(slug: string) {
		const query = `*[_type == "macnut" && slug.current == '${slug}'][0]`;
		return await client.fetch(query);
	},
};
