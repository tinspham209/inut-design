import { useMemo, useState } from "react";
import { Box, Button, Container, Paper, Stack, Typography } from "@mui/material";
import { FRAMES, RINGS } from "@/data/keychain/catalog";
import { useKeychainState } from "@/components/keychain-builder/hooks/useKeychainState";
import { useImageUpload } from "@/components/keychain-builder/hooks/useImageUpload";
import { BackControls } from "@/components/keychain-builder/controls/BackControls";
import { OpaqueAcrylicDialog } from "@/components/keychain-builder/controls/OpaqueAcrylicDialog";
import { AppearanceControls } from "@/components/keychain-builder/controls/AppearanceControls";
import { ImageUpload } from "@/components/keychain-builder/controls/ImageUpload";

export function KeychainBuilder() {
	const [config, dispatch] = useKeychainState();
	const [pendingAcrylic, setPendingAcrylic] = useState<Exclude<typeof config.acrylicId, "clear"> | null>(null);
	const { upload, status: uploadStatus, error: uploadError } = useImageUpload();
	const imageUrl = config.front.url || null;
	const selectedFrame = useMemo(() => FRAMES.find((frame) => frame.id === (config.shape.type === "frame" ? config.shape.frameId : "heart")), [config.shape]);
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
								<img src={RINGS.find((item) => item.id === config.ringId)?.src} alt="" style={{ position: "absolute", width: "24%", height: "24%", objectFit: "contain", top: "-8%", left: "38%" }} />
							</Box>
							<Stack direction="row" spacing={1} sx={{ position: "absolute", left: 16, bottom: 16 }}><Button size="small" variant="contained">Mặt trước</Button><Button size="small" disabled sx={{ color: "grey.500" }}>Mặt sau</Button><Button size="small" disabled sx={{ color: "grey.500" }}>2D</Button><Button size="small" disabled sx={{ color: "grey.500" }}>Fit</Button><Button size="small" sx={{ color: "white" }} onClick={() => dispatch({ type: "reset" })}>Reset</Button></Stack>
						</Paper>
						<Stack spacing={2}>
							<Paper sx={{ p: 2.5, bgcolor: "#1b1c23", color: "inherit" }}><Typography variant="h6">01 · Hình dáng & móc</Typography><AppearanceControls section="shape" config={config} onRing={(ringId) => dispatch({ type: "select-ring", ringId })} onFrame={(frameId) => dispatch({ type: "select-frame", frameId })} onSize={(sizeCm) => dispatch({ type: "set-size", sizeCm })} onAcrylic={(acrylicId) => dispatch({ type: "select-acrylic", acrylicId })} onOpaque={setPendingAcrylic} onMaterial={(material) => dispatch({ type: "set-material", material })} /></Paper>
							<Paper sx={{ p: 2.5, bgcolor: "#1b1c23", color: "inherit" }}><Typography variant="h6">02 · Ảnh mặt trước</Typography><ImageUpload status={uploadStatus} error={uploadError} hasImage={Boolean(imageUrl)} onSelect={onImage} onRemove={() => dispatch({ type: "set-face", face: "front", value: { transform: config.front.transform } })} /></Paper>
							<Paper sx={{ p: 2.5, bgcolor: "#1b1c23", color: "inherit" }}><Typography variant="h6">03 · Mặt sau</Typography><BackControls acrylicId={config.acrylicId} backMode={config.backMode} hasCustomImage={Boolean(config.backCustom?.url)} onModeChange={(backMode) => dispatch({ type: "set-back-mode", backMode })} onUpload={(file) => { if (file) void upload(file).then((face) => { if (face) dispatch({ type: "set-face", face: "backCustom", value: face }); }); }} /></Paper>
							<Paper sx={{ p: 2.5, bgcolor: "#1b1c23", color: "inherit" }}><Typography variant="h6">04 · Màu mica</Typography><AppearanceControls section="material" config={config} onRing={(ringId) => dispatch({ type: "select-ring", ringId })} onFrame={(frameId) => dispatch({ type: "select-frame", frameId })} onSize={(sizeCm) => dispatch({ type: "set-size", sizeCm })} onAcrylic={(acrylicId) => dispatch({ type: "select-acrylic", acrylicId })} onOpaque={setPendingAcrylic} onMaterial={(material) => dispatch({ type: "set-material", material })} /></Paper>
							<Paper sx={{ p: 2.5, bgcolor: "#1b1c23", color: "inherit" }}><Typography variant="h6">05 · Xuất PNG</Typography><Typography color="grey.400" sx={{ mt: 1 }}>Bản xem trước chưa thể xuất cho đến khi hoàn thiện kết xuất.</Typography><Button variant="contained" disabled sx={{ mt: 2 }}>Xuất PNG</Button></Paper>
						</Stack>
					</Box>
				</Stack>
				<OpaqueAcrylicDialog acrylicId={pendingAcrylic} onCancel={() => setPendingAcrylic(null)} onConfirm={(acrylicId) => { dispatch({ type: "confirm-opaque", acrylicId }); setPendingAcrylic(null); }} />
			</Container>
		</Box>
	);
}
