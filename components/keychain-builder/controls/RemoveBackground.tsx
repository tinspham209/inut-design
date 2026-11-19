import { Button, LinearProgress, Stack, Typography } from "@mui/material";
import type { BackgroundRemovalState } from "../hooks/useBackgroundRemoval";

type Props = { label: string; hasImage: boolean; hasProcessed: boolean; useProcessed?: boolean; enabled: boolean; state: BackgroundRemovalState; onRemove: () => void; onUseOriginal: () => void; onUseProcessed: () => void };

export function RemoveBackground({ label, hasImage, hasProcessed, useProcessed = false, enabled, state, onRemove, onUseOriginal, onUseProcessed }: Props) {
	const busy = state.status === "processing" || state.status === "uploading";
	if (!enabled && !hasProcessed) return null;
	return <Stack spacing={0.75} sx={{ mt: 1 }}>
		<Typography variant="caption" color="grey.400">Xóa nền · {label}</Typography>
		{enabled && <>
			<Stack direction="row" flexWrap="wrap" gap={0.75}>
				<Button size="small" variant="outlined" disabled={!hasImage || busy} onClick={onRemove} sx={{ borderColor: "#55565f" }}>{busy ? state.status === "uploading" ? "Đang lưu ảnh…" : "Đang tách nền…" : state.status === "error" ? "Thử tách lại" : "Tách nền"}</Button>
				{hasProcessed && <>
					<Button size="small" aria-pressed={!useProcessed} variant={!useProcessed ? "contained" : "outlined"} onClick={onUseOriginal}>Dùng ảnh gốc</Button>
					<Button size="small" aria-pressed={useProcessed} variant={useProcessed ? "contained" : "outlined"} onClick={onUseProcessed}>Dùng ảnh đã tách</Button>
				</>}
			</Stack>
			{busy && <Stack spacing={0.25}><LinearProgress variant="determinate" value={state.progress} sx={{ bgcolor: "#303139", "& .MuiLinearProgress-bar": { bgcolor: "#f47a28" } }} /><Typography role="status" variant="caption" color="grey.500">{state.status === "uploading" ? "Đang lưu bản đã tách nền…" : state.progress > 0 ? `Đang xử lý trên thiết bị · ${state.progress}%` : "Đang tải công cụ và chuẩn bị xử lý…"}</Typography></Stack>}
			{state.status === "complete" && <Typography role="status" variant="caption" color="success.light">Đã lưu ảnh đã tách nền. Ảnh gốc vẫn còn để khôi phục.</Typography>}
			{!hasImage && <Typography variant="caption" color="grey.500">Tải ảnh lên để bật chức năng tách nền.</Typography>}
		</>}
	</Stack>;
}
