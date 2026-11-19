import { Box, Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import Image from "next/image";
import { ACRYLICS, RINGS, SIZES_CM } from "@/data/keychain/catalog";
import type { AcrylicId, KeychainConfig } from "../types";

type Props = { section: "shape" | "material"; config: KeychainConfig; onRing: (id: string) => void; onFrame: (id: string) => void; onSize: (cm: number) => void; onAcrylic: (id: AcrylicId) => void; onOpaque: (id: Exclude<AcrylicId, "clear">) => void; onMaterial: (material: Partial<KeychainConfig["material"]>) => void };
export function AppearanceControls({ section, config, onRing, onSize, onAcrylic, onOpaque, onMaterial }: Props) {
	if (section === "shape") return <Stack spacing={{ xs: 1.25, md: 0.35 }} sx={{ mt: { xs: 1.5, md: 0.35 } }}>
		<Typography variant="caption" color="grey.400">Kiểu khoen</Typography>
		<Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(5, minmax(0, 1fr))", md: "repeat(10, minmax(0, 1fr))" }, gap: { xs: 0.5, md: 0.35 }, "& button": { minHeight: { md: 32 } } }}>{RINGS.map((ring) => <Button key={ring.id} title={ring.label} aria-label={ring.label} aria-pressed={config.ringId === ring.id} onClick={() => onRing(ring.id)} sx={{ minWidth: 0, minHeight: { xs: 49, md: 32 }, p: { xs: 0.5, md: 0.25 }, bgcolor: "#22232a", border: "1px solid", borderColor: config.ringId === ring.id ? "#f47a28" : "#36373e", borderRadius: 1 }}><Box sx={{ position: "relative", width: "100%", height: { xs: 34, md: 25 } }}><Image src={ring.src} alt="" layout="fill" objectFit="contain" unoptimized sizes="(min-width: 900px) 42px, 100%" /></Box></Button>)}</Box>
		<Stack direction="row" alignItems="center" justifyContent="space-between"><Typography variant="caption" color="grey.400">Kích thước thành phẩm</Typography><Typography variant="caption" color="grey.500">Lỗ treo 4 mm</Typography></Stack>
		<Stack direction="row" spacing={{ xs: 0.6, md: 0.35 }} flexWrap="wrap">{SIZES_CM.map((size) => <Button key={size} aria-pressed={config.sizeCm === size} onClick={() => onSize(size)} sx={{ px: { xs: 1.1, md: 0.7 }, minWidth: { xs: 39, md: 30 }, minHeight: { xs: 34, md: 28 }, border: "1px solid", borderColor: config.sizeCm === size ? "#f47a28" : "#36373e", color: config.sizeCm === size ? "#ffad69" : "#d0d0d5", bgcolor: "#22232a", borderRadius: 1, fontSize: 11 }}>{size}</Button>)}</Stack>
	</Stack>;
	return <>
		<Typography variant="caption" color="grey.400">Chọn màu mica</Typography>
		<Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(4, minmax(0, 1fr))", md: "repeat(8, minmax(0, 1fr))" }, gap: { xs: 0.5, md: 0.35 }, mt: 0.35 }}>{ACRYLICS.map((item) => <Button key={item.id} aria-pressed={config.acrylicId === item.id} onClick={() => item.opaque && config.acrylicId === "clear" ? onOpaque(item.id as Exclude<AcrylicId, "clear">) : onAcrylic(item.id)} sx={{ minWidth: 0, minHeight: { xs: 52, md: 32 }, px: 0.35, display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: { md: "center" }, gap: { xs: 0.4, md: 0.3 }, whiteSpace: { md: "nowrap" }, border: "1px solid", borderColor: config.acrylicId === item.id ? "#f47a28" : "#36373e", bgcolor: "#22232a", color: "#d0d0d5", borderRadius: 1, fontSize: { xs: 10, md: 9 }, lineHeight: 1.1 }}><Box sx={{ flex: "0 0 auto", width: { xs: 20, md: 13 }, height: { xs: 20, md: 13 }, borderRadius: "50%", bgcolor: item.color, border: "1px solid #ffffff55" }} />{item.label}</Button>)}</Box>
		<Stack direction={{ xs: "row" }} spacing={{ xs: 1, md: 0.5 }} sx={{ mt: { xs: 1.25, md: 0.5 } }}>
			<FormControl fullWidth size="small"><InputLabel id="edge-label" sx={{ color: "grey.400" }}>Cạnh</InputLabel><Select labelId="edge-label" label="Cạnh" value={config.material.edge} onChange={(event) => onMaterial({ edge: event.target.value })} sx={{ height: { md: 32 }, color: "white", ".MuiOutlinedInput-notchedOutline": { borderColor: "#41424a" } }}><MenuItem value="polished">Đánh bóng · demo</MenuItem><MenuItem value="natural">Tự nhiên · demo</MenuItem></Select></FormControl>
			<TextField size="small" label="Độ dày (mm)" type="number" inputProps={{ min: 1, max: 10, step: 0.5 }} value={config.material.thicknessMm} onChange={(event) => onMaterial({ thicknessMm: Number(event.target.value) })} sx={{ minWidth: 115, input: { color: "white" }, "& .MuiInputBase-root": { height: { md: 32 } }, ".MuiOutlinedInput-notchedOutline": { borderColor: "#41424a" } }} />
		</Stack>
		<Typography variant="caption" color="grey.500" sx={{ display: "block", mt: 0.75 }}>Màu và thông số vật liệu chỉ là bản minh họa.</Typography>
	</>;
}
