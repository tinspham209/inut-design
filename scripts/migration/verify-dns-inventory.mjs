import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

function rows(csv) {
	const values = csv.trim().split("\n");
	const headers = values.shift().split(",");
	return values.map((line) => Object.fromEntries(line.split(",").map((value, index) => [headers[index], value.trim()])));
}

const root = process.cwd();
const file = path.join(root, "artifacts/migration/dns/source-inventory.csv");
const records = rows(await readFile(file, "utf8"));
const required = ["name", "type", "target", "ttl", "priority", "proxyMode", "owner", "purpose", "disposition"];
const allowedDispositions = new Set(["copy", "update", "retire", "verify"]);
const errors = [];
for (const [index, record] of records.entries()) {
	for (const field of ["name", "type", "target", "owner", "purpose", "disposition"]) {
		if (!record[field]) errors.push(`Row ${index + 2}: missing ${field}.`);
	}
	if (!allowedDispositions.has(record.disposition)) {
		errors.push(`Row ${index + 2}: unsupported disposition ${record.disposition}.`);
	}
	if (record.target === "none" && record.disposition !== "verify") {
		errors.push(`Row ${index + 2}: unknown ${record.type} target cannot be blindly copied.`);
	}
	if (["MX", "SRV"].includes(record.type) && record.priority === "") {
		errors.push(`Row ${index + 2}: priority-bearing ${record.type} record needs an explicit priority.`);
	}
	for (const field of required) {
		if (!(field in record)) errors.push(`Row ${index + 2}: missing column ${field}.`);
	}
}
const identities = records.map((record) => `${record.name}|${record.type}|${record.target}|${record.priority}`);
if (new Set(identities).size !== identities.length) errors.push("DNS inventory contains duplicate identities.");
const requiredTypes = ["A", "AAAA", "NS", "DS", "CAA", "MX", "SPF", "TXT"];
for (const type of requiredTypes) {
	if (!records.some((record) => record.type === type)) errors.push(`DNS inventory is missing ${type} coverage.`);
}
if (!records.some((record) => record.type === "TXT" && /dmarc/i.test(record.name))) {
	errors.push("DNS inventory is missing DMARC coverage.");
}
if (errors.length) {
	console.error(`DNS inventory failed (${errors.length}):`);
	for (const error of errors) console.error(`- ${error}`);
	process.exitCode = 1;
} else {
	console.log(`DNS inventory verified ${records.length} owner-review records.`);
}
