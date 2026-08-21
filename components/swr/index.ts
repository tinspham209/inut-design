import { client } from "@/api-client/sanity-browser";

export async function fetcher(query: string) {
	const response = await client.fetch(query);
	return response;
}

export async function creater(key: string, { arg }) {
	const response = await fetch(key, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(arg),
	});
	if (!response.ok) {
		throw new Error("Failed to create record.");
	}
	return response.json();
}

export * from "./StudentDetail";
export { default as swrIncomes } from "./incomes";
export { default as swrCosts } from "./costs";
