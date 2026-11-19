import type { FrameSvgData } from "../geometry/frameSvg";
import type { KeychainConfig } from "../types";

export type RenderSide = "front" | "back";
export type ConnectorAssets = {
	ring1Front: CanvasImageSource; ring1Back: CanvasImageSource;
	ring2Front: CanvasImageSource; ring2Back: CanvasImageSource;
	ring3Front: CanvasImageSource; ring3Back: CanvasImageSource;
	tailFront: CanvasImageSource; tailBack: CanvasImageSource;
};

const CLASSIC_CHAIN_LAYOUT = {
	head: { x: 0, y: 38, width: 431, height: 536 },
	ring1Front: { x: 216, y: 525, width: 72, height: 136 }, ring1Back: { x: 148, y: 525, width: 68, height: 136 },
	ring2Front: { x: 163, y: 611, width: 55, height: 166 }, ring2Back: { x: 218, y: 611, width: 55, height: 166 },
	ring3Front: { x: 215, y: 698, width: 80, height: 195 }, ring3Back: { x: 135, y: 698, width: 80, height: 195 },
	tail: { x: 127, y: 882, width: 175, height: 223 },
} as const;
const CHAIN_HOLE = { x: 215, y: 1097.5 };
const CLASSIC_LEAD_PER_WIDTH = (CHAIN_HOLE.y - CLASSIC_CHAIN_LAYOUT.head.y) / CLASSIC_CHAIN_LAYOUT.head.width;
const MAX_RING_WIDTH_RATIO = 0.3;
const MAX_RING_LEAD_RATIO = 0.5;

export function getScaledRingWidth(frameWidth: number, frameHeight: number, leadPerWidth: number) {
	return Math.min(frameWidth * MAX_RING_WIDTH_RATIO, frameHeight * MAX_RING_LEAD_RATIO / Math.max(leadPerWidth, Number.EPSILON));
}

