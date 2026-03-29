import { Canvas } from "@react-three/fiber";
import {
	OrbitControls,
	useGLTF,
	useTexture,
	ContactShadows,
	Float,
	useProgress,
} from "@react-three/drei";
import { Suspense, useEffect, useMemo } from "react";
import * as THREE from "three";
import { Box } from "@mui/material";
import { LighterTransform } from "./types";
import { FRAME_WIDTH, FRAME_HEIGHT, PRIMARY_COLOR, BACKGROUND_COLOR } from "./constants";

interface LighterModelProps {
	textureUrl: string | null;
	transform: LighterTransform;
	modelPath: string;
}

function LighterModel({ textureUrl, transform, modelPath }: LighterModelProps) {
	const { scrollX, scrollY, rotation, scale } = transform;
	const { scene } = useGLTF(modelPath);

	// Always call useTexture hook - use a 1x1 transparent pixel as placeholder when no texture
	const texture = useTexture(
		textureUrl ||
			"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
	);

	// Create a CanvasTexture to sync with 2D preview logic
	const canvasTexture = useMemo(() => {
		const canvas = document.createElement("canvas");
		canvas.width = FRAME_WIDTH;
		canvas.height = FRAME_HEIGHT;
		const ctx = canvas.getContext("2d");
		if (!ctx) return null;

		const tex = new THREE.CanvasTexture(canvas);
		tex.colorSpace = THREE.SRGBColorSpace; // canvas pixels are sRGB — prevent double-conversion
		tex.wrapS = THREE.RepeatWrapping;
		tex.wrapT = THREE.RepeatWrapping;
		tex.flipY = false;
		return tex;
	}, []);

	// Initial scene setup - clear any default textures/materials from the model
	useEffect(() => {
		if (scene) {
			scene.traverse((child) => {
				const mesh = child as THREE.Mesh;
				if (mesh.isMesh) {
					// If the mesh is an overlay or branding part that might block the design,
					// we can either hide it or ensure it's not blocking the body.
					if (mesh.name.includes("print-area-back") || mesh.name.includes("print-area")) {
						mesh.visible = false;
					}
				}
			});
		}
	}, [scene]);

	// Update CanvasTexture whenever inputs change
	useEffect(() => {
		if (!canvasTexture || !scene) return;
		const canvas = canvasTexture.image;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// 1. Clear with primary background color
		ctx.fillStyle = PRIMARY_COLOR;
		ctx.fillRect(0, 0, FRAME_WIDTH, FRAME_HEIGHT);

		// 2. Draw image if available
		if (texture && textureUrl && texture.image) {
			const img = texture.image;
			ctx.save();

			// Center by default (matching ImagePositionPreview)
			const centerX = FRAME_WIDTH / 2;
			const centerY = FRAME_HEIGHT / 2;

			// Apply transformations
			ctx.translate(centerX - scrollX * FRAME_WIDTH, centerY + scrollY * FRAME_HEIGHT);
			ctx.rotate(((rotation + 180) * Math.PI) / 180);
			ctx.scale(scale, scale);

			// Draw image centered at current transformation point
			ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height);
			ctx.restore();
		}

		canvasTexture.needsUpdate = true;

		// 3. Apply to model
		// MeshBasicMaterial renders the texture with zero lighting math — pixel-perfect
		// color match with the 2D ImagePositionPreview.
		scene.traverse((child) => {
			const mesh = child as THREE.Mesh;
			if (mesh.isMesh && mesh.name === "body") {
				mesh.material = new THREE.MeshBasicMaterial({
					map: canvasTexture,
					transparent: true,
					depthTest: true,
					depthWrite: true,
					polygonOffset: true,
					polygonOffsetFactor: -4,
					polygonOffsetUnits: -4,
				});
				mesh.material.needsUpdate = true;
			}
		});
	}, [canvasTexture, texture, textureUrl, scrollX, scrollY, rotation, scale, scene]);

	// Center the model by adjusting its position
	useEffect(() => {
		if (scene) {
			// Calculate bounding box to center the model
			const box = new THREE.Box3().setFromObject(scene);
			const center = box.getCenter(new THREE.Vector3());
			// Offset the scene to center it at origin
			scene.position.sub(center);
		}
	}, [scene]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (texture) {
				texture.dispose();
			}
			if (scene) {
				scene.traverse((child) => {
					const mesh = child as THREE.Mesh;
					if (mesh.isMesh) {
						mesh.geometry.dispose();
						if (mesh.material) {
							if (Array.isArray(mesh.material)) {
								mesh.material.forEach((m) => {
									const standardMaterial = m as THREE.MeshStandardMaterial;
									if (standardMaterial.map) standardMaterial.map.dispose();
									standardMaterial.dispose();
								});
							} else {
								const standardMaterial = mesh.material as THREE.MeshStandardMaterial;
								if (standardMaterial.map) standardMaterial.map.dispose();
								standardMaterial.dispose();
							}
						}
					}
				});
			}
		};
	}, [texture, scene]);

	return (
		<Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
			{/* eslint-disable-next-line react/no-unknown-property */}
			<primitive object={scene} scale={1} />
		</Float>
	);
}

