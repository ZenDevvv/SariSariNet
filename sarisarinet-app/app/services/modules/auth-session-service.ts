import { APIService } from "~/services/api-service";
import { apiClient, type ApiResponse } from "~/lib/api-client";
import { API_ENDPOINTS } from "~/configs/endpoints";
import type {
	AuthSession,
	CreateAuthSession,
	UpdateAuthSession,
	GetAllAuthSessions,
} from "~/zod/modules/auth-session.zod";

const { AUTH_SESSION } = API_ENDPOINTS;

class AuthSessionService extends APIService {
	getAllAuthSessions = async () => {
		try {
			const response: ApiResponse<GetAllAuthSessions> = await apiClient.get(
				`${AUTH_SESSION.GET_ALL}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			console.error("Error fetching authSessions:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	getAuthSessionById = async (authSessionId: string) => {
		try {
			const response: ApiResponse<AuthSession> = await apiClient.get(
				`${AUTH_SESSION.GET_BY_ID.replace(":id", authSessionId)}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			console.error("Error fetching authSession:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	createAuthSession = async (data: CreateAuthSession | FormData) => {
		try {
			const response: ApiResponse<AuthSession> =
				data instanceof FormData
					? await apiClient.postFormData(AUTH_SESSION.CREATE, data)
					: await apiClient.post(AUTH_SESSION.CREATE, data);
			return response.data;
		} catch (error: any) {
			console.error("Error creating authSession:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	updateAuthSession = async (authSessionId: string, data: UpdateAuthSession | FormData) => {
		try {
			const endpoint = AUTH_SESSION.UPDATE.replace(":id", authSessionId);
			const response: ApiResponse<AuthSession> =
				data instanceof FormData
					? await apiClient.patchFormData(endpoint, data)
					: await apiClient.patch(endpoint, data);
			return response.data;
		} catch (error: any) {
			console.error("Error updating authSession:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	deleteAuthSession = async (authSessionId: string) => {
		try {
			const response: ApiResponse<AuthSession> = await apiClient.delete(
				AUTH_SESSION.DELETE.replace(":id", authSessionId),
			);
			return response.data;
		} catch (error: any) {
			console.error("Error deleting authSession:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};
}

export default new AuthSessionService();
