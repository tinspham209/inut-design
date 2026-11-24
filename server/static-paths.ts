const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type SlugRecord = {
	_id?: unknown;
	slug?: unknown;
};

function readSlug(record: SlugRecord | string): string {
	if (typeof record === "string") return record;
	const value = record.slug;
	if (typeof value === "string") return value;
	if (value && typeof value === "object" && typeof (value as { current?: unknown }).current === "string") {
		return (value as { current: string }).current;
	}
	return "";
}

function hasReference(value: unknown): boolean {
	if (typeof value === "string") return value.length > 0;
	if (!value || typeof value !== "object") return false;
	const record = value as { _id?: unknown; _ref?: unknown; current?: unknown };
	return Boolean(record._id || record._ref || record.current);
}

export function validateStaticSlugs(
	records: Array<SlugRecord | string>,
	source: string,
	options: { requiredRelations?: string[] } = {},
): string[] {
	const slugs = new Map<string, number>();
	for (const [index, record] of records.entries()) {
		const slug = readSlug(record);
		if (!slug) throw new Error(`${source}: record ${index + 1} has a blank or missing slug.`);
		if (!SLUG_PATTERN.test(slug)) throw new Error(`${source}: invalid slug "${slug}".`);
		if (slug.startsWith(".") || slug.includes("..")) throw new Error(`${source}: reserved slug "${slug}".`);
		if (typeof record !== "string") {
			if (typeof record._id === "string" && /^(?:drafts|versions)\./.test(record._id)) {
				throw new Error(`${source}: draft or versioned record cannot be published (${record._id}).`);
			}
			for (const field of options.requiredRelations ?? []) {
				if (!hasReference((record as Record<string, unknown>)[field])) {
					throw new Error(`${source}: "${slug}" is missing required relation "${field}".`);
				}
			}
		}
		slugs.set(slug, (slugs.get(slug) ?? 0) + 1);
	}
	for (const [slug, count] of slugs) {
		if (count > 1) throw new Error(`${source}: duplicate slug "${slug}".`);
	}
	return [...slugs.keys()].sort((left, right) => left.localeCompare(right));
}

export function validateStaticPathSegments(paths: string[][], source: string): string[][] {
	const seen = new Set<string>();
	return paths.map((segments, index) => {
		const validated = validateStaticSlugs(
			segments.map((segment) => ({ slug: segment })),
			`${source}[${index}]`,
		);
		if (validated.length !== segments.length) throw new Error(`${source}: invalid path segments at index ${index}.`);
		const key = segments.join("/");
		if (seen.has(key)) throw new Error(`${source}: duplicate path "/${key}".`);
		seen.add(key);
		return [...segments];
	});
}
