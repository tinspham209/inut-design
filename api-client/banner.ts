import { client } from "./sanity-client";

export const bannerApi = {
	async getBanners() {
		const query = '*[_type == "banner"]';
		const banner = await client.fetch(query);
		return banner;
	},
	async getBannerPage(slug: string) {
		const query = `*[_type == "banner" && slug.current == '${slug}']`;
		const banner = await client.fetch(query);
		return banner;
	},
};
