import axiosClient from "@/api-client/axios-client";
import {
	SendAbandonedCheckoutNotificationRequest,
	SendAbandonedCheckoutNotificationResponse,
} from "@/utils/telegram/telegram.types";
import useSWRMutation from "swr/mutation";

/**
 * SWR hook for sending Telegram abandoned checkout notifications
 */
export function useTelegramAbandonedCheckoutNotification() {
	const endpoint = "/telegram/send-abandoned-checkout-notification";

	const { trigger, isMutating, error } = useSWRMutation<
		SendAbandonedCheckoutNotificationResponse,
		Error,
		string,
		SendAbandonedCheckoutNotificationRequest
	>(endpoint, async (url, { arg }) => {
		const response = await axiosClient.post<SendAbandonedCheckoutNotificationResponse>(url, arg);
		return response.data;
	});

	const sendNotificationKeepAlive = (payload: SendAbandonedCheckoutNotificationRequest): void => {
		const headers: Record<string, string> = {
			"Content-Type": "application/json",
		};

		void fetch(`/api${endpoint}`, {
			method: "POST",
			headers,
			body: JSON.stringify(payload),
			keepalive: true,
		});
	};

	return {
		sendNotification: trigger,
		sendNotificationKeepAlive,
		isSending: isMutating,
		error,
	};
}
