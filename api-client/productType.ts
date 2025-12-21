import { client } from "./sanity-client";

export const productTypeApi = {
	async getAll() {
		const query = '*[_type == "productType"]';
		return await client.fetch(query);
	},
	async getAllMacNut() {
		const query = '*[_type == "macnutType"]';
		return await client.fetch(query);
	},
};
