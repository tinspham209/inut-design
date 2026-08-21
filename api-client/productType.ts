import { client } from "./sanity-browser";

export const productTypeApi = {
	async getAll() {
		const query = '*[_type == "productType"]{_id, _type, name, slug{current}}';
		return await client.fetch(query);
	},
	async getAllMacNut() {
		const query = '*[_type == "macnutType"]{_id, _type, name, slug{current}}';
		return await client.fetch(query);
	},
};
