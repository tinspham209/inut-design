import useDialogSlice from "@/zustand/dialog/slice";
import { DialogDataKey } from "@/zustand/dialog/type";
import { CircularProgress } from "@mui/material";
import dynamic from "next/dynamic";
import React, { Suspense } from "react";

const DialogRenderer = dynamic(() => import("./renderer"));

const DialogContainer: React.FC = () => {
	const dialogSlice = useDialogSlice();

	const { isVisible, type, data } = dialogSlice;

	return (
		<Suspense fallback={<CircularProgress />}>
			<DialogRenderer
				open={isVisible[DialogDataKey.FIRST]}
				data={data[DialogDataKey.FIRST]}
				dialogType={type[DialogDataKey.FIRST]}
			/>
			<DialogRenderer
				open={isVisible[DialogDataKey.SECOND]}
				data={data[DialogDataKey.SECOND]}
				dialogType={type[DialogDataKey.SECOND]}
			/>

			<DialogRenderer
				open={isVisible[DialogDataKey.THIRD]}
				data={data[DialogDataKey.THIRD]}
				dialogType={type[DialogDataKey.THIRD]}
			/>
		</Suspense>
	);
};

export default DialogContainer;
