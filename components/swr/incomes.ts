import useSWR from "swr";
import { fetcher } from ".";
import { firstDateOfMonth, lastDateOfMonth } from "@/utils";

export function useAllIncomes() {
	const query = '*[_type == "income"]';

	const { data, error } = useSWR(query, fetcher, {
		revalidateOnFocus: false,
	});
	return {
		incomes: data,
		isLoading: !error && !data,
		isError: error,
	};
}

export function useIncomeWithDateRange(start: Date, end: Date) {
	const formattedStart = start
		? new Date(start).toISOString()
		: new Date(firstDateOfMonth).toISOString();
	const formattedEnd = end ? new Date(end).toISOString() : new Date(lastDateOfMonth).toISOString();

	// Query to fetch income documents within the specified time range
	const query = `*[_type == "income" && date >= "${formattedStart}" && date <= "${formattedEnd}"]{
		"id": _id,
		"createdAt": _createdAt,
		title,
		date,
		discount,
		vienManHinh,
		matPhim,
		matDay,
		matLung
	}`;
	const { data, error } = useSWR(query, fetcher, {
		revalidateOnFocus: false,
	});

	return {
		incomes: data,
		isLoading: !error && !data,
		isError: error,
	};
}

export function useGetById(id: string) {
	const query = `*[_type == "income" && _id == "${id}"]`;
	const { data, error } = useSWR(query, fetcher, {
		revalidateOnFocus: false,
	});

	return {
		data: data,
		isLoading: !error && !data,
		isError: error,
	};
}

const incomeModules = {
	useAllIncomes,
	useIncomeWithDateRange,
	useGetById,
};

export default incomeModules;
