import { CreateQuoteRequestInput, QuoteRequestForm } from "../models/quoteRequest";

export const quoteRequestApi = {
	async create(input: CreateQuoteRequestInput): Promise<QuoteRequestForm> {
		const response = await fetch("/api/quote-request", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(input),
		});
		if (!response.ok) {
			const payload: unknown = await response.json().catch(() => null);
			throw new Error(
				typeof (payload as { error?: unknown })?.error === "string"
					? (payload as { error: string }).error
					: "Failed to submit quote request."
			);
		}
		return response.json();
	},
};
