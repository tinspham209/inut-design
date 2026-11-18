import { useState } from "react";
import { Alert, Button, Stack, Typography } from "@mui/material";

type Props = { status: "idle" | "uploading" | "error"; error?: string | null; hasImage: boolean; onSelect: (file: File) => void; onRemove: () => void };
export function ImageUpload({ status, error, hasImage, onSelect, onRemove }: Props) {
	const [validationError, setValidationError] = useState<string | null>(null);
	return <Stack spacing={1.5} sx={{ mt: 2 }}>
		<Stack direction="row" spacing={1}>
			<Button component="label" variant="outlined" disabled={status === "uploading"} sx={{ minHeight: 44 }}>
				{status === "uploading" ? "Đang tải ảnh…" : "Chọn ảnh"}
				<input hidden type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => {
					const file = event.target.files?.[0]; event.target.value = ""; if (!file) return;
					if (!/^image\/(png|jpeg|webp)$/.test(file.type)) { setValidationError("Chỉ hỗ trợ PNG, JPEG hoặc WebP."); return; }
					if (file.size > 10 * 1024 * 1024) { setValidationError("Ảnh không được vượt quá 10 MB."); return; }
					setValidationError(null); onSelect(file);
				}} />
			</Button>
			{hasImage && <Button onClick={onRemove} sx={{ minHeight: 44 }}>Xóa ảnh</Button>}
		</Stack>
		{status === "uploading" && <Typography role="status" variant="body2">Đang tải ảnh lên để dùng trong bản xem trước…</Typography>}
		{(validationError || error) && <Alert severity="error">{validationError || error}</Alert>}
		<Typography variant="body2" color="grey.400">PNG, JPEG hoặc WebP · tối đa 10 MB</Typography>
	</Stack>;
}
