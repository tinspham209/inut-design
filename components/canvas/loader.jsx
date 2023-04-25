import { CircularProgress } from "@mui/material";
import { Html, useProgress } from "@react-three/drei";

const CanvasLoader = () => {
	const { progress } = useProgress();
	return (
		<Html
			as="div"
			center
			style={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				flexDirection: "column",
			}}
		>
			<CircularProgress />
			<p
				style={{
					fontSize: 14,
					color: "#F1F1F1",
					fontWeight: 800,
					marginTop: 40,
				}}
			>
				{progress.toFixed(2)}%
			</p>
		</Html>
	);
};

export default CanvasLoader;
