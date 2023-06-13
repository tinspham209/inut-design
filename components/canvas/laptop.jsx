import React, { Suspense } from "react";
import { Canvas, useResource } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Preload, useGLTF } from "@react-three/drei";
import CanvasLoader from "./loader";
import { Box, useMediaQuery, useTheme } from "@mui/material";

const Laptop = ({ isMobile }) => {
	const laptop = useGLTF("./textures/laptop/scene.gltf");

	return (
		<mesh>
			<hemisphereLight intensity={0.5} groundColor="black" />
			<spotLight
				position={[-20, 50, 10]}
				angle={0.12}
				penumbra={1}
				intensity={1}
				castShadow
				shadow-mapSize={1024}
			/>
			<pointLight intensity={1} />
			<primitive
				object={laptop.scene}
				// scale={isMobile ? 0.5 : 0.75}
				// position={isMobile ? [0, -3, -0.4] : [0, -3.25, -1.5]}
				// rotation={[-0.01, -0.2, -0.1]}

				scale={1}
				position={[0, -5, 0]}
				rotation={[0.2, -0.2, 0]}
			/>
		</mesh>
	);
};

const LaptopCanvas = () => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));

	return (
		<Box
			sx={{
				height: "auto",
				minHeight: isMobile ? "200px" : "300px",
			}}
		>
			<Canvas
				shadows
				frameloop="demand"
				dpr={[1, 2]}
				gl={{ preserveDrawingBuffer: true }}
				camera={{ position: [25, 3, 5], fov: 100 }}
			>
				<Suspense fallback={<CanvasLoader />}>
					<OrbitControls
						autoRotate
						enableZoom
						enablePan
						enableRotate
						enableDamping
						maxPolarAngle={Math.PI / 2}
						minPolarAngle={Math.PI / 2}
					/>
					<Laptop isMobile={isMobile} />

					<Preload all />
					{/* <axesHelper args={[128, 128, 128]} /> */}
				</Suspense>
			</Canvas>
		</Box>
	);
};

export default LaptopCanvas;
