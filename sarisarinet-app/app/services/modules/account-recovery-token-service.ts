import { APIService } from "~/services/api-service";
import { apiClient, type ApiResponse } from "~/lib/api-client";
import { API_ENDPOINTS } from "~/configs/endpoints";
import type {
	AccountRecoveryToken,
	CreateAccountRecoveryToken,
	UpdateAccountRecoveryToken,
	GetAllAccountRecoveryTokens,
} from "~/zod/modules/account-recovery-token.zod";

const { ACCOUNT_RECOVERY_TOKEN } = API_ENDPOINTS;

class AccountRecoveryTokenService extends APIService {
	getAllAccountRecoveryTokens = async () => {
		try {
			const response: ApiResponse<GetAllAccountRecoveryTokens> = await apiClient.get(
				`${ACCOUNT_RECOVERY_TOKEN.GET_ALL}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			console.error("Error fetching accountRecoveryTokens:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	getAccountRecoveryTokenById = async (accountRecoveryTokenId: string) => {
		try {
			const response: ApiResponse<AccountRecoveryToken> = await apiClient.get(
				`${ACCOUNT_RECOVERY_TOKEN.GET_BY_ID.replace(":id", accountRecoveryTokenId)}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			console.error("Error fetching accountRecoveryToken:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	createAccountRecoveryToken = async (data: CreateAccountRecoveryToken | FormData) => {
		try {
			const response: ApiResponse<AccountRecoveryToken> =
				data instanceof FormData
					? await apiClient.postFormData(ACCOUNT_RECOVERY_TOKEN.CREATE, data)
					: await apiClient.post(ACCOUNT_RECOVERY_TOKEN.CREATE, data);
			return response.data;
		} catch (error: any) {
			console.error("Error creating accountRecoveryToken:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	updateAccountRecoveryToken = async (accountRecoveryTokenId: string, data: UpdateAccountRecoveryToken | FormData) => {
		try {
			const endpoint = ACCOUNT_RECOVERY_TOKEN.UPDATE.replace(":id", accountRecoveryTokenId);
			const response: ApiResponse<AccountRecoveryToken> =
				data instanceof FormData
					? await apiClient.patchFormData(endpoint, data)
					: await apiClient.patch(endpoint, data);
			return response.data;
		} catch (error: any) {
			console.error("Error updating accountRecoveryToken:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	deleteAccountRecoveryToken = async (accountRecoveryTokenId: string) => {
		try {
			const response: ApiResponse<AccountRecoveryToken> = await apiClient.delete(
				ACCOUNT_RECOVERY_TOKEN.DELETE.replace(":id", accountRecoveryTokenId),
			);
			return response.data;
		} catch (error: any) {
			console.error("Error deleting accountRecoveryToken:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};
}

export default new AccountRecoveryTokenService();
