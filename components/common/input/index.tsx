import { Callback, isEmpty } from "@/utils";
import { IconButton, InputAdornment, InputBaseComponentProps, TextField } from "@mui/material";
import React, { HTMLProps, MouseEventHandler, RefObject } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const Input: React.FC<InputProps> = ({
	errorMessage,
	label,
	className,
	inputRef = null,
	icon,
	onIconClick,
	isPassword,
	defaultValue,
	helperText,
	color = "primary",
	disabled,
	fullWidth,
	multiline,
	onChange,
	id,
	required,
	minRows,
	maxRows,
	inputProps,
	InputProps,
	iconPosition = "end",
	onKeyDown,
	value,
	placeholder,
	variant = "outlined",
	readOnly,
	iconType = "button",
	type = "text",
	isSmallSize,
	...props
}) => {
	const [showPassword, setShowPassword] = React.useState<boolean>(false);

	return (
		<TextField
			{...props}
			id={id}
			value={value}
			label={label ? label : ""}
			placeholder={placeholder}
			variant={variant}
			color={color}
			size={isSmallSize ? "small" : undefined}
			type={isPassword && showPassword ? "text" : isPassword && !showPassword ? "password" : type}
			error={errorMessage === " " || isEmpty(errorMessage) ? false : true}
			helperText={errorMessage ? errorMessage : !isEmpty(helperText) ? helperText : ""}
			defaultValue={defaultValue}
			ref={inputRef}
			classes={{ root: className ? className : undefined }}
			disabled={disabled}
			fullWidth={fullWidth}
			multiline={multiline}
			onChange={onChange}
			onKeyDown={onKeyDown}
			required={required}
			minRows={minRows}
			maxRows={maxRows}
			inputProps={inputProps}
			InputProps={{
				// className: classes.input,
				...(!isEmpty(InputProps) && {
					...InputProps,
				}),
				...(readOnly && {
					readOnly: readOnly,
				}),
				...(iconPosition === "end"
					? {
							endAdornment: (
								<InputAdornment position="end">
									{isPassword && (
										<IconButton
											aria-label="toggle-password"
											id="toggle-password"
											onClick={() => setShowPassword((prevState) => !prevState)}
											edge="end"
										>
											{showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
										</IconButton>
									)}
									{!isPassword && icon && iconType === "button" ? (
										<IconButton onClick={onIconClick} edge="end">
											{icon}
										</IconButton>
									) : (
										icon
									)}
								</InputAdornment>
							),
					  }
					: {
							startAdornment: (
								<InputAdornment position="start">
									{!isPassword && icon && iconType === "button" ? (
										<IconButton onClick={onIconClick} edge="end">
											{icon}
										</IconButton>
									) : (
										icon
									)}
								</InputAdornment>
							),
					  }),
			}}
		/>
	);
};

type BaseInputProps = Pick<
	HTMLProps<HTMLInputElement>,
	Exclude<keyof HTMLProps<HTMLInputElement>, "label">
>;
export type InputProps = BaseInputProps & {
	errorMessage?: string;
	inputRef?: RefObject<HTMLInputElement>;
	icon?: React.ReactNode;
	onIconClick?: MouseEventHandler<HTMLElement>;
	label?: string | React.ReactNode;
	isPassword?: boolean;
	loading?: boolean;
	defaultValue?: string | React.ReactNode;
	helperText?: string;
	color?: "primary" | "secondary";
	disabled?: boolean;
	fullWidth?: boolean;
	multiline?: boolean;
	id?: boolean;
	onChange?: Callback;
	required?: boolean;
	size?: "small" | "medium";
	minRows?: number | string;
	maxRows?: number | string;
	inputProps?: InputBaseComponentProps;
	iconPosition?: "start" | "end";
	iconType?: "button" | "normal";
	onKeyDown?: Callback;
	value?: unknown;
	placeholder?: string;
	variant?: "standard" | "outlined" | "filled";
	InputProps?: Partial<unknown>;
	readOnly?: boolean;
	type?: string;
	isSmallSize?: boolean;
};

export default Input;
