import {
	CircularProgress,
	Dialog as MuiDialog,
	DialogActions,
	DialogContent,
	DialogContentProps,
	DialogProps,
	DialogTitle,
	IconButton,
	Grow,
	Stack,
	Typography,
	Box,
	Divider,
} from "@mui/material";
import React from "react";
import { REASON_CLOSE_DIALOG } from "./helpers";
import cn from "classnames";
import { Close } from "@mui/icons-material";
import { Callback, isEmpty } from "@/utils";

const Dialog: React.FC<
	Omit<DialogProps, "onClose"> & {
		iconTitle?: React.ReactNode;
		title: string;
		dialogActions?: React.ReactNode;
		dialogContentClasses?: DialogContentProps["classes"];
		fullScreen?: boolean;
		loading?: boolean;
		overflowVisible?: boolean;
		disabledButton?: boolean;
		hideTitle?: boolean;
		showTitleDivider?: boolean;
		hideFooter?: boolean;
		onClose?: Callback;
	}
> = ({
	iconTitle,
	children,
	title,
	dialogActions,
	fullScreen,
	loading,
	overflowVisible,
	disabledButton,
	hideTitle,
	open,
	showTitleDivider = false,
	hideFooter = false,
	onClose,
	...dialogProps
}) => {
	return (
		<MuiDialog
			open={open}
			{...dialogProps}
			fullScreen={fullScreen}
			TransitionComponent={Grow}
			BackdropProps={{
				transitionDuration: 0.4,
			}}
			{...dialogProps}
		>
			{!disabledButton && (
				<IconButton
					className="cmp-dialog__close-icon"
					sx={{
						position: "absolute",
						width: "fit-content",
						top: "8px",
						right: "8px",
						zIndex: 12,
					}}
					onClick={() => {
						onClose({}, REASON_CLOSE_DIALOG.CLOSE_ICON_CLICK);
					}}
				>
					<Close />
				</IconButton>
			)}
			{!hideTitle && (
				<DialogTitle>
					<Stack flexDirection={"row"} alignItems={"center"} justifyContent={"space-between"}>
						<Stack flexDirection={"row"} alignItems={"center"}>
							{iconTitle && <Box mr={1}>{iconTitle}</Box>}
							<Typography variant="body1" fontWeight={"bold"} ml={1}>
								{isEmpty(title) ? ` ` : title}
							</Typography>
							{loading && <CircularProgress size={25} />}
						</Stack>
					</Stack>
					{showTitleDivider && <Divider />}
				</DialogTitle>
			)}
			<DialogContent
				classes={{
					root: cn("cmp-dialog__content", {
						"cmp-dialog__content--visible": overflowVisible,
					}),
				}}
			>
				{children}
			</DialogContent>
			{!isEmpty(dialogActions) && !hideFooter && (
				<DialogActions
					classes={{
						root: "cmp-dialog__footer",
					}}
				>
					{dialogActions}
				</DialogActions>
			)}
		</MuiDialog>
	);
};

export default Dialog;
