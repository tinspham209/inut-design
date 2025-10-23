import axios, { AxiosError } from "axios";

const axiosClient = axios.create({
	baseURL: "/api",
	headers: {
		"Content-Type": "application/json",
	},
});

// Add a request interceptor (metadata)
axiosClient.interceptors.request.use(
	(config) => {
		const headers: Record<string, string> = (config.headers =
			(config.headers as Record<string, string>) || {});
		// Attach a lightweight request id + timestamp for tracing (no PII)
		headers["x-request-id"] = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
		headers["x-request-ts"] = new Date().toISOString();
		// Auth token injection placeholder (uncomment if/when an auth flow is added)
		// const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
		// if (token) (config.headers as any).Authorization = `Bearer ${token}`
		return config;
	},
	(error) => Promise.reject(error)
);

// Add a response interceptor with normalized error handling
axiosClient.interceptors.response.use(
	(response) => {
		// Success: unwrap data to keep existing behavior
		return response.data;
	},
	(error: AxiosError) => {
		// Handle cancellation explicitly
		if (axios.isCancel(error)) {
			return Promise.reject({
				isCanceled: true,
				message: "Request canceled",
				original: error,
			});
		}

		// Server responded with a status outside 2xx
		if (error.response) {
			const { status, data, headers } = error.response;
			// Attempt to derive a human-readable message from known fields
			const maybeData: unknown = data;
			let derivedMessage: string | undefined;
			if (maybeData && typeof maybeData === "object") {
				const msgCandidate =
					(maybeData as { message?: string; error?: string }).message ||
					(maybeData as { message?: string; error?: string }).error;
				if (msgCandidate) derivedMessage = msgCandidate;
			}
			const message = derivedMessage || error.message || "Request failed";
			const normalizedError = {
				status,
				message,
				data,
				headers,
				isAxiosError: true,
				original: error,
			};
			return Promise.reject(normalizedError);
		}

		// No response received (network error / CORS / timeout)
		if (error.request) {
			return Promise.reject({
				status: 0,
				message: "No response received from server",
				isAxiosError: true,
				original: error,
			});
		}

		// Something else happened while setting up the request
		return Promise.reject({
			status: 0,
			message: error.message || "Unexpected error",
			isAxiosError: true,
			original: error,
		});
	}
);

export default axiosClient;
