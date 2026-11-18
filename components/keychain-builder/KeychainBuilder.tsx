import { useEffect, useState } from "react";
import { Alert, Box, Button, Container, Paper, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { FRAMES } from "@/data/keychain/catalog";
import { Preview2D } from "@/components/keychain-builder/preview/Preview2D";
import { useKeychainState } from "@/components/keychain-builder/hooks/useKeychainState";
import { useImageUpload } from "@/components/keychain-builder/hooks/useImageUpload";
import { BackControls } from "@/components/keychain-builder/controls/BackControls";
import { OpaqueAcrylicDialog } from "@/components/keychain-builder/controls/OpaqueAcrylicDialog";
import { AppearanceControls } from "@/components/keychain-builder/controls/AppearanceControls";
import { ImageUpload } from "@/components/keychain-builder/controls/ImageUpload";
import { ExportDialog } from "@/components/keychain-builder/ExportDialog";
import { useExportDesign } from "@/components/keychain-builder/hooks/useExportDesign";
import { loadFrameSvg } from "@/components/keychain-builder/geometry/frameSvg";
import { loadSanityImage } from "@/components/keychain-builder/image/loadSanityImage";
import { renderShowcasePng, type PngScale, type PngScope } from "@/components/keychain-builder/render/renderPng";
import { useLoadDesign } from "@/components/keychain-builder/hooks/useLoadDesign";

export function KeychainBuilder() {
	const [config, dispatch, session] = useKeychainState();
	const router = useRouter();
	const designId = router.query.design;
	const { status: loadStatus, error: loadError, load } = useLoadDesign(designId);
	const [pendingAcrylic, setPendingAcrylic] = useState<Exclude<typeof config.acrylicId, "clear"> | null>(null);
	const { upload, status: uploadStatus, error: uploadError } = useImageUpload();
	const [exportOpen, setExportOpen] = useState(false);
	const { exportDesign, status: exportStatus, error: exportError, link: exportLink } = useExportDesign();
	const imageUrl = config.front.url || null;
	useEffect(() => { if (router.isReady && typeof designId === "string") void load(designId, dispatch); }, [designId, dispatch, load, router.isReady]);
	const onImage = (file?: File) => {
		if (!file) return;
		if (!/^image\/(png|jpeg|webp)$/.test(file.type) || file.size > 10 * 1024 * 1024) {
			window.alert("Chọn ảnh PNG, JPEG hoặc WebP tối đa 10 MB.");
			return;
		}
		void upload(file).then((face) => { if (face) dispatch({ type: "set-face", face: "front", value: face }); });
	};
	const onExport = async (scope: PngScope, scale: PngScale) => {
		if (uploadStatus === "uploading") return;
		const frameId = config.shape.type === "frame" ? config.shape.frameId : "heart";
		const frameRecord = FRAMES.find((item) => item.id === frameId);
		if (!frameRecord) return;
		try {
			await exportDesign(config, async () => {
				const frame = await loadFrameSvg(frameRecord.src);
				const url = session.view === "back" && config.backMode === "custom" ? config.backCustom?.url : config.front.url;
				const image = url ? await loadSanityImage(url) : undefined;
				return renderShowcasePng(frame, config, image, scale, scope, session.view);
			});
		} catch { /* error is surfaced by the export status hook */ }
	};
	if (typeof designId === "string" && loadStatus !== "loaded") {
		return <Container maxWidth="md" sx={{ py: 6, minHeight: "50vh" }}>
			{loadError ? <Alert severity="error" action={<Button onClick={() => void router.replace("/builder/keychain")}>Bắt đầu thiết kế mới</Button>}>{loadError}</Alert> : <Typography role="status">Đang tải snapshot thiết kế…</Typography>}
		</Container>;
	}
	return (
		<Box sx={{ minHeight: "calc(100vh - 72px)", bgcolor: "#101116", color: "#fff", py: { xs: 3, md: 5 } }}>
			<Container maxWidth="xl">
				<Stack spacing={2}>
					<Box><Typography variant="overline" sx={{ color: "#ff9a44", fontWeight: 700 }}>DEMO • CHƯA PHẢI FILE SẢN XUẤT</Typography><Typography variant="h4" component="h1" fontWeight={700}>Thiết kế móc khóa mica</Typography><Typography color="grey.400">Khung và móc là hình minh họa; chưa được duyệt cho gia công thực tế.</Typography>
					</Box>
					<Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1.3fr) minmax(340px, .9fr)" }, gap: 2, alignItems: "start" }}>
						<Paper aria-label="Bản xem trước móc khóa" sx={{ position: { md: "sticky" }, top: 88, minHeight: 380, bgcolor: "#1b1c23", color: "inherit", p: 3 }}>
							<Preview2D config={config} view={session.view} dispatch={dispatch} />
							<Button sx={{ mt: 1 }} onClick={() => dispatch({ type: "reset" })}>Đặt lại toàn bộ</Button>
						</Paper>
						<Stack spacing={2}>
							<Paper sx={{ p: 2.5, bgcolor: "#1b1c23", color: "inherit" }}><Typography variant="h6">01 · Hình dáng & móc</Typography><AppearanceControls section="shape" config={config} onRing={(ringId) => dispatch({ type: "select-ring", ringId })} onFrame={(frameId) => dispatch({ type: "select-frame", frameId })} onSize={(sizeCm) => dispatch({ type: "set-size", sizeCm })} onAcrylic={(acrylicId) => dispatch({ type: "select-acrylic", acrylicId })} onOpaque={setPendingAcrylic} onMaterial={(material) => dispatch({ type: "set-material", material })} /></Paper>
							<Paper sx={{ p: 2.5, bgcolor: "#1b1c23", color: "inherit" }}><Typography variant="h6">02 · Ảnh mặt trước</Typography><ImageUpload status={uploadStatus} error={uploadError} hasImage={Boolean(imageUrl)} onSelect={onImage} onRemove={() => dispatch({ type: "set-face", face: "front", value: { transform: config.front.transform } })} /></Paper>
							<Paper sx={{ p: 2.5, bgcolor: "#1b1c23", color: "inherit" }}><Typography variant="h6">03 · Mặt sau</Typography><BackControls acrylicId={config.acrylicId} backMode={config.backMode} hasCustomImage={Boolean(config.backCustom?.url)} onModeChange={(backMode) => dispatch({ type: "set-back-mode", backMode })} onUpload={(file) => { if (file) void upload(file).then((face) => { if (face) dispatch({ type: "set-face", face: "backCustom", value: face }); }); }} /></Paper>
							<Paper sx={{ p: 2.5, bgcolor: "#1b1c23", color: "inherit" }}><Typography variant="h6">04 · Màu mica</Typography><AppearanceControls section="material" config={config} onRing={(ringId) => dispatch({ type: "select-ring", ringId })} onFrame={(frameId) => dispatch({ type: "select-frame", frameId })} onSize={(sizeCm) => dispatch({ type: "set-size", sizeCm })} onAcrylic={(acrylicId) => dispatch({ type: "select-acrylic", acrylicId })} onOpaque={setPendingAcrylic} onMaterial={(material) => dispatch({ type: "set-material", material })} /></Paper>
							<Paper sx={{ p: 2.5, bgcolor: "#1b1c23", color: "inherit" }}><Typography variant="h6">05 · Xuất PNG</Typography><Typography color="grey.400" sx={{ mt: 1 }}>PNG dùng để giới thiệu ý tưởng, không phải file sản xuất.</Typography><Button variant="contained" disabled={typeof designId === "string" && loadStatus !== "loaded"} onClick={() => setExportOpen(true)} sx={{ mt: 2, minHeight: 48 }}>Xuất PNG</Button></Paper>
						</Stack>
					</Box>
				</Stack>
				<OpaqueAcrylicDialog acrylicId={pendingAcrylic} onCancel={() => setPendingAcrylic(null)} onConfirm={(acrylicId) => { dispatch({ type: "confirm-opaque", acrylicId }); setPendingAcrylic(null); }} />
				<ExportDialog open={exportOpen} busy={exportStatus === "pending" || uploadStatus === "uploading"} error={uploadStatus === "uploading" ? "Đợi tải ảnh lên hoàn tất trước khi xuất." : exportError} link={exportLink} onClose={() => setExportOpen(false)} onExport={(scope, scale) => void onExport(scope, scale)} />
			</Container>
		</Box>
	);
}
