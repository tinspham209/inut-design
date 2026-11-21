import { Box, Button, Stack, Typography } from "@mui/material";
import { PreviewToolbar } from "./PreviewToolbar";

const noop = () => undefined;

export function Preview3DLoading() {
	return (
		<Stack spacing={0.5} sx={{ width: "100%", height: "100%", flex: 1, minHeight: 0, minWidth: 0 }}>
			<Stack
				className="keychain-preview-header"
				direction="row"
				spacing={0.5}
				alignItems="center"
				justifyContent="space-between"
				flexWrap="nowrap"
				sx={{
					height: 32,
					minHeight: 32,
					maxHeight: 32,
					flex: "0 0 32px",
					minWidth: 0,
					overflow: "hidden",
					"&& .MuiButton-root": { height: 28, minHeight: 28, maxHeight: 28, minWidth: 32, px: 0.5, py: 0, flexShrink: 0 },
				}}
			>
				<Stack direction="row" spacing={0.5} sx={{ flex: { xs: "1 1 auto", md: "0 0 auto" }, width: { xs: "auto", md: "fit-content" }, maxWidth: { xs: "65%", md: "none" }, minWidth: 0, px: 1, bgcolor: "#22232a", border: "1px solid #36373e", borderRadius: 1.25 }}>
					<Typography variant="caption" color="grey.400" sx={{ alignSelf: "center", minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: { xs: 11, md: 14 } }}>Xoay mô hình để xem hai mặt</Typography>
				</Stack>
				<Stack direction="row" spacing={0.25} flexShrink={0}>
					<Button size="small" sx={{ color: "#c5c6ce", borderRadius: "10px" }}>2D</Button>
					<Button size="small" disabled variant="outlined" aria-current="true" sx={{ borderColor: "#45464e", borderRadius: "10px" }}>3D</Button>
				</Stack>
			</Stack>
			<Stack direction={{ xs: "column", md: "row" }} spacing={0.5} alignItems="stretch" sx={{ minHeight: 0, flex: 1, minWidth: 0 }}>
				<PreviewToolbar artworkLabel="ảnh in" fullScreen={false} disabled onArtworkRotate={noop} onArtworkFlip={noop} onArtworkZoomOut={noop} onArtworkZoomIn={noop} onArtworkReset={noop} onViewZoomOut={noop} onViewZoomIn={noop} onViewReset={noop} onFullScreenToggle={noop} />
				<Box sx={{ flex: 1, minWidth: 0, minHeight: 0, position: "relative", overflow: "hidden", border: "1px solid #2d2e35", borderRadius: 1.5, bgcolor: "#17181e", backgroundImage: "linear-gradient(#ffffff05 1px, transparent 1px), linear-gradient(90deg, #ffffff05 1px, transparent 1px)", backgroundSize: "24px 24px", display: "grid", placeItems: "center" }}>
					<Typography role="status" color="grey.300">Đang tải bộ dựng 3D…</Typography>
				</Box>
			</Stack>
		</Stack>
	);
}
