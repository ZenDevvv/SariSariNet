import { APIService } from "~/services/api-service";
import { apiClient, type ApiResponse } from "~/lib/api-client";
import { API_ENDPOINTS } from "~/configs/endpoints";
import type {
	BorrowingAuditEntry,
	CreateBorrowingAuditEntry,
	UpdateBorrowingAuditEntry,
	GetAllBorrowingAuditEntrys,
} from "~/zod/modules/borrowing-audit-entry.zod";

const { BORROWING_AUDIT_ENTRY } = API_ENDPOINTS;

class BorrowingAuditEntryService extends APIService {
	getAllBorrowingAuditEntries = async () => {
		try {
			const response: ApiResponse<GetAllBorrowingAuditEntrys> = await apiClient.get(
				`${BORROWING_AUDIT_ENTRY.GET_ALL}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			console.error("Error fetching borrowingAuditEntries:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	getBorrowingAuditEntryById = async (borrowingAuditEntryId: string) => {
		try {
			const response: ApiResponse<BorrowingAuditEntry> = await apiClient.get(
				`${BORROWING_AUDIT_ENTRY.GET_BY_ID.replace(":id", borrowingAuditEntryId)}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			console.error("Error fetching borrowingAuditEntry:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	createBorrowingAuditEntry = async (data: CreateBorrowingAuditEntry | FormData) => {
		try {
			const response: ApiResponse<BorrowingAuditEntry> =
				data instanceof FormData
					? await apiClient.postFormData(BORROWING_AUDIT_ENTRY.CREATE, data)
					: await apiClient.post(BORROWING_AUDIT_ENTRY.CREATE, data);
			return response.data;
		} catch (error: any) {
			console.error("Error creating borrowingAuditEntry:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	updateBorrowingAuditEntry = async (borrowingAuditEntryId: string, data: UpdateBorrowingAuditEntry | FormData) => {
		try {
			const endpoint = BORROWING_AUDIT_ENTRY.UPDATE.replace(":id", borrowingAuditEntryId);
			const response: ApiResponse<BorrowingAuditEntry> =
				data instanceof FormData
					? await apiClient.patchFormData(endpoint, data)
					: await apiClient.patch(endpoint, data);
			return response.data;
		} catch (error: any) {
			console.error("Error updating borrowingAuditEntry:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	deleteBorrowingAuditEntry = async (borrowingAuditEntryId: string) => {
		try {
			const response: ApiResponse<BorrowingAuditEntry> = await apiClient.delete(
				BORROWING_AUDIT_ENTRY.DELETE.replace(":id", borrowingAuditEntryId),
			);
			return response.data;
		} catch (error: any) {
			console.error("Error deleting borrowingAuditEntry:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};
}

export default new BorrowingAuditEntryService();
