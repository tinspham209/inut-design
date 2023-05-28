import { format, lastDayOfMonth } from "date-fns";

const today = new Date();
export const firstDateOfMonth = format(today, "yyyy-MM-01");
export const lastDateOfMonth = format(lastDayOfMonth(today), "yyyy-MM-dd");

export const getFirstDateOfMonth = (date: Date) => {
	return format(date, "yyyy-MM-01");
};

export const getLastDateOfMonth = (date: Date) => {
	return format(lastDayOfMonth(date), "yyyy-MM-dd");
};