/** Render the acrylic charm and its hardware as one fitted assembly. */
export async function renderKeychain2d(
	canvas: HTMLCanvasElement, frame: FrameSvgData, config: KeychainConfig,
	image?: CanvasImageSource, side: RenderSide = "front", ring?: CanvasImageSource,
	connectors?: ConnectorAssets, showImageCoverage = false,
) {
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Thiết bị không hỗ trợ Canvas 2D");
	const [minX, minY, sourceWidth, sourceHeight] = frame.viewBox;
	const mmPerUnit = config.sizeCm * 10 / Math.max(sourceWidth, sourceHeight);
	const source = ring as (CanvasImageSource & { width: number; height: number }) | undefined;
	const useClassicChain = Boolean(source && config.ringId === "ring-01" && connectors);
	const leadPerWidth = useClassicChain ? CLASSIC_LEAD_PER_WIDTH : source ? (source.height / source.width) * 0.94 : 0;
	const ringWidthUnits = source ? getScaledRingWidth(sourceWidth, sourceHeight, leadPerWidth) : 0;
	const connectorLead = source ? ringWidthUnits * leadPerWidth
		: frame.hole.cy - minY;
	const bodyBelowHole = source ? minY + sourceHeight - frame.hole.cy : sourceHeight;
	const sceneUnits = Math.max(1, connectorLead + bodyBelowHole);
	const inset = Math.min(10, canvas.width * 0.02, canvas.height * 0.02);
	const pxPerUnit = Math.max(0.01, Math.min((canvas.width - inset * 2) / sourceWidth, (canvas.height - inset * 2) / sceneUnits));
	const bufferScale = canvas.width / Math.max(1, canvas.clientWidth || canvas.width);
	canvas.dataset.frameMaxSize = String(pxPerUnit * Math.max(sourceWidth, sourceHeight) / bufferScale);
	const sceneHeight = sceneUnits * pxPerUnit;
	const sceneTop = (canvas.height - sceneHeight) / 2;
	const frameX = (canvas.width - sourceWidth * pxPerUnit) / 2 - minX * pxPerUnit;
	const holeX = frameX + frame.hole.cx * pxPerUnit;
	const holeY = sceneTop + connectorLead * pxPerUnit;
	const frameY = holeY - frame.hole.cy * pxPerUnit;
	const ringWidth = ringWidthUnits * pxPerUnit;
	const ringScale = source ? ringWidth / CLASSIC_CHAIN_LAYOUT.head.width : 0;
	const drawReferenceLayer = (asset: CanvasImageSource, box: { x: number; y: number; width: number; height: number }, originX: number, originY: number) => {
		ctx.drawImage(asset, originX + box.x * ringScale, originY + box.y * ringScale, box.width * ringScale, box.height * ringScale);
	};
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	if (source) {
		if (useClassicChain && connectors) {
			const originX = holeX - CHAIN_HOLE.x * ringScale;
			const originY = holeY - CHAIN_HOLE.y * ringScale;
			drawReferenceLayer(connectors.ring1Front, CLASSIC_CHAIN_LAYOUT.ring1Front, originX, originY);
			drawReferenceLayer(ring, CLASSIC_CHAIN_LAYOUT.head, originX, originY);
			drawReferenceLayer(connectors.ring2Front, CLASSIC_CHAIN_LAYOUT.ring2Front, originX, originY);
			drawReferenceLayer(connectors.ring1Back, CLASSIC_CHAIN_LAYOUT.ring1Back, originX, originY);
			drawReferenceLayer(connectors.ring3Front, CLASSIC_CHAIN_LAYOUT.ring3Front, originX, originY);
			drawReferenceLayer(connectors.ring2Back, CLASSIC_CHAIN_LAYOUT.ring2Back, originX, originY);
			drawReferenceLayer(connectors.ring3Back, CLASSIC_CHAIN_LAYOUT.ring3Back, originX, originY);
			drawReferenceLayer(connectors.tailBack, CLASSIC_CHAIN_LAYOUT.tail, originX, originY);
		} else {
			const ringHeight = ringWidth * source.height / source.width;
			const attachmentY = ringHeight * 0.94;
			ctx.drawImage(source, holeX - ringWidth / 2, holeY - attachmentY, ringWidth, ringHeight);
		}
	}
	ctx.save();
	ctx.translate(frameX, frameY);
	ctx.scale(pxPerUnit, pxPerUnit);
	const cut = new Path2D(frame.cutPath);
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
	const canRenderImage = side === "front" || config.backMode === "through-acrylic" || config.backMode === "mirror-front" || config.backMode === "custom";
	if (showImageCoverage && canRenderImage) { ctx.fillStyle = "#fff"; ctx.fill(cut); }
	if (renderImage && canRenderImage) {
		ctx.save();
		ctx.clip(cut);
		const borderPx = Math.max(0, Math.min(80, config.cutBorderPx ?? 20));
		const imageScale = Math.max(0.68, 1 - borderPx * 0.004);
		const face = side === "back" && config.backMode === "custom" ? config.backCustom : config.front;
		const transform = face?.transform || config.front.transform;
		const art = renderImage as CanvasImageSource & { width: number; height: number };
		const centerX = minX + sourceWidth / 2 + transform.xMm / mmPerUnit;
		const centerY = minY + sourceHeight / 2 + transform.yMm / mmPerUnit;
		ctx.translate(centerX, centerY);
		ctx.rotate((transform.rotation * Math.PI) / 180);
		const fit = Math.max(sourceWidth / art.width, sourceHeight / art.height);
		ctx.scale(transform.scale * imageScale * (transform.flipX ? -1 : 1) * (mirror ? -1 : 1), transform.scale * imageScale);
		ctx.drawImage(art, -art.width * fit / 2, -art.height * fit / 2, art.width * fit, art.height * fit);
		ctx.restore();
	}
	ctx.globalCompositeOperation = "destination-out";
	ctx.beginPath();
	ctx.arc(frame.hole.cx, frame.hole.cy, frame.hole.radiusMm / mmPerUnit, 0, Math.PI * 2);
	ctx.fill();
	ctx.globalCompositeOperation = "source-over";
	ctx.strokeStyle = "rgba(255,255,255,.75)";
	ctx.lineWidth = 0.35 / mmPerUnit;
	ctx.stroke(cut);
	ctx.restore();
	if (useClassicChain && connectors) {
		const originX = holeX - CHAIN_HOLE.x * ringScale;
		const originY = holeY - CHAIN_HOLE.y * ringScale;
		drawReferenceLayer(connectors.tailFront, CLASSIC_CHAIN_LAYOUT.tail, originX, originY);
	}
	return canvas;
}

export function getFullKeychainHeight(frame: FrameSvgData, config: KeychainConfig, ring?: CanvasImageSource & { width: number; height: number }) {
	const sourceWidth = frame.viewBox[2];
	const bodyBelowHole = frame.viewBox[1] + frame.viewBox[3] - frame.hole.cy;
	if (!ring) return frame.viewBox[3];
	const leadPerWidth = config.ringId === "ring-01" ? CLASSIC_LEAD_PER_WIDTH : (ring.height / ring.width) * 0.94;
	const ringWidth = getScaledRingWidth(sourceWidth, frame.viewBox[3], leadPerWidth);
	const lead = ringWidth * leadPerWidth;
	return lead + bodyBelowHole;
}
