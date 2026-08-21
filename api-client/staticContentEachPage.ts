import { client } from "./sanity-browser";
import { StaticContentEachPage } from "../models/staticContentEachPage";

export const staticContentEachPageApi = {
	async getAll(): Promise<StaticContentEachPage[]> {
		const query = `*[_type == "configStaticContentEachPage"]{
			_id,
			name,
			"slug": slug.current,
			camKetMuaHang,
			moTaSanPham
		}`;
		return await client.fetch(query);
	},

	async getStaticContentBySlug(slug: string): Promise<StaticContentEachPage | null> {
		const query = `*[_type == "configStaticContentEachPage" && slug.current == $slug][0]{
			_id,
			name,
			"slug": slug.current,
			camKetMuaHang,
			moTaSanPham
		}`;
		return await client.fetch(query, { slug });
	},
};
