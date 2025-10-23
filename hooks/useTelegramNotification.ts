import axiosClient from "@/api-client/axios-client";
import {
	SendOrderNotificationRequest,
	SendOrderNotificationResponse,
} from "@/utils/telegram/telegram.types";
import useSWRMutation from "swr/mutation";

/**
 * SWR hook for sending Telegram order notifications
 */
export function useTelegramNotification() {
	const { trigger, isMutating, error } = useSWRMutation<
		SendOrderNotificationResponse,
		Error,
		string,
		SendOrderNotificationRequest
	>("/telegram/send-order-notification", async (url, { arg }) => {
		const response = await axiosClient.post<SendOrderNotificationResponse>(url, arg);
		return response.data;
	});

	return {
		sendNotification: trigger,
		isSending: isMutating,
		error,
	};
}
