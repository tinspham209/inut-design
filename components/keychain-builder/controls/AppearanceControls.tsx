import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import Image from "next/image";
import { ACRYLICS, RINGS, SIZES_CM } from "@/data/keychain/catalog";
import type { AcrylicId, KeychainConfig } from "../types";

type Props = { section: "shape" | "material"; config: KeychainConfig; onRing: (id: string) => void; onFrame: (id: string) => void; onSize: (cm: number) => void; onAcrylic: (id: AcrylicId) => void; onOpaque: (id: Exclude<AcrylicId, "clear">) => void; onMaterial: (material: Partial<KeychainConfig["material"]>) => void };
export function AppearanceControls({ section, config, onRing, onSize, onAcrylic, onOpaque, onMaterial }: Props) {
	if (section === "shape") return <Stack spacing={1.25} sx={{ mt: 1.5 }}>
		<Typography variant="caption" color="grey.400">Kiểu khoen</Typography>
		<Box sx={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: 0.75 }}>{RINGS.map((ring) => <Button key={ring.id} title={ring.label} aria-label={ring.label} aria-pressed={config.ringId === ring.id} onClick={() => onRing(ring.id)} sx={{ minWidth: 0, minHeight: 49, p: 0.5, bgcolor: "#22232a", border: "1px solid", borderColor: config.ringId === ring.id ? "#f47a28" : "#36373e", borderRadius: 1.5 }}><Image src={ring.src} alt="" width={42} height={34} unoptimized style={{ maxWidth: "100%", objectFit: "contain" }} /></Button>)}</Box>
		<Stack direction="row" alignItems="center" justifyContent="space-between"><Typography variant="caption" color="grey.400">Kích thước thành phẩm</Typography><Typography variant="caption" color="grey.500">Lỗ treo 4 mm</Typography></Stack>
		<Stack direction="row" spacing={0.6} flexWrap="wrap">{SIZES_CM.map((size) => <Button key={size} aria-pressed={config.sizeCm === size} onClick={() => onSize(size)} sx={{ px: 1.1, minWidth: 39, minHeight: 34, border: "1px solid", borderColor: config.sizeCm === size ? "#f47a28" : "#36373e", color: config.sizeCm === size ? "#ffad69" : "#d0d0d5", bgcolor: "#22232a", borderRadius: 1.5, fontSize: 12 }}>{size}</Button>)}</Stack>
	</Stack>;
	return <>
		<Typography variant="caption" color="grey.400">Chọn màu mica</Typography>
		<Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 0.75, mt: 1 }}>{ACRYLICS.map((item) => <Button key={item.id} aria-pressed={config.acrylicId === item.id} onClick={() => item.opaque && config.acrylicId === "clear" ? onOpaque(item.id as Exclude<AcrylicId, "clear">) : onAcrylic(item.id)} sx={{ minWidth: 0, minHeight: 52, px: 0.5, display: "flex", flexDirection: "column", gap: 0.4, border: "1px solid", borderColor: config.acrylicId === item.id ? "#f47a28" : "#36373e", bgcolor: "#22232a", color: "#d0d0d5", borderRadius: 1.5, fontSize: 10 }}><Box sx={{ width: 20, height: 20, borderRadius: "50%", bgcolor: item.color, border: "1px solid #ffffff55" }} />{item.label}</Button>)}</Box>
		<Stack direction={{ xs: "row" }} spacing={1} sx={{ mt: 1.25 }}>
			<FormControl fullWidth size="small"><InputLabel id="edge-label" sx={{ color: "grey.400" }}>Cạnh</InputLabel><Select labelId="edge-label" label="Cạnh" value={config.material.edge} onChange={(event) => onMaterial({ edge: event.target.value })} sx={{ color: "white", ".MuiOutlinedInput-notchedOutline": { borderColor: "#41424a" } }}><MenuItem value="polished">Đánh bóng · demo</MenuItem><MenuItem value="natural">Tự nhiên · demo</MenuItem></Select></FormControl>
			<TextField size="small" label="Độ dày (mm)" type="number" inputProps={{ min: 1, max: 10, step: 0.5 }} value={config.material.thicknessMm} onChange={(event) => onMaterial({ thicknessMm: Number(event.target.value) })} sx={{ minWidth: 115, input: { color: "white" }, ".MuiOutlinedInput-notchedOutline": { borderColor: "#41424a" } }} />
		</Stack>
		<Typography variant="caption" color="grey.500" sx={{ display: "block", mt: 0.75 }}>Màu và thông số vật liệu chỉ là bản minh họa.</Typography>
	</>;
}
