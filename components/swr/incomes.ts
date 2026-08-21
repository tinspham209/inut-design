import { firstDateOfMonth, lastDateOfMonth } from "@/utils";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { creater, fetcher } from ".";

const INCOME_FIELDS = `{
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

export function useAllIncomes() {
	const query = `*[_type == "income"]${INCOME_FIELDS}`;

	const { data, error, mutate, isLoading } = useSWR(query, fetcher, {
		revalidateOnFocus: false,
	});
	return {
		incomes: data,
		isLoading: isLoading,
		isError: error,
		refetch: mutate,
	};
}

export function useIncomeWithDateRange(start?: Date, end?: Date) {
	const formattedStart = start
		? new Date(start).toISOString()
		: new Date(firstDateOfMonth).toISOString();
	const formattedEnd = end ? new Date(end).toISOString() : new Date(lastDateOfMonth).toISOString();

	// Query to fetch income documents within the specified time range
	const query = `*[_type == "income" && date >= "${formattedStart}" && date <= "${formattedEnd}"]${INCOME_FIELDS}`;
	const { data, error, isLoading, mutate } = useSWR(query, fetcher, {
		revalidateOnFocus: true,
		revalidateIfStale: true,
		revalidateOnMount: true,
	});

	return {
		incomes: data,
		isLoading: isLoading,
		isError: error,
		refetch: mutate,
	};
}

export function useGetById(id: string) {
	const query = `*[_type == "income" && _id == "${id}"]${INCOME_FIELDS}`;
	const { data, error, isLoading } = useSWR(query, fetcher, {
		revalidateOnFocus: false,
	});

	return {
		data: data,
		isLoading: isLoading,
		isError: error,
	};
}

export function useCreateIncome() {
	const { trigger, data, error, isMutating } = useSWRMutation("/api/income/create", creater);

	return {
		createIncome: trigger,
		data: data,
		isLoading: isMutating,
		isError: error,
	};
}

const incomeModules = {
	useAllIncomes,
	useIncomeWithDateRange,
	useGetById,
	useCreateIncome,
};

export default incomeModules;
