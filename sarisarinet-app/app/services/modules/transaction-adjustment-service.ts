import { APIService } from "~/services/api-service";
import { apiClient, type ApiResponse } from "~/lib/api-client";
import { API_ENDPOINTS } from "~/configs/endpoints";
import type {
	TransactionAdjustment,
	CreateTransactionAdjustment,
	UpdateTransactionAdjustment,
	GetAllTransactionAdjustments,
} from "~/zod/modules/transaction-adjustment.zod";

const { TRANSACTION_ADJUSTMENT } = API_ENDPOINTS;

class TransactionAdjustmentService extends APIService {
	getAllTransactionAdjustments = async () => {
		try {
			const response: ApiResponse<GetAllTransactionAdjustments> = await apiClient.get(
				`${TRANSACTION_ADJUSTMENT.GET_ALL}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			console.error("Error fetching transactionAdjustments:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	getTransactionAdjustmentById = async (transactionAdjustmentId: string) => {
		try {
			const response: ApiResponse<TransactionAdjustment> = await apiClient.get(
				`${TRANSACTION_ADJUSTMENT.GET_BY_ID.replace(":id", transactionAdjustmentId)}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			console.error("Error fetching transactionAdjustment:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	createTransactionAdjustment = async (data: CreateTransactionAdjustment | FormData) => {
		try {
			const response: ApiResponse<TransactionAdjustment> =
				data instanceof FormData
					? await apiClient.postFormData(TRANSACTION_ADJUSTMENT.CREATE, data)
					: await apiClient.post(TRANSACTION_ADJUSTMENT.CREATE, data);
			return response.data;
		} catch (error: any) {
			console.error("Error creating transactionAdjustment:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	updateTransactionAdjustment = async (transactionAdjustmentId: string, data: UpdateTransactionAdjustment | FormData) => {
		try {
			const endpoint = TRANSACTION_ADJUSTMENT.UPDATE.replace(":id", transactionAdjustmentId);
			const response: ApiResponse<TransactionAdjustment> =
				data instanceof FormData
					? await apiClient.patchFormData(endpoint, data)
					: await apiClient.patch(endpoint, data);
			return response.data;
		} catch (error: any) {
			console.error("Error updating transactionAdjustment:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	deleteTransactionAdjustment = async (transactionAdjustmentId: string) => {
		try {
			const response: ApiResponse<TransactionAdjustment> = await apiClient.delete(
				TRANSACTION_ADJUSTMENT.DELETE.replace(":id", transactionAdjustmentId),
			);
			return response.data;
		} catch (error: any) {
			console.error("Error deleting transactionAdjustment:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};
}

export default new TransactionAdjustmentService();
