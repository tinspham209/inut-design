/* eslint-disable react/no-unknown-property */
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { RINGS } from "@/data/keychain/catalog";
import type { FrameSvgData } from "../geometry/frameSvg";

export function RingPlane({ ringId, sizeCm, frame }: { ringId: string; sizeCm: number; frame: FrameSvgData }) {
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
	const articulated = ringId === "ring-01";
	const chainLength = articulated ? ringWidth * ((1097.5 - 525) / 431) : 0;
	const anchorY = holeY + chainLength + ringHeight * (articulated ? 0.38 : 0.44);
	return <>
		<mesh position={[holeX, anchorY, 2]}>
			<planeGeometry args={[ringWidth, ringHeight]} />
			<meshBasicMaterial map={texture} transparent depthWrite={false} />
		</mesh>
		{articulated && Array.from({ length: 3 }, (_, index) => <mesh key={index} position={[holeX, holeY + (index + 1) * chainLength / 4, 2.5]} rotation={[0, index % 2 ? Math.PI / 2 : 0, 0]}>
			<torusGeometry args={[ringWidth * 0.045, ringWidth * 0.012, 8, 20]} />
			<meshStandardMaterial color="#d8dbe0" metalness={0.88} roughness={0.2} />
		</mesh>)}
	</>;
}
