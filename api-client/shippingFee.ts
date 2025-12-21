import { client } from "./sanity-client";
import { ShippingFee } from "../models/shippingFee";

export const shippingFeeApi = {
	async getAll(): Promise<ShippingFee[]> {
		const query = `*[_type == "shippingFee"]{_id,name,fee,"slug":slug.current,note}`;
		return await client.fetch(query);
	},
	async getBySlug(slug: string): Promise<ShippingFee | null> {
		const query = `*[_type == "shippingFee" && slug.current == $slug][0]{_id,name,fee,"slug":slug.current,note}`;
		return await client.fetch(query, { slug });
	},
};
