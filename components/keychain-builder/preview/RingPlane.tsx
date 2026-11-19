/* eslint-disable react/no-unknown-property */
import { useLoader } from "@react-three/fiber";
import { DoubleSide, TextureLoader, type Texture } from "three";
import { RINGS } from "@/data/keychain/catalog";
import type { FrameSvgData } from "../geometry/frameSvg";

const CONNECTOR_URLS = [
	"/keychain/connectors/keychain_01_f.png", "/keychain/connectors/keychain_01_b.png",
	"/keychain/connectors/keychain_02_f.png", "/keychain/connectors/keychain_02_b.png",
	"/keychain/connectors/keychain_03_f.png", "/keychain/connectors/keychain_03_b.png",
	"/keychain/connectors/keychain_tail_f.png", "/keychain/connectors/keychain_tail_b.png",
];
const LAYERS = [
	{ x: 216, y: 525, width: 72, height: 136, url: CONNECTOR_URLS[0], z: 3.2 },
	{ x: 163, y: 611, width: 55, height: 166, url: CONNECTOR_URLS[2], z: 3.3 },
	{ x: 148, y: 525, width: 68, height: 136, url: CONNECTOR_URLS[1], z: -2.9 },
	{ x: 215, y: 698, width: 80, height: 195, url: CONNECTOR_URLS[4], z: 3.4 },
	{ x: 218, y: 611, width: 55, height: 166, url: CONNECTOR_URLS[3], z: -2.8 },
	{ x: 135, y: 698, width: 80, height: 195, url: CONNECTOR_URLS[5], z: -2.7 },
	{ x: 127, y: 882, width: 175, height: 223, url: CONNECTOR_URLS[7], z: -2.6 },
	{ x: 127, y: 882, width: 175, height: 223, url: CONNECTOR_URLS[6], z: 3.5 },
];
function ClassicConnector({ ringId, sizeCm, frame }: { ringId: string; sizeCm: number; frame: FrameSvgData }) {
	const ring = RINGS.find((item) => item.id === ringId) || RINGS[0];
	const textures = useLoader(TextureLoader, [ring.src, ...CONNECTOR_URLS]) as Texture[];
	textures.forEach((texture) => { texture.colorSpace = "srgb"; });
	const headTexture = textures[0];
	const [minX, minY, width, height] = frame.viewBox;
	const worldPerUnit = sizeCm * 10 / Math.max(width, height);
	const frameWidth = width * worldPerUnit;
	const scale = frameWidth * 0.38 / 431;
	const holeX = (frame.hole.cx - (minX + width / 2)) * worldPerUnit;
	const holeY = (minY + height / 2 - frame.hole.cy) * worldPerUnit;
	const plane = (box: { x: number; y: number; width: number; height: number }, z: number) => ({
		position: [holeX + (box.x + box.width / 2 - 215) * scale, holeY - (box.y + box.height / 2 - 1097.5) * scale, z] as [number, number, number],
		size: [box.width * scale, box.height * scale] as [number, number],
	});
	const frontHead = plane({ x: 0, y: 38, width: 431, height: 536 }, 3.1);
	const backHead = plane({ x: 0, y: 38, width: 431, height: 536 }, -3.1);
	return <>
		<mesh position={frontHead.position}><planeGeometry args={frontHead.size} /><meshBasicMaterial map={headTexture} transparent depthWrite={false} side={DoubleSide} /></mesh>
		<mesh position={backHead.position}><planeGeometry args={backHead.size} /><meshBasicMaterial map={headTexture} transparent depthWrite={false} side={DoubleSide} /></mesh>
		{LAYERS.map((layer, index) => { const texture = textures[index + 1]; const box = plane(layer, layer.z); return <mesh key={layer.url} position={box.position}><planeGeometry args={box.size} /><meshBasicMaterial map={texture} transparent depthWrite={false} side={DoubleSide} /></mesh>; })}
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
	const holeX = (frame.hole.cx - (minX + width / 2)) * worldPerUnit;
	const holeY = (minY + height / 2 - frame.hole.cy) * worldPerUnit;
	const ringWidth = frameWidth * 0.38;
	const ringHeight = ringWidth * source.height / source.width;
	const anchorY = holeY + ringHeight * 0.5;
	return <mesh position={[holeX, anchorY, 3]}><planeGeometry args={[ringWidth, ringHeight]} /><meshBasicMaterial map={texture} transparent depthWrite={false} side={DoubleSide} /></mesh>;
}
