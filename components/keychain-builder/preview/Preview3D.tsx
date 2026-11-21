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
import { get3dBackRenderSource, get3dEditableFace } from "../render/renderModel";
import type { DieCutStatus } from "../hooks/useDieCutGeometry";
import { KeychainMesh } from "./KeychainMesh";
import { RingPlane } from "./RingPlane";
import { PreviewToolbar } from "./PreviewToolbar";

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
		const customBackUrl = getFaceImageUrl(config.backCustom);
		const backSource = get3dBackRenderSource(config, frontUrl, customBackUrl);
		const backUrl = backSource.imageUrl;
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
	const resetCamera = () => { const api = controls.current; if (!api) return; api.reset(); api.update(); };
	const updateArtwork = (transformUpdate: (transform: KeychainConfig["front"]["transform"]) => KeychainConfig["front"]["transform"]) => {
		const face = get3dEditableFace(view, config.backMode);
		const value = face === "backCustom" ? config.backCustom : config.front;
		if (value) dispatch({ type: "set-face", face, value: { ...value, transform: transformUpdate(value.transform) } });
	};
	const onError = (message: string) => setError(message || "Thiết bị không hỗ trợ WebGL");
	const artworkLabel = get3dEditableFace(view, config.backMode) === "backCustom" ? "ảnh mặt sau" : "ảnh in";
	const updateArtworkRotation = () => updateArtwork((transform) => ({ ...transform, rotation: (transform.rotation + 90) % 360 }));
	const updateArtworkFlip = () => updateArtwork((transform) => ({ ...transform, flipX: !transform.flipX }));
	const zoomArtworkOut = () => updateArtwork((transform) => ({ ...transform, scale: Math.max(0.25, transform.scale / 1.1) }));
	const zoomArtworkIn = () => updateArtwork((transform) => ({ ...transform, scale: Math.min(12, transform.scale * 1.1) }));
	const resetArtwork = () => updateArtwork(() => ({ xMm: 0, yMm: 0, scale: 1, rotation: 0, flipX: false }));
	return <Stack spacing={0.5} sx={{ width: "100%", height: "100%", flex: 1, minHeight: 0, minWidth: 0, ...(fullScreen ? { position: "fixed", zIndex: 1400, inset: 0, p: { xs: 1, md: 2 }, bgcolor: "#15161b", overflow: "auto" } : {}) }}>
		<Stack className="keychain-preview-header" direction="row" spacing={0.5} alignItems="center" justifyContent="space-between" flexWrap="nowrap" sx={{ height: 32, minHeight: 32, maxHeight: 32, flex: "0 0 32px", minWidth: 0, overflow: "hidden", "&& .MuiButton-root": { height: 28, minHeight: 28, maxHeight: 28, minWidth: 32, px: 0.5, py: 0, flexShrink: 0 } }}>
			<Stack direction="row" spacing={0.5} sx={{ flex: { xs: "1 1 auto", md: "0 0 auto" }, width: { xs: "auto", md: "fit-content" }, maxWidth: { xs: "65%", md: "none" }, minWidth: 0, p: 0, bgcolor: "#22232a", border: "1px solid #36373e", borderRadius: 1.25 }}>
				<Typography variant="caption" color="grey.400" sx={{ px: 1, alignSelf: "center", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: { xs: 11, md: 14 } }}>Xoay mô hình để xem hai mặt</Typography>
			</Stack>
			<Stack direction="row" spacing={0.25} flexShrink={0}>
				<Button size="small" onClick={onBack} sx={{ color: "#c5c6ce", borderRadius: "10px" }}>2D</Button>
				<Button size="small" variant="outlined" aria-current="true" sx={{ borderColor: "#45464e", color: "#c5c6ce", borderRadius: "10px" }}>3D</Button>
			</Stack>
		</Stack>
		<Stack direction={{ xs: "column", md: "row" }} spacing={0.5} alignItems="stretch" sx={{ minHeight: 0, flex: 1, minWidth: 0 }}>
			<PreviewToolbar artworkLabel={artworkLabel} fullScreen={fullScreen} onArtworkRotate={updateArtworkRotation} onArtworkFlip={updateArtworkFlip} onArtworkZoomOut={zoomArtworkOut} onArtworkZoomIn={zoomArtworkIn} onArtworkReset={resetArtwork} onViewZoomOut={() => updateCamera(1.1)} onViewZoomIn={() => updateCamera(0.9)} onViewReset={resetCamera} onFullScreenToggle={() => setFullScreen((value) => !value)} />
			<Box sx={{ flex: 1, minWidth: 0, minHeight: 0, position: "relative", overflow: "hidden", border: "1px solid #2d2e35", borderRadius: 1.5, bgcolor: "#17181e", backgroundImage: "linear-gradient(#ffffff05 1px, transparent 1px), linear-gradient(90deg, #ffffff05 1px, transparent 1px)", backgroundSize: "24px 24px" }}>
				{error ? <Stack spacing={1} role="alert" sx={{ position: "absolute", inset: 0, display: "grid", alignContent: "center", justifyItems: "center", p: 2 }}><Typography color="error.light" textAlign="center">{error}</Typography><Button onClick={onBack} sx={{ color: "#f47a28" }}>Quay lại 2D</Button></Stack> : config.shape.type === "die-cut" && !frameOverride ? <Typography role="status" color={geometryStatus === "error" ? "error" : "grey.300"}>{geometryError || (geometryStatus === "processing" ? "Đang tạo đường cắt…" : "Chọn ảnh mặt trước để tạo đường cắt.")}</Typography> : !frame || !textures ? <Typography role="status" color={geometryStatus === "error" ? "warning.main" : "grey.300"} sx={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>{geometryError || "Đang dựng bản xem trước 3D…"}</Typography> : <SceneBoundary onError={onError}>
					<Canvas frameloop="demand" dpr={[1, 1.5]} camera={{ position: [0, 0, 165], fov: 44 }} style={{ width: "100%", height: "100%" }} onCreated={({ gl }) => { if (!gl.getContext()) onError("WebGL không khả dụng."); }}>
						<CameraSide view={view} />
						<ambientLight intensity={1.2} /><directionalLight position={[30, 40, 60]} intensity={2} />
						<group position={[0, 0, 0]}>
							<KeychainMesh frame={frame} config={config} frontTexture={textures[0]} backTexture={textures[1]} />
							<RingPlane ringId={config.ringId} sizeCm={config.sizeCm} frame={frame} />
						</group>
						<OrbitControls ref={(instance) => { controls.current = instance ? instance as unknown as ControlsApi : null; }} makeDefault enableDamping={false} enablePan={false} minDistance={70} maxDistance={280} />
					</Canvas>
				</SceneBoundary>}
			</Box>
		</Stack>
	</Stack>;
}
