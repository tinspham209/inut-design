export type RenderFaceMode = "through-acrylic" | "white" | "mirror-front" | "custom" | "material";
export type FaceRenderSource = { imageUrl?: string; mirrorX: boolean; print: boolean; materialFill: boolean };

/** Mirror only at the physical viewing boundary; source-image transforms remain in their original coordinate system. */
export function getBackRenderSource(mode: RenderFaceMode, frontUrl?: string, backUrl?: string): FaceRenderSource {
	switch (mode) {
		case "through-acrylic": return { imageUrl: frontUrl, mirrorX: true, print: true, materialFill: false };
		case "white": return { mirrorX: false, print: false, materialFill: true };
		case "mirror-front": return { imageUrl: frontUrl, mirrorX: true, print: true, materialFill: false };
		case "custom": return { imageUrl: backUrl, mirrorX: false, print: true, materialFill: false };
		case "material": return { mirrorX: false, print: false, materialFill: true };
	}
}
