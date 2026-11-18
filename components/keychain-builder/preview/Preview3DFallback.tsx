import { Alert, Button, Stack } from "@mui/material";

export function Preview3DFallback({ error, onBack }: { error: string; onBack: () => void }) {
	return <Stack spacing={2}><Alert severity="warning">{error} Bản thiết kế vẫn còn nguyên; bạn có thể tiếp tục ở chế độ 2D.</Alert><Button onClick={onBack}>Quay lại 2D</Button></Stack>;
}
