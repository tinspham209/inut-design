import { CreateQuoteRequestInput, QuoteRequestForm } from "../models/quoteRequest";

export const quoteRequestApi = {
	async create(input: CreateQuoteRequestInput): Promise<QuoteRequestForm> {
		const response = await fetch("/api/quote-request", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(input),
		});
		if (!response.ok) {
			const payload = await response.json().catch(() => null);
			throw new Error(payload?.error || "Failed to submit quote request.");
		}
		return response.json();
	},
};
