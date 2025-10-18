import { LighterType } from "@/models/cart";
import {
	Box,
	FormControl,
	FormControlLabel,
	Radio,
	RadioGroup,
	Stack,
	Typography,
	Button,
	Popover,
	Divider,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useRouter } from "next/router";
import React from "react";

interface LightersFilterProps {
	lighterTypes: LighterType[];
}

const LightersFilter: React.FC<LightersFilterProps> = ({ lighterTypes }) => {
	const router = useRouter();
	const { filter } = router.query;
	const [currentFilter, setCurrentFilter] = React.useState(filter || "");
	const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

	React.useEffect(() => {
		setCurrentFilter(filter || "");
	}, [filter]);

	const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(e.currentTarget);
	};
	const handleClose = () => setAnchorEl(null);

	const open = Boolean(anchorEl);
	const id = open ? "lighters-filter-popover" : undefined;

	const scrollToTop = () => {
		// Smooth scroll to products title area
		setTimeout(() => {
			document
				.getElementById("lighterTitle")
				?.scrollIntoView({ behavior: "smooth", block: "start" });
		}, 200);
	};

	const handleOnChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = (event.target as HTMLInputElement).value;
		setCurrentFilter(value);
		router.push(
			{
				pathname: "/lighters",
				query: { filter: value },
			},
			undefined,
			{ scroll: false }
		);
		// Close popover after selection (desktop & mobile)
		handleClose();
		scrollToTop();
	};

	const handleClearFilter = () => {
		setCurrentFilter("");
		router.push(
			{
				pathname: "/lighters",
				query: {},
			},
			undefined,
			{ scroll: false }
		);
		handleClose();
		scrollToTop();
	};

	return (
		<Box>
			<Button
				variant="outlined"
				color="primary"
				onClick={handleOpen}
				startIcon={<FilterAltIcon />}
				sx={{
					textTransform: "none",
					fontWeight: 600,
					borderRadius: 2,
				}}
			>
				Bộ lọc
			</Button>
			<Popover
				id={id}
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
				transformOrigin={{ vertical: "top", horizontal: "left" }}
				PaperProps={{
					sx: {
						px: 2,
						pt: 1.5,
						pb: 2,
						borderRadius: 2,
						minWidth: 240,
					},
				}}
			>
				<Stack spacing={1}>
					<Box>
						<Typography variant="subtitle1" fontWeight={700}>
							Danh mục bật lửa ({lighterTypes.length})
						</Typography>

						<Divider sx={{ mt: 1 }} />
					</Box>
					<Stack direction="row" justifyContent="flex-end">
						{currentFilter && (
							<Button variant="text" color="error" size="small" onClick={handleClearFilter}>
								Xóa bộ lọc
							</Button>
						)}
					</Stack>
					<FormControl component="fieldset">
						<RadioGroup
							name="radio-buttons-filters"
							value={currentFilter}
							onChange={handleOnChangeCheckbox}
						>
							<FormControlLabel value={""} control={<Radio size="small" />} label={"Tất cả"} />
							{lighterTypes.map((lighterType) => (
								<FormControlLabel
									key={lighterType._id}
									value={lighterType.slug.current}
									control={<Radio size="small" />}
									label={lighterType.name}
								/>
							))}
						</RadioGroup>
					</FormControl>
				</Stack>
			</Popover>
		</Box>
	);
};

export default LightersFilter;
