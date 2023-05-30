import { ErrorMessage } from "@hookform/error-message";
import { TextField } from "@mui/material";
import React from "react";
import { Control, Controller, FieldErrors, FieldValues } from "react-hook-form";

const ControllerInput: React.FC<Props> = ({
	id,
	label,
	placeholder,
	required,
	errors,
	control,
	type,
}) => {
	return (
		<>
			<Controller
				name={id}
				control={control}
				render={({ field: { ref, ...field } }) => (
					<TextField
						{...field}
						inputRef={ref}
						id={id}
						variant="outlined"
						type={type}
						error={!!errors[id]}
						helperText={(errors[id]?.message as string) || ""}
						label={label}
						placeholder={placeholder}
						required={required}
						sx={{
							width: "100%",
						}}
					/>
				)}
			/>
			<ErrorMessage errors={errors} name={id} />
		</>
	);
};

type Props = {
	id: string;
	label: string;
	placeholder?: string;
	required?: boolean;
	control: Control<FieldValues>;
	errors: FieldErrors;
	type?: React.HTMLInputTypeAttribute;
};

export default ControllerInput;
