import axiosClient from "@/api-client/axios-client";
import { QuoteRequestForm } from "@/models/quoteRequest";
import useSWRMutation from "swr/mutation";

interface SendQuoteNotificationRequest {
	quoteData: QuoteRequestForm;
}

interface SendQuoteNotificationResponse {
	success: boolean;
	messageId?: number;
	error?: string;
}

export function useTelegramQuoteNotification() {
	const { trigger, isMutating, error } = useSWRMutation<
		SendQuoteNotificationResponse,
		Error,
		string,
		SendQuoteNotificationRequest
	>("/telegram/send-quote-notification", async (url, { arg }) => {
		const response = await axiosClient.post<SendQuoteNotificationResponse>(url, arg);
		return response.data;
	});

	return {
		sendNotification: trigger,
		isSending: isMutating,
		error,
	};
}
