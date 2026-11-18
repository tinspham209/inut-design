import { Alert, Button, Stack, Typography } from "@mui/material";
import type { KeychainAction, KeychainConfig } from "../types";
import type { DieCutStatus } from "../hooks/useDieCutGeometry";

export function ShapeControls({ config, status, error, onChange }: { config: KeychainConfig; status: DieCutStatus; error?: string; onChange: (action: KeychainAction) => void }) {
	return <Stack spacing={1} sx={{ mt: 2 }}>
		<Typography variant="body2" color="grey.300">Hình dáng</Typography>
		<Stack direction="row" spacing={1}>
			<Button variant={config.shape.type === "frame" ? "contained" : "outlined"} aria-pressed={config.shape.type === "frame"} onClick={() => onChange({ type: "select-frame", frameId: config.shape.type === "frame" ? config.shape.frameId : "heart" })}>Khung cố định</Button>
			<Button variant={config.shape.type === "die-cut" ? "contained" : "outlined"} aria-pressed={config.shape.type === "die-cut"} onClick={() => onChange({ type: "select-die-cut" })}>Theo viền ảnh</Button>
		</Stack>
		{config.shape.type === "die-cut" && <>
			<Typography variant="caption" color="grey.400">Dùng ảnh PNG/WebP có nền trong suốt, một silhouette liền khối. Tai treo minh họa, lỗ giữ đường kính 4 mm.</Typography>
			{status === "processing" && <Alert severity="info" role="status">Đang tính đường cắt từ ảnh mặt trước…</Alert>}
			{status === "error" && <Alert severity="warning" action={<Button size="small" onClick={() => onChange({ type: "select-die-cut" })}>Thử lại</Button>}>{error || "Không tạo được đường cắt. Chọn ảnh khác hoặc dùng khung cố định."}</Alert>}
		</>}
	</Stack>;
}
