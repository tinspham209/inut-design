import { Box, Typography } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { LighterTransform, UploadedImage } from "./types";
import { FRAME_WIDTH, FRAME_HEIGHT, ACCENT_COLOR, PRIMARY_COLOR } from "./constants";

interface ImagePositionPreviewProps {
	uploadedImage: UploadedImage | null;
	transform: LighterTransform;
	onPositionChange: (x: number, y: number) => void;
}

const VIEWPORT_SCALE = 0.22;

export function ImagePositionPreview({
	uploadedImage,
	transform,
	onPositionChange,
}: ImagePositionPreviewProps) {
	const { scrollX, scrollY, rotation, scale } = transform;
	const containerRef = useRef<HTMLDivElement>(null);
	const isDragging = useRef(false);
	const startPos = useRef({ x: 0, y: 0 });
	const startScroll = useRef({ x: 0, y: 0 });

	const previewWidth = FRAME_WIDTH * VIEWPORT_SCALE;
	const previewHeight = FRAME_HEIGHT * VIEWPORT_SCALE;
	const [viewportSize, setViewportSize] = useState({ width: previewWidth, height: previewHeight });

	useEffect(() => {
		const updateViewportSize = () => {
			const width = containerRef.current?.clientWidth || previewWidth;
			const height = containerRef.current?.clientHeight || previewHeight;
			setViewportSize({ width, height });
		};

		updateViewportSize();
		window.addEventListener("resize", updateViewportSize);

		return () => {
			window.removeEventListener("resize", updateViewportSize);
		};
	}, [previewWidth, previewHeight]);

	const handleStart = (clientX: number, clientY: number) => {
		if (!uploadedImage) return;
		isDragging.current = true;
		startPos.current = { x: clientX, y: clientY };
		startScroll.current = { x: scrollX, y: scrollY };
		document.body.style.cursor = "grabbing";
	};

	const handleMove = useCallback(
		(clientX: number, clientY: number) => {
			if (!isDragging.current || !uploadedImage) return;

			// Translate movement into coordinate changes
			const deltaX = (clientX - startPos.current.x) / viewportSize.width;
			const deltaY = (clientY - startPos.current.y) / viewportSize.height;

			onPositionChange(startScroll.current.x - deltaX, startScroll.current.y + deltaY);
		},
		[onPositionChange, uploadedImage, viewportSize.height, viewportSize.width]
	);

	const handleEnd = () => {
		isDragging.current = false;
		document.body.style.cursor = "default";
	};

	const handleMouseDown = (e: React.MouseEvent) => {
		handleStart(e.clientX, e.clientY);
	};

	const handleTouchStart = (e: React.TouchEvent) => {
		const touch = e.touches[0];
		if (touch) {
			handleStart(touch.clientX, touch.clientY);
		}
	};

	useEffect(() => {
		const handleMouseMoveGlobal = (e: MouseEvent) => {
			handleMove(e.clientX, e.clientY);
		};

		const handleTouchMoveGlobal = (e: TouchEvent) => {
			const touch = e.touches[0];
			if (touch && isDragging.current) {
				// Prevent page scrolling while dragging image
				if (e.cancelable) e.preventDefault();
				handleMove(touch.clientX, touch.clientY);
			}
		};

		const handleEndGlobal = () => {
			handleEnd();
		};

		window.addEventListener("mousemove", handleMouseMoveGlobal);
		window.addEventListener("mouseup", handleEndGlobal);
		window.addEventListener("touchmove", handleTouchMoveGlobal, { passive: false });
		window.addEventListener("touchend", handleEndGlobal);
		window.addEventListener("touchcancel", handleEndGlobal);

		return () => {
			window.removeEventListener("mousemove", handleMouseMoveGlobal);
			window.removeEventListener("mouseup", handleEndGlobal);
			window.removeEventListener("touchmove", handleTouchMoveGlobal);
			window.removeEventListener("touchend", handleEndGlobal);
			window.removeEventListener("touchcancel", handleEndGlobal);
		};
	}, [handleMove]);

	// Calculate image natural size scaled for preview.
	// Use the ACTUAL container pixel width (viewportSize.width) divided by FRAME_WIDTH
	// so scale=N in the preview matches scale=N on the 3D canvas exactly.
	// VIEWPORT_SCALE is only a fallback during SSR / before the first resize fires.
	const viewportActualScale =
		viewportSize.width > 0 ? viewportSize.width / FRAME_WIDTH : VIEWPORT_SCALE;
	const imageNaturalPreviewWidth = (uploadedImage?.width || 0) * viewportActualScale;
	const imageNaturalPreviewHeight = (uploadedImage?.height || 0) * viewportActualScale;

	return (
		<Box>
			<Typography
				component="div"
				sx={{
					fontSize: "10px",
					fontFamily: '"Syne", sans-serif',
					fontWeight: 700,
					letterSpacing: "0.12em",
					textTransform: "uppercase",
					color: "#7a7870",
				}}
			>
				Vị trí thiết kế (Kéo để điều chỉnh)
			</Typography>

			<Box
				ref={containerRef}
				onMouseDown={handleMouseDown}
				onTouchStart={handleTouchStart}
				sx={{
					width: "100%",
					maxWidth: previewWidth,
					aspectRatio: `${FRAME_WIDTH}/${FRAME_HEIGHT}`,
					bgcolor: PRIMARY_COLOR, // Match canvas background so uncovered areas are obvious
					border: "1px solid #2c2b28",
					borderRadius: 1,
					position: "relative",
					overflow: "hidden",
					cursor: uploadedImage ? "grab" : "default",
					mx: "auto",
					mt: 1,
					touchAction: "none", // Prevent browser handling of touch gestures
				}}
			>
				{uploadedImage && (
					<Box
						sx={{
							position: "absolute",
							// Center by default
							left: "50%",
							top: "50%",
							width: imageNaturalPreviewWidth,
							height: imageNaturalPreviewHeight,
							backgroundImage: `url(${uploadedImage.url})`,
							backgroundSize: "contain",
							backgroundRepeat: "no-repeat",
							transformOrigin: "center center",
							// Combine translation (scrollX/Y), scale, and rotation
							transform: `
                translate(-50%, -50%)
								translate(${-scrollX * viewportSize.width}px, ${scrollY * viewportSize.height}px)
                scale(${scale})
                rotate(${rotation + 180}deg)
              `,
							opacity: 0.9,
							transition: isDragging.current ? "none" : "transform 0.1s ease-out",
						}}
					/>
				)}

				{/* Frame Overlay */}
				<Box
					sx={{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						border: `2px solid ${ACCENT_COLOR}`,
						pointerEvents: "none",
						zIndex: 1,
						"&::after": {
							content: `"${FRAME_WIDTH}x${FRAME_HEIGHT} px"`,
							position: "absolute",
							top: -20,
							right: 0,
							fontSize: "10px",
							color: ACCENT_COLOR,
							fontWeight: "bold",
						},
					}}
				/>
			</Box>
		</Box>
	);
}
