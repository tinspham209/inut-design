import { client } from './sanity-client'

export const productTypeApi = {
	async getAll() {
		const query = '*[_type == "productType"]'
		return await client.fetch(query)
	},
}
