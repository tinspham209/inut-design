import { client } from "./sanity-client";

export const productsApi = {
	async getAllProducts() {
		const query = '*[_type == "products"]';
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

	async getAllProductsMacnut() {
		const query = '*[_type == "macnut"]';
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
