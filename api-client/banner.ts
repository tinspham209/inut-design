import { client } from './sanity-client'

export const bannerApi = {
	async getBanner() {
		const query = '*[_type == "banner"]'
		const banner = await client.fetch(query)
		return banner
	},
}
