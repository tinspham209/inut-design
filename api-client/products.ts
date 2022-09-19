import { client } from './sanity-client'

export const productsApi = {
	async getAllProducts() {
		const query = '*[_type == "products"]'
		return await client.fetch(query)
	},
}
