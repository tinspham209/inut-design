import { Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { ACRYLICS, FRAMES, RINGS, SIZES_CM } from "@/data/keychain/catalog";
import type { AcrylicId, KeychainConfig } from "../types";

type Props = { section: "shape" | "material"; config: KeychainConfig; onRing: (id: string) => void; onFrame: (id: string) => void; onSize: (cm: number) => void; onAcrylic: (id: AcrylicId) => void; onOpaque: (id: Exclude<AcrylicId, "clear">) => void; onMaterial: (material: Partial<KeychainConfig["material"]>) => void };
export function AppearanceControls({ section, config, onRing, onFrame, onSize, onAcrylic, onOpaque, onMaterial }: Props) {
	if (section === "shape") return <Stack spacing={2} sx={{ mt: 2 }}>
		<FormControl fullWidth><InputLabel id="frame-label" sx={{ color: "grey.400" }}>Khung minh họa</InputLabel><Select labelId="frame-label" label="Khung minh họa" value={config.shape.type === "frame" ? config.shape.frameId : "heart"} onChange={(event) => onFrame(event.target.value)} sx={{ color: "white" }}>{FRAMES.map((frame) => <MenuItem key={frame.id} value={frame.id}>{frame.label} · demo</MenuItem>)}</Select></FormControl>
		<FormControl fullWidth><InputLabel id="ring-label" sx={{ color: "grey.400" }}>Móc khóa</InputLabel><Select labelId="ring-label" label="Móc khóa" value={config.ringId} onChange={(event) => onRing(event.target.value)} sx={{ color: "white" }}>{RINGS.map((ring) => <MenuItem key={ring.id} value={ring.id}>{ring.label} · demo</MenuItem>)}</Select></FormControl>
		<FormControl fullWidth><InputLabel id="size-label" sx={{ color: "grey.400" }}>Kích thước</InputLabel><Select labelId="size-label" label="Kích thước" value={config.sizeCm} onChange={(event) => onSize(Number(event.target.value))} sx={{ color: "white" }}>{SIZES_CM.map((size) => <MenuItem key={size} value={size}>{size} cm</MenuItem>)}</Select></FormControl>
	</Stack>;
	return <>
		<Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 2 }}>{ACRYLICS.map((item) => <Button key={item.id} aria-pressed={config.acrylicId === item.id} onClick={() => item.opaque && config.acrylicId === "clear" ? onOpaque(item.id as Exclude<AcrylicId, "clear">) : onAcrylic(item.id)} variant={config.acrylicId === item.id ? "contained" : "outlined"}>{item.label}</Button>)}</Stack>
		<Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 2 }}>
			<FormControl fullWidth><InputLabel id="edge-label" sx={{ color: "grey.400" }}>Cạnh</InputLabel><Select labelId="edge-label" label="Cạnh" value={config.material.edge} onChange={(event) => onMaterial({ edge: event.target.value })} sx={{ color: "white" }}><MenuItem value="polished">Đánh bóng · minh họa</MenuItem><MenuItem value="natural">Tự nhiên · minh họa</MenuItem></Select></FormControl>
			<TextField label="Độ dày (mm)" type="number" inputProps={{ min: 1, max: 10, step: 0.5 }} value={config.material.thicknessMm} onChange={(event) => onMaterial({ thicknessMm: Number(event.target.value) })} />
			<TextField label="Độ bóng" type="number" inputProps={{ min: 0, max: 1, step: 0.05 }} value={config.material.sheen} onChange={(event) => onMaterial({ sheen: Number(event.target.value) })} />
		</Stack>
		<Typography variant="caption" color="grey.400" sx={{ display: "block", mt: 1 }}>Màu và thông số vật liệu chỉ là bản minh họa.</Typography>
	</>;
}
