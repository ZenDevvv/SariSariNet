import { APIService } from "~/services/api-service";
import { apiClient, type ApiResponse } from "~/lib/api-client";
import { API_ENDPOINTS } from "~/configs/endpoints";
import type {
	TransactionInvoice,
	CreateTransactionInvoice,
	UpdateTransactionInvoice,
	GetAllTransactionInvoices,
} from "~/zod/modules/transaction-invoice.zod";

const { TRANSACTION_INVOICE } = API_ENDPOINTS;

class TransactionInvoiceService extends APIService {
	getAllTransactionInvoices = async () => {
		try {
			const response: ApiResponse<GetAllTransactionInvoices> = await apiClient.get(
				`${TRANSACTION_INVOICE.GET_ALL}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			console.error("Error fetching transactionInvoices:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	getTransactionInvoiceById = async (transactionInvoiceId: string) => {
		try {
			const response: ApiResponse<TransactionInvoice> = await apiClient.get(
				`${TRANSACTION_INVOICE.GET_BY_ID.replace(":id", transactionInvoiceId)}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			console.error("Error fetching transactionInvoice:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	createTransactionInvoice = async (data: CreateTransactionInvoice | FormData) => {
		try {
			const response: ApiResponse<TransactionInvoice> =
				data instanceof FormData
					? await apiClient.postFormData(TRANSACTION_INVOICE.CREATE, data)
					: await apiClient.post(TRANSACTION_INVOICE.CREATE, data);
			return response.data;
		} catch (error: any) {
			console.error("Error creating transactionInvoice:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	updateTransactionInvoice = async (transactionInvoiceId: string, data: UpdateTransactionInvoice | FormData) => {
		try {
			const endpoint = TRANSACTION_INVOICE.UPDATE.replace(":id", transactionInvoiceId);
			const response: ApiResponse<TransactionInvoice> =
				data instanceof FormData
					? await apiClient.patchFormData(endpoint, data)
					: await apiClient.patch(endpoint, data);
			return response.data;
		} catch (error: any) {
			console.error("Error updating transactionInvoice:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	deleteTransactionInvoice = async (transactionInvoiceId: string) => {
		try {
			const response: ApiResponse<TransactionInvoice> = await apiClient.delete(
				TRANSACTION_INVOICE.DELETE.replace(":id", transactionInvoiceId),
			);
			return response.data;
		} catch (error: any) {
			console.error("Error deleting transactionInvoice:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};
}

export default new TransactionInvoiceService();
