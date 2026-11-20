import { useEffect, useState } from "react";
import {
	Alert,
	Box,
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	Typography,
} from "@mui/material";
import type { PngScale, PngScope } from "./render/renderPng";

type Props = {
	open: boolean;
	busy: boolean;
	error?: string | null;
	link?: string | null;
	onClose: () => void;
	onExport: (scope: PngScope, scale: PngScale) => void;
	canExport?: boolean;
	renderPreview: (scope: PngScope) => Promise<Blob>;
};

export function ExportDialog({
	open,
	busy,
	error,
	link,
	onClose,
	onExport,
	canExport = true,
	renderPreview,
}: Props) {
	const [scope, setScope] = useState<PngScope>("full-keychain");
	const [scale, setScale] = useState<PngScale>(1);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [previewLoading, setPreviewLoading] = useState(false);
	const [previewError, setPreviewError] = useState<string | null>(null);

	useEffect(() => {
		if (!open) {
			setPreviewUrl(null);
			setPreviewError(null);
			return;
		}
		let active = true;
		let objectUrl: string | undefined;
		setPreviewLoading(true);
		setPreviewUrl(null);
		setPreviewError(null);
		void renderPreview(scope)
			.then((blob) => {
				if (!active) return;
				objectUrl = URL.createObjectURL(blob);
				setPreviewUrl(objectUrl);
			})
			.catch((reason) => {
				if (active)
					setPreviewError(
						reason instanceof Error ? reason.message : "Không dựng được ảnh xem trước."
					);
			})
			.finally(() => {
				if (active) setPreviewLoading(false);
			});
		return () => {
			active = false;
			if (objectUrl) URL.revokeObjectURL(objectUrl);
		};
	}, [open, renderPreview, scope]);

	return (
		<Dialog
			open={open}
			onClose={busy ? undefined : onClose}
			fullWidth
			maxWidth="sm"
			PaperProps={{
				sx: { bgcolor: "#191a20", color: "#fff", border: "1px solid #34353d", borderRadius: 2 },
			}}
		>
			<DialogTitle>Xuất ảnh giới thiệu</DialogTitle>
			<DialogContent>
				<Stack spacing={1.5} sx={{ pt: 1 }}>
					<FormControl fullWidth sx={darkFormControlSx}>
						<InputLabel id="png-scope">Phạm vi</InputLabel>
						<Select
							labelId="png-scope"
							label="Phạm vi"
							value={scope}
							onChange={(event) => setScope(event.target.value as PngScope)}
							MenuProps={{ PaperProps: { sx: { bgcolor: "#202127", color: "#fff" } } }}
						>
							<MenuItem value="full-keychain">Móc khóa đầy đủ</MenuItem>
							<MenuItem value="charm-only">Chỉ mặt móc</MenuItem>
						</Select>
					</FormControl>
					<Box
						aria-label="Ảnh xem trước sẽ xuất"
						sx={{
							minHeight: 0,
							height: { xs: 150, sm: 170 },
							display: "grid",
							gridTemplateRows: "minmax(0, 1fr)",
							placeItems: "center",
							overflow: "hidden",
							border: "1px solid #34353d",
							borderRadius: 1.5,
							bgcolor: "#121318",
							backgroundImage: "radial-gradient(#292a31 0.7px, transparent 0.7px)",
							backgroundSize: "16px 16px",
						}}
					>
						{previewLoading ? (
							<Stack alignItems="center" spacing={1} role="status">
								<CircularProgress size={24} sx={{ color: "#f47a28" }} />
								<Typography variant="caption" color="grey.400">
									Đang dựng ảnh xem trước…
								</Typography>
							</Stack>
						) : previewUrl ? (
							<Box
								component="img"
								src={previewUrl}
								alt={scope === "full-keychain" ? "Xem trước móc khóa đầy đủ" : "Xem trước mặt móc"}
								sx={{ display: "block", width: "100%", height: "100%", objectFit: "contain" }}
							/>
						) : (
							<Typography variant="body2" color="grey.400">
								Chưa có ảnh xem trước.
							</Typography>
						)}
					</Box>
					{previewError && <Alert severity="warning">{previewError}</Alert>}
					<FormControl fullWidth sx={darkFormControlSx}>
						<InputLabel id="png-scale">Độ phân giải</InputLabel>
						<Select
							labelId="png-scale"
							label="Độ phân giải"
							value={scale}
							onChange={(event) => setScale(Number(event.target.value) as PngScale)}
							MenuProps={{ PaperProps: { sx: { bgcolor: "#202127", color: "#fff" } } }}
						>
							<MenuItem value={1}>1× · 100 px/cm</MenuItem>
							<MenuItem value={2}>2× · 200 px/cm</MenuItem>
							<MenuItem value={3}>3× · 300 px/cm</MenuItem>
						</Select>
					</FormControl>
					{error && <Alert severity="error">{error}</Alert>}
					{link && (
						<Alert
							severity="success"
							action={
								<Button onClick={() => void navigator.clipboard?.writeText(link)}>Sao chép</Button>
							}
						>
							Đã lưu snapshot.{" "}
							<a href={link} target="_blank" rel="noreferrer">
								Mở liên kết
							</a>
						</Alert>
					)}
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button size="small" onClick={onClose} disabled={busy}>
					Đóng
				</Button>
				<Button
					size="small"
					variant="contained"
					onClick={() => onExport(scope, scale)}
					disabled={busy || !canExport || previewLoading || Boolean(previewError)}
					sx={{ bgcolor: "#f47a28", "&:hover": { bgcolor: "#ff8a36" } }}
				>
					{busy ? "Đang xuất…" : "Xuất PNG"}
				</Button>
			</DialogActions>
		</Dialog>
	);
}

const darkFormControlSx = {
	"& .MuiInputLabel-root": { color: "#b7b7bd" },
	"& .MuiInputLabel-root.Mui-focused": { color: "#ff8a36" },
	"& .MuiOutlinedInput-root": {
		bgcolor: "#202127",
		color: "#fff",
		"& fieldset": { borderColor: "#41424a" },
		"&:hover fieldset": { borderColor: "#777982" },
		"&.Mui-focused fieldset": { borderColor: "#ff8a36" },
	},
	"& .MuiSelect-icon": { color: "#b7b7bd" },
};
