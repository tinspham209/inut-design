import { sanityImageUrl } from "@/api-client/sanity-image";

type SnapshotFace = {
	image?: unknown;
	processedImage?: unknown;
	url?: string;
	processedUrl?: string;
	[key: string]: unknown;
};
type SnapshotConfig = { front?: SnapshotFace; backCustom?: SnapshotFace; [key: string]: unknown };

/** Store asset references as the source of truth; CDN URLs are derived on read. */
export function toSnapshotConfig(config: SnapshotConfig) {
	const snapshot = { ...config };
	for (const key of ["front", "backCustom"] as const) {
		const face = snapshot[key] as SnapshotFace | undefined;
		if (!face) continue;
		const { url: _url, processedUrl: _processedUrl, ...canonicalFace } = face;
		snapshot[key] = canonicalFace;
	}
	return snapshot;
}

/** Add the legacy runtime URL fields expected by current canvas renderers. */
export function hydrateSnapshotConfig(config: SnapshotConfig) {
	const hydrated = { ...config };
	for (const key of ["front", "backCustom"] as const) {
		const face = hydrated[key] as SnapshotFace | undefined;
		if (!face) continue;
		hydrated[key] = {
			...face,
			...(face.image ? { url: sanityImageUrl(face.image, "design") } : {}),
			...(face.processedImage
				? { processedUrl: sanityImageUrl(face.processedImage, "design") }
				: {}),
		};
	}
	return hydrated;
}
