/* eslint-disable react/no-unknown-property */
import { useMemo } from "react";
import { ExtrudeGeometry, Float32BufferAttribute, Path, Shape, type CanvasTexture } from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import { splitExtrudeMaterialGroups } from "../geometry/extrudeMaterialGroups";
import { mapCenteredGeometryToFrameUv } from "../geometry/frameUv";
import { is3dBackOpaque } from "../render/renderModel";
import type { FrameSvgData } from "../geometry/frameSvg";
import type { KeychainConfig } from "../types";

type Props = { frame: FrameSvgData; config: KeychainConfig; frontTexture: CanvasTexture; backTexture: CanvasTexture };

export function KeychainMesh({ frame, config, frontTexture, backTexture }: Props) {
	const clearAcrylic = config.acrylicId === "clear";
	const opaqueBack = is3dBackOpaque(config);
	const acrylicColor = clearAcrylic ? "#e1f4ff" : config.acrylicId;
	const opacity = clearAcrylic ? 0.85 : 1;
	const sideOpacity = clearAcrylic ? opacity * 0.28 : 1;
	const geometry = useMemo(() => {
		const cutPath = new SVGLoader().parse(frame.source).paths.find((path) => path.userData?.node?.id === "cut");
		if (!cutPath) throw new Error("SVG không có đường cắt #cut");
		const parsed = SVGLoader.createShapes(cutPath);
		const shape = parsed[0] as Shape | undefined;
		if (!shape) throw new Error("Không dựng được biên dạng 3D");
		const [minX, minY, viewWidth, viewHeight] = frame.viewBox;
		const scale = (config.sizeCm * 10) / Math.max(viewWidth, viewHeight);
		if (!frame.holeAlreadyInPath) {
			const hole = new Path();
			hole.absellipse(frame.hole.cx, frame.hole.cy, 2 / scale, 2 / scale, 0, Math.PI * 2, false, 0);
			shape.holes.push(hole);
		}
		const geometry = new ExtrudeGeometry(shape, { depth: config.material.thicknessMm / scale, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.25 / scale, bevelThickness: 0.25 / scale, curveSegments: 12 });
		const materialGroups = splitExtrudeMaterialGroups(geometry.groups);
		geometry.clearGroups();
		for (const group of materialGroups) geometry.addGroup(group.start, group.count, group.materialIndex);
		geometry.scale(scale, -scale, scale);
		geometry.translate(-(minX + viewWidth / 2) * scale, (minY + viewHeight / 2) * scale, -config.material.thicknessMm / 2);
		const positions = geometry.getAttribute("position");
		const uv = new Float32Array(positions.count * 2);
		const worldWidth = viewWidth * scale;
		const worldHeight = viewHeight * scale;
		for (let index = 0; index < positions.count; index += 1) {
			const [u, v] = mapCenteredGeometryToFrameUv(positions.getX(index), positions.getY(index), worldWidth, worldHeight);
			uv[index * 2] = u;
			uv[index * 2 + 1] = v;
		}
		geometry.setAttribute("uv", new Float32BufferAttribute(uv, 2));
		geometry.computeVertexNormals();
		return geometry;
	}, [frame, config.sizeCm, config.material.thicknessMm]);
	return <mesh geometry={geometry} rotation={[0, 0, 0]}>
		<meshBasicMaterial attach="material-0" map={backTexture} color="white" transparent={!opaqueBack} opacity={opaqueBack ? 1 : opacity} depthWrite side={2} />
		<meshBasicMaterial attach="material-1" map={frontTexture} color="white" transparent={clearAcrylic} opacity={opacity} depthWrite side={2} />
		<meshBasicMaterial attach="material-2" color={acrylicColor} transparent={clearAcrylic} opacity={sideOpacity} depthWrite side={2} />
	</mesh>;
}
