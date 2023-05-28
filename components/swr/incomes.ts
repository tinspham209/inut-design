import useSWR from "swr";
import { fetcher } from ".";

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
	const formattedStart = new Date(start).toISOString();
	const formattedEnd = new Date(end).toISOString();

	// Query to fetch income documents within the specified time range
	const query = `*[_type == "income" && date >= "${formattedStart}" && date <= "${formattedEnd}"]`;
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
