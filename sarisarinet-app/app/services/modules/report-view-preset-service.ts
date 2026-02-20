import { APIService } from "~/services/api-service";
import { apiClient, type ApiResponse } from "~/lib/api-client";
import { API_ENDPOINTS } from "~/configs/endpoints";
import type {
	ReportViewPreset,
	CreateReportViewPreset,
	UpdateReportViewPreset,
	GetAllReportViewPresets,
} from "~/zod/modules/report-view-preset.zod";

const { REPORT_VIEW_PRESET } = API_ENDPOINTS;

class ReportViewPresetService extends APIService {
	getAllReportViewPresets = async () => {
		try {
			const response: ApiResponse<GetAllReportViewPresets> = await apiClient.get(
				`${REPORT_VIEW_PRESET.GET_ALL}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			console.error("Error fetching reportViewPresets:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	getReportViewPresetById = async (reportViewPresetId: string) => {
		try {
			const response: ApiResponse<ReportViewPreset> = await apiClient.get(
				`${REPORT_VIEW_PRESET.GET_BY_ID.replace(":id", reportViewPresetId)}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			console.error("Error fetching reportViewPreset:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	createReportViewPreset = async (data: CreateReportViewPreset | FormData) => {
		try {
			const response: ApiResponse<ReportViewPreset> =
				data instanceof FormData
					? await apiClient.postFormData(REPORT_VIEW_PRESET.CREATE, data)
					: await apiClient.post(REPORT_VIEW_PRESET.CREATE, data);
			return response.data;
		} catch (error: any) {
			console.error("Error creating reportViewPreset:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	updateReportViewPreset = async (reportViewPresetId: string, data: UpdateReportViewPreset | FormData) => {
		try {
			const endpoint = REPORT_VIEW_PRESET.UPDATE.replace(":id", reportViewPresetId);
			const response: ApiResponse<ReportViewPreset> =
				data instanceof FormData
					? await apiClient.patchFormData(endpoint, data)
					: await apiClient.patch(endpoint, data);
			return response.data;
		} catch (error: any) {
			console.error("Error updating reportViewPreset:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	deleteReportViewPreset = async (reportViewPresetId: string) => {
		try {
			const response: ApiResponse<ReportViewPreset> = await apiClient.delete(
				REPORT_VIEW_PRESET.DELETE.replace(":id", reportViewPresetId),
			);
			return response.data;
		} catch (error: any) {
			console.error("Error deleting reportViewPreset:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};
}

export default new ReportViewPresetService();
