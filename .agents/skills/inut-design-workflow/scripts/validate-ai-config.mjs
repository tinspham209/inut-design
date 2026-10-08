import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

export const expectedSkills = [
	"inut-design-workflow",
	"inut-content-writer",
	"inut-product-page-automation",
	"product-page-generator",
	"agent-browser-automation",
	"autoresearch",
	"skill-creator",
];
export const obsoletePaths = [
	...["instructions", "prompts", "workflows", "agents"].map((p) => `.agents/${p}`),
	...["agents", "prompts", "skills", "instructions", "copilot-instructions.md"].map(
		(p) => `.github/${p}`
	),
	...["agents", "prompts", "skills", "workflows", "instructions"].map((p) => `.codex/${p}`),
	...[
		"agents",
		"prompts",
		"skills",
		"workflows",
		"instructions",
		"prompts-link",
		"skills-link",
	].map((p) => `.trae/${p}`),
	...["agents", "prompts", "skills", "workflows", "instructions", "default-rules.md"].map(
		(p) => `.clinerules/${p}`
	),
	".cursorrules",
	".traerules",
];
const exists = (p) => {
	try {
		fs.lstatSync(p);
		return true;
	} catch (e) {
		if (e.code === "ENOENT") return false;
		throw e;
	}
};
function walk(dir) {
	if (!exists(dir)) return [];
	return fs.readdirSync(dir).flatMap((n) => {
		const p = path.join(dir, n),
			s = fs.lstatSync(p);
		return s.isSymbolicLink() ? [p] : s.isDirectory() ? walk(p) : [p];
	});
}

export function validateArchitecture(root) {
	const errors = [],
		check = (ok, msg) => {
			if (!ok) errors.push(msg);
		};
	const skills = path.join(root, ".agents/skills");
	const directory = (p) => exists(p) && fs.lstatSync(p).isDirectory();
	check(directory(path.join(root, ".agents")), "Missing physical .agents directory");
	check(directory(skills), "Missing physical .agents/skills directory");
	if (directory(path.join(root, ".agents"))) {
		check(
			JSON.stringify(fs.readdirSync(path.join(root, ".agents")).sort()) === '["skills"]',
			".agents must contain only skills/"
		);
	}
	if (directory(skills)) {
		check(
			JSON.stringify(fs.readdirSync(skills).sort()) === JSON.stringify([...expectedSkills].sort()),
			"Expected exactly seven retained skills"
		);
	}
	for (const name of expectedSkills) {
		const dir = path.join(skills, name),
			p = path.join(dir, "SKILL.md");
		check(directory(dir), `Missing physical skill directory: ${name}`);
		if (!exists(p) || !fs.lstatSync(p).isFile()) {
			errors.push(`Missing regular SKILL.md: ${name}`);
			continue;
		}
		const text = fs.readFileSync(p, "utf8");
		try {
			check(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/.test(text), `Missing YAML frontmatter: ${name}`);
			const { data } = matter(text);
			check(data.name === name, `Skill name mismatch: ${name}`);
			check(
				typeof data.description === "string" && data.description.trim().length > 20,
				`Invalid description: ${name}`
			);
		} catch (e) {
			errors.push(`Invalid YAML ${name}: ${e.message}`);
		}
		for (const file of walk(dir)) {
			if (fs.lstatSync(file).isSymbolicLink()) {
				errors.push(`Unexpected skill symlink: ${path.relative(root, file)}`);
				continue;
			}
			if (!file.endsWith(".md")) continue;
			const body = fs.readFileSync(file, "utf8");
			// Local Markdown links in bundled docs must resolve. External links and
			// template placeholders are not local resource references.
			for (const [, link] of body.matchAll(/\[[^\]]*\]\(([^\s)]+)(?:\s+"[^"]*")?\)/g)) {
				if (/^(?:[a-z][\w+.-]*:|#|\/)/i.test(link) || /[{}<>]/.test(link)) continue;
				check(
					exists(path.resolve(path.dirname(file), decodeURIComponent(link.split("#")[0]))),
					`Missing resource in ${path.relative(root, file)}: ${link}`
				);
			}
			check(
				!obsoletePaths.some((p) => body.includes(p)),
				`Deprecated active path: ${path.relative(root, file)}`
			);
		}
	}
	for (const p of obsoletePaths)
		check(!exists(path.join(root, p)), `Obsolete path still present: ${p}`);
	const active = [
		"AGENTS.md",
		"README.md",
		"docs/ai/DUAL_EDITOR_WORKFLOW.md",
		"docs/ai/DEPLOYMENT_ROLLBACK.md",
		"docs/ai/PORTABLE_PROMPTS.md",
		"docs/ai/DEVELOPER_EFFECTIVENESS.md",
		...walk(path.join(root, ".deveveloper-docs")).map((p) => path.relative(root, p)),
	];
	for (const rel of active) {
		const p = path.join(root, rel);
		if (!exists(p) || !fs.lstatSync(p).isFile()) {
			errors.push(`Missing active document: ${rel}`);
			continue;
		}
		const text = fs.readFileSync(p, "utf8");
		check(!obsoletePaths.some((p) => text.includes(p)), `Deprecated active path: ${rel}`);
		check(!/\bln\s+-[a-z]*s/.test(text), `Symlink reconstruction instruction: ${rel}`);
	}
	const manifestPath = path.join(root, "docs/ai/SKILLS_MIGRATION_MANIFEST.json");
	try {
		const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
		check(manifest.sources.length === 22, "Manifest must map all 22 legacy regular source files");
		for (const source of manifest.sources) {
			check(/^[a-f0-9]{64}$/.test(source.sha256), `Missing source hash: ${source.path}`);
			check(!exists(path.join(root, source.path)), `Migrated source still present: ${source.path}`);
			for (const dest of source.destinations)
				check(exists(path.join(root, dest)), `Missing migration destination: ${dest}`);
		}
		for (const alias of manifest.aliases)
			check(!exists(path.join(root, alias.path)), `Alias still present: ${alias.path}`);
	} catch (e) {
		errors.push(`Migration manifest: ${e.message}`);
	}
	return errors;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	const root = path.resolve(process.argv[2] || ".");
	const errors = validateArchitecture(root);
	if (errors.length) {
		console.error(errors.map((e) => `ERROR: ${e}`).join("\n"));
		process.exitCode = 1;
	} else
		console.log(
			"PASS: seven skills, YAML metadata, bundled references, active docs, migration manifest and obsolete-path absence"
		);
}
