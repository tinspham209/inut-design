import { Alert, Button, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from "@mui/material";
import type { AcrylicId, BackMode } from "../types";

type Props = { acrylicId: AcrylicId; backMode: BackMode; hasCustomImage: boolean; uploading?: boolean; error?: string | null; onModeChange: (mode: Exclude<BackMode, "material">) => void; onUpload: (file?: File) => void };
export function BackControls({ acrylicId, backMode, hasCustomImage, uploading = false, error, onModeChange, onUpload }: Props) {
	const clear = acrylicId === "clear";
	return <>
		<FormControl fullWidth sx={{ mt: 2 }} disabled={!clear}>
			<InputLabel id="back-mode-label" sx={{ color: "grey.400" }}>Chế độ mặt sau</InputLabel>
			<Select labelId="back-mode-label" label="Chế độ mặt sau" value={backMode} onChange={(event) => onModeChange(event.target.value as Exclude<BackMode, "material">)} sx={{ color: "white" }}>
				<MenuItem value="through-acrylic">Nhìn xuyên</MenuItem><MenuItem value="white">Lót trắng</MenuItem><MenuItem value="mirror-front">In ảnh trước hai mặt</MenuItem><MenuItem value="custom" disabled={!hasCustomImage}>Ảnh riêng mặt sau</MenuItem>
			</Select>
		</FormControl>
		<Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2 }}>
			<Button component="label" variant="outlined" disabled={!clear || uploading}>{uploading ? "Đang tải…" : "Tải ảnh mặt sau"}<input hidden type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => onUpload(event.target.files?.[0])} /></Button>
			{hasCustomImage && <Typography variant="caption" color="grey.400">Ảnh đã tải lên và được giữ khi đổi chế độ.</Typography>}
		</Stack>
		{error && <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>}
	</>;
}
