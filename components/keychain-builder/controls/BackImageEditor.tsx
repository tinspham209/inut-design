import { Button, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import type { ImageFace, ImageTransform } from "../types";

type Props = {
	face?: ImageFace;
	frameAspect: number;
	status: "idle" | "uploading" | "error";
	error?: string | null;
	onChange: (transform: ImageTransform) => void;
	onReset: () => void;
	onDiscard: () => void;
};

const initialTransform: ImageTransform = { xMm: 0, yMm: 0, scale: 1, rotation: 0, flipX: false };

export function getImageCropPercent(imageAspect: number, frameAspect: number) {
	if (!Number.isFinite(imageAspect) || !Number.isFinite(frameAspect) || imageAspect <= 0 || frameAspect <= 0) return 0;
	return Math.round((1 - Math.min(imageAspect, frameAspect) / Math.max(imageAspect, frameAspect)) * 100);
}

export function BackImageEditor({ face, frameAspect, status, error, onChange, onReset, onDiscard }: Props) {
	const [cropPercent, setCropPercent] = useState(0);
	const url = face?.useProcessed && face.processedUrl ? face.processedUrl : face?.url;
	useEffect(() => {
		if (!url) { setCropPercent(0); return; }
		let active = true;
		const image = new Image();
		image.onload = () => {
			if (!active || !image.naturalWidth || !image.naturalHeight) return;
			const imageAspect = image.naturalWidth / image.naturalHeight;
			setCropPercent(getImageCropPercent(imageAspect, frameAspect));
		};
		image.onerror = () => { if (active) setCropPercent(0); };
		image.src = url;
		return () => { active = false; image.src = ""; };
	}, [frameAspect, url]);

	if (!face || !url) return null;
	const localOnly = url.startsWith("blob:") || url.startsWith("data:");
	const transform = face.transform || initialTransform;
	const setScale = (scale: number) => onChange({ ...transform, scale: Math.max(0.25, Math.min(12, scale)) });
	return <Stack spacing={0.5} sx={{ mt: 0.75, p: 1, border: "1px solid #34353d", borderRadius: 1.25, bgcolor: "#1b1c22" }}>
		<Typography variant="caption" color="grey.300">Chỉnh riêng ảnh mặt sau</Typography>
		<Typography variant="caption" color={localOnly ? "warning.light" : cropPercent >= 30 ? "warning.light" : "grey.400"} role="status">
			{status === "uploading" ? "Đang tải ảnh sau lên; chưa thể Export." : localOnly ? "Ảnh tạm chưa lưu trên Sanity. Tải lại ảnh hoặc gỡ bản tạm để khôi phục." : cropPercent >= 30 ? `Ảnh giữ nguyên tỷ lệ; ước tính crop ${cropPercent}% để phủ vùng in.` : `Ảnh giữ nguyên tỷ lệ và phủ vùng in (ước tính crop ${cropPercent}%).`}
		</Typography>
		{error && <Typography variant="caption" color="error.light">{error}</Typography>}
		<Stack direction="row" flexWrap="wrap" gap={0.5}>
			<Button aria-label="Thu nhỏ ảnh mặt sau" onClick={() => setScale(transform.scale / 1.1)} sx={{ minWidth: 44, minHeight: 44 }}>−</Button>
			<Button aria-label="Phóng to ảnh mặt sau" onClick={() => setScale(transform.scale * 1.1)} sx={{ minWidth: 44, minHeight: 44 }}>+</Button>
			<Button aria-label="Xoay ảnh mặt sau" onClick={() => onChange({ ...transform, rotation: (transform.rotation + 90) % 360 })} sx={{ minWidth: 44, minHeight: 44 }}>↻</Button>
			<Button aria-label="Lật ảnh mặt sau" aria-pressed={transform.flipX} onClick={() => onChange({ ...transform, flipX: !transform.flipX })} sx={{ minWidth: 44, minHeight: 44 }}>⇋</Button>
			<Button onClick={onReset} sx={{ minHeight: 44 }}>Đặt lại vị trí</Button>
			{localOnly && <Button color="warning" onClick={onDiscard} sx={{ minHeight: 44 }}>Gỡ ảnh tạm</Button>}
		</Stack>
	</Stack>;
}
