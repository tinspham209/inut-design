import { client } from './sanity-client';

export const bannerApi = {
	async getBanner() {
		const query = '*[_type == "banner"]';
		const banner = await client.fetch(query);
		return banner;
	},
	async getBannerHomePage() {
		const query = `*[_type == "banner" && slug.current == 'homepage']`;
		const banner = await client.fetch(query);
		return banner;
	},
	async getBannerProductsPage() {
		const query = `*[_type == "banner" && slug.current == 'products-page']`;
		const banner = await client.fetch(query);
		return banner;
	},
};
