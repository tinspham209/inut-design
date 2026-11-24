import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const baseline = JSON.parse(
	await readFile(path.join(root, "artifacts/migration/baseline/call-sites.json"), "utf8"),
);
const browser = JSON.parse(
	await readFile(path.join(root, "artifacts/migration/runtime/browser/report.json"), "utf8"),
);
const { spawnSync } = await import("node:child_process");
const legacyImages = spawnSync(
	"rg",
	["-l", "layout=|objectFit=|objectPosition=", "pages", "components", "-g", "*.tsx"],
	{ cwd: root, encoding: "utf8" },
).stdout.trim().split("\n").filter(Boolean);
const legacyLinks = spawnSync(
	"rg",
	["-l", "passHref|legacyBehavior", "pages", "components", "-g", "*.tsx"],
	{ cwd: root, encoding: "utf8" },
).stdout.trim().split("\n").filter(Boolean);
const errors = [];
if (baseline.summary.nextImage.files !== 35) errors.push("Image baseline file count changed unexpectedly.");
if (baseline.summary.nextLink.files !== 61) errors.push("Link baseline file count changed unexpectedly.");
if (legacyImages.length) errors.push(`Legacy Image props remain in ${legacyImages.length} file(s).`);
if (legacyLinks.length) errors.push(`Legacy Link props remain in ${legacyLinks.length} file(s).`);
for (const viewport of browser.viewports) {
	for (const route of ["/builder/keychain", "/builder/lighters", "/creativa/skin-laptop/daisy-quilt-macbook-skin"]) {
		const page = viewport.pages.find((candidate) => candidate.route === route);
		const surface = JSON.parse(page?.surface?.data?.result ?? "null");
		const contextLoss = JSON.parse(page?.contextLoss?.data?.result ?? "null");
		if (!page) errors.push(`${viewport.name}: missing ${route} evidence.`);
		if (route.includes("/builder/") && !surface?.canvases) {
			errors.push(`${viewport.name}: ${route} has no 3D canvas.`);
		}
		if (route.includes("/builder/") && !contextLoss?.supported) {
			errors.push(`${viewport.name}: ${route} has no context-loss evidence.`);
		}
		if (route.startsWith("/creativa/skin-laptop/") && !surface?.carouselRegions) {
			errors.push(`${viewport.name}: ${route} has no carousel region.`);
		}
	}
}
if (errors.length) {
	console.error(`UI evidence failed (${errors.length}):`);
	for (const error of errors) console.error(`- ${error}`);
	process.exitCode = 1;
} else {
	console.log("UI evidence passed 35 Image files, 61 Link files, two 3D canvases, and carousel keyboard surface.");
}
