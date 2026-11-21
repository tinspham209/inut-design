import { Button, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import type { ImageFace } from "../types";

type Props = {
	face?: ImageFace;
	frameAspect: number;
	status: "idle" | "uploading" | "error";
	error?: string | null;
	onDiscard: () => void;
};

export function getImageCropPercent(imageAspect: number, frameAspect: number) {
	if (!Number.isFinite(imageAspect) || !Number.isFinite(frameAspect) || imageAspect <= 0 || frameAspect <= 0) return 0;
	return Math.round((1 - Math.min(imageAspect, frameAspect) / Math.max(imageAspect, frameAspect)) * 100);
}

export function BackImageStatus({ face, frameAspect, status, error, onDiscard }: Props) {
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

	const localOnly = Boolean(url && (url.startsWith("blob:") || url.startsWith("data:")));
	if (!face && status === "idle" && !error) return null;
	const cropWarning = Boolean(url && cropPercent >= 30);
	if (url && !cropWarning && !localOnly && status === "idle" && !error) return null;
	return <Stack spacing={0.25} role="status" sx={{ mt: 0.5 }}>
		{status === "uploading" && <Typography variant="caption" color="grey.400" role="status">Đang tải ảnh sau lên; chưa thể Export.</Typography>}
		{localOnly && <Typography variant="caption" color="warning.light" role="status">Ảnh tạm chưa lưu trên Sanity. Tải lại ảnh hoặc gỡ bản tạm để khôi phục.</Typography>}
		{cropWarning && <Typography variant="caption" color="warning.light" role="status">Ảnh giữ nguyên tỷ lệ; ước tính crop {cropPercent}% để phủ vùng in.</Typography>}
		{!url && status !== "uploading" && !error && <Typography variant="caption" color="grey.400" role="status">Chưa có ảnh mặt sau đã tải lên.</Typography>}
		{error && <Typography variant="caption" color="error.light">{error}</Typography>}
		{localOnly && <Button color="warning" onClick={onDiscard} sx={{ alignSelf: "flex-start", minHeight: 40 }}>Gỡ ảnh tạm</Button>}
	</Stack>;
}
