import { ErrorMessage } from "@hookform/error-message";
import { Stack, Switch, Typography } from "@mui/material";
import React from "react";
import { Control, Controller, FieldErrors, FieldValues } from "react-hook-form";

const ControllerSwitch: React.FC<Props> = ({ id, errors, control, label, required }) => {
	return (
		<>
			<Controller
				name={id}
				control={control}
				render={({ field: { value, onChange, ...field } }) => {
					return (
						<Stack flexDirection={"row"} width={"100%"} alignItems={"center"}>
							<Switch
								{...field}
								checked={value}
								onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
									const checked = e.target.checked;
									onChange(checked);
								}}
							/>
							<Typography variant="body1" mr={2}>
								{label} {required ? " *" : ""}
							</Typography>
						</Stack>
					);
				}}
			/>
			<ErrorMessage errors={errors} name={id} />
		</>
	);
};

type Props = {
	id: string;
	control: Control<FieldValues>;
	errors: FieldErrors;
	label: string;
	required?: string;
};

export default ControllerSwitch;
