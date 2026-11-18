import { useState } from "react";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, Stack } from "@mui/material";
import type { PngScale, PngScope } from "./render/renderPng";

type Props = { open: boolean; busy: boolean; error?: string | null; link?: string | null; onClose: () => void; onExport: (scope: PngScope, scale: PngScale) => void };
export function ExportDialog({ open, busy, error, link, onClose, onExport }: Props) {
	const [scope, setScope] = useState<PngScope>("full-keychain");
	const [scale, setScale] = useState<PngScale>(1);
	return <Dialog open={open} onClose={busy ? undefined : onClose} fullWidth maxWidth="xs">
		<DialogTitle>Xuất ảnh giới thiệu</DialogTitle>
		<DialogContent><Stack spacing={2} sx={{ pt: 1 }}>
			<FormControl fullWidth><InputLabel id="png-scope">Phạm vi</InputLabel><Select labelId="png-scope" label="Phạm vi" value={scope} onChange={(event) => setScope(event.target.value as PngScope)}><MenuItem value="full-keychain">Móc khóa đầy đủ</MenuItem><MenuItem value="charm-only">Chỉ mặt móc</MenuItem></Select></FormControl>
			<FormControl fullWidth><InputLabel id="png-scale">Độ phân giải</InputLabel><Select labelId="png-scale" label="Độ phân giải" value={scale} onChange={(event) => setScale(Number(event.target.value) as PngScale)}><MenuItem value={1}>1× · 100 px/cm</MenuItem><MenuItem value={2}>2× · 200 px/cm</MenuItem><MenuItem value={3}>3× · 300 px/cm</MenuItem></Select></FormControl>
			{error && <Alert severity="error">{error}</Alert>}
			{link && <Alert severity="success" action={<Button onClick={() => void navigator.clipboard?.writeText(link)}>Sao chép</Button>}>Đã lưu snapshot. <a href={link} target="_blank" rel="noreferrer">Mở liên kết</a></Alert>}
		</Stack></DialogContent>
		<DialogActions><Button onClick={onClose} disabled={busy}>Đóng</Button><Button variant="contained" onClick={() => onExport(scope, scale)} disabled={busy}>{busy ? "Đang xuất…" : "Xuất PNG"}</Button></DialogActions>
	</Dialog>;
}
