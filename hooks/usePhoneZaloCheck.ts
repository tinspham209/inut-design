import axiosClient from "@/api-client/axios-client";
import { ValidatePhoneResponse } from "@/models/phoneValidation";
import { isZaloPhoneCheckEnabled } from "@/utils/env-const";
import { isValidVietnamesePhone, normalizePhone } from "@/utils/phone";
import { useEffect, useRef, useState } from "react";

export type PhoneZaloStatus = "idle" | "checking" | "registered" | "not_registered" | "unknown";

const ZALO_CHECK_DEBOUNCE_MS = 500;

export function usePhoneZaloCheck(phone: string) {
	const [status, setStatus] = useState<PhoneZaloStatus>("idle");
	const latestPhoneRef = useRef<string>(phone);

	useEffect(() => {
		latestPhoneRef.current = phone;
		setStatus("idle");

		const normalized = normalizePhone(phone);

		if (!isValidVietnamesePhone(normalized) || !isZaloPhoneCheckEnabled()) {
			return;
		}

		const timeoutId = window.setTimeout(async () => {
			setStatus("checking");
			try {
				const response = (await axiosClient.post("/validate-phone", {
					phone: normalized,
				})) as ValidatePhoneResponse;

				if (latestPhoneRef.current !== phone) {
					return;
				}

				if (response.zaloRegistered === true) {
					setStatus("registered");
				} else if (response.zaloRegistered === false) {
					setStatus("not_registered");
				} else {
					setStatus("unknown");
				}
			} catch {
				if (latestPhoneRef.current === phone) {
					setStatus("unknown");
				}
			}
		}, ZALO_CHECK_DEBOUNCE_MS);

		return () => {
			window.clearTimeout(timeoutId);
		};
	}, [phone]);

	return { status };
}
