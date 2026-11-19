/* eslint-disable react/no-unknown-property */
import { useMemo } from "react";
import { ExtrudeGeometry, Float32BufferAttribute, Path, Shape, type CanvasTexture } from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import type { FrameSvgData } from "../geometry/frameSvg";
import type { KeychainConfig } from "../types";

type Props = { frame: FrameSvgData; config: KeychainConfig; frontTexture: CanvasTexture; backTexture: CanvasTexture; view: "front" | "back" };
export function KeychainMesh({ frame, config, frontTexture, backTexture, view }: Props) {
	const edgeColor = config.material.edge === "natural" ? "#9baab1" : "#d7e7ef";
	const geometry = useMemo(() => {
		const cutPath = new SVGLoader().parse(frame.source).paths.find((path) => path.userData?.node?.id === "cut");
		if (!cutPath) throw new Error("SVG không có đường cắt #cut");
		const parsed = SVGLoader.createShapes(cutPath);
		const shape = parsed[0] as Shape | undefined;
		if (!shape) throw new Error("Không dựng được biên dạng 3D");
		const scale = (config.sizeCm * 10) / Math.max(frame.viewBox[2], frame.viewBox[3]);
		if (!frame.holeAlreadyInPath) {
			const hole = new Path();
			hole.absellipse(frame.hole.cx, frame.hole.cy, 2 / scale, 2 / scale, 0, Math.PI * 2, false, 0);
			shape.holes.push(hole);
		}
		const geometry = new ExtrudeGeometry(shape, { depth: config.material.thicknessMm / scale, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.25 / scale, bevelThickness: 0.25 / scale, curveSegments: 12 });
		geometry.scale(scale, -scale, scale); geometry.center();
		geometry.computeBoundingBox();
		const bounds = geometry.boundingBox;
		const positions = geometry.getAttribute("position");
		const uv = new Float32Array(positions.count * 2);
		const spanX = bounds ? Math.max(Number.EPSILON, bounds.max.x - bounds.min.x) : 1;
		const spanY = bounds ? Math.max(Number.EPSILON, bounds.max.y - bounds.min.y) : 1;
		for (let index = 0; index < positions.count; index += 1) {
			uv[index * 2] = bounds ? (positions.getX(index) - bounds.min.x) / spanX : 0;
			uv[index * 2 + 1] = bounds ? (positions.getY(index) - bounds.min.y) / spanY : 0;
		}
		geometry.setAttribute("uv", new Float32BufferAttribute(uv, 2));
		geometry.computeVertexNormals();
		return geometry;
	}, [frame, config.sizeCm, config.material.thicknessMm]);
	return <mesh geometry={geometry} rotation={[0, 0, 0]}>
		<meshPhysicalMaterial attach="material-0" map={view === "front" ? frontTexture : backTexture} color={config.acrylicId === "clear" ? "#e1f4ff" : "#ffffff"} transparent={config.acrylicId === "clear"} opacity={config.acrylicId === "clear" ? 0.86 : 1} roughness={0.2 + config.material.sheen * 0.35} metalness={0} clearcoat={0.9} clearcoatRoughness={0.16} side={2} />
		<meshPhysicalMaterial attach="material-1" color={edgeColor} roughness={0.2} metalness={0.35} />
	</mesh>;
}
