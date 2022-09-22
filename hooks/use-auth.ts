/* eslint-disable @typescript-eslint/no-explicit-any */
import { authApi } from "@/api";
import useSWR from "swr";
import { PublicConfiguration } from "swr/dist/types";

// Auth --> Protected Pages
// <Auth>{children}</Auth>
export function useAuth(options?: Partial<PublicConfiguration>): {
	profile: any;
	error: any;
	login: () => void;
	logout: () => void;
	firstLoading: any;
} {
	const {
		data: profile,
		error,
		mutate,
	} = useSWR("/profile", {
		dedupingInterval: 60 * 60 * 1000, // 1hr
		revalidateOnFocus: false,
		...options,
	});

	const firstLoading = profile === undefined && error === undefined;

	async function login() {
		await authApi.login({
			username: "test1",
			password: "123123",
		});

		await mutate();
	}

	async function logout() {
		await authApi.logout();
		mutate(null, false);
	}

	return {
		profile,
		error,
		login,
		logout,
		firstLoading,
	};
}
