import type { ImageFace } from "../types";

export function getFaceImageUrl(face?: ImageFace): string | undefined {
	return face?.useProcessed && face.processedUrl ? face.processedUrl : face?.url;
}

