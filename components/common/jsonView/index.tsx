import { Box, Divider } from "@mui/material";
import dynamic from "next/dynamic";
import React from "react";

const DynamicReactJson = dynamic(import("react-json-view"), { ssr: false });

const JsonView: React.FC<Props> = ({ src }) => {
	return (
		<Box>
			<Box my={1}>
				<Divider />
			</Box>
			<DynamicReactJson src={src} theme={"monokai"} />
			<Box my={1}>
				<Divider />
			</Box>
		</Box>
	);
};

type Props = {
	src;
};

export default JsonView;
