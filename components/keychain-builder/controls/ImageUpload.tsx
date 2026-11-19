import { useState } from "react";
import { Alert, Box, Button, Stack, Typography } from "@mui/material";

type Props = { error?: string | null; hasImage: boolean; imageUrl?: string | null; onSelect: (file: File) => void; onRemove: () => void };
export function ImageUpload({ error, hasImage, imageUrl, onSelect, onRemove }: Props) {
	const [validationError, setValidationError] = useState<string | null>(null);
	return <Stack spacing={{ xs: 1.25, md: 0.5 }}>
		<Stack direction="row" spacing={{ xs: 1, md: 0.75 }} alignItems="center" sx={{ p: { xs: 1, md: 0.6 }, border: "1px solid #34353d", borderRadius: 1.5, bgcolor: "#202127", minWidth: 0 }}>
			{imageUrl ? <Box component="img" src={imageUrl} alt="Ảnh mặt trước đã chọn" sx={{ width: { xs: 48, md: 38 }, height: { xs: 48, md: 38 }, borderRadius: 1.25, objectFit: "cover", bgcolor: "#15161a" }} /> : <Box sx={{ width: { xs: 48, md: 38 }, height: { xs: 48, md: 38 }, borderRadius: 1.25, display: "grid", placeItems: "center", bgcolor: "#2a2b32", color: "#85868e", fontSize: 20 }}>＋</Box>}
			<Box sx={{ flex: 1, minWidth: 0 }}><Typography variant="body2" fontWeight={600}>{hasImage ? "Ảnh thiết kế" : "Chưa có ảnh"}</Typography><Typography variant="caption" color="grey.500">PNG, JPG hoặc WebP · tối đa 10 MB</Typography></Box>
			<Button component="label" variant="outlined" sx={{ minHeight: 38, px: 1.1, borderColor: "#55565f", whiteSpace: "nowrap" }}>
				{hasImage ? "Thay ảnh" : "Tải ảnh"}
				<input hidden type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => {
					const file = event.target.files?.[0]; event.target.value = ""; if (!file) return;
					if (!/^image\/(png|jpeg|webp)$/.test(file.type)) { setValidationError("Chỉ hỗ trợ PNG, JPEG hoặc WebP."); return; }
					if (file.size > 10 * 1024 * 1024) { setValidationError("Ảnh không được vượt quá 10 MB."); return; }
					setValidationError(null); onSelect(file);
				}} />
			</Button>
			{hasImage && <Button onClick={onRemove} aria-label="Xóa ảnh mặt trước" sx={{ minWidth: 34, minHeight: 38, px: 0.5, color: "grey.400" }}>×</Button>}
		</Stack>
		{(validationError || error) && <Alert severity="error">{validationError || error}</Alert>}
	</Stack>;
}
