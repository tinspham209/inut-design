import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const errors = [];
for (const file of ["public/sitemap.xml", "public/robots.txt"]) {
	const content = await readFile(path.join(root, file), "utf8");
	if (!content.includes("https://inutdesign.com")) errors.push(`${file} lost the production host.`);
	if (/workers\.dev|trycloudflare|preview\./i.test(content)) {
		errors.push(`${file} contains a preview hostname.`);
	}
}
const searchIndex = await readFile(path.join(root, "public/search-index.json"), "utf8").catch(() => "");
if (/workers\.dev|trycloudflare|preview\./i.test(searchIndex)) {
	errors.push("public/search-index.json contains a preview hostname.");
}
const config = await readFile(path.join(root, "next.config.js"), "utf8");
if (!config.includes("DEPLOYMENT_CHANNEL") || !config.includes("X-Robots-Tag")) {
	errors.push("next.config.js does not declare preview-channel X-Robots-Tag control.");
}
const cfConfig = await readFile(path.join(root, "cloudflare.config.ts"), "utf8");
if (!cfConfig.includes('deploymentChannel === "production"') || !cfConfig.includes("!/robots.txt") || !cfConfig.includes("!/sitemap.xml")) {
	errors.push("cloudflare.config.ts does not restrict /robots.txt and /sitemap.xml static bypass to production.");
}
const headersFile = await readFile(path.join(root, "public/_headers"), "utf8");
if (/x-robots-tag/i.test(headersFile)) {
	errors.push("public/_headers must not set X-Robots-Tag.");
}
if (errors.length) {
	console.error(`Preview SEO check failed (${errors.length}):`);
	for (const error of errors) console.error(`- ${error}`);
	process.exitCode = 1;
} else {
	console.log("Preview SEO artifacts retain production canonical host and reject preview URLs.");
}
