import { DateRangePicker } from "@/components/common";
import { firstDateOfMonth, lastDateOfMonth } from "@/utils";
import { Button, Popover, Typography } from "@mui/material";
import { endOfDay, format, startOfDay } from "date-fns";
import { useRouter } from "next/router";
import React from "react";
import { Range, RangeKeyDict } from "react-date-range";
const SelectDate = () => {
	const router = useRouter();
	const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const { startDate, endDate } = router.query;

	const [dateRange, setDateRange] = React.useState<Range>({
		startDate: startDate ? new Date(startDate as string) : new Date(firstDateOfMonth),
		endDate: endDate ? new Date(endDate as string) : new Date(lastDateOfMonth),
		key: "selection",
	});

	const updateQuery = React.useCallback(
		({ startDate, endDate }) => {
			router.push({
				pathname: "/incomes",
				query: {
					startDate: startDate.toISOString(),
					endDate: endDate.toISOString(),
				},
			});
		},
		[router]
	);

	const handleDateChange = (value: RangeKeyDict) => {
		updateQuery({
			startDate: startOfDay(value.selection.startDate),
			endDate: endOfDay(value.selection.endDate),
		});
	};

	React.useEffect(() => {
		if (startDate && endDate) {
			setDateRange((prev) => ({
				...prev,
				startDate: new Date(startDate as string),
				endDate: new Date(endDate as string),
			}));
		} else {
			setDateRange((prev) => ({
				...prev,
				startDate: new Date(firstDateOfMonth),
				endDate: new Date(lastDateOfMonth),
			}));
			updateQuery({
				startDate: startOfDay(new Date(firstDateOfMonth)),
				endDate: endOfDay(new Date(lastDateOfMonth)),
			});
		}
	}, [startDate, endDate, updateQuery]);

	return (
		<>
			<Button variant="outlined" onClick={(e) => handleClick(e)}>
				<Typography variant="body1" color="white">
					{format(dateRange.startDate, "dd/MM/yy")} - {format(dateRange.endDate, "dd/MM/yy")}
				</Typography>
			</Button>
			<Popover
				open={Boolean(anchorEl)}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "left",
				}}
			>
				<DateRangePicker
					value={dateRange}
					onChange={handleDateChange}
					maxDate={endOfDay(new Date())}
				/>
			</Popover>
		</>
	);
};

export default SelectDate;
