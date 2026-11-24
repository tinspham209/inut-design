import dns from "node:dns/promises";
import { readFile } from "node:fs/promises";
import process from "node:process";

const domain = process.env.DOMAIN || "inutdesign.com";
const baseUrl = process.env.PRODUCTION_URL || `https://${domain}`;
const expectedNameservers = ["giancarlo.ns.cloudflare.com", "zainab.ns.cloudflare.com"];
const apiManifest = JSON.parse(
	await readFile(new URL("../../artifacts/migration/baseline/apis.json", import.meta.url), "utf8"),
);
const results = [];

async function resolve(name, type) {
	try {
		return await dns.resolve(name, type);
	} catch (error) {
		return { error: error.code || error.message };
	}
}

async function check(name, run) {
	try {
		const value = await run();
		results.push({ name, status: "pass", value });
	} catch (error) {
		results.push({ name, status: "fail", error: error instanceof Error ? error.message : String(error) });
	}
}

await check("authoritative-nameservers", async () => {
	const nameservers = (await dns.resolveNs(domain)).sort();
	if (JSON.stringify(nameservers.map((value) => value.toLowerCase())) !== JSON.stringify([...expectedNameservers].sort())) {
		throw new Error(`Unexpected nameservers: ${nameservers.join(", ")}`);
	}
	return nameservers;
});
await check("apex-resolution", async () => {
	const addresses = await dns.resolve4(domain);
	if (!addresses.length) throw new Error("Apex has no A records.");
	return addresses;
});
await check("www-resolution", async () => {
	const addresses = await dns.resolve4(`www.${domain}`);
	if (!addresses.length) throw new Error("www has no A records.");
	return addresses;
});
await check("mx-records", async () => {
	const values = await resolve(domain, "MX");
	return values;
});
await check("spf-dmarc-txt", async () => ({
	txt: await resolve(domain, "TXT"),
	dmarc: await resolve(`_dmarc.${domain}`, "TXT"),
}));
await check("dnssec-and-caa", async () => ({
	ds: await resolve(domain, "DS"),
	caa: await resolve(domain, "CAA"),
}));

for (const path of [
	"/",
	"/www",
	"/robots.txt",
	"/sitemap.xml",
	"/cart/lighters",
	"/checkout/lighters",
	"/builder/keychain",
	"/search",
]) {
	await check(`http:${path}`, async () => {
		const response = await fetch(`${baseUrl}${path}`, { redirect: "manual" });
		if (response.status >= 400) throw new Error(`HTTP ${response.status}`);
		const text = response.headers.get("content-type")?.includes("json") ? await response.json() : null;
		return { status: response.status, contentType: response.headers.get("content-type"), bodyShape: text };
	});
}
for (const record of apiManifest.apis) {
	const path = record.path
		.replace("[publicId]", "migration-public-id")
		.replace("[id]", "migration-design-id")
		.replace("[slug]", "migration-product");
	await check(`api:${record.path}`, async () => {
		const method = record.methods.includes("GET") ? "GET" : "OPTIONS";
		const response = await fetch(`${baseUrl}${path}`, { method, redirect: "manual" });
		const expected = record.methods.includes("GET")
			? response.status < 500
			: response.status < 500 && response.status >= 400;
		if (!expected) throw new Error(`HTTP ${response.status}`);
		return { status: response.status, method };
	});
}

const failed = results.filter((result) => result.status === "fail");
console.log(JSON.stringify({ domain, baseUrl, results }, null, 2));
if (failed.length) process.exitCode = 1;
