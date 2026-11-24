import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://inutdesign.com").replace(/\/$/, "");
const baseline = JSON.parse(
	await readFile(path.join(root, "artifacts/migration/baseline/slugs.json"), "utf8"),
);
const routes = JSON.parse(
	await readFile(path.join(root, "artifacts/migration/baseline/routes.json"), "utf8"),
);
if (baseline.validation?.status !== "pass") {
	throw new Error("Approved slug baseline is not valid; generate SEO artifacts only after source validation passes.");
}

const excluded = [
	"/search",
	"/creativa/cart",
	"/creativa/checkout",
	"/creativa/order-tracking",
];
const paths = [
	...routes.routes.filter((route) => !route.path.includes("[")).map((route) => route.path),
	...baseline.paths,
]
	.filter((route) => !excluded.some((candidate) => route === candidate || route.startsWith(`${candidate}/`)))
	.sort((left, right) => left.localeCompare(right));
const uniquePaths = [...new Set(paths)];
const escapeXml = (value) =>
	value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniquePaths.map((route) => `  <url><loc>${escapeXml(`${siteUrl}${route === "/" ? "" : route}`)}</loc></url>`).join("\n")}
</urlset>
`;
const robots = `User-agent: *
Allow: /
Disallow: /*?updated-max=*
Disallow: /signup
Disallow: /*.avif$
Disallow: /_next/image
Disallow: /_next/static/
Disallow: /apple-app-site-association
Disallow: /.well-known/
Host: ${siteUrl}
Sitemap: ${siteUrl}/sitemap.xml

User-agent: Mediapartners-Google
Allow: /search
Disallow: *archive.html

User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /
`;

await mkdir(path.join(root, "public"), { recursive: true });
await Promise.all([
	writeFile(path.join(root, "public/sitemap.xml"), sitemap),
	writeFile(path.join(root, "public/robots.txt"), robots),
]);
console.log(`Generated sitemap and robots for ${uniquePaths.length} public paths.`);
