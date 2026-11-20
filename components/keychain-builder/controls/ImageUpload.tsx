import { Box, Button, Stack, Typography } from "@mui/material";

type Props = { hasImage: boolean; imageUrl?: string | null; onSelect: (file: File) => void; onRemove: () => void; onValidationError: (message: string) => void };
export function ImageUpload({ hasImage, imageUrl, onSelect, onRemove, onValidationError }: Props) {
	return <Stack spacing={{ xs: 1.25, md: 0.5 }}>
		<Stack direction="row" spacing={{ xs: 0.75, md: 0.5 }} alignItems="center" sx={{ p: { xs: 0.75, md: 0.5 }, border: "1px solid #34353d", borderRadius: 1.5, bgcolor: "#202127", minWidth: 0 }}>
			{imageUrl ? <Box component="img" src={imageUrl} alt="Ảnh mặt trước đã chọn" sx={{ width: { xs: 38, md: 32 }, height: { xs: 38, md: 32 }, flex: "0 0 auto", borderRadius: 1, objectFit: "cover", bgcolor: "#15161a" }} /> : <Box sx={{ width: { xs: 38, md: 32 }, height: { xs: 38, md: 32 }, flex: "0 0 auto", borderRadius: 1, display: "grid", placeItems: "center", bgcolor: "#2a2b32", color: "#85868e", fontSize: 18 }}>＋</Box>}
			<Box sx={{ flex: 1, minWidth: 0, overflow: "hidden" }}><Typography variant="body2" fontWeight={600} noWrap sx={{ fontSize: { md: 11 } }}>{hasImage ? "Ảnh thiết kế" : "Chưa có ảnh"}</Typography><Typography variant="caption" color="grey.500" noWrap sx={{ display: "block", fontSize: { md: 9 } }}>PNG, JPG, WebP · tối đa 10 MB</Typography></Box>
			<Button component="label" variant="outlined" aria-label={hasImage ? "Thay ảnh mặt trước" : "Tải ảnh mặt trước"} title={hasImage ? "Thay ảnh" : "Tải ảnh"} sx={{ minWidth: { xs: 44, md: 32 }, width: { xs: 44, md: 32 }, height: { xs: 44, md: 32 }, minHeight: { xs: 44, md: 32 }, p: 0, flex: "0 0 auto", borderColor: "#55565f", whiteSpace: "nowrap" }}>
				↑
				<input hidden type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => {
					const file = event.target.files?.[0]; event.target.value = ""; if (!file) return;
					if (!/^image\/(png|jpeg|webp)$/.test(file.type)) { onValidationError("Chỉ hỗ trợ PNG, JPEG hoặc WebP."); return; }
					if (file.size > 10 * 1024 * 1024) { onValidationError("Ảnh không được vượt quá 10 MB."); return; }
					onSelect(file);
				}} />
			</Button>
			{hasImage && <Button onClick={onRemove} aria-label="Xóa ảnh mặt trước" title="Xóa ảnh" sx={{ minWidth: { xs: 44, md: 28 }, width: { xs: 44, md: 28 }, height: { xs: 44, md: 32 }, minHeight: { xs: 44, md: 32 }, p: 0, flex: "0 0 auto", color: "grey.400" }}>×</Button>}
		</Stack>
	</Stack>;
}
