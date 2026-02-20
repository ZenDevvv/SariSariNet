import { APIService } from "~/services/api-service";
import { apiClient, type ApiResponse } from "~/lib/api-client";
import { API_ENDPOINTS } from "~/configs/endpoints";
import type {
	SuggestionLayoutPreference,
	CreateSuggestionLayoutPreference,
	UpdateSuggestionLayoutPreference,
	GetAllSuggestionLayoutPreferences,
} from "~/zod/modules/suggestion-layout-preference.zod";

const { SUGGESTION_LAYOUT_PREFERENCE } = API_ENDPOINTS;

class SuggestionLayoutPreferenceService extends APIService {
	getAllSuggestionLayoutPreferences = async () => {
		try {
			const response: ApiResponse<GetAllSuggestionLayoutPreferences> = await apiClient.get(
				`${SUGGESTION_LAYOUT_PREFERENCE.GET_ALL}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			console.error("Error fetching suggestionLayoutPreferences:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	getSuggestionLayoutPreferenceById = async (suggestionLayoutPreferenceId: string) => {
		try {
			const response: ApiResponse<SuggestionLayoutPreference> = await apiClient.get(
				`${SUGGESTION_LAYOUT_PREFERENCE.GET_BY_ID.replace(":id", suggestionLayoutPreferenceId)}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			console.error("Error fetching suggestionLayoutPreference:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	createSuggestionLayoutPreference = async (data: CreateSuggestionLayoutPreference | FormData) => {
		try {
			const response: ApiResponse<SuggestionLayoutPreference> =
				data instanceof FormData
					? await apiClient.postFormData(SUGGESTION_LAYOUT_PREFERENCE.CREATE, data)
					: await apiClient.post(SUGGESTION_LAYOUT_PREFERENCE.CREATE, data);
			return response.data;
		} catch (error: any) {
			console.error("Error creating suggestionLayoutPreference:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	updateSuggestionLayoutPreference = async (suggestionLayoutPreferenceId: string, data: UpdateSuggestionLayoutPreference | FormData) => {
		try {
			const endpoint = SUGGESTION_LAYOUT_PREFERENCE.UPDATE.replace(":id", suggestionLayoutPreferenceId);
			const response: ApiResponse<SuggestionLayoutPreference> =
				data instanceof FormData
					? await apiClient.patchFormData(endpoint, data)
					: await apiClient.patch(endpoint, data);
			return response.data;
		} catch (error: any) {
			console.error("Error updating suggestionLayoutPreference:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	deleteSuggestionLayoutPreference = async (suggestionLayoutPreferenceId: string) => {
		try {
			const response: ApiResponse<SuggestionLayoutPreference> = await apiClient.delete(
				SUGGESTION_LAYOUT_PREFERENCE.DELETE.replace(":id", suggestionLayoutPreferenceId),
			);
			return response.data;
		} catch (error: any) {
			console.error("Error deleting suggestionLayoutPreference:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};
}

export default new SuggestionLayoutPreferenceService();
