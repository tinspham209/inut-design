import SearchIcon from "@mui/icons-material/Search";
import {
	Button,
	IconButton,
	Popover,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import React from "react";
import { COLOR_CODE } from "@/utils";
import { trackSearchOpen } from "@/utils/analytics";

type SearchPopoverProps = {
	device: "desktop" | "mobile";
};

export function SearchPopover({ device }: SearchPopoverProps) {
	const router = useRouter();
	const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
	const [value, setValue] = React.useState("");
	const [error, setError] = React.useState(false);
	const triggerRef = React.useRef<HTMLElement | null>(null);
	const inputRef = React.useRef<HTMLInputElement | null>(null);

	const open = Boolean(anchorEl);

	const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
		triggerRef.current = event.currentTarget;
		setAnchorEl(event.currentTarget);
		setError(false);
		trackSearchOpen(device);
	};

	const handleClose = () => {
		setAnchorEl(null);
		setError(false);
		window.setTimeout(() => triggerRef.current?.focus(), 0);
	};

	React.useEffect(() => {
		const handleRouteChange = () => setAnchorEl(null);
		router.events.on("routeChangeStart", handleRouteChange);
		return () => router.events.off("routeChangeStart", handleRouteChange);
	}, [router.events]);

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const trimmedValue = value.trim().replace(/\s+/g, " ");
		if (!trimmedValue) {
			setError(true);
			inputRef.current?.focus();
			return;
		}

		handleClose();
		void router.push(`/search?q=${encodeURIComponent(trimmedValue)}`);
	};

	return (
		<>
			{device === "desktop" ? (
				<Button
					color="inherit"
					startIcon={<SearchIcon />}
					onClick={handleOpen}
					aria-haspopup="dialog"
					aria-expanded={open ? "true" : undefined}
					sx={{
						fontWeight: "bold",
						textTransform: "uppercase",
						color: COLOR_CODE.TEXT_MUTED,
						fontSize: { md: "0.75rem", lg: "0.875rem" },
						minWidth: 0,
						flexShrink: 1,
						whiteSpace: "nowrap",
						px: { md: 0.5, lg: 1 },
						"&:hover": { color: COLOR_CODE.WHITE },
					}}
				>
					Tìm kiếm
				</Button>
			) : (
				<IconButton
					onClick={handleOpen}
					aria-label="Tìm kiếm"
					aria-haspopup="dialog"
					aria-expanded={open ? "true" : undefined}
					sx={{ color: COLOR_CODE.WHITE }}
				>
					<SearchIcon />
				</IconButton>
			)}
			<Popover
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				disableRestoreFocus
				anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
				transformOrigin={{ vertical: "top", horizontal: "right" }}
				PaperProps={{
					role: "dialog",
					"aria-label": "Tìm kiếm trên INUT Design",
					sx: {
						backgroundColor: COLOR_CODE.SURFACE_ELEVATED,
						color: COLOR_CODE.WHITE,
						border: `1px solid ${COLOR_CODE.BORDER_DARK}`,
					},
				}}
			>
				<Stack component="form" onSubmit={handleSubmit} spacing={1.5} sx={{ p: 2, width: { xs: 280, sm: 360 } }}>
					<Typography variant="subtitle1" fontWeight="bold">
						Tìm kiếm
					</Typography>
					<TextField
						inputRef={inputRef}
						autoFocus
						fullWidth
						size="small"
						label="Từ khóa"
						value={value}
						sx={{
							"& .MuiInputLabel-root": { color: COLOR_CODE.TEXT_MUTED },
							"& .MuiInputLabel-root.Mui-focused": { color: COLOR_CODE.PRIMARY },
							"& .MuiOutlinedInput-root": {
								color: COLOR_CODE.WHITE,
								"& fieldset": { borderColor: COLOR_CODE.INK_4 },
								"&:hover fieldset": { borderColor: COLOR_CODE.TEXT_MUTED },
								"&.Mui-focused fieldset": { borderColor: COLOR_CODE.PRIMARY },
							},
							"& .MuiFormHelperText-root": { color: COLOR_CODE.TEXT_MUTED },
						}}
						onChange={(event) => {
							setValue(event.target.value);
							if (error) setError(false);
						}}
						error={error}
						helperText={error ? "Vui lòng nhập từ khóa tìm kiếm." : " "}
						inputProps={{ "aria-label": "Từ khóa tìm kiếm" }}
					/>
					<Button type="submit" variant="contained" startIcon={<SearchIcon />}>
						Tìm kiếm
					</Button>
				</Stack>
			</Popover>
		</>
	);
}
