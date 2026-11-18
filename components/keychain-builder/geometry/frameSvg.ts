import { HOLE_DIAMETER_MM } from "./mm";

export type FrameSvgData = { viewBox: [number, number, number, number]; cutPath: string; printPath: string; hole: { cx: number; cy: number; radiusMm: number }; source: string };

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
