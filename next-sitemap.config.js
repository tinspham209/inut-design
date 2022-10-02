/** @type {import('next-sitemap').IConfig} */
module.exports = {
	siteUrl: "https://inutdesign.com",
	generateIndexSitemap: false,

	generateRobotsTxt: true,
	robotsTxtOptions: {
		policies: [
			{
				userAgent: "*",
				allow: "/",
				disallow: "/*?updated-max=*",
				host: "https://inutdesign.com",
				siteMap: "https://inutdesign.com/sitemap.xml",
			},
			{ userAgent: "Mediapartners-Google", allow: "/search", disallow: "*archive.html" },
		],
	},
};
