/* eslint-disable react/no-unknown-property */
import { useMemo } from "react";
import { ExtrudeGeometry, Path, Shape, type CanvasTexture } from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import type { FrameSvgData } from "../geometry/frameSvg";
import type { KeychainConfig } from "../types";

type Props = { frame: FrameSvgData; config: KeychainConfig; frontTexture: CanvasTexture; backTexture: CanvasTexture };
export function KeychainMesh({ frame, config, frontTexture, backTexture }: Props) {
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
		geometry.computeVertexNormals();
		return geometry;
	}, [frame, config.sizeCm, config.material.thicknessMm]);
	return <mesh geometry={geometry} rotation={[0, 0, 0]}>
		<meshPhysicalMaterial attach="material-0" map={frontTexture} color={config.acrylicId === "clear" ? "#cceaff" : config.acrylicId} transparent={config.acrylicId === "clear"} opacity={config.acrylicId === "clear" ? 0.78 : 1} roughness={0.2 + config.material.sheen * 0.35} metalness={0} side={2} />
		<meshPhysicalMaterial attach="material-1" map={backTexture} color={config.acrylicId === "clear" ? "#d9efff" : config.acrylicId} transparent={config.acrylicId === "clear"} opacity={config.acrylicId === "clear" ? 0.75 : 1} roughness={0.25} side={2} />
		<meshPhysicalMaterial attach="material-2" color={config.material.edge} roughness={0.28} />
	</mesh>;
}
