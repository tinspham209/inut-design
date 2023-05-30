import { COLOR_CODE, Callback } from "@/utils";
import { ErrorMessage } from "@hookform/error-message";
import React from "react";
import { Calendar } from "react-date-range";
import { Control, Controller, FieldErrors, FieldValues } from "react-hook-form";

const ControllerDatePicker: React.FC<Props> = ({ id, errors, control, closePopover }) => {
	return (
		<>
			<Controller
				name={id}
				control={control}
				render={({ field: { value, onChange, ...field } }) => (
					<>
						<Calendar
							{...field}
							dateDisplayFormat="yyyy/MM/dd"
							date={value}
							onChange={(date) => {
								console.log("date: ", date);
								onChange(date);
								if (closePopover) {
									closePopover();
								}
							}}
							color={COLOR_CODE.PRIMARY}
						/>
					</>
				)}
			/>
			<ErrorMessage errors={errors} name={id} />
		</>
	);
};

type Props = {
	id: string;
	control: Control<FieldValues>;
	errors: FieldErrors;
	closePopover?: Callback;
};

export default ControllerDatePicker;