function CanvasLoadingOverlay() {
	const { active, progress } = useProgress();

	return (
		<Box
			sx={{
				position: "absolute",
				inset: 0,
				zIndex: 10,
				bgcolor: BACKGROUND_COLOR,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				flexDirection: "column",
				gap: "16px",
				opacity: active ? 1 : 0,
				pointerEvents: active ? "auto" : "none",
				transition: "opacity 0.4s ease",
			}}
		>
			{/* Spinning ring */}
			<Box
				sx={{
					width: 52,
					height: 52,
					borderRadius: "50%",
					border: "3px solid #2c2b28",
					borderTopColor: "#FF4D00",
					animation: "lighter-spin 0.85s linear infinite",
					"@keyframes lighter-spin": {
						from: { transform: "rotate(0deg)" },
						to: { transform: "rotate(360deg)" },
					},
				}}
			/>

			{/* Progress bar */}
			<Box sx={{ width: 100, height: 3, bgcolor: "#1a1916", borderRadius: 2, overflow: "hidden" }}>
				<Box
					sx={{
						height: "100%",
						width: `${Math.round(progress)}%`,
						bgcolor: "#FF4D00",
						borderRadius: 2,
						transition: "width 0.2s ease",
					}}
				/>
			</Box>

			<Box
				component="span"
				sx={{
					fontFamily: '"Syne", sans-serif',
					fontSize: 11,
					fontWeight: 700,
					letterSpacing: "0.08em",
					color: "rgba(245,243,238,0.45)",
				}}
			>
				Đang tải mô hình... {Math.round(progress)}%
			</Box>
		</Box>
	);
}

interface LighterCanvasProps {
	textureUrl: string | null;
	transform: LighterTransform;
	modelPath?: string;
	hasImage?: boolean;
}

export function LighterCanvas({
	textureUrl,
	transform,
	modelPath = "/models/lighter.glb",
	hasImage = false,
}: LighterCanvasProps) {
	return (
		<Box
			sx={{
				width: "100%",
				height: "100%",
				minHeight: 400,
				bgcolor: BACKGROUND_COLOR,
				borderRadius: 2,
				overflow: "hidden",
				position: "relative",
			}}
		>
			<Box
				sx={{
					position: "absolute",
					left: "50%",
					bottom: 12,
					transform: "translateX(-50%)",
					zIndex: 2,
					pointerEvents: "none",
					px: 1.5,
					py: 0.5,
					borderRadius: 1,
					bgcolor: "rgba(0,0,0,0.35)",
					border: "1px solid rgba(255,255,255,0.08)",
					maxWidth: "calc(100% - 24px)",
				}}
			>
				<Box
					component="span"
					sx={{
						fontSize: 12,
						color: hasImage ? "rgba(245,243,238,0.78)" : "rgba(245,243,238,0.58)",
						whiteSpace: "nowrap",
					}}
				>
					← Kéo để xoay • Cuộn để phóng to →
				</Box>
			</Box>

			<CanvasLoadingOverlay />

			<Canvas
				camera={{ position: [0, 0, 7], fov: 80 }}
				gl={{
					powerPreference: "high-performance",
					antialias: true,
					toneMapping: THREE.NoToneMapping, // no post-processing — raw texture colors
					outputColorSpace: THREE.SRGBColorSpace,
				}}
				dpr={[1, 2]}
			>
				{/* No lights needed — MeshBasicMaterial on the body ignores all lighting.
				     Lights only affect non-body parts (cap, flint wheel, etc.) */}
				{/* eslint-disable-next-line react/no-unknown-property */}
				<ambientLight intensity={0.8} color="#ffffff" />
				{/* eslint-disable-next-line react/no-unknown-property */}
				<directionalLight position={[4, 5, 4]} intensity={0.4} color="#ffffff" />

				<Suspense fallback={null}>
					<LighterModel textureUrl={textureUrl} transform={transform} modelPath={modelPath} />
				</Suspense>

				{/* 4. Soft contact shadows for depth */}
				<ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2} far={4.5} />

				<OrbitControls enableZoom={true} enablePan={false} autoRotate={true} autoRotateSpeed={1} />
			</Canvas>
		</Box>
	);
}
