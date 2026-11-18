import type { FrameSvgData } from "../geometry/frameSvg";
import type { KeychainConfig } from "../types";

export type RenderSide = "front" | "back";

/** Render the source SVG coordinate system through a uniform mm transform.
 * The hole is always reconstructed to 4 mm after scaling the supplied outline.
 */
export async function renderKeychain2d(canvas: HTMLCanvasElement, frame: FrameSvgData, config: KeychainConfig, image?: CanvasImageSource, side: RenderSide = "front") {
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Thiết bị không hỗ trợ Canvas 2D");
	const [minX, minY, sourceWidth, sourceHeight] = frame.viewBox;
	const sizeMm = config.sizeCm * 10;
	const mmPerUnit = sizeMm / Math.max(sourceWidth, sourceHeight);
	const pxPerMm = canvas.width / sizeMm;
	const pxPerUnit = mmPerUnit * pxPerMm;
	const toCanvasX = (x: number) => (x - minX) * pxPerUnit + (canvas.width - sourceWidth * pxPerUnit) / 2;
	const toCanvasY = (y: number) => (y - minY) * pxPerUnit + (canvas.height - sourceHeight * pxPerUnit) / 2;
	const cut = new Path2D(frame.cutPath);
	const print = new Path2D(frame.printPath);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.save();
	ctx.translate((canvas.width - sourceWidth * pxPerUnit) / 2 - minX * pxPerUnit, (canvas.height - sourceHeight * pxPerUnit) / 2 - minY * pxPerUnit);
	ctx.scale(pxPerUnit, pxPerUnit);
	const acrylicColor = config.acrylicId === "clear" ? "rgba(183,220,240,0.28)" : config.acrylicId;
	ctx.fillStyle = acrylicColor;
	ctx.fill(cut);
	let renderImage = image;
	let mirror = false;
	if (side === "back") {
		if (config.backMode === "white") { ctx.fillStyle = "#fff"; ctx.fill(cut); }
		if (config.backMode === "material") { ctx.fillStyle = acrylicColor; ctx.fill(cut); }
		if (config.backMode === "through-acrylic" || config.backMode === "mirror-front") mirror = true;
		if (config.backMode === "custom") renderImage = image;
		if (config.backMode === "material") renderImage = undefined;
	}
	if (renderImage && (side === "front" || config.backMode === "through-acrylic" || config.backMode === "mirror-front" || config.backMode === "custom")) {
		ctx.save();
		ctx.clip(print);
		const face = side === "back" && config.backMode === "custom" ? config.backCustom : config.front;
		const transform = face?.transform || config.front.transform;
		const source = renderImage as CanvasImageSource & { width: number; height: number };
		const centerX = (minX + sourceWidth / 2 + transform.xMm / mmPerUnit);
		const centerY = (minY + sourceHeight / 2 + transform.yMm / mmPerUnit);
		ctx.translate(centerX, centerY);
		ctx.rotate((transform.rotation * Math.PI) / 180);
		ctx.scale(transform.scale * (transform.flipX ? -1 : 1) * (mirror ? -1 : 1), transform.scale);
		const fit = Math.max(sourceWidth * 0.72 / source.width, sourceHeight * 0.72 / source.height);
		ctx.drawImage(source, -source.width * fit / 2, -source.height * fit / 2, source.width * fit, source.height * fit);
		ctx.restore();
	}
	// Punch out the hanging hole after face art and material layers.
	ctx.globalCompositeOperation = "destination-out";
	ctx.beginPath();
	ctx.arc(frame.hole.cx, frame.hole.cy, 2 / mmPerUnit, 0, Math.PI * 2);
	ctx.fill();
	ctx.globalCompositeOperation = "source-over";
	ctx.strokeStyle = "rgba(255,255,255,.75)";
	ctx.lineWidth = 0.35 / mmPerUnit;
	ctx.stroke(cut);
	ctx.restore();
	void toCanvasX; void toCanvasY;
	return canvas;
}
