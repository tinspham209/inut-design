"use client";

import { DateRange, Range, RangeKeyDict } from "react-date-range";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

interface DateRangePickerProps {
	value: Range;
	// eslint-disable-next-line no-unused-vars
	onChange: (value: RangeKeyDict) => void;
	disabledDates?: Date[];
	minDate?: Date;
	maxDate?: Date;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
	value,
	onChange,
	disabledDates,
	minDate,
	maxDate,
}) => {
	return (
		<DateRange
			rangeColors={["#262626"]}
			ranges={[value]}
			date={new Date()}
			onChange={onChange}
			direction="vertical"
			showDateDisplay={false}
			minDate={minDate}
			maxDate={maxDate}
			disabledDates={disabledDates}
		/>
	);
};

export default DateRangePicker;
