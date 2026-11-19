/* eslint-disable react/no-unknown-property */
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Vector3, type CanvasTexture, type PerspectiveCamera } from "three";
import { FRAMES } from "@/data/keychain/catalog";
import type { KeychainAction, KeychainConfig } from "../types";
import { loadFrameSvg, type FrameSvgData } from "../geometry/frameSvg";
import { loadSanityImage } from "../image/loadSanityImage";
import { getFaceImageUrl } from "../image/imageFace";
import { createDesignTexture } from "../render/render3dTexture";
import type { DieCutStatus } from "../hooks/useDieCutGeometry";
import { KeychainMesh } from "./KeychainMesh";
import { RingPlane } from "./RingPlane";

class SceneBoundary extends Component<{ onError: (error: string) => void; children: ReactNode }, { failed: boolean }> {
	state = { failed: false };
	static getDerivedStateFromError() { return { failed: true }; }
	componentDidCatch(error: Error) { this.props.onError(error.message); }
	render() { return this.state.failed ? null : this.props.children; }
}

type ControlsApi = { reset: () => void; update: () => void; object: PerspectiveCamera; target: Vector3 };
function CameraSide({ view }: { view: "front" | "back" }) {
	const { camera, invalidate } = useThree();
	useEffect(() => { camera.position.set(0, 0, view === "front" ? 165 : -165); camera.up.set(0, 1, 0); camera.lookAt(0, 0, 0); camera.updateProjectionMatrix(); invalidate(); }, [camera, invalidate, view]);
	return null;
}

