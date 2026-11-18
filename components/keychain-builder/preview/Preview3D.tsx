/* eslint-disable react/no-unknown-property */
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { Alert, Button, Stack, Typography } from "@mui/material";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { CanvasTexture } from "three";
import { FRAMES } from "@/data/keychain/catalog";
import { loadFrameSvg, type FrameSvgData } from "../geometry/frameSvg";
import { loadSanityImage } from "../image/loadSanityImage";
import type { KeychainConfig } from "../types";
import { createDesignTexture } from "../render/render3dTexture";
import { KeychainMesh } from "./KeychainMesh";
import { RingPlane } from "./RingPlane";
import { Preview3DFallback } from "./Preview3DFallback";

class SceneBoundary extends Component<{ onError: (error: string) => void; children: ReactNode }, { failed: boolean }> {
	state = { failed: false };
	static getDerivedStateFromError() { return { failed: true }; }
	componentDidCatch(error: Error) { this.props.onError(error.message); }
	render() { return this.state.failed ? null : this.props.children; }
}

export function Preview3D({ config, onBack }: { config: KeychainConfig; onBack: () => void }) {
	const [frame, setFrame] = useState<FrameSvgData | null>(null);
	const [textures, setTextures] = useState<[CanvasTexture, CanvasTexture] | null>(null);
	const [error, setError] = useState<string | null>(null);
	const controls = useRef<{ reset: () => void } | null>(null);
	const frameId = config.shape.type === "frame" ? config.shape.frameId : "heart";
	const source = FRAMES.find((item) => item.id === frameId)?.src;
	useEffect(() => {
		let active = true;
		if (!source) { setError("Không tìm thấy khung 3D."); return; }
		void loadFrameSvg(source).then((value) => { if (active) { setFrame(value); setError(null); } }).catch((reason) => { if (active) setError(reason instanceof Error ? reason.message : "Không tải được hình học"); });
		return () => { active = false; };
	}, [source]);
	useEffect(() => {
		let active = true;
		let created: CanvasTexture[] = [];
		if (!frame) return;
		const frontUrl = config.front.url;
		const backUrl = config.backMode === "custom" ? config.backCustom?.url : frontUrl;
		void Promise.all([frontUrl ? loadSanityImage(frontUrl) : Promise.resolve(undefined), backUrl ? loadSanityImage(backUrl) : Promise.resolve(undefined)])
			.then(async ([frontImage, backImage]) => {
				const front = await createDesignTexture(frame, config, frontImage, "front");
				const back = await createDesignTexture(frame, config, backImage, "back"); created = [front, back];
				if (active) setTextures([front, back]);
			})
			.catch((reason) => { if (active) setError(reason instanceof Error ? reason.message : "Không tạo được họa tiết 3D"); });
		return () => { active = false; created.forEach((texture) => texture.dispose()); };
	}, [frame, config]);
	const onError = (message: string) => setError(message || "Thiết bị không hỗ trợ WebGL");
	if (error) return <Preview3DFallback error={error} onBack={onBack} />;
	if (!frame || !textures) return <Alert severity="info" role="status">Đang dựng bản xem trước 3D…</Alert>;
	return <Stack spacing={1}>
		<Stack direction="row" spacing={1}><Button onClick={onBack}>Quay lại 2D</Button><Button onClick={() => controls.current?.reset()}>Fit / Reset camera</Button><Typography variant="body2" color="grey.400">Xoay và phóng to không làm thay đổi thiết kế</Typography></Stack>
		<SceneBoundary onError={onError}>
			<Canvas frameloop="demand" dpr={[1, 1.5]} camera={{ position: [0, 0, 120], fov: 35 }} style={{ width: "100%", height: 440 }} onCreated={({ gl }) => { if (!gl.getContext()) onError("WebGL không khả dụng."); }}>
				<ambientLight intensity={1.2} /><directionalLight position={[30, 40, 60]} intensity={2} />
				<KeychainMesh frame={frame} config={config} frontTexture={textures[0]} backTexture={textures[1]} />
				<RingPlane ringId={config.ringId} sizeCm={config.sizeCm} />
				<OrbitControls ref={(instance) => { controls.current = instance ? instance as unknown as { reset: () => void } : null; }} makeDefault enableDamping={false} enablePan={false} minDistance={70} maxDistance={220} />
			</Canvas>
		</SceneBoundary>
	</Stack>;
}
