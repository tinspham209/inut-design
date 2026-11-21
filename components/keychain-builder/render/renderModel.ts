import type { KeychainConfig } from "../types";

export type RenderFaceMode = "through-acrylic" | "white" | "mirror-front" | "custom" | "material";
export type FaceRenderSource = { imageUrl?: string; mirrorX: boolean; print: boolean; materialFill: boolean };

/** Artwork controls in 3D follow the side selected in 2D; only custom mode has a separate reverse source. */
export function get3dEditableFace(view: "front" | "back", backMode: KeychainConfig["backMode"]): "front" | "backCustom" {
	return view === "back" && backMode === "custom" ? "backCustom" : "front";
}

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

/** Resolve the image that belongs on the physical reverse cap for the active material mode. */
export function get3dBackRenderSource(config: Pick<KeychainConfig, "acrylicId" | "backMode">, frontUrl?: string, backUrl?: string): FaceRenderSource {
	const mode: RenderFaceMode = config.acrylicId === "clear" ? config.backMode : "material";
	return getBackRenderSource(mode, frontUrl, backUrl);
}

/** White backing and opaque acrylic block light; clear printed modes remain see-through. */
export function is3dBackOpaque(config: Pick<KeychainConfig, "acrylicId" | "backMode">) {
	return config.acrylicId !== "clear" || config.backMode === "white";
}
