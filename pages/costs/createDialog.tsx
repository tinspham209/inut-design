import { ControllerDatePicker, ControllerInput } from "@/components/common";
import { swrCosts } from "@/components/swr";
import useDialogSlice from "@/store/dialog/slice";
import { DIALOG_TYPES } from "@/store/dialog/type";
import { Box, Button, Grid, Popover, Stack, Typography } from "@mui/material";
import { format } from "date-fns";
import React from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
const CreateCostDialog = () => {
	const dialogSlice = useDialogSlice();
	const { isLoading } = swrCosts.useCreateNew();

	const handleShowDialog = () => {
		dialogSlice.showDialog({
			type: DIALOG_TYPES.CONTENT_DIALOG,
			data: {
				title: "Tạo chi phí mới",
				hideFooter: true,
				content: (
					<Box>
						<CreateForm />
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

enum CREATE_COST_FORM_KEY {
	TYPE = "_type",
	DATE = "date",
	TITLE = "title",
	PRICE = "price",
}

const CreateForm = () => {
	const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};
	const dialogSlice = useDialogSlice();
	const { refetch } = swrCosts.useGetByDateRange();
	const { createCost, isLoading } = swrCosts.useCreateNew();

	const {
		handleSubmit,
		watch,
		control,
		formState: { errors },
	} = useForm<FieldValues>({
		defaultValues: {
			_type: "costs",
			date: new Date(),
			title: "",
			price: null,
		},
		reValidateMode: "onBlur",
	});

	const date = watch(CREATE_COST_FORM_KEY.DATE);

	const onSubmit: SubmitHandler<FieldValues> = (data) => {
		createCost(
			{
				_type: data._type,
				date: format(data.date, "yyyy-MM-dd"),
				title: data.title,
				price: data.price ? `${data.price}` : "",
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
							id={CREATE_COST_FORM_KEY.TITLE}
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
								id={CREATE_COST_FORM_KEY.DATE}
								control={control}
								errors={errors}
								closePopover={handleClose}
							/>
						</Popover>
					</Grid>

					<Grid item xs={12}>
						<ControllerInput
							id={CREATE_COST_FORM_KEY.PRICE}
							control={control}
							label="Giá"
							required
							errors={errors}
							type="number"
							helperText="Ex: 200, 400, 450"
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

export default CreateCostDialog;
