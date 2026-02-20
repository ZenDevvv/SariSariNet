import { APIService } from "~/services/api-service";
import { apiClient, type ApiResponse } from "~/lib/api-client";
import { API_ENDPOINTS } from "~/configs/endpoints";
import type {
	BorrowingMetricSnapshot,
	CreateBorrowingMetricSnapshot,
	UpdateBorrowingMetricSnapshot,
	GetAllBorrowingMetricSnapshots,
} from "~/zod/modules/borrowing-metric-snapshot.zod";

const { BORROWING_METRIC_SNAPSHOT } = API_ENDPOINTS;

class BorrowingMetricSnapshotService extends APIService {
	getAllBorrowingMetricSnapshots = async () => {
		try {
			const response: ApiResponse<GetAllBorrowingMetricSnapshots> = await apiClient.get(
				`${BORROWING_METRIC_SNAPSHOT.GET_ALL}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			console.error("Error fetching borrowingMetricSnapshots:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	getBorrowingMetricSnapshotById = async (borrowingMetricSnapshotId: string) => {
		try {
			const response: ApiResponse<BorrowingMetricSnapshot> = await apiClient.get(
				`${BORROWING_METRIC_SNAPSHOT.GET_BY_ID.replace(":id", borrowingMetricSnapshotId)}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			console.error("Error fetching borrowingMetricSnapshot:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	createBorrowingMetricSnapshot = async (data: CreateBorrowingMetricSnapshot | FormData) => {
		try {
			const response: ApiResponse<BorrowingMetricSnapshot> =
				data instanceof FormData
					? await apiClient.postFormData(BORROWING_METRIC_SNAPSHOT.CREATE, data)
					: await apiClient.post(BORROWING_METRIC_SNAPSHOT.CREATE, data);
			return response.data;
		} catch (error: any) {
			console.error("Error creating borrowingMetricSnapshot:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	updateBorrowingMetricSnapshot = async (borrowingMetricSnapshotId: string, data: UpdateBorrowingMetricSnapshot | FormData) => {
		try {
			const endpoint = BORROWING_METRIC_SNAPSHOT.UPDATE.replace(":id", borrowingMetricSnapshotId);
			const response: ApiResponse<BorrowingMetricSnapshot> =
				data instanceof FormData
					? await apiClient.patchFormData(endpoint, data)
					: await apiClient.patch(endpoint, data);
			return response.data;
		} catch (error: any) {
			console.error("Error updating borrowingMetricSnapshot:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	deleteBorrowingMetricSnapshot = async (borrowingMetricSnapshotId: string) => {
		try {
			const response: ApiResponse<BorrowingMetricSnapshot> = await apiClient.delete(
				BORROWING_METRIC_SNAPSHOT.DELETE.replace(":id", borrowingMetricSnapshotId),
			);
			return response.data;
		} catch (error: any) {
			console.error("Error deleting borrowingMetricSnapshot:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};
}

export default new BorrowingMetricSnapshotService();
