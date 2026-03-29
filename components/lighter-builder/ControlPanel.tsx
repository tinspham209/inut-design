import { Box, Dialog, DialogContent, Slider, Typography } from "@mui/material";
import { useState } from "react";
import { ImageUploadZone } from "./ImageUploadZone";
import { ImagePositionPreview } from "./ImagePositionPreview";
import { LighterTransform, UploadedImage } from "./types";
import { RECOMMENDED_HEIGHT, RECOMMENDED_WIDTH } from "./constants";

// ── Design tokens (matching prototype) ──────────
const T = {
	bg: "#080706",
	surface: "#100f0d",
	surface2: "#1a1916",
	surface3: "#242220",
	border: "#2c2b28",
	borderLight: "#3a3936",
	orange: "#FF4D00",
	orangeDim: "rgba(255,77,0,0.15)",
	yellow: "#FFE234",
	white: "#f5f3ee",
	whiteDim: "rgba(245,243,238,0.55)",
	muted: "#7a7870",
	radius: "8px",
	tr: "200ms cubic-bezier(0.4,0,0.2,1)",
};

interface ControlPanelProps {
	uploadedImage: UploadedImage | null;
	transform: LighterTransform;
	onImageUpload: (file: File) => void;
	onClear: () => void;
	onPositionChange: (x: number, y: number) => void;
	onRotationChange: (value: number) => void;
	onScaleChange: (value: number) => void;
	onReset: () => void;
	onNext: () => void;
	isLoading?: boolean;
}

