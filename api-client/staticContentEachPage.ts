import { client } from "./sanity-client";
import { StaticContentEachPage } from "../models/staticContentEachPage";

export const staticContentEachPageApi = {
	async getAll(): Promise<StaticContentEachPage[]> {
		const query = `*[_type == "configStaticContentEachPage"]`;
		return await client.fetch(query);
	},

	async getStaticContentBySlug(slug: string): Promise<StaticContentEachPage | null> {
		const query = `*[_type == "configStaticContentEachPage" && slug.current == $slug][0]`;
		return await client.fetch(query, { slug });
	},
};
