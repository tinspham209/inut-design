import { client } from "./sanity-client";

export const priceLaptopApi = {
	async getAll() {
		const query = `*[_type == "price-laptop"]{
			"id": _id,
			"createdAt": _createdAt,
			title,
			price,
			"slug": slug.current
		}`;
		return await client.fetch(query);
	},
};
