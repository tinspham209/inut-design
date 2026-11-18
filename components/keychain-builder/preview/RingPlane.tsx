/* eslint-disable react/no-unknown-property */
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { RINGS } from "@/data/keychain/catalog";

export function RingPlane({ ringId, sizeCm }: { ringId: string; sizeCm: number }) {
	const ring = RINGS.find((item) => item.id === ringId) || RINGS[0];
	const texture = useLoader(TextureLoader, ring.src);
	texture.colorSpace = "srgb";
	const anchorY = sizeCm * 5 + (20 - ring.estimatedAnchor.y) * 0.25 + 4;
	const anchorX = (ring.estimatedAnchor.x - 50) * 0.05;
	return <mesh position={[anchorX, anchorY, 2]}>
		<planeGeometry args={[18, 18]} />
		<meshBasicMaterial map={texture} transparent depthWrite={false} />
	</mesh>;
}
