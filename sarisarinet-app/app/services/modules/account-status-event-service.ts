import { APIService } from "~/services/api-service";
import { apiClient, type ApiResponse } from "~/lib/api-client";
import { API_ENDPOINTS } from "~/configs/endpoints";
import type {
	AccountStatusEvent,
	CreateAccountStatusEvent,
	UpdateAccountStatusEvent,
	GetAllAccountStatusEvents,
} from "~/zod/modules/account-status-event.zod";

const { ACCOUNT_STATUS_EVENT } = API_ENDPOINTS;

class AccountStatusEventService extends APIService {
	getAllAccountStatusEvents = async () => {
		try {
			const response: ApiResponse<GetAllAccountStatusEvents> = await apiClient.get(
				`${ACCOUNT_STATUS_EVENT.GET_ALL}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			console.error("Error fetching accountStatusEvents:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	getAccountStatusEventById = async (accountStatusEventId: string) => {
		try {
			const response: ApiResponse<AccountStatusEvent> = await apiClient.get(
				`${ACCOUNT_STATUS_EVENT.GET_BY_ID.replace(":id", accountStatusEventId)}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			console.error("Error fetching accountStatusEvent:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	createAccountStatusEvent = async (data: CreateAccountStatusEvent | FormData) => {
		try {
			const response: ApiResponse<AccountStatusEvent> =
				data instanceof FormData
					? await apiClient.postFormData(ACCOUNT_STATUS_EVENT.CREATE, data)
					: await apiClient.post(ACCOUNT_STATUS_EVENT.CREATE, data);
			return response.data;
		} catch (error: any) {
			console.error("Error creating accountStatusEvent:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	updateAccountStatusEvent = async (accountStatusEventId: string, data: UpdateAccountStatusEvent | FormData) => {
		try {
			const endpoint = ACCOUNT_STATUS_EVENT.UPDATE.replace(":id", accountStatusEventId);
			const response: ApiResponse<AccountStatusEvent> =
				data instanceof FormData
					? await apiClient.patchFormData(endpoint, data)
					: await apiClient.patch(endpoint, data);
			return response.data;
		} catch (error: any) {
			console.error("Error updating accountStatusEvent:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	deleteAccountStatusEvent = async (accountStatusEventId: string) => {
		try {
			const response: ApiResponse<AccountStatusEvent> = await apiClient.delete(
				ACCOUNT_STATUS_EVENT.DELETE.replace(":id", accountStatusEventId),
			);
			return response.data;
		} catch (error: any) {
			console.error("Error deleting accountStatusEvent:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};
}

export default new AccountStatusEventService();
