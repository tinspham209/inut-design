import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import { UploadedImage } from "../types";
import {
	ACCEPTED_TYPES,
	MAX_FILE_SIZE,
	RECOMMENDED_WIDTH,
	RECOMMENDED_HEIGHT,
	WARNING_COLOR,
} from "../constants";
import { Box, Typography } from "@mui/material";
import React from "react";

export const useImageUploader = (onUpload?: (image: UploadedImage) => void) => {
	const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);

	const clearImage = useCallback(() => {
		if (uploadedImage) {
			URL.revokeObjectURL(uploadedImage.url);
		}
		setUploadedImage(null);
	}, [uploadedImage]);

	const validateAndProcessFile = useCallback(
		async (file: File) => {
			if (!ACCEPTED_TYPES.includes(file.type)) {
				toast.error("Chỉ chấp nhận file PNG, JPG, WEBP");
				return;
			}

			if (file.size > MAX_FILE_SIZE) {
				toast.error(`File quá lớn (tối đa 10 MB)`);
				return;
			}

			const url = URL.createObjectURL(file);
			const img = new window.Image();

			img.onload = () => {
				const { naturalWidth: width, naturalHeight: height } = img;

				if (width < RECOMMENDED_WIDTH || height < RECOMMENDED_HEIGHT) {
					toast(
						(t) => (
							<Box>
								<Typography variant="body2" fontWeight="bold" color={WARNING_COLOR}>
									Độ phân giải thấp
								</Typography>
								<Typography variant="caption">
									Khuyến nghị: {RECOMMENDED_WIDTH}×{RECOMMENDED_HEIGHT} px trở lên
								</Typography>
							</Box>
						),
						{
							icon: "⚠️",
							style: {
								background: "#1a1916",
								color: "#fff",
								border: `1px solid ${WARNING_COLOR}`,
							},
						}
					);
				}

				const newImage = {
					file,
					url,
					width,
					height,
					size: file.size,
				};

				setUploadedImage(newImage);
				if (onUpload) onUpload(newImage);
			};

			img.onerror = () => {
				URL.revokeObjectURL(url);
				toast.error("Không thể đọc file ảnh");
			};

			img.src = url;
		},
		[onUpload]
	);

	return {
		uploadedImage,
		setUploadedImage,
		clearImage,
		validateAndProcessFile,
	};
};
