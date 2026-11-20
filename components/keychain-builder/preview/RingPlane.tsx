/* eslint-disable react/no-unknown-property */
import { useLoader } from "@react-three/fiber";
import { DoubleSide, TextureLoader, type Texture } from "three";
import { RINGS } from "@/data/keychain/catalog";
import type { FrameSvgData } from "../geometry/frameSvg";
import { getScaledRingWidth } from "../render/render2d";

const CLASSIC_LEAD_PER_WIDTH = (1097.5 - 38) / 431;

const CONNECTOR_URLS = [
	"/keychain/connectors/keychain_01_f.png",
	"/keychain/connectors/keychain_02_f.png",
	"/keychain/connectors/keychain_03_f.png",
	"/keychain/connectors/keychain_tail_f.png",
];
const LAYERS = [
	{ x: 216, y: 525, width: 72, height: 136, url: CONNECTOR_URLS[0] },
	{ x: 163, y: 611, width: 55, height: 166, url: CONNECTOR_URLS[1] },
	{ x: 215, y: 698, width: 80, height: 195, url: CONNECTOR_URLS[2] },
	{ x: 127, y: 882, width: 175, height: 223, url: CONNECTOR_URLS[3] },
];
function ClassicConnector({ ringId, sizeCm, frame }: { ringId: string; sizeCm: number; frame: FrameSvgData }) {
	const ring = RINGS.find((item) => item.id === ringId) || RINGS[0];
	const textures = useLoader(TextureLoader, [ring.src, ...CONNECTOR_URLS]) as Texture[];
	textures.forEach((texture) => { texture.colorSpace = "srgb"; });
	const headTexture = textures[0];
	const [minX, minY, width, height] = frame.viewBox;
	const worldPerUnit = sizeCm * 10 / Math.max(width, height);
	const frameWidth = width * worldPerUnit;
	const frameHeight = height * worldPerUnit;
	const scale = getScaledRingWidth(frameWidth, frameHeight, CLASSIC_LEAD_PER_WIDTH) / 431;
	const holeX = (frame.hole.cx - (minX + width / 2)) * worldPerUnit;
	const holeY = (minY + height / 2 - frame.hole.cy) * worldPerUnit;
	const plane = (box: { x: number; y: number; width: number; height: number }, z: number) => ({
		position: [holeX + (box.x + box.width / 2 - 215) * scale, holeY - (box.y + box.height / 2 - 1097.5) * scale, z] as [number, number, number],
		size: [box.width * scale, box.height * scale] as [number, number],
	});
	const head = plane({ x: 0, y: 38, width: 431, height: 536 }, 0);
	return <>
		<mesh position={head.position}><planeGeometry args={head.size} /><meshBasicMaterial map={headTexture} transparent depthWrite={false} depthTest={false} side={DoubleSide} /></mesh>
		{LAYERS.map((layer, index) => { const texture = textures[index + 1]; const box = plane(layer, 0); return <mesh key={layer.url} position={box.position}><planeGeometry args={box.size} /><meshBasicMaterial map={texture} transparent depthWrite={false} depthTest={false} side={DoubleSide} /></mesh>; })}
	</>;
}

export function RingPlane({ ringId, sizeCm, frame }: { ringId: string; sizeCm: number; frame: FrameSvgData }) {
	if (ringId === "ring-01") return <ClassicConnector ringId={ringId} sizeCm={sizeCm} frame={frame} />;
	return <OtherRing ringId={ringId} sizeCm={sizeCm} frame={frame} />;
}

function OtherRing({ ringId, sizeCm, frame }: { ringId: string; sizeCm: number; frame: FrameSvgData }) {
	const ring = RINGS.find((item) => item.id === ringId) || RINGS[0];
	const texture = useLoader(TextureLoader, ring.src);
	texture.colorSpace = "srgb";
	const source = texture.image as { width: number; height: number };
	const [minX, minY, width, height] = frame.viewBox;
	const worldPerUnit = sizeCm * 10 / Math.max(width, height);
	const frameWidth = width * worldPerUnit;
	const frameHeight = height * worldPerUnit;
	const holeX = (frame.hole.cx - (minX + width / 2)) * worldPerUnit;
	const holeY = (minY + height / 2 - frame.hole.cy) * worldPerUnit;
	const leadPerWidth = (source.height / source.width) * 0.94;
	const ringWidth = getScaledRingWidth(frameWidth, frameHeight, leadPerWidth);
	const ringHeight = ringWidth * source.height / source.width;
	const anchorY = holeY + ringHeight * (0.94 - 0.5);
	return <mesh position={[holeX, anchorY, 3]}><planeGeometry args={[ringWidth, ringHeight]} /><meshBasicMaterial map={texture} transparent depthWrite={false} side={DoubleSide} /></mesh>;
}
