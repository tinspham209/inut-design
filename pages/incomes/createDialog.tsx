import { ControllerDatePicker, ControllerInput, ControllerSwitch } from "@/components/common";
import { swrIncomes } from "@/components/swr";
import useDialogSlice from "@/zustand/dialog/slice";
import { DIALOG_TYPES } from "@/zustand/dialog/type";
import { Box, Button, Grid, Popover, Stack, Typography } from "@mui/material";
import { format } from "date-fns";
import React from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
const CreateIncomeDialog = () => {
	const dialogSlice = useDialogSlice();
	const { isLoading } = swrIncomes.useCreateIncome();

	const handleShowDialog = () => {
		dialogSlice.showDialog({
			type: DIALOG_TYPES.CONTENT_DIALOG,
			data: {
				title: "Tạo doanh thu mới",
				hideFooter: true,
				content: (
					<Box>
						<CreateUserForm />
					</Box>
				),
			},
		});
	};

	return (
		<Box mr={2}>
			<Button variant="contained" onClick={() => handleShowDialog()} disabled={isLoading}>
				Tạo mới
			</Button>
		</Box>
	);
};

enum CREATE_USER_FORM_KEY {
	TYPE = "_type",
	DATE = "date",
	TITLE = "title",
	MAT_LUNG = "matLung",
	VIEN_MAN_HINH = "vienManHinh",
	MAT_PHIM = "matPhim",
	MAT_DAY = "matDay",
	DISCOUNT = "discount",
}

const CreateUserForm = () => {
	const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};
	const dialogSlice = useDialogSlice();
	const { refetch } = swrIncomes.useIncomeWithDateRange();
	const { createIncome, isLoading } = swrIncomes.useCreateIncome();

	const {
		handleSubmit,
		watch,
		control,
		formState: { errors },
	} = useForm<FieldValues>({
		defaultValues: {
			_type: "income",
			date: new Date(),
			title: "",
			matLung: false,
			vienManHinh: false,
			matPhim: false,
			matDay: false,
			discount: null,
		},
		reValidateMode: "onBlur",
	});

	const date = watch(CREATE_USER_FORM_KEY.DATE);

	const onSubmit: SubmitHandler<FieldValues> = (data) => {
		createIncome(
			{
				_type: data._type,
				date: format(data.date, "yyyy-MM-dd"),
				matLung: data.matLung,
				vienManHinh: data.vienManHinh,
				matPhim: data.matPhim,
				title: data.title,
				matDay: data.matDay,
				discount: data.discount ? `${data.discount}` : "",
			},
			{
				onSuccess() {
					refetch();
					toast.success("Successfully!");
					dialogSlice.hideDialog();
				},
			}
		);
	};

	return (
		<Box mt={1}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<ControllerInput
							id={CREATE_USER_FORM_KEY.TITLE}
							control={control}
							label="Thông tin"
							required
							errors={errors}
						/>
					</Grid>
					<Grid item xs={12}>
						<Box
							sx={{
								padding: "16px 14px",
								border: "1px solid rgba(255,255,255,0.23)",
								borderRadius: "4px",
								cursor: "pointer",

								"&:hover": {
									borderColor: "rgba(255,255,255,0.8)",
								},
							}}
							onClick={(e) => handleClick(e)}
						>
							<Typography>Ngày: {format(date, "dd-MM-yyyy")}</Typography>
						</Box>
						<Popover
							open={Boolean(anchorEl)}
							anchorEl={anchorEl}
							onClose={handleClose}
							anchorOrigin={{
								vertical: "bottom",
								horizontal: "left",
							}}
						>
							<ControllerDatePicker
								id={CREATE_USER_FORM_KEY.DATE}
								control={control}
								errors={errors}
								closePopover={handleClose}
							/>
						</Popover>
					</Grid>
					<Grid item xs={12}>
						<BoxBorder>
							<ControllerSwitch
								label="Mặt lưng"
								id={CREATE_USER_FORM_KEY.MAT_LUNG}
								control={control}
								errors={errors}
							/>
						</BoxBorder>
					</Grid>
					<Grid item xs={12}>
						<BoxBorder>
							<ControllerSwitch
								label="Mặt phím"
								id={CREATE_USER_FORM_KEY.MAT_PHIM}
								control={control}
								errors={errors}
							/>
						</BoxBorder>
					</Grid>
					<Grid item xs={12}>
						<BoxBorder>
							<ControllerSwitch
								label="Mặt đáy"
								id={CREATE_USER_FORM_KEY.MAT_DAY}
								control={control}
								errors={errors}
							/>
						</BoxBorder>
					</Grid>
					<Grid item xs={12}>
						<BoxBorder>
							<ControllerSwitch
								label="Viền màn hình"
								id={CREATE_USER_FORM_KEY.VIEN_MAN_HINH}
								control={control}
								errors={errors}
							/>
						</BoxBorder>
					</Grid>
					<Grid item xs={12}>
						<ControllerInput
							id={CREATE_USER_FORM_KEY.DISCOUNT}
							control={control}
							label="Giảm giá (%)"
							required={false}
							errors={errors}
							type="number"
						/>
					</Grid>
				</Grid>
				<Stack flexDirection={"row"} justifyContent={"flex-end"} mt={3}>
					<Box>
						<Button
							variant="outlined"
							onClick={() => {
								dialogSlice.hideDialog();
							}}
							sx={{ mr: 2 }}
						>
							Huỷ
						</Button>
						<Button variant="contained" type="submit" disabled={isLoading}>
							Tạo
						</Button>
					</Box>
				</Stack>
			</form>
		</Box>
	);
};

const BoxBorder = ({ children }) => {
	return (
		<Box
			sx={{
				padding: "8px 4px",
				border: "1px solid rgba(255,255,255,0.23)",
				borderRadius: "4px",
				cursor: "pointer",

				"&:hover": {
					borderColor: "rgba(255,255,255,0.8)",
				},
			}}
		>
			{children}
		</Box>
	);
};

export default CreateIncomeDialog;
