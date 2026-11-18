import { Alert, Button, Stack, Typography } from "@mui/material";
import type { AcrylicId, BackMode } from "../types";

type Props = { acrylicId: AcrylicId; backMode: BackMode; hasCustomImage: boolean; uploading?: boolean; error?: string | null; onModeChange: (mode: Exclude<BackMode, "material">) => void; onUpload: (file?: File) => void };
export function BackControls({ acrylicId, backMode, hasCustomImage, uploading = false, error, onModeChange, onUpload }: Props) {
	const clear = acrylicId === "clear";
	const modes: Array<{ id: Exclude<BackMode, "material">; label: string; detail: string }> = [
		{ id: "through-acrylic", label: "Xuyên mica", detail: "Giữ màu vật liệu" },
		{ id: "white", label: "Lót trắng", detail: "Nền trắng mặt sau" },
		{ id: "mirror-front", label: "In hai mặt", detail: "Dùng ảnh mặt trước" },
		{ id: "custom", label: "Ảnh riêng", detail: hasCustomImage ? "Đã có ảnh" : "Tải ảnh để chọn" },
	];
	return <>
		<Stack spacing={1.25}>
			<Typography variant="caption" color="grey.400">Cách hiển thị mặt sau</Typography>
			<Stack direction="row" flexWrap="wrap" gap={0.75}>{modes.map((mode) => <Button key={mode.id} aria-pressed={backMode === mode.id} disabled={!clear || (mode.id === "custom" && !hasCustomImage)} onClick={() => onModeChange(mode.id)} sx={{ flex: "1 1 calc(50% - 6px)", minWidth: 125, justifyContent: "flex-start", alignItems: "flex-start", flexDirection: "column", border: "1px solid", borderColor: backMode === mode.id ? "#f47a28" : "#36373e", color: "white", bgcolor: "#22232a", borderRadius: 1.5, px: 1, py: 0.75 }}><Typography variant="caption" fontWeight={700}>{mode.label}</Typography><Typography variant="caption" sx={{ color: "#90919a", fontSize: 10 }}>{mode.detail}</Typography></Button>)}</Stack>
			<Button component="label" variant="outlined" disabled={!clear || uploading} sx={{ alignSelf: "flex-start", borderColor: "#55565f" }}>{uploading ? "Đang tải…" : hasCustomImage ? "Thay ảnh mặt sau" : "＋ Tải ảnh mặt sau"}<input hidden type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => { onUpload(event.target.files?.[0]); event.target.value = ""; }} /></Button>
			{hasCustomImage && <Typography variant="caption" color="grey.400">Ảnh riêng được lưu khi đổi chế độ.</Typography>}
		</Stack>
		{error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
	</>;
}
