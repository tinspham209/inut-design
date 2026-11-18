import { HOLE_DIAMETER_MM } from "./mm";
import type { DieCutGeometry } from "./dieCut";

export type FrameSvgData = { viewBox: [number, number, number, number]; cutPath: string; printPath: string; hole: { cx: number; cy: number; radiusMm: number }; source: string; holeAlreadyInPath?: boolean };

export function dieCutFrameSvg(geometry: DieCutGeometry): FrameSvgData {
	const width = geometry.widthMm; const height = geometry.heightMm;
	const source = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><path id="cut" d="${geometry.path}"/><path id="print" d="${geometry.outerPath}"/></svg>`;
	return { viewBox: [0, 0, width, height], cutPath: geometry.path, printPath: geometry.outerPath, hole: geometry.hole, source, holeAlreadyInPath: true };
}

export async function loadFrameSvg(src: string): Promise<FrameSvgData> {
	const response = await fetch(src, { mode: "cors", cache: "force-cache" });
	if (!response.ok) throw new Error("Không tải được mẫu khung. Vui lòng thử lại.");
	const text = await response.text();
	const document = new DOMParser().parseFromString(text, "image/svg+xml");
	if (document.querySelector("parsererror")) throw new Error("Tệp khung SVG không hợp lệ");
	const svg = document.documentElement;
	const viewBox = (svg.getAttribute("viewBox") || "").split(/[ ,]+/).map(Number);
	const cut = document.querySelector("#cut");
	const print = document.querySelector("#print");
	const hole = document.querySelector("#hole");
	const cutPath = cut?.getAttribute("d");
	const printPath = print?.getAttribute("d");
	const cx = Number(hole?.getAttribute("cx"));
	const cy = Number(hole?.getAttribute("cy"));
	if (viewBox.length !== 4 || !viewBox.every(Number.isFinite) || !cutPath || !printPath || !hole || !Number.isFinite(cx) || !Number.isFinite(cy)) throw new Error("Khung thiếu vùng cắt, vùng in hoặc lỗ treo");
	return { viewBox: viewBox as FrameSvgData["viewBox"], cutPath, printPath, hole: { cx, cy, radiusMm: HOLE_DIAMETER_MM / 2 }, source: text };
}
