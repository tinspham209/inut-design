import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { validateBatch, canonicalRoute } from "./validate-blog.mjs";
import { validateArchitecture } from "../../inut-design-workflow/scripts/validate-ai-config.mjs";

// Fixtures live outside the repository; no production blog/order writes.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../..");
const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), "inut-skill-checks-"));
let checks = 0;
function test(name, fn) {
	fn();
	checks++;
	console.log(`PASS: ${name}`);
}
try {
	const out = path.join(sandbox, "posts");
	fs.mkdirSync(out);
	const route = "/services/sticker/sticker-magnet";
	const template = fs.readFileSync(
		path.join(root, ".agents/skills/inut-content-writer/assets/blog-post-template.md"),
		"utf8"
	);
	const fixture = (slug) =>
		template
			.replace("replace-with-unique-slug", slug)
			.replace("Replace with a distinct title: quote YAML safely", `Kiểm tra: ${slug}`)
			.replace(
				"Replace with a useful excerpt grounded in the selected product source.",
				"Sticker Magnet phù hợp với bề mặt kim loại có từ tính; hãy kiểm tra bề mặt trước khi chọn."
			)
			.replaceAll("{route}", route);
	const files = ["sandbox-magnet-material", "sandbox-magnet-artwork"].map((slug) => {
		const p = path.join(out, `2026-10-08-${slug}.md`);
		fs.writeFileSync(p, fixture(slug));
		return p;
	});
	const spec = {
		root,
		groups: [{ product: "Sticker Magnet", count: 2, route, date: "2026-10-08", files }],
	};
	test("compact Sticker Magnet two-post group, YAML colon title, contextual CTA and remark parse", () =>
		assert.deepEqual(validateBatch(spec), []));
	test("full canonical INUT URL normalization", () =>
		assert.equal(canonicalRoute(root, `https://inutdesign.com${route}`), route));
	test("Pin canonical route exists; conflict is rejected rather than guessed", () => {
		assert.equal(
			canonicalRoute(root, "/services/an-pham-luu-niem/pin-cai-ao-mica"),
			"/services/an-pham-luu-niem/pin-cai-ao-mica"
		);
		assert.throws(() => canonicalRoute(root, "/services/sticker/pin-cai-ao"), /No canonical page/);
	});
	test("wrong group count", () =>
		assert(
			validateBatch({ ...spec, groups: [{ ...spec.groups[0], count: 3 }] }).some((e) =>
				/count mismatch/.test(e)
			)
		));
	const original = fs.readFileSync(files[0], "utf8");
	const bullet = `- [https://inutdesign.com${route}](${route})`;
	test("duplicate visible URL update is rejected", () => {
		fs.writeFileSync(files[0], original.replace(bullet, `${bullet}\n${bullet}`));
		assert(validateBatch(spec).some((e) => /exactly one/.test(e)));
		fs.writeFileSync(files[0], original);
	});
	test("internal MOQ uncertainty is rejected in customer prose", () => {
		fs.writeFileSync(files[0], original + "\nDữ liệu sản phẩm không xác nhận MOQ.\n");
		assert(validateBatch(spec).some((e) => /uncertainty/.test(e)));
		fs.writeFileSync(files[0], original);
	});
	test("duplicate batch slug and existing slug", () => {
		fs.writeFileSync(files[1], original);
		assert(validateBatch(spec).some((e) => /duplicate slug/.test(e)));
		fs.writeFileSync(files[1], fixture("sandbox-magnet-artwork"));
		const existing = path.join(sandbox, "existing");
		fs.mkdirSync(existing);
		fs.writeFileSync(path.join(existing, "existing.md"), original);
		assert(validateBatch({ ...spec, existingDir: existing }).some((e) => /duplicate slug/.test(e)));
	});
	test("invalid date and malformed YAML", () => {
		assert(
			validateBatch({ ...spec, groups: [{ ...spec.groups[0], date: "2026-02-30" }] }).some((e) =>
				/Invalid group date/.test(e)
			)
		);
		fs.writeFileSync(files[0], original.replace('title: "', 'title: ["'));
		assert(validateBatch(spec).length > 0);
		fs.writeFileSync(files[0], original);
	});

	const architecture = path.join(sandbox, "repo");
	fs.mkdirSync(architecture);
	fs.mkdirSync(path.join(architecture, ".agents"));
	fs.cpSync(path.join(root, ".agents/skills"), path.join(architecture, ".agents/skills"), {
		recursive: true,
	});
	fs.mkdirSync(path.join(architecture, "docs"));
	fs.cpSync(path.join(root, "docs/ai"), path.join(architecture, "docs/ai"), { recursive: true });
	for (const p of ["AGENTS.md", "README.md"])
		fs.copyFileSync(path.join(root, p), path.join(architecture, p));
	test("skills-only architecture validates repeatedly without mutation", () => {
		const before = fs.readFileSync(path.join(architecture, "AGENTS.md"), "utf8");
		assert.deepEqual(validateArchitecture(architecture), []);
		assert.deepEqual(validateArchitecture(architecture), []);
		assert.equal(fs.readFileSync(path.join(architecture, "AGENTS.md"), "utf8"), before);
	});
	test("broken obsolete symlink detected with lstat", () => {
		const p = path.join(architecture, ".cursorrules");
		fs.symlinkSync("missing-target", p);
		assert(validateArchitecture(architecture).some((e) => /Obsolete path still present/.test(e)));
		fs.unlinkSync(p);
	});
	test("skill name mismatch, invalid YAML and missing resource detected", () => {
		const p = path.join(architecture, ".agents/skills/inut-content-writer/SKILL.md");
		const text = fs.readFileSync(p, "utf8");
		fs.writeFileSync(p, text.replace("name: inut-content-writer", "name: wrong-name"));
		assert(validateArchitecture(architecture).some((e) => /name mismatch/.test(e)));
		fs.writeFileSync(p, text.replace("name: inut-content-writer", "name: [broken"));
		assert(validateArchitecture(architecture).some((e) => /Invalid YAML/.test(e)));
		fs.writeFileSync(p, text + "\n[Missing](references/missing.md)\n");
		assert(validateArchitecture(architecture).some((e) => /Missing resource/.test(e)));
		fs.writeFileSync(p, text);
	});
	test("checkout, dual analytics, source grounding and page routing contracts retained", () => {
		const read = (p) => fs.readFileSync(path.join(root, ".agents/skills", p), "utf8");
		const checkout = read("inut-design-workflow/references/checkout.md");
		for (const token of [
			"inut-lighters-cart",
			"_key",
			"lighterType",
			"unitPrice",
			"subtotal",
			"risk",
		])
			assert(checkout.includes(token));
		const analytics = read("inut-design-workflow/references/analytics.md");
		for (const token of ["GA4", "Umami", "duplicate", "purchase"])
			assert(analytics.includes(token));
		const writer = read("inut-content-writer/SKILL.md");
		assert(writer.includes("Never invent price, MOQ, SLA"));
		const automation = read("inut-product-page-automation/SKILL.md");
		assert(automation.includes("Draft-only requests stop here without code"));
		assert(automation.includes("content.generated.md"));
		assert(read("product-page-generator/SKILL.md").includes("centralized data pattern"));
	});
	console.log(
		`PASS: ${checks} sandbox checks; no production writes. These are contract/parser checks, not independent model or client-discovery evaluations.`
	);
} finally {
	fs.rmSync(sandbox, { recursive: true, force: true });
}
