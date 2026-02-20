import { APIService } from "~/services/api-service";
import { apiClient, type ApiResponse } from "~/lib/api-client";
import { API_ENDPOINTS } from "~/configs/endpoints";
import type {
	BorrowingRecord,
	CreateBorrowingRecord,
	UpdateBorrowingRecord,
	GetAllBorrowingRecords,
} from "~/zod/modules/borrowing-record.zod";

const { BORROWING_RECORD } = API_ENDPOINTS;

class BorrowingRecordService extends APIService {
	getAllBorrowingRecords = async () => {
		try {
			const response: ApiResponse<GetAllBorrowingRecords> = await apiClient.get(
				`${BORROWING_RECORD.GET_ALL}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			console.error("Error fetching borrowingRecords:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	getBorrowingRecordById = async (borrowingRecordId: string) => {
		try {
			const response: ApiResponse<BorrowingRecord> = await apiClient.get(
				`${BORROWING_RECORD.GET_BY_ID.replace(":id", borrowingRecordId)}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			console.error("Error fetching borrowingRecord:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	createBorrowingRecord = async (data: CreateBorrowingRecord | FormData) => {
		try {
			const response: ApiResponse<BorrowingRecord> =
				data instanceof FormData
					? await apiClient.postFormData(BORROWING_RECORD.CREATE, data)
					: await apiClient.post(BORROWING_RECORD.CREATE, data);
			return response.data;
		} catch (error: any) {
			console.error("Error creating borrowingRecord:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	updateBorrowingRecord = async (borrowingRecordId: string, data: UpdateBorrowingRecord | FormData) => {
		try {
			const endpoint = BORROWING_RECORD.UPDATE.replace(":id", borrowingRecordId);
			const response: ApiResponse<BorrowingRecord> =
				data instanceof FormData
					? await apiClient.patchFormData(endpoint, data)
					: await apiClient.patch(endpoint, data);
			return response.data;
		} catch (error: any) {
			console.error("Error updating borrowingRecord:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	deleteBorrowingRecord = async (borrowingRecordId: string) => {
		try {
			const response: ApiResponse<BorrowingRecord> = await apiClient.delete(
				BORROWING_RECORD.DELETE.replace(":id", borrowingRecordId),
			);
			return response.data;
		} catch (error: any) {
			console.error("Error deleting borrowingRecord:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};
}

export default new BorrowingRecordService();
