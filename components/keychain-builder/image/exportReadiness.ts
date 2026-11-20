import type { ImageFace, KeychainConfig } from "../types";

type FaceIssue = "missing" | "local" | "stale" | "invalid-url";

function imageUrlMatchesReference(url: string, face: ImageFace) {
	if (!face.image || face.image._type !== "image" || face.image.asset?._type !== "reference") return false;
	const refHash = face.image.asset._ref.match(/^image-([a-f0-9]+)-/i)?.[1];
	if (!refHash) return false;
	try {
		const parsed = new URL(url);
		return parsed.protocol === "https:" && parsed.hostname === "cdn.sanity.io" &&
			new RegExp(`/${refHash}-[^/]+\\.[a-z0-9]+$`, "i").test(parsed.pathname);
	} catch {
		return false;
	}
}

function getFaceIssue(face: ImageFace | undefined, required: boolean): FaceIssue | undefined {
	if (!face) return required ? "missing" : undefined;
	const selectedUrl = face.useProcessed ? face.processedUrl || face.url : face.url;
	if (!selectedUrl) return required ? "missing" : undefined;
	if (selectedUrl.startsWith("blob:") || selectedUrl.startsWith("data:")) return "local";
	const selectedFace = face.useProcessed && face.processedUrl ? { ...face, image: face.processedImage || face.image } : face;
	if (!imageUrlMatchesReference(selectedUrl, selectedFace)) return "stale";
	for (const [url, image] of [[face.url, face.image], [face.processedUrl, face.processedImage]] as const) {
		if (url && (url.startsWith("blob:") || url.startsWith("data:"))) return "local";
		if (url && !imageUrlMatchesReference(url, { ...face, image })) return "stale";
	}
	return undefined;
}

export function getExportImageIssue(config: KeychainConfig): FaceIssue | undefined {
	return getFaceIssue(config.front, true) || getFaceIssue(config.backCustom, config.backMode === "custom");
}

export function exportIsReady(config: KeychainConfig, busy: boolean) {
	return !busy && !getExportImageIssue(config);
}
