import { urlFor as buildUrl } from "./sanity-browser";

export type SanityImagePreset =
	| "tiny"
	| "small"
	| "card"
	| "thumbnail"
	| "hero"
	| "seo"
	| "structured"
	| "design";

const PRESETS: Record<
	SanityImagePreset,
	{ width: number; quality: number }
> = {
	tiny: { width: 120, quality: 70 },
	small: { width: 400, quality: 75 },
	card: { width: 500, quality: 75 },
	thumbnail: { width: 1000, quality: 80 },
	hero: { width: 1600, quality: 80 },
	seo: { width: 1200, quality: 80 },
	structured: { width: 1200, quality: 80 },
	design: { width: 1600, quality: 85 },
};

/**
 * Shared image URL policy: cap dimensions, use Sanity's negotiated format,
 * and keep quality appropriate for the display context.
 */
export function sanityImageUrl(source: any, preset: SanityImagePreset = "card"): string {
	if (!source) return "";

	const { width, quality } = PRESETS[preset];
	return buildUrl(source).width(width).fit("max").quality(quality).auto("format").url();
}

export const sanityImagePresets = PRESETS;
