import { CanvasTexture } from "three";
import type { FrameSvgData } from "../geometry/frameSvg";
import type { KeychainConfig } from "../types";
import { renderKeychain2d, type RenderSide } from "./render2d";

export async function createDesignTexture(frame: FrameSvgData, config: KeychainConfig, image: CanvasImageSource | undefined, side: RenderSide) {
	const canvas = document.createElement("canvas");
	canvas.width = 512; canvas.height = Math.round(512 * frame.viewBox[3] / frame.viewBox[2]);
	await renderKeychain2d(canvas, frame, config, image, side);
	const texture = new CanvasTexture(canvas);
	texture.flipY = true; texture.needsUpdate = true;
	return texture;
}
