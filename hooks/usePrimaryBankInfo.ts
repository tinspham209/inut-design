import useSWR from "swr";
import { bankInfoApi } from "@/api-client/bankInfo";
import { BankInfo } from "@/models/bankInfo";

export function usePrimaryBankInfo(enabled: boolean) {
	const { data, error, isLoading } = useSWR<BankInfo>(enabled ? "primaryBankInfo" : null, () =>
		bankInfoApi.getPrimaryBankAccount()
	);
	return { data, error, isLoading };
}
