import { APIService } from "~/services/api-service";
import { apiClient, type ApiResponse } from "~/lib/api-client";
import { API_ENDPOINTS } from "~/configs/endpoints";
import type {
	ReportExportJob,
	CreateReportExportJob,
	UpdateReportExportJob,
	GetAllReportExportJobs,
} from "~/zod/modules/report-export-job.zod";

const { REPORT_EXPORT_JOB } = API_ENDPOINTS;

class ReportExportJobService extends APIService {
	getAllReportExportJobs = async () => {
		try {
			const response: ApiResponse<GetAllReportExportJobs> = await apiClient.get(
				`${REPORT_EXPORT_JOB.GET_ALL}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			console.error("Error fetching reportExportJobs:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	getReportExportJobById = async (reportExportJobId: string) => {
		try {
			const response: ApiResponse<ReportExportJob> = await apiClient.get(
				`${REPORT_EXPORT_JOB.GET_BY_ID.replace(":id", reportExportJobId)}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			console.error("Error fetching reportExportJob:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	createReportExportJob = async (data: CreateReportExportJob | FormData) => {
		try {
			const response: ApiResponse<ReportExportJob> =
				data instanceof FormData
					? await apiClient.postFormData(REPORT_EXPORT_JOB.CREATE, data)
					: await apiClient.post(REPORT_EXPORT_JOB.CREATE, data);
			return response.data;
		} catch (error: any) {
			console.error("Error creating reportExportJob:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	updateReportExportJob = async (reportExportJobId: string, data: UpdateReportExportJob | FormData) => {
		try {
			const endpoint = REPORT_EXPORT_JOB.UPDATE.replace(":id", reportExportJobId);
			const response: ApiResponse<ReportExportJob> =
				data instanceof FormData
					? await apiClient.patchFormData(endpoint, data)
					: await apiClient.patch(endpoint, data);
			return response.data;
		} catch (error: any) {
			console.error("Error updating reportExportJob:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	deleteReportExportJob = async (reportExportJobId: string) => {
		try {
			const response: ApiResponse<ReportExportJob> = await apiClient.delete(
				REPORT_EXPORT_JOB.DELETE.replace(":id", reportExportJobId),
			);
			return response.data;
		} catch (error: any) {
			console.error("Error deleting reportExportJob:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};
}

export default new ReportExportJobService();
