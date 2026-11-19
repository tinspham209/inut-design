import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Box, Button, Container, Paper, Snackbar, Stack, Typography } from "@mui/material";
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
import { ShapeControls } from "@/components/keychain-builder/controls/ShapeControls";
import { RemoveBackground } from "@/components/keychain-builder/controls/RemoveBackground";
import { useDieCutGeometry } from "@/components/keychain-builder/hooks/useDieCutGeometry";
import { useBackgroundRemoval, type BackgroundRemovalFace } from "@/components/keychain-builder/hooks/useBackgroundRemoval";
import { getFaceImageUrl } from "@/components/keychain-builder/image/imageFace";
import { removeSolidBackground } from "@/components/keychain-builder/image/removeSolidBackground";
import { uploadKeychainImage } from "@/api-client/keychain";
import dynamic from "next/dynamic";

const LazyPreview3D = dynamic(() => import("@/components/keychain-builder/preview/Preview3D").then((module) => module.Preview3D), { ssr: false, loading: () => <Typography role="status">Đang tải bộ dựng 3D…</Typography> });
const defaultImageTransform = { xMm: 0, yMm: 0, scale: 1, rotation: 0, flipX: false };

export function KeychainBuilder() {
	type ToastState = { message: string; severity: "error" | "info" | "success" | "warning" };
	const [toast, setToast] = useState<ToastState | null>(null);
	const notify = useCallback((message: string, severity: ToastState["severity"] = "info") => setToast({ message, severity }), []);
	const notifyPreviewError = useCallback((message: string) => notify(message, "error"), [notify]);
	const [config, dispatch, session] = useKeychainState();
	const configRef = useRef(config);
	configRef.current = config;
	const localImageUrls = useRef<{ front?: string; backCustom?: string; dieCutProcessed?: string }>({});
	const [dieCutSource, setDieCutSource] = useState<{ status: "ready" | "processing" | "error"; sourceUrl?: string; error?: string }>({ status: "ready" });
	const dieCutSourceIsCurrent = dieCutSource.sourceUrl === config.front.url;
	const dieCutSourceStatus = config.shape.type === "die-cut" && config.front.url ? dieCutSourceIsCurrent ? dieCutSource.status : "processing" : "ready";
	const dieCutSourceError = dieCutSourceIsCurrent ? dieCutSource.error : undefined;
	const dieCut = useDieCutGeometry(config, session.revisions.geometry, dieCutSourceStatus, dieCutSourceError);
	const dieCutReady = config.shape.type === "frame" || (dieCut.status === "ready" && dieCut.revision === session.revisions.geometry);
	const dieCutExportReady = dieCutReady && !localImageUrls.current.dieCutProcessed;
	const frameOverride = useMemo(() => config.shape.type === "die-cut" && dieCutReady && dieCut.geometry ? dieCutFrameSvg(dieCut.geometry) : undefined, [config.shape.type, dieCutReady, dieCut.geometry]);
	const router = useRouter();
	const designId = router.query.design;
	const { status: loadStatus, error: loadError, load } = useLoadDesign(designId);
	const [pendingAcrylic, setPendingAcrylic] = useState<Exclude<typeof config.acrylicId, "clear"> | null>(null);
	const { upload, cancel: cancelUpload, status: uploadStatus, error: uploadError } = useImageUpload();
	const { upload: uploadBackImage, cancel: cancelBackUpload, error: backUploadError } = useBackImage();
	const { states: backgroundRemovalStates, remove: removeBackground, cancel: cancelBackgroundRemoval } = useBackgroundRemoval();
	const frontRemovalStatus = backgroundRemovalStates.front.status;
	const frontRemovalError = backgroundRemovalStates.front.error;
	const backRemovalStatus = backgroundRemovalStates.backCustom.status;
	const backRemovalError = backgroundRemovalStates.backCustom.error;
	const backgroundRemovalEnabled = process.env.NEXT_PUBLIC_KEYCHAIN_BACKGROUND_REMOVAL_ENABLED === "true";
	const [exportOpen, setExportOpen] = useState(false);
	const { exportDesign, status: exportStatus, error: exportError, link: exportLink } = useExportDesign();
	const imageUrl = getFaceImageUrl(config.front) || null;
	const onRing = (ringId: string) => { dispatch({ type: "select-ring", ringId }); trackKeychainAction("keychain_ring_selected", { ring_id: ringId }); };
	const onFrame = (frameId: string) => { dispatch({ type: "select-frame", frameId }); trackKeychainAction("keychain_shape_selected", { shape_type: "frame" }); };
	const onAcrylic = (acrylicId: typeof config.acrylicId) => { dispatch({ type: "select-acrylic", acrylicId }); trackKeychainAction("keychain_acrylic_selected", { acrylic_id: acrylicId }); };
	useEffect(() => { if (router.isReady && typeof designId === "string") void load(designId, dispatch); }, [designId, dispatch, load, router.isReady]);
	useEffect(() => {
		if (config.shape.type !== "die-cut") { setDieCutSource({ status: "ready" }); return; }
		const sourceUrl = config.front.url;
		if (!sourceUrl) { setDieCutSource({ status: "ready" }); return; }
		const currentFront = configRef.current.front;
		if (currentFront.useProcessed && currentFront.processedUrl) { setDieCutSource({ status: "ready", sourceUrl }); return; }
		let active = true;
		setDieCutSource({ status: "processing", sourceUrl });
		void (async () => {
			try {
				const response = await fetch(sourceUrl, { mode: "cors", credentials: "omit" });
				if (!response.ok) throw new Error("Không tải được ảnh để tách nền. Hãy thử lại.");
				const source = await response.blob();
				if (!source.size || source.size > 10 * 1024 * 1024) throw new Error("Ảnh không hợp lệ hoặc vượt quá 10 MB.");
				const processed = await removeSolidBackground(source);
				if (!active || configRef.current.shape.type !== "die-cut" || configRef.current.front.url !== sourceUrl) return;
				if (!processed) {
					setDieCutSource({ status: "ready", sourceUrl });
					return;
				}
				const localUrl = URL.createObjectURL(processed);
				if (localImageUrls.current.dieCutProcessed) URL.revokeObjectURL(localImageUrls.current.dieCutProcessed);
				localImageUrls.current.dieCutProcessed = localUrl;
				dispatch({ type: "set-face", face: "front", value: { ...configRef.current.front, processedUrl: localUrl, useProcessed: true } });
				setDieCutSource({ status: "ready", sourceUrl });
				const processedFile = new File([processed], "keychain-front-background-removed.webp", { type: "image/webp" });
				void uploadKeychainImage(processedFile).then((uploaded) => {
					if (configRef.current.front.processedUrl !== localUrl) return;
					dispatch({ type: "set-face", face: "front", value: { ...configRef.current.front, processedImage: uploaded.image, processedUrl: uploaded.url, useProcessed: true } });
					if (localImageUrls.current.dieCutProcessed === localUrl) localImageUrls.current.dieCutProcessed = undefined;
					URL.revokeObjectURL(localUrl);
				}).catch(() => notify("Đường cắt đã sẵn sàng để xem trước, nhưng ảnh tách nền chưa lưu được. Hãy tải lại ảnh trước khi xuất.", "warning"));
			} catch (reason) {
				if (!active || configRef.current.front.url !== sourceUrl) return;
				const message = reason instanceof Error ? reason.message : "Không thể tách nền ảnh.";
				setDieCutSource({ status: "error", sourceUrl, error: message });
				notify(message, "error");
			}
		})();
		return () => { active = false; };
	}, [config.shape.type, config.front.url, dispatch, notify]);
	useEffect(() => { if (uploadError) notify(uploadError, "error"); }, [notify, uploadError]);
	useEffect(() => { if (backUploadError) notify(backUploadError, "error"); }, [backUploadError, notify]);
	useEffect(() => { if (exportError) notify(exportError, "error"); }, [exportError, notify]);
	useEffect(() => {
		if (dieCut.status === "error" && dieCut.revision === session.revisions.geometry && dieCutSourceStatus !== "processing" && dieCutSourceStatus !== "error") notify(dieCut.error || "Không tạo được đường cắt. Chọn ảnh khác hoặc dùng khung cố định.", "warning");
	}, [dieCut.error, dieCut.revision, dieCut.status, dieCutSourceStatus, notify, session.revisions.geometry]);
	useEffect(() => {
		if (frontRemovalStatus === "error" || frontRemovalStatus === "unsupported") notify(frontRemovalError || "Không thể tách nền ảnh.", frontRemovalStatus === "unsupported" ? "info" : "error");
		if (backRemovalStatus === "error" || backRemovalStatus === "unsupported") notify(backRemovalError || "Không thể tách nền ảnh.", backRemovalStatus === "unsupported" ? "info" : "error");
	}, [backRemovalError, backRemovalStatus, frontRemovalError, frontRemovalStatus, notify]);
	useEffect(() => { cancelBackgroundRemoval("front"); }, [cancelBackgroundRemoval, config.front.url]);
	useEffect(() => { cancelBackgroundRemoval("backCustom"); }, [cancelBackgroundRemoval, config.backCustom?.url]);
	useEffect(() => () => {
		cancelBackgroundRemoval("front"); cancelBackgroundRemoval("backCustom"); cancelUpload(); cancelBackUpload();
		Object.values(localImageUrls.current).forEach((url) => { if (url) URL.revokeObjectURL(url); });
	}, [cancelBackUpload, cancelBackgroundRemoval, cancelUpload]);
	const onImage = (file?: File) => {
		if (!file) return;
		cancelBackgroundRemoval("front");
		if (!/^image\/(png|jpeg|webp)$/.test(file.type) || file.size > 10 * 1024 * 1024) {
			notify("Chọn ảnh PNG, JPEG hoặc WebP tối đa 10 MB.", "error");
			return;
		}
		const url = URL.createObjectURL(file);
		if (localImageUrls.current.front) URL.revokeObjectURL(localImageUrls.current.front);
		localImageUrls.current.front = url;
		dispatch({ type: "set-face", face: "front", value: { url, transform: defaultImageTransform } });
		void upload(file).then((face) => {
			if (localImageUrls.current.front !== url) return;
			if (face) {
				const currentFront = configRef.current.front;
				dispatch({ type: "set-face", face: "front", value: { ...face, processedImage: currentFront.processedImage, processedUrl: currentFront.processedUrl, useProcessed: currentFront.useProcessed, transform: currentFront.transform } });
				localImageUrls.current.front = undefined; URL.revokeObjectURL(url);
				trackKeychainAction("keychain_image_upload", { result: "success" });
			} else trackKeychainAction("keychain_image_upload", { result: "error" });
		});
	};
	const onBackImage = (file?: File) => {
		if (!file) return;
		if (!/^image\/(png|jpeg|webp)$/.test(file.type) || file.size > 10 * 1024 * 1024) {
			notify("Chọn ảnh PNG, JPEG hoặc WebP tối đa 10 MB.", "error");
			return;
		}
		cancelBackgroundRemoval("backCustom");
		const url = URL.createObjectURL(file);
		if (localImageUrls.current.backCustom) URL.revokeObjectURL(localImageUrls.current.backCustom);
		localImageUrls.current.backCustom = url;
		dispatch({ type: "set-face", face: "backCustom", value: { url, transform: defaultImageTransform } });
		void uploadBackImage(file).then((face) => {
			if (localImageUrls.current.backCustom !== url || !face) return;
			dispatch({ type: "set-face", face: "backCustom", value: { ...face, transform: configRef.current.backCustom?.transform || defaultImageTransform } });
			localImageUrls.current.backCustom = undefined; URL.revokeObjectURL(url);
			trackKeychainAction("keychain_custom_back", { result: "success" });
		});
	};
	const removeFrontImage = () => {
		cancelUpload(); cancelBackgroundRemoval("front");
		if (localImageUrls.current.front) URL.revokeObjectURL(localImageUrls.current.front);
		if (localImageUrls.current.dieCutProcessed) URL.revokeObjectURL(localImageUrls.current.dieCutProcessed);
		localImageUrls.current.front = undefined; localImageUrls.current.dieCutProcessed = undefined;
		dispatch({ type: "set-face", face: "front", value: { transform: config.front.transform } });
	};
	const removeFaceBackground = async (face: BackgroundRemovalFace) => {
		const value = face === "front" ? config.front : config.backCustom;
		const processed = await removeBackground(face, value?.url);
		if (processed && value) {
			dispatch({ type: "set-face", face, value: { ...value, processedImage: processed.image, processedUrl: processed.url, useProcessed: true } });
			trackKeychainAction("keychain_background_removal", { result: "success" });
		} else if (processed === null && value?.url) trackKeychainAction("keychain_background_removal", { result: "error" });
	};
	const selectFaceSource = (face: BackgroundRemovalFace, useProcessed: boolean) => {
		const value = face === "front" ? config.front : config.backCustom;
		if (value?.processedImage && value.processedUrl) dispatch({ type: "set-face", face, value: { ...value, useProcessed } });
	};
	const getExportInputs = useCallback(async () => {
		const selectedFrameId = config.shape.type === "frame" ? config.shape.frameId : undefined;
		const frameRecord = selectedFrameId ? FRAMES.find((item) => item.id === selectedFrameId) : undefined;
		if (selectedFrameId && !frameRecord) throw new Error("Không tìm thấy khung đã chọn.");
		const fallbackFrameSource = frameRecord?.src;
		if (!frameOverride && !fallbackFrameSource) throw new Error("Chưa có khung để dựng ảnh.");
		const frame = frameOverride || await loadFrameSvg(fallbackFrameSource as string);
		const url = getFaceImageUrl(session.view === "back" && config.backMode === "custom" ? config.backCustom : config.front);
		const image = url ? await loadSanityImage(url) : undefined;
		return { frame, image };
	}, [config, frameOverride, session.view]);
	const renderExportPreview = useCallback(async (scope: PngScope) => {
		const { frame, image } = await getExportInputs();
		return renderShowcasePng(frame, config, image, 1, scope, session.view);
	}, [config, getExportInputs, session.view]);
	const onExport = async (scope: PngScope, scale: PngScale) => {
		if (uploadStatus === "uploading" || !dieCutExportReady) return;
		try {
			await exportDesign(config, async () => {
				const { frame, image } = await getExportInputs();
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
		<Box sx={{ height: { md: "calc(100dvh - 72px)" }, minHeight: "calc(100vh - 72px)", bgcolor: "#101116", color: "#fff", py: { xs: 0.75, md: 0.75 }, pb: { xs: "calc(88px + env(safe-area-inset-bottom))", md: "calc(8px + env(safe-area-inset-bottom))" }, overflow: { md: "hidden" }, overflowX: "hidden", "& button": { minHeight: { xs: 40, md: 34 }, textTransform: "none", fontSize: { md: 12 } }, "& input": { fontSize: 16 } }}>
			<Container maxWidth="xl" sx={{ height: { md: "100%" }, px: { md: 1.5 } }}>
				<Stack spacing={{ xs: 0.75, md: 0 }} sx={{ height: { md: "100%" }, minHeight: 0 }}>
					<Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1.35fr) minmax(440px, 1fr)" }, gap: { xs: 0.75, md: 1 }, alignItems: "stretch", minHeight: 0, height: { md: "100%" } }}>
						<Paper aria-label="Bản xem trước móc khóa" sx={{ position: { md: "relative" }, top: 0, minHeight: { xs: 360, md: 0 }, height: { md: "100%" }, display: "flex", flexDirection: "column", overflow: "hidden", bgcolor: "#191a20", color: "inherit", p: { xs: 1, md: 1.5 }, border: "1px solid #2c2d34", borderRadius: 2.5, backgroundImage: "radial-gradient(#30313a 0.7px, transparent 0.7px)", backgroundSize: "18px 18px" }}>
			{session.preview === "2d" ? <Preview2D config={config} view={session.view} frameOverride={frameOverride} geometryStatus={dieCut.status} geometryError={dieCut.error} onNotify={notifyPreviewError} on3D={() => { dispatch({ type: "set-preview", preview: "3d" }); trackKeychainAction("keychain_view_change", { mode: "3d" }); }} dispatch={(action) => { dispatch(action); if (action.type === "set-view") trackKeychainAction("keychain_view_change", { mode: "2d" }); }} /> : <LazyPreview3D config={config} view={session.view} dispatch={(action) => { dispatch(action); if (action.type === "set-view") trackKeychainAction("keychain_view_change", { mode: "3d", side: action.view }); }} onNotify={notifyPreviewError} frameOverride={frameOverride} geometryStatus={dieCut.status} geometryError={dieCut.error} onBack={() => { dispatch({ type: "set-preview", preview: "2d" }); trackKeychainAction("keychain_view_change", { mode: "2d" }); }} />}
						</Paper>
						<Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" }, gap: { xs: 0.75, md: 0.25 }, alignContent: "start", minWidth: 0, minHeight: 0, height: { md: "100%" }, overflowY: { md: "auto" }, bgcolor: { md: "#191a20" }, border: { md: "1px solid #2c2d34" }, borderRadius: { md: 2 }, p: { md: 0.25 }, "& .keychain-panel": { minWidth: 0, flexShrink: 0 }, "& .keychain-panel-01, & .keychain-panel-04, & .keychain-panel-05": { gridColumn: { md: "1 / -1" } }, "& .keychain-panel .MuiButton-root": { minHeight: { md: 28 }, fontSize: { md: 10 }, lineHeight: { md: 1.1 }, py: { md: 0.2 } }, "& .keychain-panel-03 .MuiButton-root": { minHeight: { md: 30 } }, "& .keychain-panel-04 .MuiButton-root": { minHeight: { md: 34 } }, "& .keychain-panel-05 .MuiButton-root": { minHeight: { md: 34 } } }}>
							<Panel title="01" label="Hình dáng & móc"><ShapeControls config={config} onChange={(action) => { dispatch(action); if (action.type === "select-die-cut") notify("Đang tạo đường cắt theo ảnh…", "info"); }} /><AppearanceControls section="shape" config={config} onRing={onRing} onFrame={onFrame} onSize={(sizeCm) => dispatch({ type: "set-size", sizeCm })} onAcrylic={onAcrylic} onOpaque={setPendingAcrylic} onMaterial={(material) => dispatch({ type: "set-material", material })} /></Panel>
							<Panel title="02" label="Ảnh mặt trước"><ImageUpload hasImage={Boolean(imageUrl)} imageUrl={imageUrl} onSelect={onImage} onRemove={removeFrontImage} onValidationError={(message) => notify(message, "error")} /><RemoveBackground label="mặt trước" hasImage={Boolean(config.front.image)} hasProcessed={Boolean(config.front.processedUrl && config.front.processedImage)} useProcessed={config.front.useProcessed} enabled={backgroundRemovalEnabled} state={backgroundRemovalStates.front} onRemove={() => void removeFaceBackground("front")} onUseOriginal={() => selectFaceSource("front", false)} onUseProcessed={() => selectFaceSource("front", true)} /></Panel>
							<Panel title="03" label="Mặt sau"><BackControls acrylicId={config.acrylicId} backMode={config.backMode} hasCustomImage={Boolean(config.backCustom?.url)} onModeChange={(backMode) => { dispatch({ type: "set-back-mode", backMode }); trackKeychainAction("keychain_back_mode", { mode: backMode, print_sides: backMode === "mirror-front" || backMode === "custom" ? 2 : 1 }); }} onUpload={onBackImage} />{config.backCustom?.url && <RemoveBackground label="mặt sau" hasImage={Boolean(config.backCustom.image)} hasProcessed={Boolean(config.backCustom.processedUrl && config.backCustom.processedImage)} useProcessed={config.backCustom.useProcessed} enabled={backgroundRemovalEnabled} state={backgroundRemovalStates.backCustom} onRemove={() => void removeFaceBackground("backCustom")} onUseOriginal={() => selectFaceSource("backCustom", false)} onUseProcessed={() => selectFaceSource("backCustom", true)} />}</Panel>
							<Panel title="04" label="Chất liệu"><AppearanceControls section="material" config={config} onRing={onRing} onFrame={onFrame} onSize={(sizeCm) => dispatch({ type: "set-size", sizeCm })} onAcrylic={onAcrylic} onOpaque={setPendingAcrylic} onMaterial={(material) => dispatch({ type: "set-material", material })} /></Panel>
							<Panel title="05" label="Xuất file"><Typography variant="caption" color="grey.400" sx={{ display: { xs: "block", md: "none" } }}>PNG giới thiệu ý tưởng · không phải file sản xuất.</Typography><Button fullWidth variant="contained" disabled={(typeof designId === "string" && loadStatus !== "loaded") || !dieCutExportReady} onClick={() => setExportOpen(true)} sx={{ mt: { xs: 1.5, md: 0.25 }, minHeight: { xs: 48, md: 34 }, bgcolor: "#f47a28", fontWeight: 750, "&:hover": { bgcolor: "#ff8a36" } }}>Xuất PNG</Button></Panel>
						</Box>
					</Box>
				</Stack>
				<OpaqueAcrylicDialog acrylicId={pendingAcrylic} onCancel={() => setPendingAcrylic(null)} onConfirm={(acrylicId) => { dispatch({ type: "confirm-opaque", acrylicId }); trackKeychainAction("keychain_acrylic_transition", { acrylic_id: acrylicId, print_sides: 1, result: "confirmed" }); setPendingAcrylic(null); }} />
				<ExportDialog open={exportOpen} busy={exportStatus === "pending" || uploadStatus === "uploading"} error={uploadStatus === "uploading" ? "Đợi tải ảnh lên hoàn tất trước khi xuất." : exportError} link={exportLink} onClose={() => setExportOpen(false)} onExport={(scope, scale) => void onExport(scope, scale)} renderPreview={renderExportPreview} onContactClick={() => trackKeychainAction("contact_click", { variant: "keychain-export-dialog" })} />
				<Snackbar open={Boolean(toast)} autoHideDuration={4500} onClose={() => setToast(null)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }} sx={{ bottom: { xs: "calc(82px + env(safe-area-inset-bottom))", md: 24 } }}><Alert onClose={() => setToast(null)} severity={toast?.severity || "info"} variant="filled" sx={{ width: "100%" }}>{toast?.message}</Alert></Snackbar>
			</Container>
			<Box sx={{ display: { xs: "block", md: "none" }, position: "fixed", zIndex: 1100, left: 0, right: 0, bottom: 0, px: 2, pt: 2, pb: "calc(12px + env(safe-area-inset-bottom))", background: "linear-gradient(transparent, #101116 24%)" }}><Button fullWidth variant="contained" onClick={() => setExportOpen(true)} disabled={(typeof designId === "string" && loadStatus !== "loaded") || !dieCutExportReady} sx={{ minHeight: 50, bgcolor: "#f47a28", color: "#fff", fontWeight: 750, boxShadow: "0 8px 28px #0009", "&:hover": { bgcolor: "#ff8a36" } }}>Xuất PNG</Button></Box>
		</Box>
	);
}

function Panel({ title, label, children }: { title: string; label: string; children: React.ReactNode }) {
	return <Paper className={`keychain-panel keychain-panel-${title}`} sx={{ p: { xs: 1.25, md: 0.65 }, bgcolor: "#191a20", color: "inherit", border: { xs: "1px solid #2c2d34", md: 0 }, borderRadius: { xs: 2, md: 0 }, boxShadow: "none", "& .MuiButton-root": { borderRadius: { md: 1 }, fontSize: { md: 11 }, px: { md: 0.75 } }, "& .MuiTypography-caption": { lineHeight: { md: 1.15 }, fontSize: { md: 10 } }, "& .MuiTypography-subtitle2": { fontSize: { md: 12 } } }}><Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: { xs: 1, md: 0.25 } }}><Box sx={{ color: "#ff7a23", fontSize: 11, fontWeight: 800 }}>{title}</Box><Typography variant="subtitle2" fontWeight={700}>{label}</Typography></Stack>{children}</Paper>;
}
