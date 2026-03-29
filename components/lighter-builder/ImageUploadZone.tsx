import { Box, Typography } from "@mui/material";
import { useCallback, useRef, useState } from "react";
import { UploadedImage } from "./types";
import { ACCEPTED_TYPES, ACCENT_COLOR, MAX_FILE_SIZE } from "./constants";

// Design tokens
const T = {
	surface2: "#1a1916",
	surface3: "#242220",
	border: "#2c2b28",
	borderLight: "#3a3936",
	orange: "#FF4D00",
	orangeDim: "rgba(255,77,0,0.15)",
	white: "#f5f3ee",
	whiteDim: "rgba(245,243,238,0.55)",
	muted: "#7a7870",
	radius: "8px",
	tr: "200ms cubic-bezier(0.4,0,0.2,1)",
};

interface ImageUploadZoneProps {
	onImageUpload: (file: File) => void;
	onClear: () => void;
	uploadedImage: UploadedImage | null;
}

export function ImageUploadZone({ onImageUpload, onClear, uploadedImage }: ImageUploadZoneProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isDragging, setIsDragging] = useState(false);

	const handleFileSelect = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (file) {
				onImageUpload(file);
			}
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		},
		[onImageUpload]
	);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			setIsDragging(false);
			const file = e.dataTransfer.files?.[0];
			if (file) {
				onImageUpload(file);
			}
		},
		[onImageUpload]
	);

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	}, []);

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
	}, []);

	const handleClick = useCallback(() => {
		fileInputRef.current?.click();
	}, []);

	const formatFileSize = (bytes: number) => {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	};

	if (uploadedImage) {
		return (
			<Box>
				<input
					ref={fileInputRef}
					type="file"
					accept={ACCEPTED_TYPES.join(",")}
					onChange={handleFileSelect}
					style={{ display: "none" }}
				/>

				{/* Preview card
				<Box
					sx={{
						borderRadius: T.radius,
						overflow: "hidden",
						border: `1px solid ${T.border}`,
						mb: "10px",
						bgcolor: T.surface2,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						minHeight: "80px",
					}}
				>
					<Box
						component="img"
						src={uploadedImage.url}
						alt={uploadedImage.file.name}
						sx={{ maxWidth: "100%", maxHeight: "140px", objectFit: "contain", display: "block" }}
					/>
				</Box> */}

				{/* Metadata */}
				<Typography sx={{ fontSize: "11px", color: T.muted, mb: "10px", lineHeight: 1.5 }}>
					<Box component="strong" sx={{ color: T.whiteDim, fontWeight: 500 }}>
						{uploadedImage.file.name}
					</Box>
					<br />
					{uploadedImage.width} × {uploadedImage.height} px · {formatFileSize(uploadedImage.size)}
				</Typography>

				{/* Action buttons */}
				<Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
					<Box
						component="button"
						onClick={handleClick}
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							gap: "6px",
							py: "9px",
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
						<svg
							width="12"
							height="12"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
						>
							<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
						</svg>
						Thay ảnh
					</Box>
					<Box
						component="button"
						onClick={onClear}
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							gap: "6px",
							py: "9px",
							borderRadius: T.radius,
							bgcolor: "rgba(220,38,38,0.12)",
							color: "#f87171",
							border: "1px solid rgba(220,38,38,0.25)",
							fontSize: "12px",
							fontFamily: '"Syne", sans-serif',
							fontWeight: 700,
							letterSpacing: "0.05em",
							cursor: "pointer",
							transition: `background ${T.tr}`,
							"&:hover": { bgcolor: "rgba(220,38,38,0.2)" },
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
							<polyline points="3 6 5 6 21 6" />
							<path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" />
						</svg>
						Xóa ảnh
					</Box>
				</Box>
			</Box>
		);
	}

	return (
		<Box>
			{/* Dropzone */}
			<Box
				onClick={handleClick}
				onDrop={handleDrop}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				sx={{
					border: `1.5px dashed ${isDragging ? T.orange : T.borderLight}`,
					borderRadius: T.radius,
					py: "28px",
					px: "16px",
					textAlign: "center",
					cursor: "pointer",
					bgcolor: isDragging ? T.orangeDim : T.surface2,
					transition: `border-color ${T.tr}, background ${T.tr}`,
					"&:hover": {
						borderColor: T.orange,
						bgcolor: T.orangeDim,
					},
				}}
			>
				{/* Upload icon circle */}
				<Box
					sx={{
						width: "36px",
						height: "36px",
						borderRadius: "50%",
						bgcolor: T.surface3,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						mx: "auto",
						mb: "10px",
						color: T.orange,
					}}
				>
					<svg
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.8"
					>
						<path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
					</svg>
				</Box>

				<Typography sx={{ fontSize: "13px", color: T.whiteDim, lineHeight: 1.5 }}>
					{isDragging ? (
						"Thả file vào đây"
					) : (
						<>
							Kéo thả ảnh vào đây
							<br />
							hoặc{" "}
							<Box component="span" sx={{ color: T.orange, fontWeight: 500 }}>
								nhấp để chọn file
							</Box>
						</>
					)}
				</Typography>
				<Typography sx={{ display: "block", mt: "6px", fontSize: "11px", color: T.muted }}>
					PNG · JPG · WEBP · tối đa 10 MB
				</Typography>
			</Box>

			<input
				ref={fileInputRef}
				type="file"
				accept={ACCEPTED_TYPES.join(",")}
				onChange={handleFileSelect}
				style={{ display: "none" }}
			/>
		</Box>
	);
}
