import { Box, Button, Slider, Stack, TextField, Typography } from "@mui/material";
import Image from "next/image";
import { FRAMES } from "@/data/keychain/catalog";
import type { KeychainAction, KeychainConfig } from "../types";

export function ShapeControls({ config, onChange }: { config: KeychainConfig; onChange: (action: KeychainAction) => void }) {
	const cutBorderPx = Math.round(config.cutBorderPx ?? 20);
	const maxCutBorderPx = Math.max(4, Math.min(80, Math.floor((config.sizeCm * 10 - 6) * 2)));
	const setCutBorderPx = (value: number) => onChange({ type: "set-cut-border", cutBorderPx: Math.min(maxCutBorderPx, Math.max(0, value)) });
	return <Stack spacing={{ xs: 1.25, md: 0.4 }}>
		<Typography variant="caption" color="grey.400">Kiểu tạo hình</Typography>
		<Stack direction="row" spacing={{ xs: 1, md: 0.5 }}>
			<Button fullWidth variant="outlined" aria-pressed={config.shape.type === "frame"} onClick={() => onChange({ type: "select-frame", frameId: config.shape.type === "frame" ? config.shape.frameId : "heart" })} sx={{ minHeight: { md: 30 }, justifyContent: "flex-start", borderColor: config.shape.type === "frame" ? "#f47a28" : "#41424a", color: "white", bgcolor: "#202127" }}>▱ &nbsp; Khung có sẵn</Button>
		<Button fullWidth variant="outlined" aria-pressed={config.shape.type === "die-cut"} onClick={() => onChange({ type: "select-die-cut" })} sx={{ minHeight: { md: 30 }, justifyContent: "flex-start", borderColor: config.shape.type === "die-cut" ? "#f47a28" : "#41424a", color: "white", bgcolor: "#202127" }}>✧ &nbsp; Cắt theo ảnh</Button>
		</Stack>
		{config.shape.type === "frame" && <>
			<Typography variant="caption" color="grey.400">Chọn hình khung</Typography>
			<Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(6, minmax(0, 1fr))", md: "repeat(9, minmax(0, 1fr))" }, gap: { xs: 0.5, md: 0.35 }, maxHeight: { xs: 164, md: "none" }, overflowY: "auto", pr: 0.25, "& button": { minHeight: { md: 30 } } }}>
				{FRAMES.map((frame) => <Button key={frame.id} title={frame.label} aria-label={frame.label} aria-pressed={config.shape.type === "frame" && config.shape.frameId === frame.id} onClick={() => onChange({ type: "select-frame", frameId: frame.id })} sx={{ minWidth: 0, minHeight: { xs: 48, md: 30 }, p: { xs: 0.5, md: 0.25 }, border: "1px solid", borderColor: config.shape.type === "frame" && config.shape.frameId === frame.id ? "#f47a28" : "#36373e", bgcolor: "#22232a", borderRadius: 1 }}><Image src={frame.src} alt="" width={24} height={24} unoptimized style={{ objectFit: "contain" }} /></Button>)}
			</Box>
		</>}
		<Stack spacing={{ xs: 0.25, md: 0.1 }} sx={{ mt: { xs: 0.5, md: 0.25 } }}>
			<Stack direction="row" alignItems="center" justifyContent="space-between" gap={1}>
				<Typography variant="caption" color="grey.300">Cut border</Typography>
				<Stack direction="row" alignItems="center" spacing={0.5}>
					<TextField size="small" type="number" value={Math.min(cutBorderPx, maxCutBorderPx)} onChange={(event) => setCutBorderPx(Number(event.target.value))} inputProps={{ min: 0, max: maxCutBorderPx, step: 1, "aria-label": "Cut border" }} sx={{ width: 66, "& .MuiInputBase-root": { height: 30 }, "& input": { py: 0.25, px: 0.5, textAlign: "center", color: "white" }, ".MuiOutlinedInput-notchedOutline": { borderColor: "#41424a" } }} />
					<Typography variant="caption" color="grey.400">px</Typography>
				</Stack>
			</Stack>
			<Slider aria-label="Cut border" value={Math.min(cutBorderPx, maxCutBorderPx)} min={0} max={maxCutBorderPx} step={1} onChange={(_, value) => setCutBorderPx(Array.isArray(value) ? value[0] : value)} sx={{ color: "#f47a28", py: 0.5, height: 3, "& .MuiSlider-thumb": { width: 14, height: 14 }, "& .MuiSlider-rail": { opacity: 0.45 } }} />
		</Stack>
	</Stack>;
}
