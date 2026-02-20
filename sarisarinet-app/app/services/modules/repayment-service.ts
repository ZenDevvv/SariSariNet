import { APIService } from "~/services/api-service";
import { apiClient, type ApiResponse } from "~/lib/api-client";
import { API_ENDPOINTS } from "~/configs/endpoints";
import type {
	Repayment,
	CreateRepayment,
	UpdateRepayment,
	GetAllRepayments,
} from "~/zod/modules/repayment.zod";

const { REPAYMENT } = API_ENDPOINTS;

class RepaymentService extends APIService {
	getAllRepayments = async () => {
		try {
			const response: ApiResponse<GetAllRepayments> = await apiClient.get(
				`${REPAYMENT.GET_ALL}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			console.error("Error fetching repayments:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	getRepaymentById = async (repaymentId: string) => {
		try {
			const response: ApiResponse<Repayment> = await apiClient.get(
				`${REPAYMENT.GET_BY_ID.replace(":id", repaymentId)}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			console.error("Error fetching repayment:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	createRepayment = async (data: CreateRepayment | FormData) => {
		try {
			const response: ApiResponse<Repayment> =
				data instanceof FormData
					? await apiClient.postFormData(REPAYMENT.CREATE, data)
					: await apiClient.post(REPAYMENT.CREATE, data);
			return response.data;
		} catch (error: any) {
			console.error("Error creating repayment:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	updateRepayment = async (repaymentId: string, data: UpdateRepayment | FormData) => {
		try {
			const endpoint = REPAYMENT.UPDATE.replace(":id", repaymentId);
			const response: ApiResponse<Repayment> =
				data instanceof FormData
					? await apiClient.patchFormData(endpoint, data)
					: await apiClient.patch(endpoint, data);
			return response.data;
		} catch (error: any) {
			console.error("Error updating repayment:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	deleteRepayment = async (repaymentId: string) => {
		try {
			const response: ApiResponse<Repayment> = await apiClient.delete(
				REPAYMENT.DELETE.replace(":id", repaymentId),
			);
			return response.data;
		} catch (error: any) {
			console.error("Error deleting repayment:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};
}

export default new RepaymentService();
