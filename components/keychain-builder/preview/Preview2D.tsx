import { useCallback, useEffect, useRef, useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { FRAMES, RINGS } from "@/data/keychain/catalog";
import type { KeychainAction, KeychainConfig } from "../types";
import { loadFrameSvg, type FrameSvgData } from "../geometry/frameSvg";
import { loadSanityImage } from "../image/loadSanityImage";
import { renderKeychain2d, type ConnectorAssets } from "../render/render2d";
import type { DieCutStatus } from "../hooks/useDieCutGeometry";
import { getFaceImageUrl } from "../image/imageFace";

type Props = { config: KeychainConfig; view: "front" | "back"; dispatch: (action: KeychainAction) => void; on3D?: () => void; onNotify?: (message: string) => void; frameOverride?: FrameSvgData; geometryStatus?: DieCutStatus; geometryError?: string };
const demoImages = new Map<string, Promise<HTMLImageElement>>();
function loadDemoImage(src: string) {
	let pending = demoImages.get(src);
	if (!pending) { pending = new Promise((resolve, reject) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = () => reject(new Error("Không tải được hình móc demo")); image.src = src; }); demoImages.set(src, pending); }
	return pending;
}
export function Preview2D({ config, view, dispatch, on3D, onNotify, frameOverride, geometryStatus, geometryError }: Props) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const stageRef = useRef<HTMLDivElement>(null);
	const dragRef = useRef<{ x: number; y: number } | null>(null);
	const [frame, setFrame] = useState<FrameSvgData | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [fullScreen, setFullScreen] = useState(false);
	const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
	const frameId = config.shape.type === "frame" ? config.shape.frameId : "heart";
	const frameRecord = FRAMES.find((record) => record.id === frameId);
	useEffect(() => {
		const stage = stageRef.current;
		if (!stage || typeof ResizeObserver === "undefined") return;
		const observer = new ResizeObserver(([entry]) => {
			const { width, height } = entry.contentRect;
			setStageSize((current) => current.width === width && current.height === height ? current : { width, height });
		});
		observer.observe(stage);
		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		let active = true;
		if (config.shape.type === "die-cut") { setFrame(frameOverride || null); return; }
		if (!frameRecord) return;
		void loadFrameSvg(frameRecord.src).then((result) => { if (active) { setFrame(result); setError(null); } }).catch((reason) => { if (active) setError(reason instanceof Error ? reason.message : "Không tải được khung"); });
		return () => { active = false; };
	}, [frameRecord, config.shape.type, frameOverride]);

	useEffect(() => {
		let active = true;
		const canvas = canvasRef.current;
		if (!canvas || !frame) return;
		const width = Math.max(1, canvas.clientWidth || stageSize.width);
		const height = Math.max(1, canvas.clientHeight || stageSize.height);
		const dpr = Math.min(2, window.devicePixelRatio || 1);
		canvas.width = Math.round(width * dpr);
		canvas.height = Math.round(height * dpr);
		const url = getFaceImageUrl(view === "back" && config.backMode === "custom" ? config.backCustom : config.front);
		const load = url ? loadSanityImage(url) : Promise.resolve(undefined);
		const ringSrc = RINGS.find((item) => item.id === config.ringId)?.src;
		const ring = ringSrc ? loadDemoImage(ringSrc) : Promise.reject(new Error("Không tìm thấy móc demo"));
		const connectorAssets = config.ringId === "ring-01" ? Promise.all([
			"keychain_01_f", "keychain_01_b", "keychain_02_f", "keychain_02_b", "keychain_03_f", "keychain_03_b", "keychain_tail_f", "keychain_tail_b",
		].map((name) => loadDemoImage(`/keychain/connectors/${name}.png`))).then(([ring1Front, ring1Back, ring2Front, ring2Back, ring3Front, ring3Back, tailFront, tailBack]) => ({ ring1Front, ring1Back, ring2Front, ring2Back, ring3Front, ring3Back, tailFront, tailBack } as ConnectorAssets)) : Promise.resolve(undefined);
		void Promise.all([load, ring, connectorAssets]).then(([image, ringImage, connectors]) => { if (active) return renderKeychain2d(canvas, frame, config, image, view, ringImage, connectors); }).catch((reason) => { if (active) setError(reason instanceof Error ? reason.message : "Không thể dựng bản xem trước"); });
		return () => { active = false; };
	}, [frame, config, view, stageSize]);
	useEffect(() => { if (error) onNotify?.(error); }, [error, onNotify]);

	const updatePan = useCallback((dx: number, dy: number) => {
		const face = view === "back" && config.backMode === "custom" ? "backCustom" : "front";
		const value = face === "backCustom" ? config.backCustom : config.front;
		if (!value) return;
		const canvas = canvasRef.current;
		const width = canvas?.clientWidth || 1;
		const framePixels = Number(canvas?.dataset.frameMaxSize) || width;
		const deltaMm = (config.sizeCm * 10) / framePixels;
		dispatch({ type: "set-face", face, value: { ...value, transform: { ...value.transform, xMm: value.transform.xMm + dx * deltaMm, yMm: value.transform.yMm + dy * deltaMm } } });
	}, [config, dispatch, view]);

	const updateTransform = (update: (transform: typeof config.front.transform) => typeof config.front.transform) => {
		const face = view === "back" && config.backMode === "custom" ? "backCustom" : "front";
		const value = face === "backCustom" ? config.backCustom : config.front;
		if (value) dispatch({ type: "set-face", face, value: { ...value, transform: update(value.transform) } });
	};
	return <Stack spacing={{ xs: 0.75, md: 0.35 }} sx={{ width: "100%", height: { md: "100%" }, flex: { md: 1 }, minHeight: 0, ...(fullScreen ? { position: "fixed", zIndex: 1400, inset: 0, p: { xs: 1, md: 2 }, bgcolor: "#15161b", overflow: "auto" } : {}) }}>
		<Stack direction="row" spacing={0.5} alignItems="center" justifyContent="space-between" flexWrap="nowrap" sx={{ height: 32, minHeight: 32 }}>
			<Stack direction="row" spacing={0.5} sx={{ p: 0.35, bgcolor: "#22232a", border: "1px solid #36373e", borderRadius: 1.25 }}>
				{(["front", "back"] as const).map((face) => <Button key={face} size="small" aria-pressed={view === face} variant={view === face ? "contained" : "text"} onClick={() => dispatch({ type: "set-view", view: face })} sx={{ height: 28, minHeight: 28, px: { xs: 1, md: 1 }, lineHeight: 1, bgcolor: view === face ? "#f47a28" : "transparent", color: "white", "&:hover": { bgcolor: view === face ? "#ff8a36" : "#303139" } }}>{face === "front" ? "Mặt trước" : "Mặt sau"}</Button>)}
			</Stack>
			<Stack direction="row" spacing={0.25}>
				<Button size="small" variant="outlined" aria-current="true" sx={{ height: 28, minHeight: 28, minWidth: 36, borderColor: "#45464e", color: "#c5c6ce" }}>2D</Button>
				{on3D && <Button size="small" onClick={on3D} disabled={config.shape.type === "die-cut" && !frameOverride} sx={{ height: 28, minHeight: 28, minWidth: 36, color: "#c5c6ce" }}>3D</Button>}
			</Stack>
		</Stack>
		<Stack direction="row" spacing={{ xs: 0.5, md: 0.5 }} alignItems="stretch" sx={{ minHeight: { xs: 260, md: 0 }, flex: { md: 1 } }}>
			<Stack direction={{ xs: "column" }} spacing={0.35} sx={{ width: 32, flex: "0 0 32px", py: 0.25 }}>
				{[
					{ label: "Xoay ảnh 90°", icon: "↻", action: () => updateTransform((t) => ({ ...t, rotation: (t.rotation + 90) % 360 })) },
					{ label: "Lật ngang", icon: "⇋", action: () => updateTransform((t) => ({ ...t, flipX: !t.flipX })) },
					{ label: "Thu nhỏ ảnh", icon: "−", action: () => updateTransform((t) => ({ ...t, scale: Math.max(0.25, t.scale / 1.1) })) },
					{ label: "Phóng to ảnh", icon: "+", action: () => updateTransform((t) => ({ ...t, scale: Math.min(12, t.scale * 1.1) })) },
					{ label: "Đặt lại ảnh", icon: "⟲", action: () => updateTransform(() => ({ xMm: 0, yMm: 0, scale: 1, rotation: 0, flipX: false })) },
					{ label: fullScreen ? "Thoát toàn màn hình" : "Toàn màn hình", icon: fullScreen ? "⊡" : "⛶", action: () => setFullScreen((current) => !current) },
				].map((tool) => <Button key={tool.label} title={tool.label} aria-label={tool.label} onClick={tool.action} sx={{ width: 32, minWidth: 32, height: 32, minHeight: 32, p: 0, color: "#c5c6ce", border: "1px solid #34353d", bgcolor: "#22232a", borderRadius: 1, fontSize: 14 }}>{tool.icon}</Button>)}
			</Stack>
			<Box ref={stageRef} sx={{ display: "grid", flex: 1, placeItems: "center", minWidth: 0, minHeight: 0, height: "100%", position: "relative", border: "1px solid #2d2e35", borderRadius: 1.5, bgcolor: "#17181e", backgroundImage: "linear-gradient(#ffffff05 1px, transparent 1px), linear-gradient(90deg, #ffffff05 1px, transparent 1px)", backgroundSize: "24px 24px" }}>
		{config.shape.type === "die-cut" && !frameOverride ? <Typography role="status" color={geometryStatus === "error" ? "error" : "grey.300"}>{geometryError || (geometryStatus === "processing" ? "Đang tạo đường cắt…" : "Chọn ảnh mặt trước để tạo đường cắt.")}</Typography> : <Box sx={{ position: "relative", width: "100%", height: "100%", maxWidth: { xs: 520, md: 440 }, mx: "auto" }}>
			<canvas ref={canvasRef} aria-label={`Bản xem trước mặt ${view === "front" ? "trước" : "sau"}`} tabIndex={0}
				onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); dragRef.current = { x: event.clientX, y: event.clientY }; }}
				onPointerMove={(event) => { if (!dragRef.current) return; const dx = event.clientX - dragRef.current.x; const dy = event.clientY - dragRef.current.y; dragRef.current = { x: event.clientX, y: event.clientY }; updatePan(dx, dy); }}
				onPointerUp={() => { dragRef.current = null; }}
				onPointerCancel={() => { dragRef.current = null; }}
				onKeyDown={(event) => { const step = event.shiftKey ? 5 : 1; if (event.key === "ArrowLeft") updatePan(-step, 0); if (event.key === "ArrowRight") updatePan(step, 0); if (event.key === "ArrowUp") updatePan(0, -step); if (event.key === "ArrowDown") updatePan(0, step); }}
				style={{ width: "100%", height: "100%", maxHeight: "100%", display: "block", touchAction: "none", cursor: "grab", outline: "none" }} />
		</Box>}
			</Box>
		</Stack>
		<Typography variant="caption" color="grey.500" sx={{ fontSize: { md: 10 }, minHeight: 14 }}>Kéo ảnh để căn vị trí</Typography>
	</Stack>;
}
