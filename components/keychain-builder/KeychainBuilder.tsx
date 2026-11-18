import { useEffect, useMemo, useState } from "react";
import { Alert, Box, Button, Container, Paper, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { FRAMES } from "@/data/keychain/catalog";
import { Preview2D } from "@/components/keychain-builder/preview/Preview2D";
import { useKeychainState } from "@/components/keychain-builder/hooks/useKeychainState";
import { useImageUpload } from "@/components/keychain-builder/hooks/useImageUpload";
import { useBackImage } from "@/components/keychain-builder/hooks/useBackImage";
import { BackControls } from "@/components/keychain-builder/controls/BackControls";
import { OpaqueAcrylicDialog } from "@/components/keychain-builder/controls/OpaqueAcrylicDialog";
import { AppearanceControls } from "@/components/keychain-builder/controls/AppearanceControls";
import { ImageUpload } from "@/components/keychain-builder/controls/ImageUpload";
import { ExportDialog } from "@/components/keychain-builder/ExportDialog";
import { useExportDesign } from "@/components/keychain-builder/hooks/useExportDesign";
import { dieCutFrameSvg, loadFrameSvg } from "@/components/keychain-builder/geometry/frameSvg";
import { loadSanityImage } from "@/components/keychain-builder/image/loadSanityImage";
import { renderShowcasePng, type PngScale, type PngScope } from "@/components/keychain-builder/render/renderPng";
import { useLoadDesign } from "@/components/keychain-builder/hooks/useLoadDesign";
import { trackKeychainAction } from "@/utils/keychainAnalytics";
import { BackImageEditor } from "@/components/keychain-builder/controls/BackImageEditor";
import { ShapeControls } from "@/components/keychain-builder/controls/ShapeControls";
import { useDieCutGeometry } from "@/components/keychain-builder/hooks/useDieCutGeometry";
import dynamic from "next/dynamic";

const LazyPreview3D = dynamic(() => import("@/components/keychain-builder/preview/Preview3D").then((module) => module.Preview3D), { ssr: false, loading: () => <Typography role="status">Đang tải bộ dựng 3D…</Typography> });

export function KeychainBuilder() {
	const [config, dispatch, session] = useKeychainState();
	const dieCut = useDieCutGeometry(config, session.revisions.geometry);
	const dieCutReady = config.shape.type === "frame" || (dieCut.status === "ready" && dieCut.revision === session.revisions.geometry);
	const frameOverride = useMemo(() => config.shape.type === "die-cut" && dieCutReady && dieCut.geometry ? dieCutFrameSvg(dieCut.geometry) : undefined, [config.shape.type, dieCutReady, dieCut.geometry]);
	const router = useRouter();
	const designId = router.query.design;
	const { status: loadStatus, error: loadError, load } = useLoadDesign(designId);
	const [pendingAcrylic, setPendingAcrylic] = useState<Exclude<typeof config.acrylicId, "clear"> | null>(null);
	const { upload, status: uploadStatus, error: uploadError } = useImageUpload();
	const backUpload = useBackImage();
	const [exportOpen, setExportOpen] = useState(false);
	const { exportDesign, status: exportStatus, error: exportError, link: exportLink } = useExportDesign();
	const imageUrl = config.front.url || null;
	const onRing = (ringId: string) => { dispatch({ type: "select-ring", ringId }); trackKeychainAction("keychain_ring_selected", { ring_id: ringId }); };
	const onFrame = (frameId: string) => { dispatch({ type: "select-frame", frameId }); trackKeychainAction("keychain_shape_selected", { shape_type: "frame" }); };
	const onAcrylic = (acrylicId: typeof config.acrylicId) => { dispatch({ type: "select-acrylic", acrylicId }); trackKeychainAction("keychain_acrylic_selected", { acrylic_id: acrylicId }); };
	useEffect(() => { if (router.isReady && typeof designId === "string") void load(designId, dispatch); }, [designId, dispatch, load, router.isReady]);
	const onImage = (file?: File) => {
		if (!file) return;
		if (!/^image\/(png|jpeg|webp)$/.test(file.type) || file.size > 10 * 1024 * 1024) {
			window.alert("Chọn ảnh PNG, JPEG hoặc WebP tối đa 10 MB.");
			return;
		}
		void upload(file).then((face) => { if (face) { dispatch({ type: "set-face", face: "front", value: face }); trackKeychainAction("keychain_image_upload", { result: "success" }); } else trackKeychainAction("keychain_image_upload", { result: "error" }); });
	};
	const updateBackTransform = (transform: NonNullable<typeof config.backCustom>["transform"]) => {
		if (config.backCustom) dispatch({ type: "set-face", face: "backCustom", value: { ...config.backCustom, transform } });
	};
	const resetBackTransform = () => updateBackTransform({ xMm: 0, yMm: 0, scale: 1, rotation: 0, flipX: false });
	const onExport = async (scope: PngScope, scale: PngScale) => {
		if (uploadStatus === "uploading") return;
		if (!dieCutReady) return;
		const selectedFrameId = config.shape.type === "frame" ? config.shape.frameId : undefined;
		const frameRecord = selectedFrameId ? FRAMES.find((item) => item.id === selectedFrameId) : undefined;
		if (selectedFrameId && !frameRecord) return;
		const fallbackFrameSource = frameRecord?.src;
		if (!frameOverride && !fallbackFrameSource) return;
		try {
			await exportDesign(config, async () => {
				const frame = frameOverride || await loadFrameSvg(fallbackFrameSource as string);
				const url = session.view === "back" && config.backMode === "custom" ? config.backCustom?.url : config.front.url;
				const image = url ? await loadSanityImage(url) : undefined;
				return renderShowcasePng(frame, config, image, scale, scope, session.view);
			});
			trackKeychainAction("keychain_export", { variant: scope, scale, result: "success" });
		} catch { trackKeychainAction("keychain_export", { variant: scope, scale, result: "error" }); }
	};
	if (typeof designId === "string" && loadStatus !== "loaded") {
		return <Container maxWidth="md" sx={{ py: 6, minHeight: "50vh" }}>
			{loadError ? <Alert severity="error" action={<Button onClick={() => void router.replace("/builder/keychain")}>Bắt đầu thiết kế mới</Button>}>{loadError}</Alert> : <Typography role="status">Đang tải snapshot thiết kế…</Typography>}
		</Container>;
	}
	return (
		<Box sx={{ minHeight: "calc(100vh - 72px)", bgcolor: "#101116", color: "#fff", py: { xs: 1.5, md: 2.5 }, pb: { xs: "calc(88px + env(safe-area-inset-bottom))", md: "calc(24px + env(safe-area-inset-bottom))" }, overflowX: "hidden", "& button": { minHeight: 40, textTransform: "none" }, "& input": { fontSize: 16 } }}>
			<Container maxWidth="xl">
				<Stack spacing={{ xs: 1.5, md: 2 }}>
					<Box sx={{ display: "flex", alignItems: "center", gap: 1.5, borderBottom: "1px solid #2a2b32", pb: 1.5 }}>
						<Button onClick={() => router.push("/")} aria-label="Quay lại" sx={{ minWidth: 40, color: "#c5c6ce", border: "1px solid #383941", borderRadius: 2 }}>←</Button>
						<Box sx={{ flex: 1, minWidth: 0 }}><Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap"><Typography variant="h6" component="h1" fontWeight={750}>INUT Keychain Builder</Typography><Box sx={{ border: "1px solid #bc6a2d", color: "#ffad69", borderRadius: 1, px: 0.8, py: 0.15, fontSize: 10, fontWeight: 800, letterSpacing: 1 }}>DEMO</Box></Stack><Typography variant="caption" color="grey.400">Tùy chỉnh mẫu móc khóa của bạn</Typography></Box>
					</Box>
					<Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1.55fr) minmax(340px, .8fr)" }, gap: { xs: 1.5, md: 2 }, alignItems: "start" }}>
						<Paper aria-label="Bản xem trước móc khóa" sx={{ position: { md: "sticky" }, top: 84, minHeight: { xs: 390, md: 600 }, bgcolor: "#191a20", color: "inherit", p: { xs: 1.5, md: 2.5 }, border: "1px solid #2c2d34", borderRadius: 3, backgroundImage: "radial-gradient(#30313a 0.7px, transparent 0.7px)", backgroundSize: "18px 18px" }}>
			{session.preview === "2d" ? <Preview2D config={config} view={session.view} frameOverride={frameOverride} geometryStatus={dieCut.status} geometryError={dieCut.error} on3D={() => { dispatch({ type: "set-preview", preview: "3d" }); trackKeychainAction("keychain_view_change", { mode: "3d" }); }} dispatch={(action) => { dispatch(action); if (action.type === "set-view") trackKeychainAction("keychain_view_change", { mode: "2d" }); }} /> : <LazyPreview3D config={config} frameOverride={frameOverride} geometryStatus={dieCut.status} geometryError={dieCut.error} onBack={() => { dispatch({ type: "set-preview", preview: "2d" }); trackKeychainAction("keychain_view_change", { mode: "2d" }); }} />}
							<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1.5, pt: 1.5, borderTop: "1px solid #2d2e35" }}><Typography variant="caption" color="grey.500">Bản xem trước chỉ mang tính minh họa.</Typography><Button size="small" onClick={() => dispatch({ type: "reset" })} sx={{ color: "grey.400" }}>Đặt lại</Button></Stack>
						</Paper>
						<Stack spacing={1.25}>
							<Panel title="01" label="Hình dáng & móc"><ShapeControls config={config} status={dieCut.status} error={dieCut.error} onChange={dispatch} /><AppearanceControls section="shape" config={config} onRing={onRing} onFrame={onFrame} onSize={(sizeCm) => dispatch({ type: "set-size", sizeCm })} onAcrylic={onAcrylic} onOpaque={setPendingAcrylic} onMaterial={(material) => dispatch({ type: "set-material", material })} /></Panel>
							<Panel title="02" label="Ảnh mặt trước"><ImageUpload status={uploadStatus} error={uploadError} hasImage={Boolean(imageUrl)} imageUrl={imageUrl} onSelect={onImage} onRemove={() => dispatch({ type: "set-face", face: "front", value: { transform: config.front.transform } })} /></Panel>
							<Panel title="03" label="Mặt sau"><BackControls acrylicId={config.acrylicId} backMode={config.backMode} hasCustomImage={Boolean(config.backCustom?.url)} uploading={backUpload.status === "uploading"} error={backUpload.error} onModeChange={(backMode) => { dispatch({ type: "set-back-mode", backMode }); trackKeychainAction("keychain_back_mode", { mode: backMode, print_sides: backMode === "mirror-front" || backMode === "custom" ? 2 : 1 }); }} onUpload={(file) => { if (file) void backUpload.upload(file).then((face) => { if (face) { dispatch({ type: "set-face", face: "backCustom", value: face }); trackKeychainAction("keychain_custom_back", { result: "success" }); } }); }} />{config.backCustom?.url && config.acrylicId === "clear" && <BackImageEditor transform={config.backCustom.transform} onChange={updateBackTransform} onReset={resetBackTransform} />}</Panel>
							<Panel title="04" label="Chất liệu"><AppearanceControls section="material" config={config} onRing={onRing} onFrame={onFrame} onSize={(sizeCm) => dispatch({ type: "set-size", sizeCm })} onAcrylic={onAcrylic} onOpaque={setPendingAcrylic} onMaterial={(material) => dispatch({ type: "set-material", material })} /></Panel>
							<Panel title="05" label="Xuất file"><Typography variant="caption" color="grey.400">PNG giới thiệu ý tưởng · không phải file sản xuất.</Typography><Button fullWidth variant="contained" disabled={(typeof designId === "string" && loadStatus !== "loaded") || !dieCutReady} onClick={() => setExportOpen(true)} sx={{ mt: 1.5, minHeight: 48, bgcolor: "#f47a28", fontWeight: 750, "&:hover": { bgcolor: "#ff8a36" } }}>Xuất PNG</Button></Panel>
						</Stack>
					</Box>
				</Stack>
				<OpaqueAcrylicDialog acrylicId={pendingAcrylic} onCancel={() => setPendingAcrylic(null)} onConfirm={(acrylicId) => { dispatch({ type: "confirm-opaque", acrylicId }); trackKeychainAction("keychain_acrylic_transition", { acrylic_id: acrylicId, print_sides: 1, result: "confirmed" }); setPendingAcrylic(null); }} />
				<ExportDialog open={exportOpen} busy={exportStatus === "pending" || uploadStatus === "uploading"} error={uploadStatus === "uploading" ? "Đợi tải ảnh lên hoàn tất trước khi xuất." : exportError} link={exportLink} onClose={() => setExportOpen(false)} onExport={(scope, scale) => void onExport(scope, scale)} />
			</Container>
			<Box sx={{ display: { xs: "block", md: "none" }, position: "fixed", zIndex: 1100, left: 0, right: 0, bottom: 0, px: 2, pt: 2, pb: "calc(12px + env(safe-area-inset-bottom))", background: "linear-gradient(transparent, #101116 24%)" }}><Button fullWidth variant="contained" onClick={() => setExportOpen(true)} disabled={(typeof designId === "string" && loadStatus !== "loaded") || !dieCutReady} sx={{ minHeight: 50, bgcolor: "#f47a28", color: "#fff", fontWeight: 750, boxShadow: "0 8px 28px #0009", "&:hover": { bgcolor: "#ff8a36" } }}>Xuất PNG</Button></Box>
		</Box>
	);
}

function Panel({ title, label, children }: { title: string; label: string; children: React.ReactNode }) {
	return <Paper sx={{ p: { xs: 1.5, md: 1.75 }, bgcolor: "#191a20", color: "inherit", border: "1px solid #2c2d34", borderRadius: 2.5 }}><Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.3 }}><Box sx={{ width: 24, height: 24, display: "grid", placeItems: "center", borderRadius: 1, bgcolor: "#292a31", color: "#ff9a44", fontSize: 11, fontWeight: 800 }}>{title}</Box><Typography variant="subtitle2" fontWeight={700}>{label}</Typography></Stack>{children}</Paper>;
}