export function ControlPanel({
	uploadedImage,
	transform,
	onImageUpload,
	onClear,
	onPositionChange,
	onRotationChange,
	onScaleChange,
	onReset,
	onNext,
	isLoading = false,
}: ControlPanelProps) {
	const [confirmOpen, setConfirmOpen] = useState(false);
	// active control tab: rotation | scale | x | y
	const [activeCtrl, setActiveCtrl] = useState<"rotation" | "scale" | "x" | "y">("rotation");
	const { rotation, scale, scrollX, scrollY } = transform;
	const isLowResolution =
		uploadedImage &&
		(uploadedImage.width < RECOMMENDED_WIDTH || uploadedImage.height < RECOMMENDED_HEIGHT);

	// Section label
	const SectionLabel = ({ children }: { children: React.ReactNode }) => (
		<Typography
			component="div"
			sx={{
				fontSize: "10px",
				fontFamily: '"Syne", sans-serif',
				fontWeight: 700,
				letterSpacing: "0.12em",
				textTransform: "uppercase",
				color: T.muted,
				mb: "8px",
			}}
		>
			{children}
		</Typography>
	);

	const Divider = () => (
		<Box component="hr" sx={{ border: "none", borderTop: `1px solid ${T.border}`, my: "8px" }} />
	);

	// Styled slider sx
	const sliderSx = {
		color: T.orange,
		height: 4,
		"& .MuiSlider-thumb": {
			width: 16,
			height: 16,
			boxShadow: "0 0 0 3px rgba(255,77,0,0.2)",
			"&:hover": { boxShadow: "0 0 0 5px rgba(255,77,0,0.3)" },
		},
		"& .MuiSlider-rail": { bgcolor: T.borderLight },
		"& .MuiSlider-track": { border: "none" },
	};

	const handleNextClick = () => {
		if (uploadedImage && !isLoading) {
			setConfirmOpen(true);
		}
	};

	const handleConfirm = () => {
		setConfirmOpen(false);
		onNext();
	};

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				// Desktop: fill full column height and clip scroll to panel only
				// Mobile: natural height, border-top separates from canvas
				borderLeft: { md: `1px solid ${T.border}` },
				borderTop: { xs: `1px solid ${T.border}`, md: "none" },
				bgcolor: T.surface,
				height: { md: "100%" },
				overflow: { md: "hidden" },
			}}
		>
			{/* ── SINGLE SCROLLABLE CONTENT (no tabs) ── */}
			<Box
				sx={{
					flex: 1,
					overflowY: { md: "auto" },
					overflowX: "hidden",
					"&::-webkit-scrollbar": { width: "4px" },
					"&::-webkit-scrollbar-track": { bgcolor: "transparent" },
					"&::-webkit-scrollbar-thumb": { bgcolor: T.border, borderRadius: "2px" },
				}}
			>
				<Box sx={{ p: "8px" }}>
					{/* ── Upload section ── */}
					<Box sx={{ mb: "8px", mt: "8px" }}>
						<SectionLabel>Ảnh thiết kế</SectionLabel>
						<ImageUploadZone
							onImageUpload={onImageUpload}
							onClear={onClear}
							uploadedImage={uploadedImage}
						/>
					</Box>

					{/* ── Low resolution warning ── */}
					{isLowResolution && (
						<Box
							sx={{
								display: "flex",
								gap: "8px",
								alignItems: "flex-start",
								bgcolor: "rgba(255,226,52,0.08)",
								border: `1px solid rgba(255,226,52,0.25)`,
								borderRadius: "6px",
								p: "8px 10px",
								mb: "8px",
							}}
						>
							<svg
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke={T.yellow}
								strokeWidth="2"
								style={{ flexShrink: 0, marginTop: 1 }}
							>
								<path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" />
							</svg>
							<Typography sx={{ fontSize: "12px", color: T.yellow, lineHeight: 1.5 }}>
								Độ phân giải thấp. Nên dùng ảnh từ{" "}
								<strong>
									{RECOMMENDED_WIDTH}px×{RECOMMENDED_HEIGHT}px
								</strong>{" "}
								trở lên để in đẹp nhất.
							</Typography>
						</Box>
					)}

					{/* ── Adjustments (only when image uploaded) ── */}
					{uploadedImage && (
						<>
							<Divider />

							{/* Position preview — drag-and-drop */}
							<Box sx={{ mb: "8px" }}>
								<ImagePositionPreview
									uploadedImage={uploadedImage}
									transform={transform}
									onPositionChange={onPositionChange}
								/>
								<Typography sx={{ fontSize: "11px", color: T.muted, mt: "6px" }}></Typography>
								<Typography
									variant="caption"
									color="rgba(245,243,238,0.55)"
									sx={{ display: "block", textAlign: "center", mt: 1 }}
								>
									Rot: {rotation + 180}° | Scale: {scale.toFixed(2)} | X: {scrollX.toFixed(2)} | Y:{" "}
									{scrollY.toFixed(2)}
								</Typography>
							</Box>

							<Divider />

							{/* ── 4-tab control switcher ── */}
							<SectionLabel>Điều chỉnh chi tiết</SectionLabel>

							{/* Tab strip */}
							<Box
								sx={{
									display: "grid",
									gridTemplateColumns: "repeat(4, 1fr)",
									gap: "4px",
									mb: "8px",
								}}
							>
								{(
									[
										{ key: "rotation", label: "Xoay" },
										{ key: "scale", label: "Thu phóng" },
										{ key: "x", label: "Dịch ngang" },
										{ key: "y", label: "Dịch dọc" },
									] as const
								).map(({ key, label }) => (
									<Box
										key={key}
										component="button"
										onClick={() => setActiveCtrl(key)}
										sx={{
											py: "7px",
											px: "2px",
											borderRadius: "6px",
											bgcolor: activeCtrl === key ? T.orange : T.surface3,
											color: activeCtrl === key ? "#fff" : T.muted,
											border:
												activeCtrl === key ? `1px solid ${T.orange}` : `1px solid ${T.border}`,
											fontSize: "10px",
											fontFamily: '"Syne", sans-serif',
											fontWeight: 700,
											letterSpacing: "0.04em",
											textAlign: "center",
											cursor: "pointer",
											transition: `background ${T.tr}, color ${T.tr}`,
											"&:hover":
												activeCtrl === key ? {} : { color: T.whiteDim, borderColor: T.borderLight },
											"&:active": { transform: "scale(0.96)" },
										}}
									>
										{label}
									</Box>
								))}
							</Box>

							{/* Single active slider */}
							<Box>
								{/* Rotation */}
								{activeCtrl === "rotation" && (
									<Box>
										<Box
											sx={{
												display: "flex",
												justifyContent: "space-between",
												alignItems: "center",
												mb: "8px",
											}}
										>
											<Typography sx={{ fontSize: "12px", color: T.whiteDim }}>Góc xoay</Typography>
											<Typography
												sx={{
													fontFamily: '"Syne", sans-serif',
													fontSize: "12px",
													fontWeight: 700,
													color: T.orange,
													minWidth: "42px",
													textAlign: "right",
												}}
											>
												{rotation + 180}°
											</Typography>
										</Box>
										<Slider
											value={rotation + 180}
											onChange={(_, v) => onRotationChange((v as number) - 180)}
											min={0}
											max={360}
											step={1}
											sx={sliderSx}
										/>
									</Box>
								)}

								{/* Scale */}
								{activeCtrl === "scale" && (
									<Box>
										<Box
											sx={{
												display: "flex",
												justifyContent: "space-between",
												alignItems: "center",
												mb: "8px",
											}}
										>
											<Typography sx={{ fontSize: "12px", color: T.whiteDim }}>
												Tỉ lệ hiển thị
											</Typography>
											<Typography
												sx={{
													fontFamily: '"Syne", sans-serif',
													fontSize: "12px",
													fontWeight: 700,
													color: T.orange,
													minWidth: "42px",
													textAlign: "right",
												}}
											>
												{Math.round(scale * 100)}%
											</Typography>
										</Box>
										<Slider
											value={scale}
											onChange={(_, v) => onScaleChange(v as number)}
											min={0.1}
											max={3}
											step={0.01}
											sx={sliderSx}
										/>
									</Box>
								)}

								{/* Scroll X — horizontal shift */}
								{activeCtrl === "x" && (
									<Box>
										<Box
											sx={{
												display: "flex",
												justifyContent: "space-between",
												alignItems: "center",
												mb: "8px",
											}}
										>
											<Typography sx={{ fontSize: "12px", color: T.whiteDim }}>
												Dịch ngang (trái ↔ phải)
											</Typography>
											<Typography
												sx={{
													fontFamily: '"Syne", sans-serif',
													fontSize: "12px",
													fontWeight: 700,
													color: T.orange,
													minWidth: "42px",
													textAlign: "right",
												}}
											>
												{scrollX.toFixed(2)}
											</Typography>
										</Box>
										<Slider
											value={scrollX}
											onChange={(_, v) => onPositionChange(v as number, scrollY)}
											min={-1.5}
											max={1.5}
											step={0.01}
											sx={sliderSx}
										/>
									</Box>
								)}

								{/* Scroll Y — vertical shift */}
								{activeCtrl === "y" && (
									<Box>
										<Box
											sx={{
												display: "flex",
												justifyContent: "space-between",
												alignItems: "center",
												mb: "8px",
											}}
										>
											<Typography sx={{ fontSize: "12px", color: T.whiteDim }}>
												Dịch dọc (lên ↕ xuống)
											</Typography>
											<Typography
												sx={{
													fontFamily: '"Syne", sans-serif',
													fontSize: "12px",
													fontWeight: 700,
													color: T.orange,
													minWidth: "42px",
													textAlign: "right",
												}}
											>
												{scrollY.toFixed(2)}
											</Typography>
										</Box>
										<Slider
											value={scrollY}
											onChange={(_, v) => onPositionChange(scrollX, v as number)}
											min={-1.5}
											max={1.5}
											step={0.01}
											sx={sliderSx}
										/>
									</Box>
								)}
							</Box>

							{/* Reset */}
							<Box
								component="button"
								onClick={onReset}
								sx={{
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									gap: "6px",
									width: "100%",
									py: "8px",
									borderRadius: T.radius,
									bgcolor: T.surface3,
									color: T.whiteDim,
									border: `1px solid ${T.border}`,
									fontSize: "12px",
									fontFamily: '"Syne", sans-serif',
									fontWeight: 700,
									letterSpacing: "0.05em",
									cursor: "pointer",
									mt: "8px",
									transition: `background ${T.tr}, color ${T.tr}`,
									"&:hover": { bgcolor: T.border, color: T.white },
									"&:active": { transform: "scale(0.97)" },
								}}
							>
								<svg
									width="12"
									height="12"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								>
									<path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8" />
									<path d="M3 3v5h5" />
								</svg>
								Reset tất cả
							</Box>
						</>
					)}

					{/* ── Resolution hint (always visible) ── */}
					<Typography
						sx={{
							fontSize: "11px",
							color: T.muted,
							textAlign: "center",
							lineHeight: 1.6,
							pt: uploadedImage ? "18px" : "10px",
							pb: "4px",
						}}
					>
						Để in đẹp nhất, dùng ảnh{" "}
						<Box component="strong" sx={{ color: T.whiteDim }}>
							{RECOMMENDED_WIDTH}×{RECOMMENDED_HEIGHT}px
						</Box>{" "}
						trở lên
					</Typography>
				</Box>
			</Box>

			{/* ── SUBMIT AREA — sticky on mobile, static on desktop ── */}
			<Box
				sx={{
					p: "16px",
					borderTop: `1px solid ${T.border}`,
					bgcolor: T.surface,
					flexShrink: 0,
					// Keep visible at bottom of screen while user scrolls on mobile
					position: { xs: "sticky", md: "static" },
					bottom: 0,
					zIndex: 10,
				}}
			>
				<Box
					component="button"
					onClick={handleNextClick}
					disabled={!uploadedImage || isLoading}
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						gap: "6px",
						width: "100%",
						py: "11px",
						borderRadius: T.radius,
						bgcolor: !uploadedImage || isLoading ? "rgba(255,77,0,0.25)" : T.orange,
						color: !uploadedImage || isLoading ? "rgba(255,255,255,0.35)" : "#fff",
						border: "none",
						fontSize: "12px",
						fontFamily: '"Syne", sans-serif',
						fontWeight: 700,
						letterSpacing: "0.05em",
						cursor: !uploadedImage || isLoading ? "not-allowed" : "pointer",
						transition: `background ${T.tr}`,
						"&:hover": !uploadedImage || isLoading ? {} : { bgcolor: "#e04400" },
						"&:active": !uploadedImage || isLoading ? {} : { transform: "scale(0.97)" },
					}}
				>
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
					>
						<line x1="22" y1="2" x2="11" y2="13" />
						<polygon points="22 2 15 22 11 13 2 9 22 2" />
					</svg>
					{isLoading ? "Đang xử lý..." : "Tiếp theo"}
				</Box>
				<Typography sx={{ fontSize: "11px", color: T.muted, textAlign: "center", mt: "8px" }}>
					{uploadedImage ? (
						<>
							Chuyển đến{" "}
							<Box component="span" sx={{ color: T.orange }}>
								trang giỏ hàng
							</Box>{" "}
							và kiểm tra lại đơn hàng
						</>
					) : (
						"Tải ảnh thiết kế lên để tiếp tục"
					)}
				</Typography>
			</Box>

			{/* ── CONFIRM MODAL ── */}
			<Dialog
				open={confirmOpen}
				onClose={() => setConfirmOpen(false)}
				PaperProps={{
					sx: {
						bgcolor: T.surface2,
						border: `1px solid ${T.border}`,
						borderRadius: "12px",
						maxWidth: "340px",
						width: "calc(100% - 32px)",
						m: 2,
					},
				}}
				BackdropProps={{
					sx: { bgcolor: "rgba(8,7,6,0.85)" },
				}}
			>
				<DialogContent sx={{ p: "36px 32px", textAlign: "center" }}>
					{/* Icon */}
					<Box
						sx={{
							width: 56,
							height: 56,
							borderRadius: "50%",
							bgcolor: "rgba(255,77,0,0.1)",
							border: `1px solid rgba(255,77,0,0.3)`,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							mx: "auto",
							mb: "16px",
							color: T.orange,
						}}
					>
						<svg
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.8"
						>
							<path d="M9 12l2 2 4-4" />
							<circle cx="12" cy="12" r="9" />
						</svg>
					</Box>

					{/* Title */}
					<Typography
						sx={{
							fontFamily: '"Syne", sans-serif',
							fontSize: "17px",
							fontWeight: 800,
							color: T.white,
							mb: "8px",
						}}
					>
						Xác nhận thiết kế?
					</Typography>

					{/* Body */}
					<Typography
						sx={{
							fontSize: "13px",
							color: T.whiteDim,
							lineHeight: 1.6,
							mb: "24px",
						}}
					>
						Bạn đã chắc chắn với mẫu thiết kế này và muốn chuyển đến{" "}
						<Box component="strong" sx={{ color: T.orange }}>
							trang đặt hàng
						</Box>
						?
					</Typography>

					{/* Actions */}
					<Box sx={{ display: "flex", gap: "10px" }}>
						{/* Cancel */}
						<Box
							component="button"
							onClick={() => setConfirmOpen(false)}
							sx={{
								flex: 1,
								py: "10px",
								borderRadius: T.radius,
								bgcolor: T.surface3,
								color: T.whiteDim,
								border: `1px solid ${T.border}`,
								fontSize: "12px",
								fontFamily: '"Syne", sans-serif',
								fontWeight: 700,
								letterSpacing: "0.05em",
								cursor: "pointer",
								transition: `background ${T.tr}`,
								"&:hover": { bgcolor: T.border, color: T.white },
								"&:active": { transform: "scale(0.97)" },
							}}
						>
							← Xem lại
						</Box>

						{/* Confirm */}
						<Box
							component="button"
							onClick={handleConfirm}
							sx={{
								flex: 1,
								py: "10px",
								borderRadius: T.radius,
								bgcolor: T.orange,
								color: "#fff",
								border: "none",
								fontSize: "12px",
								fontFamily: '"Syne", sans-serif',
								fontWeight: 700,
								letterSpacing: "0.05em",
								cursor: "pointer",
								transition: `background ${T.tr}`,
								"&:hover": { bgcolor: "#e04400" },
								"&:active": { transform: "scale(0.97)" },
							}}
						>
							Đặt hàng →
						</Box>
					</Box>
				</DialogContent>
			</Dialog>
		</Box>
	);
}
