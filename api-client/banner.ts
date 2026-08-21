import { client } from "./sanity-browser";

export const bannerApi = {
	async getBanners() {
		const query = `*[_type == "banner"]{
			_id,
			_rev,
			_type,
			_updatedAt,
			createdAt,
			buttonText,
			slug{current},
			image{_type, asset, crop, hotspot}
		}`;
		const banner = await client.fetch(query);
		return banner;
	},
	async getBannerPage(slug: string) {
		const query = `*[_type == "banner" && slug.current == $slug]{
			_id,
			_rev,
			_type,
			_updatedAt,
			createdAt,
			buttonText,
			slug{current},
			image{_type, asset, crop, hotspot}
		}`;
		const banner = await client.fetch(query, { slug });
		return banner;
	},
};
