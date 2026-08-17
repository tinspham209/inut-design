export interface ValidatePhoneResponse {
	success: boolean;
	formatValid: boolean;
	zaloRegistered: boolean | null;
	error?: string;
}
