/** @type {import('next-sitemap').IConfig} */
const nextSitemapConfig = {
	siteUrl: "https://inutdesign.com",
	generateIndexSitemap: false,

	generateRobotsTxt: true,
	robotsTxtOptions: {
		policies: [
			{
				userAgent: "*",
				allow: "/",
				disallow: ["/*?updated-max=*", "/signup"],
				host: "https://inutdesign.com",
				siteMap: "https://inutdesign.com/sitemap.xml",
			},
			{ userAgent: "Mediapartners-Google", allow: "/search", disallow: "*archive.html" },
			// AI Search Crawlers — allow full indexing for AI-powered search visibility
			{ userAgent: "GPTBot", allow: "/" },
			{ userAgent: "ChatGPT-User", allow: "/" },
			{ userAgent: "anthropic-ai", allow: "/" },
			{ userAgent: "ClaudeBot", allow: "/" },
			{ userAgent: "PerplexityBot", allow: "/" },
		],
	},
};

export default nextSitemapConfig;
