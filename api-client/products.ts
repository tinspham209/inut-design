import { client } from './sanity-client';

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
};
