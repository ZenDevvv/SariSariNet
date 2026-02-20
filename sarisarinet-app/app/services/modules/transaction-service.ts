import { APIService } from "~/services/api-service";
import { apiClient, type ApiResponse } from "~/lib/api-client";
import { API_ENDPOINTS } from "~/configs/endpoints";
import type {
	Transaction,
	CreateTransaction,
	UpdateTransaction,
	GetAllTransactions,
} from "~/zod/modules/transaction.zod";

const { TRANSACTION } = API_ENDPOINTS;

class TransactionService extends APIService {
	getAllTransactions = async () => {
		try {
			const response: ApiResponse<GetAllTransactions> = await apiClient.get(
				`${TRANSACTION.GET_ALL}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			console.error("Error fetching transactions:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	getTransactionById = async (transactionId: string) => {
		try {
			const response: ApiResponse<Transaction> = await apiClient.get(
				`${TRANSACTION.GET_BY_ID.replace(":id", transactionId)}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			console.error("Error fetching transaction:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	createTransaction = async (data: CreateTransaction | FormData) => {
		try {
			const response: ApiResponse<Transaction> =
				data instanceof FormData
					? await apiClient.postFormData(TRANSACTION.CREATE, data)
					: await apiClient.post(TRANSACTION.CREATE, data);
			return response.data;
		} catch (error: any) {
			console.error("Error creating transaction:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	updateTransaction = async (transactionId: string, data: UpdateTransaction | FormData) => {
		try {
			const endpoint = TRANSACTION.UPDATE.replace(":id", transactionId);
			const response: ApiResponse<Transaction> =
				data instanceof FormData
					? await apiClient.patchFormData(endpoint, data)
					: await apiClient.patch(endpoint, data);
			return response.data;
		} catch (error: any) {
			console.error("Error updating transaction:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	deleteTransaction = async (transactionId: string) => {
		try {
			const response: ApiResponse<Transaction> = await apiClient.delete(
				TRANSACTION.DELETE.replace(":id", transactionId),
			);
			return response.data;
		} catch (error: any) {
			console.error("Error deleting transaction:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};
}

export default new TransactionService();
