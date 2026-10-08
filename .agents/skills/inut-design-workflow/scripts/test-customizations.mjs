// Safe sandbox fixtures only; never writes production blog/config files.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { validateArchitecture, expectedSkills } from "./validate-ai-config.mjs";
import { validateBatch, canonicalRoute } from "../../inut-content-writer/scripts/validate-blog.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../..");
const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), "inut-ai-checks-"));
const put = (rel, content) => {
	const p = path.join(sandbox, rel);
	fs.mkdirSync(path.dirname(p), { recursive: true });
	fs.writeFileSync(p, content);
	return p;
};
try {
	fs.cpSync(path.join(root, ".agents/skills"), path.join(sandbox, ".agents/skills"), {
		recursive: true,
	});
	for (const rel of ["AGENTS.md", "README.md", "docs/ai", ".deveveloper-docs"]) {
		if (fs.existsSync(path.join(root, rel)))
			fs.cpSync(path.join(root, rel), path.join(sandbox, rel), { recursive: true });
	}
	const before = JSON.stringify(fs.readdirSync(sandbox));
	assert.deepEqual(validateArchitecture(sandbox), []);
	assert.deepEqual(validateArchitecture(sandbox), []);
	assert.equal(JSON.stringify(fs.readdirSync(sandbox)), before);
	console.log("PASS: skills-only architecture and repeatable read-only validation");

	const skill = path.join(sandbox, ".agents/skills/inut-content-writer/SKILL.md");
	const original = fs.readFileSync(skill, "utf8");
	fs.writeFileSync(skill, original.replace("name: inut-content-writer", "name: wrong-name"));
	assert(validateArchitecture(sandbox).some((e) => e.includes("name mismatch")));
	fs.writeFileSync(skill, "---\nname: [bad YAML\n---\n");
	assert(validateArchitecture(sandbox).some((e) => e.includes("Invalid YAML")));
	fs.writeFileSync(skill, original);
	fs.symlinkSync("missing-target", path.join(sandbox, ".cursorrules"));
	assert(validateArchitecture(sandbox).some((e) => e.includes("Obsolete path still present")));
	fs.unlinkSync(path.join(sandbox, ".cursorrules"));
	assert.deepEqual(validateArchitecture(sandbox), []);
	console.log("PASS: name/YAML failures and broken obsolete symlink rejection");

	const route = "/services/sticker/sticker-magnet";
	put(`pages${route}/index.tsx`, "// Sandbox route stub, not production");
	put("pages/services/an-pham-luu-niem/pin-cai-ao-mica/index.tsx", "// Sandbox stub");
	const template = fs.readFileSync(
		path.join(root, ".agents/skills/inut-content-writer/assets/blog-post-template.md"),
		"utf8"
	);
	const post = (slug, title) =>
		template
			.replaceAll("replace-with-unique-slug", slug)
			.replace("Replace with a distinct title: quote YAML safely", title)
			.replaceAll("{route}", route);
	const f1 = put(
		"outputs/2026-10-08-sandbox-intent-one.md",
		post("sandbox-intent-one", "Magnet: phân biệt vật liệu")
	);
	const f2 = put(
		"outputs/2026-10-08-sandbox-intent-two.md",
		post("sandbox-intent-two", "Magnet: chuẩn bị artwork")
	);
	const spec = {
		root: sandbox,
		existingDir: path.join(sandbox, "existing"),
		groups: [{ product: "Sticker Magnet", count: 2, date: "2026-10-08", route, files: [f1, f2] }],
	};
	assert.deepEqual(validateBatch(spec), []);
	assert.equal(canonicalRoute(sandbox, `https://inutdesign.com${route}`), route);
	assert.throws(
		() => canonicalRoute(sandbox, "/services/an-pham-luu-niem/pin"),
		/No canonical page/
	);
	console.log("PASS: compact two-post group, quoted colon titles and canonical route conflict");

	const good = fs.readFileSync(f1, "utf8");
	const bullet = `- [https://inutdesign.com${route}](${route})`;
	fs.writeFileSync(f1, good.replace(bullet, `${bullet}\n\n${bullet}`));
	assert(validateBatch(spec).some((e) => e.includes("exactly one")));
	fs.writeFileSync(
		f1,
		good.replace(
			"Write source-grounded Vietnamese prose;",
			"Dữ liệu sản phẩm không xác nhận MOQ. Write source-grounded Vietnamese prose;"
		)
	);
	assert(validateBatch(spec).some((e) => e.includes("data-uncertainty")));
	fs.writeFileSync(f1, good);
	assert(
		validateBatch({ ...spec, groups: [{ ...spec.groups[0], count: 3 }] }).some((e) =>
			e.includes("count mismatch")
		)
	);
	put("existing/other.md", good);
	assert(validateBatch(spec).some((e) => e.includes("duplicate slug")));
	fs.rmSync(path.join(sandbox, "existing"), { recursive: true });
	assert.deepEqual(validateBatch(spec), []);
	console.log("PASS: duplicate URL, internal uncertainty, wrong count and existing slug detection");

	const read = (rel) => fs.readFileSync(path.join(root, ".agents/skills", rel), "utf8");
	const checkout = read("inut-design-workflow/references/checkout.md");
	for (const term of ["inut-lighters-cart", "_key", "unitPrice", "subtotal", "risk"])
		assert(checkout.includes(term));
	const tracking = read("inut-design-workflow/references/analytics.md");
	for (const term of ["GA4", "Umami", "duplicate", "purchase"]) assert(tracking.includes(term));
	assert(
		read("inut-product-page-automation/SKILL.md").includes(
			"Draft-only requests stop here without code"
		)
	);
	assert(read("product-page-generator/SKILL.md").includes("content.md"));
	assert.equal(expectedSkills.length, 7);
	console.log("PASS: checkout/dual-tracking contracts and draft-vs-existing-content routing");
	console.log(
		"Sandbox assertions are deterministic checks, not independent agent/discovery or browser evaluations."
	);
} finally {
	fs.rmSync(sandbox, { recursive: true, force: true });
}
