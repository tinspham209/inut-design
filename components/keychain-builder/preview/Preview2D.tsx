import { useCallback, useEffect, useRef, useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { FRAMES, RINGS } from "@/data/keychain/catalog";
import type { KeychainAction, KeychainConfig } from "../types";
import { loadFrameSvg, type FrameSvgData } from "../geometry/frameSvg";
import { loadSanityImage } from "../image/loadSanityImage";
import { renderKeychain2d } from "../render/render2d";

type Props = { config: KeychainConfig; view: "front" | "back"; dispatch: (action: KeychainAction) => void; on3D?: () => void };
const demoImages = new Map<string, Promise<HTMLImageElement>>();
function loadDemoImage(src: string) {
	let pending = demoImages.get(src);
	if (!pending) { pending = new Promise((resolve, reject) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = () => reject(new Error("Không tải được hình móc demo")); image.src = src; }); demoImages.set(src, pending); }
	return pending;
}
export function Preview2D({ config, view, dispatch, on3D }: Props) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const dragRef = useRef<{ x: number; y: number } | null>(null);
	const [frame, setFrame] = useState<FrameSvgData | null>(null);
	const [error, setError] = useState<string | null>(null);
	const frameId = config.shape.type === "frame" ? config.shape.frameId : "heart";
	const frameRecord = FRAMES.find((record) => record.id === frameId);
	const currentFace = view === "back" && config.backMode === "custom" ? config.backCustom : config.front;

	useEffect(() => {
		let active = true;
		if (!frameRecord) return;
		void loadFrameSvg(frameRecord.src).then((result) => { if (active) { setFrame(result); setError(null); } }).catch((reason) => { if (active) setError(reason instanceof Error ? reason.message : "Không tải được khung"); });
		return () => { active = false; };
	}, [frameRecord]);

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

	return <Stack spacing={1.5} sx={{ width: "100%" }}>
		<Stack direction="row" spacing={1} alignItems="center">
			<Button variant={view === "front" ? "contained" : "outlined"} onClick={() => dispatch({ type: "set-view", view: "front" })}>Mặt trước</Button>
			<Button variant={view === "back" ? "contained" : "outlined"} onClick={() => dispatch({ type: "set-view", view: "back" })}>Mặt sau</Button>
			{on3D && <Button onClick={on3D}>Xem 3D</Button>}
			<Typography variant="body2" color="grey.400">2D · Kéo để căn ảnh</Typography>
		</Stack>
		<Box sx={{ position: "relative", width: "100%", maxWidth: 520, mx: "auto" }}>
			<canvas ref={canvasRef} aria-label={`Bản xem trước mặt ${view === "front" ? "trước" : "sau"}`} tabIndex={0}
				onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); dragRef.current = { x: event.clientX, y: event.clientY }; }}
				onPointerMove={(event) => { if (!dragRef.current) return; const dx = event.clientX - dragRef.current.x; const dy = event.clientY - dragRef.current.y; dragRef.current = { x: event.clientX, y: event.clientY }; updatePan(dx, dy); }}
				onPointerUp={() => { dragRef.current = null; }}
				onPointerCancel={() => { dragRef.current = null; }}
				onKeyDown={(event) => { const step = event.shiftKey ? 5 : 1; if (event.key === "ArrowLeft") updatePan(-step, 0); if (event.key === "ArrowRight") updatePan(step, 0); if (event.key === "ArrowUp") updatePan(0, -step); if (event.key === "ArrowDown") updatePan(0, step); }}
				style={{ width: "100%", height: "auto", display: "block", touchAction: "none", cursor: "grab", outline: "none" }} />
			{error && <Typography role="alert" color="error">{error}</Typography>}
		</Box>
		<Stack direction="row" spacing={1}>
			<Button onClick={() => updatePan(-4, 0)} aria-label="Dịch ảnh sang trái">←</Button><Button onClick={() => updatePan(4, 0)} aria-label="Dịch ảnh sang phải">→</Button>
			<Button onClick={() => { if (currentFace) dispatch({ type: "set-face", face: view === "back" && config.backMode === "custom" ? "backCustom" : "front", value: { ...currentFace, transform: { ...currentFace.transform, scale: 1 } } }); }}>Fit</Button>
			<Button onClick={() => { if (currentFace) dispatch({ type: "set-face", face: view === "back" && config.backMode === "custom" ? "backCustom" : "front", value: { ...currentFace, transform: { xMm: 0, yMm: 0, scale: 1, rotation: 0, flipX: false } } }); }}>Reset</Button>
		</Stack>
	</Stack>;
}
