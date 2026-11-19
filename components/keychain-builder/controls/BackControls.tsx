import { Button, Stack, Typography } from "@mui/material";
import type { AcrylicId, BackMode } from "../types";

type Props = { acrylicId: AcrylicId; backMode: BackMode; hasCustomImage: boolean; onModeChange: (mode: Exclude<BackMode, "material">) => void; onUpload: (file?: File) => void };
export function BackControls({ acrylicId, backMode, hasCustomImage, onModeChange, onUpload }: Props) {
	const clear = acrylicId === "clear";
	const modes: Array<{ id: Exclude<BackMode, "material">; label: string; detail: string }> = [
		{ id: "through-acrylic", label: "Xuyên mica", detail: "Giữ màu vật liệu" },
		{ id: "white", label: "Lót trắng", detail: "Nền trắng mặt sau" },
		{ id: "mirror-front", label: "In hai mặt", detail: "Dùng ảnh mặt trước" },
		{ id: "custom", label: "Ảnh riêng", detail: hasCustomImage ? "Đã có ảnh" : "Tải ảnh để chọn" },
	];
	return <>
		<Stack spacing={{ xs: 1.25, md: 0.35 }}>
			<Stack direction="row" flexWrap="wrap" gap={{ xs: 0.5, md: 0.35 }}>{modes.map((mode) => <Button key={mode.id} aria-pressed={backMode === mode.id} disabled={!clear} onClick={() => onModeChange(mode.id)} sx={{ flex: "1 1 calc(50% - 6px)", minWidth: 0, minHeight: { xs: 40, md: 34 }, justifyContent: "flex-start", alignItems: "flex-start", flexDirection: "column", border: "1px solid", borderColor: backMode === mode.id ? "#f47a28" : "#36373e", color: "white", bgcolor: "#22232a", borderRadius: 1, px: { xs: 0.75, md: 0.6 }, py: { xs: 0.5, md: 0.3 }, overflow: "hidden" }}><Typography variant="caption" fontWeight={700} noWrap sx={{ maxWidth: "100%" }}>{mode.label}</Typography><Typography variant="caption" noWrap sx={{ color: "#90919a", fontSize: { xs: 9, md: 8 }, maxWidth: "100%" }}>{mode.detail}</Typography></Button>)}</Stack>
			{backMode === "custom" && <Button component="label" variant="outlined" disabled={!clear} sx={{ alignSelf: "flex-start", minHeight: { md: 28 }, borderColor: "#55565f" }}>{hasCustomImage ? "Thay ảnh mặt sau" : "＋ Tải ảnh mặt sau"}<input hidden type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => { onUpload(event.target.files?.[0]); event.target.value = ""; }} /></Button>}
		</Stack>
	</>;
}
