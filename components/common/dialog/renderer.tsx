import { Callback } from "@/utils";
import { DIALOG_TYPES, DialogData } from "@/store/dialog/type";
import React from "react";
import Dialog from ".";
import { Button, Stack } from "@mui/material";
import useDialogSlice from "@/store/dialog/slice";

const DialogRenderer: React.FC<Props> = ({ data = {}, dialogType = "", open = false }) => {
	const {
		cancelText = "",
		content,
		fullScreen = false,
		hideTitle = false,
		maxWidth = "sm",
		okText = "",
		overflowVisible = false,
		reconfirm,
		title = "",
		hideCloseButton,
		showTitleDivider = false,
		iconTitle,
		hideFooter = false,
		onCancel,
		onOk,
	} = data;

	const dialogSlice = useDialogSlice();

	const onNoClick = () => {
		const cancelCallback = () => {
			if (data.onCancel) {
				data.onCancel();
			} else {
				dialogSlice.hideDialog();
			}
		};

		switch (dialogType) {
			case DIALOG_TYPES.YESNO_DIALOG:
				if (data.reconfirm?.cancel?.show) {
					showReconfirmDialog("cancel");
				} else {
					cancelCallback();
				}
				return;
			default:
				dialogSlice.hideDialog();
		}
	};

	const onYesClick = () => {
		switch (dialogType) {
			case DIALOG_TYPES.YESNO_DIALOG:
				if (data.reconfirm?.cancel?.show) {
					showReconfirmDialog("ok");
				} else {
					onOk();
				}
				return;
			default:
				onOk();
		}
	};

	const showReconfirmDialog = (type: "ok" | "cancel") => {
		switch (type) {
			case "ok":
				// eslint-disable-next-line no-case-declarations
				const dataOk = data.reconfirm?.ok;
				dialogSlice.showDialog({
					type: DIALOG_TYPES.YESNO_DIALOG,
					data: {
						title: dataOk?.title || "Confirmation",
						content: dataOk?.content || "Are you sure you want to apply this change?",
						cancelText: dataOk?.cancelBtn || "Cancel",
						okText: dataOk?.okBtn || "Confirm",
						onOk,
						onCancel: () => {
							dialogSlice.hideDialog();
						},
					},
				});
				return;
			case "cancel":
				// eslint-disable-next-line no-case-declarations
				const dataCancel = reconfirm?.cancel;
				dialogSlice.showDialog({
					type: DIALOG_TYPES.YESNO_DIALOG,
					data: {
						title: dataCancel?.title || "Confirmation",
						content: dataCancel?.content || "Are you sure you want to apply this change?",
						cancelText: dataCancel?.cancelBtn || "Cancel",
						okText: dataCancel?.okBtn || "Confirm",
						onOk: () => {
							onCancel();
						},
						onCancel: () => {
							dialogSlice.hideDialog();
						},
					},
				});
				return;
			default:
				dialogSlice.hideDialog();
		}
	};

	return (
		<Dialog
			open={open}
			title={title}
			maxWidth={maxWidth}
			fullWidth
			onClose={() => onNoClick()}
			overflowVisible={overflowVisible || false}
			dialogActions={
				<DiaLogAction {...{ dialogType, cancelText, okText, onNoClick, onYesClick }} />
			}
			hideTitle={hideTitle}
			fullScreen={fullScreen}
			disabledButton={hideCloseButton}
			showTitleDivider={showTitleDivider}
			iconTitle={iconTitle}
			hideFooter={hideFooter}
		>
			{content}
		</Dialog>
	);
};

type DialogActionType = {
	dialogType: string;
	cancelText: string;
	onNoClick: Callback;
	onYesClick: Callback;
	okText: string;
};

const DiaLogAction: React.FC<DialogActionType> = ({
	dialogType,
	cancelText,
	onNoClick,
	onYesClick,
	okText,
}) => {
	switch (dialogType) {
		case DIALOG_TYPES.YESNO_DIALOG:
			return (
				<Stack flexDirection={"row"}>
					<Button
						variant="outlined"
						onClick={() => onNoClick()}
						sx={{
							mr: 1,
						}}
					>
						{cancelText || "Cancel"}
					</Button>
					<Button onClick={() => onYesClick()}>{okText || "Confirm"}</Button>
				</Stack>
			);
		case DIALOG_TYPES.OK_DIALOG:
			return (
				<Stack flexDirection={"row"} alignItems={"center"}>
					<Button onClick={() => onYesClick()}>{okText || "Confirm"}</Button>
				</Stack>
			);
		default:
			return null;
	}
};

type Props = {
	data: DialogData;
	dialogType: string;
	open: boolean;
};

export default DialogRenderer;
