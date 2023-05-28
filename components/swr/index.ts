import { client } from "@/api-client/sanity-client";

export async function fetcher(query: string) {
	const response = await client.fetch(query);
	return response;
}

export * from "./StudentDetail";
export { default as swrIncomes } from "./incomes";
