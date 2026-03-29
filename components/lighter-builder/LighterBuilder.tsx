import { lightersApi } from "@/api-client/lighters";
import { useLightersCart } from "@/store";
import { trackAddToCart, trackPageView } from "@/utils/analytics";
import { Box } from "@mui/material";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ControlPanel } from "./ControlPanel";
import { LighterCanvas } from "./LighterCanvas";
import {
	CUSTOM_LIGHTER_NAME,
	BACKGROUND_COLOR,
	FRAME_WIDTH,
	FRAME_HEIGHT,
	DEFAULT_TRANSFORM,
} from "./constants";
import { UploadedImage } from "./types";
import { useLighterTransform } from "./hooks/useLighterTransform";
import { useImageUploader } from "./hooks/useImageUploader";

export function LighterBuilder() {
	const router = useRouter();
	const { addItem } = useLightersCart();

	const { transform, updateTransform, resetTransform, setPosition } = useLighterTransform();

	// Auto-scale to fill the frame whenever a new image is uploaded
	const handleAutoScale = useCallback(
		(img: UploadedImage) => {
			const autoScale = Math.max(FRAME_WIDTH / img.width, FRAME_HEIGHT / img.height);
			updateTransform({
				scale: autoScale,
				scrollX: 0,
				scrollY: 0,
				rotation: DEFAULT_TRANSFORM.rotation,
			});
		},
		[updateTransform]
	);

	const { uploadedImage, clearImage, validateAndProcessFile } = useImageUploader(handleAutoScale);

	const [isLoading, setIsLoading] = useState(false);

	// Track page view on mount
	useEffect(() => {
		trackPageView("/builder/lighters", "Lighter Builder");
	}, []);

	const handleClear = useCallback(() => {
		clearImage();
		resetTransform();
	}, [clearImage, resetTransform]);

	const handleNext = useCallback(async () => {
		if (!uploadedImage) {
			toast.error("Vui lòng upload ảnh thiết kế");
			return;
		}

		setIsLoading(true);

		try {
			// Fetch custom lighter product by name
			const customLighterProduct = await lightersApi.getLighterByName(CUSTOM_LIGHTER_NAME);

			if (!customLighterProduct) {
				toast.error("Không tìm thấy sản phẩm bật lửa custom");
				return;
			}

			// Get first price tier for initial unit price
			const priceTiers = customLighterProduct.lighterTypeDetails.priceTiers;
			const initialPrice = priceTiers[0]?.price || 0;

			// Track add to cart event
			trackAddToCart({
				id: customLighterProduct._id,
				name: customLighterProduct.name,
				category: "Lighters",
				variant: customLighterProduct.lighterTypeDetails.name,
				price: initialPrice,
				quantity: 1,
			});

			// Convert blob URL → base64 data URL so it survives page reloads and
			// persists correctly in localStorage. Blob URLs are session-only.
			let designImageUrl: string = uploadedImage.url;
			try {
				designImageUrl = await new Promise<string>((resolve, reject) => {
					const reader = new FileReader();
					reader.onload = () => resolve(reader.result as string);
					reader.onerror = () => reject(new Error("FileReader error"));
					reader.readAsDataURL(uploadedImage.file);
				});
			} catch {
				// Blob URL fallback — still works within the same browser session
			}

			// Add to cart with design image
			addItem({
				productId: customLighterProduct._id,
				productName: customLighterProduct.name,
				productImage: customLighterProduct.image?.[0],
				productSlug: customLighterProduct.slug.current,
				lighterTypeId: customLighterProduct.lighterTypeDetails._id,
				lighterTypeName: customLighterProduct.lighterTypeDetails.name,
				quantity: 1,
				unitPrice: initialPrice,
				priceTiers: priceTiers,
				designImage: designImageUrl,
			});

			toast.success("Đã thêm vào giỏ hàng!");

			// Redirect to cart
			router.push("/cart/lighters");
		} catch (error) {
			console.error("Error adding to cart:", error);
			toast.error("Có lỗi xảy ra. Vui lòng thử lại!");
		} finally {
			setIsLoading(false);
		}
	}, [uploadedImage, addItem, router]);

	// ── RENDER ──────────────────────────────────────────────────────────────
	// Layout:
	//   Mobile  → stacked (3D preview on top, panel scrolls below)
	//   Desktop → side-by-side (canvas | 340px panel), fills viewport below site header
	return (
		<Box
			component="section"
			sx={{
				bgcolor: BACKGROUND_COLOR,
				// Desktop: fill exactly the viewport space under the site header (~64px)
				height: { md: "calc(100vh - 64px)" },
				display: { xs: "flex", md: "grid" },
				flexDirection: "column",
				gridTemplateColumns: { md: "1fr 340px" },
				overflow: { md: "hidden" },
			}}
		>
			{/* ── 3D Canvas ── visible on BOTH mobile and desktop */}
			<Box
				sx={{
					position: "relative",
					overflow: "hidden",
					bgcolor: BACKGROUND_COLOR,
					// Mobile: fixed compact height; Desktop: fills the full column
					height: { xs: "45vw", md: "100%" },
					minHeight: { xs: 400 },
					flexShrink: 0,
				}}
			>
				<LighterCanvas
					textureUrl={uploadedImage?.url || null}
					transform={transform}
					hasImage={Boolean(uploadedImage)}
				/>
			</Box>

			{/* ── Control Panel ── */}
			<ControlPanel
				uploadedImage={uploadedImage}
				transform={transform}
				onImageUpload={validateAndProcessFile}
				onClear={handleClear}
				onPositionChange={setPosition}
				onRotationChange={(rotation) => updateTransform({ rotation })}
				onScaleChange={(scale) => updateTransform({ scale })}
				onReset={resetTransform}
				onNext={handleNext}
				isLoading={isLoading}
			/>
		</Box>
	);
}