export function Preview3D({ config, view, dispatch, onBack, onNotify, frameOverride, geometryStatus, geometryError }: { config: KeychainConfig; view: "front" | "back"; dispatch: (action: KeychainAction) => void; onBack: () => void; onNotify?: (message: string) => void; frameOverride?: FrameSvgData; geometryStatus?: DieCutStatus; geometryError?: string }) {
	const [frame, setFrame] = useState<FrameSvgData | null>(null);
	const [textures, setTextures] = useState<[CanvasTexture, CanvasTexture] | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [fullScreen, setFullScreen] = useState(false);
	const controls = useRef<ControlsApi | null>(null);
	const frameId = config.shape.type === "frame" ? config.shape.frameId : "heart";
	const source = FRAMES.find((item) => item.id === frameId)?.src;
	const updateTransform = (update: (transform: typeof config.front.transform) => typeof config.front.transform) => {
		const face = view === "back" && config.backMode === "custom" ? "backCustom" : "front";
		const value = face === "backCustom" ? config.backCustom : config.front;
		if (value) dispatch({ type: "set-face", face, value: { ...value, transform: update(value.transform) } });
	};
	useEffect(() => { if (error) onNotify?.(error); }, [error, onNotify]);
	useEffect(() => {
		let active = true;
		if (config.shape.type === "die-cut") { setFrame(frameOverride || null); return; }
		if (!source) { setError("Không tìm thấy khung 3D."); return; }
		void loadFrameSvg(source).then((value) => { if (active) { setFrame(value); setError(null); } }).catch((reason) => { if (active) setError(reason instanceof Error ? reason.message : "Không tải được hình học"); });
		return () => { active = false; };
	}, [source, config.shape.type, frameOverride]);
	useEffect(() => {
		let active = true;
		let created: CanvasTexture[] = [];
		if (!frame) return;
		const frontUrl = getFaceImageUrl(config.front);
		const backUrl = config.backMode === "custom" ? getFaceImageUrl(config.backCustom) : frontUrl;
		void Promise.all([frontUrl ? loadSanityImage(frontUrl) : Promise.resolve(undefined), backUrl ? loadSanityImage(backUrl) : Promise.resolve(undefined)])
			.then(async ([frontImage, backImage]) => {
				const front = await createDesignTexture(frame, config, frontImage, "front");
				const back = await createDesignTexture(frame, config, backImage, "back"); created = [front, back];
				if (active) setTextures([front, back]);
			})
			.catch((reason) => { if (active) setError(reason instanceof Error ? reason.message : "Không tạo được họa tiết 3D"); });
		return () => { active = false; created.forEach((texture) => texture.dispose()); };
	}, [frame, config]);
	const updateCamera = (factor: number) => { const api = controls.current; if (!api) return; api.object.position.multiplyScalar(factor); api.update(); };
	const resetImage = () => updateTransform(() => ({ xMm: 0, yMm: 0, scale: 1, rotation: 0, flipX: false }));
	const onError = (message: string) => setError(message || "Thiết bị không hỗ trợ WebGL");
	const tools = [
		{ label: "Xoay góc nhìn", icon: "↻", action: () => { const api = controls.current; if (!api) return; api.object.position.applyAxisAngle(new Vector3(0, 0, 1), Math.PI / 2); api.update(); } },
		{ label: "Lật ảnh ngang", icon: "⇋", action: () => updateTransform((t) => ({ ...t, flipX: !t.flipX })) },
		{ label: "Thu nhỏ", icon: "−", action: () => updateCamera(1.1) },
		{ label: "Phóng to", icon: "+", action: () => updateCamera(0.9) },
		{ label: "Đặt lại ảnh", icon: "⟲", action: resetImage },
		{ label: fullScreen ? "Thoát toàn màn hình" : "Toàn màn hình", icon: fullScreen ? "⊡" : "⛶", action: () => setFullScreen((value) => !value) },
	];
	return <Stack spacing={{ xs: 0.75, md: 0.35 }} sx={{ width: "100%", height: { md: "100%" }, flex: { md: 1 }, minHeight: 0, ...(fullScreen ? { position: "fixed", zIndex: 1400, inset: 0, p: { xs: 1, md: 2 }, bgcolor: "#15161b", overflow: "auto" } : {}) }}>
		<Stack direction="row" spacing={0.5} alignItems="center" justifyContent="space-between" flexWrap="nowrap" sx={{ height: 32, minHeight: 32 }}>
			<Stack direction="row" spacing={0.5} sx={{ p: 0.35, bgcolor: "#22232a", border: "1px solid #36373e", borderRadius: 1.25 }}>
				{(["front", "back"] as const).map((face) => <Button key={face} size="small" aria-pressed={view === face} variant={view === face ? "contained" : "text"} onClick={() => dispatch({ type: "set-view", view: face })} sx={{ height: 28, minHeight: 28, px: 1, lineHeight: 1, bgcolor: view === face ? "#f47a28" : "transparent", color: "white", "&:hover": { bgcolor: view === face ? "#ff8a36" : "#303139" } }}>{face === "front" ? "Mặt trước" : "Mặt sau"}</Button>)}
			</Stack>
			<Stack direction="row" spacing={0.25}>
				<Button size="small" onClick={onBack} sx={{ height: 28, minHeight: 28, minWidth: 36, color: "#c5c6ce" }}>2D</Button>
				<Button size="small" variant="outlined" aria-current="true" sx={{ height: 28, minHeight: 28, minWidth: 36, borderColor: "#45464e", color: "#c5c6ce" }}>3D</Button>
			</Stack>
		</Stack>
		<Stack direction="row" spacing={0.5} alignItems="stretch" sx={{ minHeight: { xs: 260, md: 0 }, flex: { md: 1 }, height: { md: "100%" } }}>
			<Stack spacing={0.35} sx={{ width: 32, flex: "0 0 32px", py: 0.25 }}>
				{tools.map((tool) => <Button key={tool.label} title={tool.label} aria-label={tool.label} onClick={tool.action} sx={{ width: 32, minWidth: 32, height: 32, minHeight: 32, p: 0, color: "#c5c6ce", border: "1px solid #34353d", bgcolor: "#22232a", borderRadius: 1, fontSize: 14 }}>{tool.icon}</Button>)}
			</Stack>
			<Box sx={{ flex: 1, minWidth: 0, minHeight: 0, position: "relative", overflow: "hidden", border: "1px solid #2d2e35", borderRadius: 1.5, bgcolor: "#17181e", backgroundImage: "linear-gradient(#ffffff05 1px, transparent 1px), linear-gradient(90deg, #ffffff05 1px, transparent 1px)", backgroundSize: "24px 24px" }}>
				{error ? <Stack spacing={1} role="alert" sx={{ position: "absolute", inset: 0, display: "grid", alignContent: "center", justifyItems: "center", p: 2 }}><Typography color="error.light" textAlign="center">{error}</Typography><Button onClick={onBack} sx={{ color: "#f47a28" }}>Quay lại 2D</Button></Stack> : config.shape.type === "die-cut" && !frameOverride ? <Typography role="status" color={geometryStatus === "error" ? "error" : "grey.300"}>{geometryError || (geometryStatus === "processing" ? "Đang tạo đường cắt…" : "Chọn ảnh mặt trước để tạo đường cắt.")}</Typography> : !frame || !textures ? <Typography role="status" color={geometryStatus === "error" ? "warning.main" : "grey.300"} sx={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>{geometryError || "Đang dựng bản xem trước 3D…"}</Typography> : <SceneBoundary onError={onError}>
					<Canvas frameloop="demand" dpr={[1, 1.5]} camera={{ position: [0, 0, 165], fov: 44 }} style={{ width: "100%", height: "100%" }} onCreated={({ gl }) => { if (!gl.getContext()) onError("WebGL không khả dụng."); }}>
						<CameraSide view={view} />
						<ambientLight intensity={1.2} /><directionalLight position={[30, 40, 60]} intensity={2} />
						<group position={[0, -12, 0]}>
							<KeychainMesh frame={frame} config={config} frontTexture={textures[0]} backTexture={textures[1]} view={view} />
							<RingPlane ringId={config.ringId} sizeCm={config.sizeCm} frame={frame} />
						</group>
						<OrbitControls ref={(instance) => { controls.current = instance ? instance as unknown as ControlsApi : null; }} makeDefault enableDamping={false} enablePan={false} minDistance={70} maxDistance={280} />
					</Canvas>
				</SceneBoundary>}
			</Box>
		</Stack>
	</Stack>;
}
