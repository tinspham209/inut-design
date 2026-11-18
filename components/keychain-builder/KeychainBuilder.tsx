import { useMemo, useState } from "react";
import { Box, Button, Container, FormControl, InputLabel, MenuItem, Paper, Select, Stack, Typography } from "@mui/material";
import { ACRYLICS, FRAMES, RINGS, SIZES_CM } from "@/data/keychain/catalog";
import { useKeychainState } from "@/components/keychain-builder/hooks/useKeychainState";
import { useImageUpload } from "@/components/keychain-builder/hooks/useImageUpload";
import { BackControls } from "@/components/keychain-builder/controls/BackControls";
import { OpaqueAcrylicDialog } from "@/components/keychain-builder/controls/OpaqueAcrylicDialog";

export function KeychainBuilder() {
	const [config, dispatch] = useKeychainState();
	const [pendingAcrylic, setPendingAcrylic] = useState<Exclude<typeof config.acrylicId, "clear"> | null>(null);
	const { upload, status: uploadStatus, error: uploadError } = useImageUpload();
	const imageUrl = config.front.url || null;
	const selectedFrame = useMemo(() => FRAMES.find((frame) => frame.id === (config.shape.type === "frame" ? config.shape.frameId : "heart")), [config.shape]);
	const selectedAcrylic = ACRYLICS.find((item) => item.id === config.acrylicId)!;
	const onImage = (file?: File) => {
		if (!file) return;
		if (!/^image\/(png|jpeg|webp)$/.test(file.type) || file.size > 10 * 1024 * 1024) {
			window.alert("Chọn ảnh PNG, JPEG hoặc WebP tối đa 10 MB.");
			return;
		}
		void upload(file).then((face) => { if (face) dispatch({ type: "set-face", face: "front", value: face }); });
	};
	return (
		<Box sx={{ minHeight: "calc(100vh - 72px)", bgcolor: "#101116", color: "#fff", py: { xs: 3, md: 5 } }}>
			<Container maxWidth="xl">
				<Stack spacing={2}>
					<Box><Typography variant="overline" sx={{ color: "#ff9a44", fontWeight: 700 }}>DEMO • CHƯA PHẢI FILE SẢN XUẤT</Typography><Typography variant="h4" component="h1" fontWeight={700}>Thiết kế móc khóa mica</Typography><Typography color="grey.400">Khung và móc là hình minh họa; chưa được duyệt cho gia công thực tế.</Typography></Box>
					<Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1.3fr) minmax(340px, .9fr)" }, gap: 2, alignItems: "start" }}>
						<Paper aria-label="Bản xem trước móc khóa" sx={{ position: { md: "sticky" }, top: 88, minHeight: 380, display: "grid", placeItems: "center", bgcolor: "#1b1c23", color: "inherit", p: 3 }}>
							<Box sx={{ position: "relative", width: "min(68vw, 320px)", aspectRatio: "1 / 1.12", display: "grid", placeItems: "center" }}>
								{selectedFrame && <img src={selectedFrame.src} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", filter: "drop-shadow(0 16px 24px #0008)" }} />}
								{imageUrl && <img src={imageUrl} alt="Ảnh thiết kế xem trước" style={{ position: "absolute", width: "56%", height: "62%", objectFit: "cover", borderRadius: 24, mixBlendMode: "multiply" }} />}
								<div aria-hidden="true" style={{ position: "absolute", inset: "4%", background: selectedAcrylic.color, borderRadius: 40, pointerEvents: "none" }} />
								<img src={RINGS.find((item) => item.id === config.ringId)?.src} alt="" style={{ position: "absolute", width: "24%", height: "24%", objectFit: "contain", top: "-8%", left: "38%" }} />
							</Box>
							<Stack direction="row" spacing={1} sx={{ position: "absolute", left: 16, bottom: 16 }}><Button size="small" variant="contained">Mặt trước</Button><Button size="small" disabled>Mặt sau</Button><Button size="small" disabled>2D</Button><Button size="small" disabled>Fit</Button><Button size="small" onClick={() => dispatch({ type: "reset" })}>Reset</Button></Stack>
						</Paper>
						<Stack spacing={2}>
							<Paper sx={{ p: 2.5, bgcolor: "#1b1c23", color: "inherit" }}><Typography variant="h6">01 · Hình dáng & móc</Typography><Stack spacing={2} sx={{ mt: 2 }}>
								<FormControl fullWidth><InputLabel id="frame-label" sx={{ color: "grey.400" }}>Khung minh họa</InputLabel><Select labelId="frame-label" label="Khung minh họa" value={config.shape.type === "frame" ? config.shape.frameId : "heart"} onChange={(e) => dispatch({ type: "select-frame", frameId: e.target.value })} sx={{ color: "white" }}>{FRAMES.map((frame) => <MenuItem key={frame.id} value={frame.id}>{frame.label} · demo</MenuItem>)}</Select></FormControl>
								<FormControl fullWidth><InputLabel id="ring-label" sx={{ color: "grey.400" }}>Móc khóa</InputLabel><Select labelId="ring-label" label="Móc khóa" value={config.ringId} onChange={(e) => dispatch({ type: "select-ring", ringId: e.target.value })} sx={{ color: "white" }}>{RINGS.map((ring) => <MenuItem key={ring.id} value={ring.id}>{ring.label} · demo</MenuItem>)}</Select></FormControl>
								<FormControl fullWidth><InputLabel id="size-label" sx={{ color: "grey.400" }}>Kích thước</InputLabel><Select labelId="size-label" label="Kích thước" value={config.sizeCm} onChange={(e) => dispatch({ type: "set-size", sizeCm: Number(e.target.value) })} sx={{ color: "white" }}>{SIZES_CM.map((size) => <MenuItem key={size} value={size}>{size} cm</MenuItem>)}</Select></FormControl>
							</Stack></Paper>
							<Paper sx={{ p: 2.5, bgcolor: "#1b1c23", color: "inherit" }}><Typography variant="h6">02 · Ảnh mặt trước</Typography><Button component="label" variant="outlined" sx={{ mt: 2 }} disabled={uploadStatus === "uploading"}>{uploadStatus === "uploading" ? "Đang tải ảnh…" : "Chọn ảnh"}<input hidden type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => onImage(event.target.files?.[0])} /></Button>{imageUrl && <Button sx={{ mt: 2, ml: 1 }} onClick={() => dispatch({ type: "set-face", face: "front", value: { transform: config.front.transform } })}>Xóa ảnh</Button>}<Typography variant="body2" color={uploadError ? "error" : "grey.400"} sx={{ mt: 1 }}>{uploadError || "PNG, JPEG hoặc WebP · tối đa 10 MB"}</Typography></Paper>
							<Paper sx={{ p: 2.5, bgcolor: "#1b1c23", color: "inherit" }}><Typography variant="h6">03 · Mặt sau</Typography><BackControls acrylicId={config.acrylicId} backMode={config.backMode} hasCustomImage={Boolean(config.backCustom?.url)} onModeChange={(backMode) => dispatch({ type: "set-back-mode", backMode })} onUpload={(file) => { if (file) void upload(file).then((face) => { if (face) dispatch({ type: "set-face", face: "backCustom", value: face }); }); }} /></Paper>
							<Paper sx={{ p: 2.5, bgcolor: "#1b1c23", color: "inherit" }}><Typography variant="h6">04 · Màu mica</Typography><Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 2 }}>{ACRYLICS.map((item) => <Button key={item.id} aria-pressed={config.acrylicId === item.id} onClick={() => item.opaque && config.acrylicId === "clear" ? setPendingAcrylic(item.id as Exclude<typeof item.id, "clear">) : dispatch({ type: "select-acrylic", acrylicId: item.id })} variant={config.acrylicId === item.id ? "contained" : "outlined"}>{item.label}</Button>)}</Stack></Paper>
							<Paper sx={{ p: 2.5, bgcolor: "#1b1c23", color: "inherit" }}><Typography variant="h6">05 · Xuất PNG</Typography><Typography color="grey.400" sx={{ mt: 1 }}>Bản xem trước chưa thể xuất cho đến khi hoàn thiện kết xuất.</Typography><Button variant="contained" disabled sx={{ mt: 2 }}>Xuất PNG</Button></Paper>
						</Stack>
					</Box>
				</Stack>
				<OpaqueAcrylicDialog acrylicId={pendingAcrylic} onCancel={() => setPendingAcrylic(null)} onConfirm={(acrylicId) => { dispatch({ type: "confirm-opaque", acrylicId }); setPendingAcrylic(null); }} />
			</Container>
		</Box>
	);
}
