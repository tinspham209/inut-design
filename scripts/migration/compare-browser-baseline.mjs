import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const args = new Map(
	process.argv.slice(2).map((argument) => {
		const [key, ...rest] = argument.replace(/^--/, "").split("=");
		return [key, rest.join("=")];
	}),
);
const selfCheck = process.argv.includes("--self-check");
const skipBefore404 = process.argv.includes("--skip-before-404");
const beforePath = path.resolve(
	root,
	args.get("before") || "artifacts/migration/runtime/browser-before/report.json",
);
const afterPath = path.resolve(
	root,
	args.get("after") ||
		(selfCheck ? beforePath : "artifacts/migration/runtime/browser-after/report.json"),
);
const outputPath = path.resolve(root, "artifacts/migration/runtime/browser-compare.json");

function parseEvalJson(entry) {
	const raw = entry?.data?.result;
	if (!raw) return null;
	try {
		return JSON.parse(raw);
	} catch {
		return null;
	}
}

function documentStatus(page) {
	const req = page.network?.find(
		(item) => String(item.resourceType || "").toLowerCase() === "document",
	);
	return req?.status ?? null;
}

const before = JSON.parse(await readFile(beforePath, "utf8"));
const after = JSON.parse(await readFile(afterPath, "utf8"));
const findings = [];

for (const beforeViewport of before.viewports || []) {
	const afterViewport = (after.viewports || []).find((v) => v.name === beforeViewport.name);
	if (!afterViewport) {
		findings.push({ viewport: beforeViewport.name, reason: "missing-viewport" });
		continue;
	}
	for (const beforePage of beforeViewport.pages || []) {
		const beforeStatus = documentStatus(beforePage);
		const afterPage = (afterViewport.pages || []).find((p) => p.route === beforePage.route);
		if (!afterPage) {
			if (skipBefore404 && beforeStatus === 404) continue;
			findings.push({ viewport: beforeViewport.name, route: beforePage.route, reason: "missing-route" });
			continue;
		}
		const afterStatus = documentStatus(afterPage);
		if (beforeStatus === 200 && afterStatus !== 200) {
			findings.push({
				viewport: beforeViewport.name,
				route: beforePage.route,
				reason: "http-status-regression",
				beforeStatus,
				afterStatus,
			});
		}
		const beforeDom = parseEvalJson(beforePage.domSummary);
		const afterDom = parseEvalJson(afterPage.domSummary);
		if (beforeDom && afterDom) {
			for (const field of ["title", "canonical", "robots", "headings", "codeBlocks", "tables"]) {
				if (JSON.stringify(beforeDom[field]) !== JSON.stringify(afterDom[field])) {
					findings.push({
						viewport: beforeViewport.name,
						route: beforePage.route,
						reason: `dom-${field}-mismatch`,
						before: beforeDom[field],
						after: afterDom[field],
					});
				}
			}
		}
		const beforeErrors = (beforePage.console || []).filter((e) => String(e.type).toLowerCase() === "error");
		const afterErrors = (afterPage.console || []).filter((e) => String(e.type).toLowerCase() === "error");
		if (afterErrors.length > beforeErrors.length) {
			findings.push({
				viewport: beforeViewport.name,
				route: beforePage.route,
				reason: "new-console-errors",
				beforeCount: beforeErrors.length,
				afterErrors,
			});
		}
	}
	for (const afterPage of afterViewport.pages || []) {
		const afterStatus = documentStatus(afterPage);
		if (afterStatus !== 200) {
			findings.push({
				viewport: afterViewport.name,
				route: afterPage.route,
				reason: "after-route-not-200",
				afterStatus,
			});
		}
	}
}

const report = {
	schemaVersion: 1,
	generatedAt: new Date().toISOString(),
	beforePath: path.relative(root, beforePath),
	afterPath: path.relative(root, afterPath),
	findings,
	status: findings.length === 0 ? "pass" : "fail",
};

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`);

if (findings.length > 0) {
	console.error(`Browser baseline compare FAILED (${findings.length} finding(s)). See ${path.relative(root, outputPath)}.`);
	for (const f of findings.slice(0, 8)) {
		console.error(`- [${f.viewport}] ${f.route || ""}: ${f.reason}`);
	}
	process.exitCode = 1;
} else {
	console.log(`Browser baseline compare PASSED across ${before.viewports?.length ?? 0} viewports.`);
}
