import useSWRMutation from "swr/mutation";
import { quoteRequestApi } from "@/api-client/quoteRequest";
import { CreateQuoteRequestInput, QuoteRequestForm } from "@/models/quoteRequest";

export function useSubmitQuoteRequest() {
	const { trigger, isMutating, error, reset } = useSWRMutation<
		QuoteRequestForm,
		Error,
		string,
		CreateQuoteRequestInput
	>("submit-quote-request", async (key, { arg }) => {
		return await quoteRequestApi.create(arg);
	});

	return {
		submit: trigger,
		isSubmitting: isMutating,
		error,
		reset,
	};
}
