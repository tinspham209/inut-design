import { firstDateOfMonth, lastDateOfMonth } from "@/utils";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { creater, fetcher } from ".";

export function useGetAllCosts() {
	const query = `*[_type == "costs"]{
		"id": _id,
		"createdAt": _createdAt,
		title,
		date,
		price
	}`;

	const { data, error, mutate, isLoading } = useSWR(query, fetcher, {
		revalidateOnFocus: false,
	});
	return {
		costs: data,
		isLoading: isLoading,
		isError: error,
		refetch: mutate,
	};
}

export function useGetByDateRange(start?: Date, end?: Date) {
	const formattedStart = start
		? new Date(start).toISOString()
		: new Date(firstDateOfMonth).toISOString();
	const formattedEnd = end ? new Date(end).toISOString() : new Date(lastDateOfMonth).toISOString();

	const query = `*[_type == "costs" && date >= "${formattedStart}" && date <= "${formattedEnd}"]{
		"id": _id,
		"createdAt": _createdAt,
		title,
		date,
		price
	}`;
	const { data, error, isLoading, mutate } = useSWR(query, fetcher, {
		revalidateOnFocus: true,
		revalidateIfStale: true,
		revalidateOnMount: true,
	});

	return {
		costs: data,
		isLoading: isLoading,
		isError: error,
		refetch: mutate,
	};
}

export function useGetById(id: string) {
	const query = `*[_type == "costs" && _id == "${id}"]`;
	const { data, error, isLoading } = useSWR(query, fetcher, {
		revalidateOnFocus: false,
	});

	return {
		data: data,
		isLoading: isLoading,
		isError: error,
	};
}

export function useCreateNew() {
	const { trigger, data, error, isMutating } = useSWRMutation("/api/costs/create", creater);

	return {
		createCost: trigger,
		data: data,
		isLoading: isMutating,
		isError: error,
	};
}

const costsModules = {
	useGetAllCosts,
	useGetByDateRange,
	useGetById,
	useCreateNew,
};

export default costsModules;
