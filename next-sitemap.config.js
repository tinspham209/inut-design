/** @type {import('next-sitemap').IConfig} */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://inutdesign.com";
const nextSitemapConfig = {
	siteUrl,
	generateIndexSitemap: false,
	exclude: [
		"/search",
		"/creativa/cart",
		"/creativa/checkout",
		"/creativa/order-tracking",
		"/creativa/order-tracking/*",
		"/creativa/skin-laptop/huong-dan-su-dung",
		"/creativa/skin-laptop/huong-dan-su-dung/*",
	],

	generateRobotsTxt: true,
	robotsTxtOptions: {
		policies: [
			{
				userAgent: "*",
				allow: "/",
				disallow: [
					"/*?updated-max=*",
					"/signup",
					"/*.avif$",
					"/_next/image",
					"/_next/static/",
					"/apple-app-site-association",
					"/.well-known/",
				],
				host: siteUrl,
				siteMap: `${siteUrl}/sitemap.xml`,
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
