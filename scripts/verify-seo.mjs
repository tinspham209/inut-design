#!/usr/bin/env node

import { readFileSync, existsSync } from "fs";
import { join, resolve } from "path";

const ROOT = resolve(process.argv[2] || process.cwd());
const ROBOTS_PATH = join(ROOT, "public", "robots.txt");
const SITEMAP_PATH = join(ROOT, "public", "sitemap.xml");

let exitCode = 0;
const fail = (msg) => { console.error("  ✗ " + msg); exitCode = 1; };
const pass = (msg) => { console.log("  ✓ " + msg); };

function assertRobotsTxt(content) {
	console.log("\n[robots.txt]");

	if (content.includes("Disallow: /*.avif$")) {
		pass("Disallow: /*.avif$ present");
	} else {
		fail("Missing Disallow: /*.avif$");
	}

	if (content.includes("Disallow: /_next/image")) {
		pass("Disallow: /_next/image present");
	} else {
		fail("Missing Disallow: /_next/image");
	}

	if (content.includes("Allow: /")) {
		pass("Allow: / present");
	} else {
		fail("Missing Allow: /");
	}

	if (content.includes("Host: https://inutdesign.com")) {
		pass("Host: https://inutdesign.com present");
	} else {
		fail("Missing Host: https://inutdesign.com");
	}

	if (content.includes("Sitemap: https://inutdesign.com/sitemap.xml")) {
		pass("Sitemap: https://inutdesign.com/sitemap.xml present");
	} else {
		fail("Missing Sitemap URL");
	}
}

function assertSitemapXml(content) {
	console.log("\n[sitemap.xml]");

	const urls = [...content.matchAll(/<loc>(.+?)<\/loc>/g)].map((m) => m[1]);

	if (urls.length > 0) {
		pass(`${urls.length} URLs found in sitemap`);
	} else {
		fail("No URLs found in sitemap");
	}

	const searchUrls = urls.filter((u) => u.includes("/search"));
	if (searchUrls.length === 0) {
		pass("/search excluded from sitemap");
	} else {
		fail(`Found ${searchUrls.length} /search URL(s) in sitemap: ${searchUrls[0]}`);
	}

	const queryParamUrls = urls.filter((u) => u.includes("?"));
	if (queryParamUrls.length === 0) {
		pass("No query-parameter URLs in sitemap");
	} else {
		fail(`Found ${queryParamUrls.length} query-parameter URL(s) in sitemap`);
	}

	const expected = [
		"https://inutdesign.com",
		"https://inutdesign.com/blog",
		"https://inutdesign.com/contact",
		"https://inutdesign.com/san-pham",
		"https://inutdesign.com/san-pham/skin-laptop",
		"https://inutdesign.com/san-pham/skin-nut-phim",
		"https://inutdesign.com/services",
	];
	for (const url of expected) {
		if (urls.includes(url)) {
			pass(`${url} in sitemap`);
		} else {
			fail(`${url} missing from sitemap`);
		}
	}
}

function main() {
	console.log(`🔍 SEO smoke test — ${ROOT}\n`);

	if (!existsSync(ROBOTS_PATH)) {
		fail(`robots.txt not found at ${ROBOTS_PATH}`);
	} else {
		const robots = readFileSync(ROBOTS_PATH, "utf-8");
		assertRobotsTxt(robots);
	}

	if (!existsSync(SITEMAP_PATH)) {
		fail(`sitemap.xml not found at ${SITEMAP_PATH}`);
	} else {
		const sitemap = readFileSync(SITEMAP_PATH, "utf-8");
		assertSitemapXml(sitemap);
	}

	console.log(exitCode === 0 ? "\n✅ All SEO smoke tests passed.\n" : `\n❌ ${exitCode} SEO smoke test(s) failed.\n`);
	process.exit(exitCode);
}

main();
