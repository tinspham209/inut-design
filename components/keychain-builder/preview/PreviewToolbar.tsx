import { Fragment } from "react";
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FlipIcon from "@mui/icons-material/Flip";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import RemoveIcon from "@mui/icons-material/Remove";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import Rotate90DegreesCcwIcon from "@mui/icons-material/Rotate90DegreesCcw";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";

type PreviewToolbarProps = {
	artworkLabel: string;
	fullScreen: boolean;
	disabled?: boolean;
	onArtworkRotate: () => void;
	onArtworkFlip: () => void;
	onArtworkZoomOut: () => void;
	onArtworkZoomIn: () => void;
	onArtworkReset: () => void;
	onViewZoomOut: () => void;
	onViewZoomIn: () => void;
	onViewReset: () => void;
	onFullScreenToggle: () => void;
};

export function PreviewToolbar({ artworkLabel, fullScreen, disabled = false, onArtworkRotate, onArtworkFlip, onArtworkZoomOut, onArtworkZoomIn, onArtworkReset, onViewZoomOut, onViewZoomIn, onViewReset, onFullScreenToggle }: PreviewToolbarProps) {
	const tools = [
		{ label: "Thu nhỏ góc nhìn", icon: <ZoomOutIcon />, action: onViewZoomOut },
		{ label: "Phóng to góc nhìn", icon: <ZoomInIcon />, action: onViewZoomIn },
		{ label: "Đặt lại góc nhìn", icon: <RestartAltIcon />, action: onViewReset },
		{ label: fullScreen ? "Thoát toàn màn hình" : "Toàn màn hình", icon: fullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />, action: onFullScreenToggle },
		{ label: `Xoay ${artworkLabel} 90°`, icon: <Rotate90DegreesCcwIcon />, action: onArtworkRotate },
		{ label: `Lật ${artworkLabel}`, icon: <FlipIcon />, action: onArtworkFlip },
		{ label: `Thu nhỏ ${artworkLabel}`, icon: <RemoveIcon />, action: onArtworkZoomOut },
		{ label: `Phóng to ${artworkLabel}`, icon: <AddIcon />, action: onArtworkZoomIn },
		{ label: `Đặt lại ${artworkLabel}`, icon: <RestartAltIcon />, action: onArtworkReset },
	];

	return (
		<Box
			className="keychain-preview-toolbar"
			sx={{
				width: { xs: "100%", md: 32 },
				flex: { xs: "0 0 auto", md: "0 0 32px" },
				py: { xs: 0, md: 0.25 },
				display: "grid",
				gridTemplateColumns: { xs: "repeat(5, 32px)", md: "32px" },
				gap: 0.5,
				justifyContent: { xs: "center", md: "flex-start" },
				alignContent: "start",
				flexShrink: 0,
				"&& .MuiButton-root": {
					width: 32,
					minWidth: 32,
					height: 32,
					minHeight: 32,
					maxHeight: 32,
					p: 0,
					flexShrink: 0,
				},
			}}
		>
			{tools.map((tool, index) => (
				<Fragment key={tool.label}>
					{index === 4 && (
						<Box
							aria-hidden="true"
							sx={{
								gridColumn: "1 / -1",
								justifySelf: "center",
								alignSelf: "center",
								width: { xs: "60%", md: "1px" },
								height: { xs: 1, md: 16 },
								borderTop: { xs: "1px solid #45464e", md: 0 },
								borderLeft: { xs: 0, md: "1px solid #45464e" },
							}}
						/>
					)}
					<Button
						className="keychain-preview-tool"
						title={tool.label}
						aria-label={tool.label}
						disabled={disabled}
						onClick={tool.action}
						sx={{ color: "#c5c6ce", border: "1px solid #34353d", bgcolor: "#22232a", borderRadius: 1 }}
					>
						<Box component="span" sx={{ display: "inline-flex", alignItems: "center", justifyContent: "center", "& > svg": { fontSize: 20 } }}>
							{tool.icon}
						</Box>
					</Button>
				</Fragment>
			))}
		</Box>
	);
}
