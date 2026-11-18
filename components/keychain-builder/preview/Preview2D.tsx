import { useCallback, useEffect, useRef, useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { FRAMES, RINGS } from "@/data/keychain/catalog";
import type { KeychainAction, KeychainConfig } from "../types";
import { loadFrameSvg, type FrameSvgData } from "../geometry/frameSvg";
import { loadSanityImage } from "../image/loadSanityImage";
import { renderKeychain2d } from "../render/render2d";
import type { DieCutStatus } from "../hooks/useDieCutGeometry";

type Props = { config: KeychainConfig; view: "front" | "back"; dispatch: (action: KeychainAction) => void; on3D?: () => void; frameOverride?: FrameSvgData; geometryStatus?: DieCutStatus; geometryError?: string };
const demoImages = new Map<string, Promise<HTMLImageElement>>();
function loadDemoImage(src: string) {
	let pending = demoImages.get(src);
	if (!pending) { pending = new Promise((resolve, reject) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = () => reject(new Error("Không tải được hình móc demo")); image.src = src; }); demoImages.set(src, pending); }
	return pending;
}
export function Preview2D({ config, view, dispatch, on3D, frameOverride, geometryStatus, geometryError }: Props) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const dragRef = useRef<{ x: number; y: number } | null>(null);
	const [frame, setFrame] = useState<FrameSvgData | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [fullScreen, setFullScreen] = useState(false);
	const previewRef = useRef<HTMLDivElement>(null);
	const frameId = config.shape.type === "frame" ? config.shape.frameId : "heart";
	const frameRecord = FRAMES.find((record) => record.id === frameId);
	const currentFace = view === "back" && config.backMode === "custom" ? config.backCustom : config.front;

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
		const width = Math.max(1, canvas.clientWidth);
		const dpr = Math.min(2, window.devicePixelRatio || 1);
		canvas.width = Math.round(width * dpr);
		canvas.height = Math.round(width * (frame.viewBox[3] / frame.viewBox[2] + 0.34) * dpr);
		const url = view === "back" && config.backMode === "custom" ? config.backCustom?.url : config.front.url;
		const load = url ? loadSanityImage(url) : Promise.resolve(undefined);
		const ringSrc = RINGS.find((item) => item.id === config.ringId)?.src;
		const ring = ringSrc ? loadDemoImage(ringSrc) : Promise.reject(new Error("Không tìm thấy móc demo"));
		void Promise.all([load, ring]).then(([image, ringImage]) => { if (active) return renderKeychain2d(canvas, frame, config, image, view, ringImage); }).catch((reason) => { if (active) setError(reason instanceof Error ? reason.message : "Không thể dựng bản xem trước"); });
		return () => { active = false; };
	}, [frame, config, view]);

	const updatePan = useCallback((dx: number, dy: number) => {
		const face = view === "back" && config.backMode === "custom" ? "backCustom" : "front";
		const value = face === "backCustom" ? config.backCustom : config.front;
		if (!value) return;
		const canvas = canvasRef.current;
		const width = canvas?.clientWidth || 1;
		const deltaMm = (config.sizeCm * 10) / width;
		dispatch({ type: "set-face", face, value: { ...value, transform: { ...value.transform, xMm: value.transform.xMm + dx * deltaMm, yMm: value.transform.yMm + dy * deltaMm } } });
	}, [config, dispatch, view]);

	const updateTransform = (update: (transform: typeof config.front.transform) => typeof config.front.transform) => {
		const face = view === "back" && config.backMode === "custom" ? "backCustom" : "front";
		const value = face === "backCustom" ? config.backCustom : config.front;
		if (value) dispatch({ type: "set-face", face, value: { ...value, transform: update(value.transform) } });
	};
	return <Stack ref={previewRef} spacing={1.25} sx={{ width: "100%", ...(fullScreen ? { position: "fixed", zIndex: 1400, inset: 0, p: { xs: 1.5, md: 3 }, bgcolor: "#15161b", overflow: "auto" } : {}) }}>
		<Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between" flexWrap="wrap">
			<Stack direction="row" spacing={0.5} sx={{ p: 0.5, bgcolor: "#22232a", border: "1px solid #36373e", borderRadius: 1.5 }}>
				{(["front", "back"] as const).map((face) => <Button key={face} size="small" aria-pressed={view === face} variant={view === face ? "contained" : "text"} onClick={() => dispatch({ type: "set-view", view: face })} sx={{ minHeight: 34, px: 1.5, bgcolor: view === face ? "#f47a28" : "transparent", color: "white", "&:hover": { bgcolor: view === face ? "#ff8a36" : "#303139" } }}>{face === "front" ? "Mặt trước" : "Mặt sau"}</Button>)}
			</Stack>
			<Stack direction="row" spacing={0.5}>
				<Button size="small" variant="outlined" aria-pressed sx={{ minHeight: 34, borderColor: "#45464e", color: "#c5c6ce" }}>2D</Button>
				{on3D && <Button size="small" onClick={on3D} disabled={config.shape.type === "die-cut" && !frameOverride} sx={{ minHeight: 34, color: "#c5c6ce" }}>3D</Button>}
				<Button size="small" onClick={() => setFullScreen((current) => !current)} aria-label={fullScreen ? "Thoát toàn màn hình" : "Toàn màn hình"} sx={{ minHeight: 34, color: "#c5c6ce" }}>{fullScreen ? "Thu nhỏ" : "⛶"}</Button>
			</Stack>
		</Stack>
		<Stack direction="row" spacing={1} alignItems="stretch" sx={{ minHeight: { xs: 290, md: 440 } }}>
			<Stack spacing={0.5} sx={{ display: { xs: "none", sm: "flex" }, py: 1 }}>
				{[{ label: "Di chuyển", icon: "✥", action: () => updatePan(4, 0) }, { label: "Xoay ảnh", icon: "↻", action: () => updateTransform((t) => ({ ...t, rotation: t.rotation + 15 })) }, { label: "Thu nhỏ", icon: "−", action: () => updateTransform((t) => ({ ...t, scale: Math.max(0.25, t.scale - 0.1) })) }, { label: "Phóng to", icon: "+", action: () => updateTransform((t) => ({ ...t, scale: Math.min(4, t.scale + 0.1) })) }].map((tool) => <Button key={tool.label} title={tool.label} aria-label={tool.label} onClick={tool.action} sx={{ minWidth: 38, width: 38, minHeight: 38, p: 0, color: "#c5c6ce", border: "1px solid #34353d", bgcolor: "#22232a", borderRadius: 1.25, fontSize: 16 }}>{tool.icon}</Button>)}
			</Stack>
			<Box sx={{ display: "grid", flex: 1, placeItems: "center", minWidth: 0, position: "relative", border: "1px solid #2d2e35", borderRadius: 2, bgcolor: "#17181e", backgroundImage: "linear-gradient(#ffffff05 1px, transparent 1px), linear-gradient(90deg, #ffffff05 1px, transparent 1px)", backgroundSize: "24px 24px" }}>
		{config.shape.type === "die-cut" && !frameOverride ? <Typography role="status" color={geometryStatus === "error" ? "error" : "grey.300"}>{geometryError || (geometryStatus === "processing" ? "Đang tạo đường cắt…" : "Chọn ảnh mặt trước để tạo đường cắt.")}</Typography> : <Box sx={{ position: "relative", width: "100%", maxWidth: 520, mx: "auto" }}>
			<canvas ref={canvasRef} aria-label={`Bản xem trước mặt ${view === "front" ? "trước" : "sau"}`} tabIndex={0}
				onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); dragRef.current = { x: event.clientX, y: event.clientY }; }}
				onPointerMove={(event) => { if (!dragRef.current) return; const dx = event.clientX - dragRef.current.x; const dy = event.clientY - dragRef.current.y; dragRef.current = { x: event.clientX, y: event.clientY }; updatePan(dx, dy); }}
				onPointerUp={() => { dragRef.current = null; }}
				onPointerCancel={() => { dragRef.current = null; }}
				onKeyDown={(event) => { const step = event.shiftKey ? 5 : 1; if (event.key === "ArrowLeft") updatePan(-step, 0); if (event.key === "ArrowRight") updatePan(step, 0); if (event.key === "ArrowUp") updatePan(0, -step); if (event.key === "ArrowDown") updatePan(0, step); }}
				style={{ width: "100%", height: "auto", display: "block", touchAction: "none", cursor: "grab", outline: "none" }} />
			{error && <Typography role="alert" color="error">{error}</Typography>}
		</Box>}
			</Box>
		</Stack>
		<Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
			<Typography variant="caption" color="grey.500">Kéo ảnh để căn vị trí · Lỗ treo và khung là hình minh họa</Typography>
			<Stack direction="row" spacing={0.5}>
				<Button size="small" onClick={() => updateTransform((t) => ({ ...t, scale: Math.max(0.25, t.scale - 0.1) }))} aria-label="Thu nhỏ ảnh">−</Button>
				<Button size="small" onClick={() => updateTransform((t) => ({ ...t, scale: Math.min(4, t.scale + 0.1) }))} aria-label="Phóng to ảnh">＋</Button>
				<Button size="small" onClick={() => { if (currentFace) dispatch({ type: "set-face", face: view === "back" && config.backMode === "custom" ? "backCustom" : "front", value: { ...currentFace, transform: { ...currentFace.transform, scale: 1 } } }); }}>Fit</Button>
				<Button size="small" onClick={() => { if (currentFace) dispatch({ type: "set-face", face: view === "back" && config.backMode === "custom" ? "backCustom" : "front", value: { ...currentFace, transform: { xMm: 0, yMm: 0, scale: 1, rotation: 0, flipX: false } } }); }}>Đặt lại ảnh</Button>
			</Stack>
		</Stack>
	</Stack>;
}
