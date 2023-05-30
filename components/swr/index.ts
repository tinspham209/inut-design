import { client } from "@/api-client/sanity-client";

export async function fetcher(query: string) {
	const response = await client.fetch(query);
	return response;
}

export async function creater(body, { arg }) {
	await client
		.create(arg)
		.then((res) => {
			return res;
		})
		.catch((error) => {
			throw new Error(error);
		});
}

export * from "./StudentDetail";
export { default as swrIncomes } from "./incomes";
export { default as swrCosts } from "./costs";
