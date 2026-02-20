import { APIService } from "~/services/api-service";
import { apiClient, type ApiResponse } from "~/lib/api-client";
import { API_ENDPOINTS } from "~/configs/endpoints";
import type {
	CommerceMetricSnapshot,
	CreateCommerceMetricSnapshot,
	UpdateCommerceMetricSnapshot,
	GetAllCommerceMetricSnapshots,
} from "~/zod/modules/commerce-metric-snapshot.zod";

const { COMMERCE_METRIC_SNAPSHOT } = API_ENDPOINTS;

class CommerceMetricSnapshotService extends APIService {
	getAllCommerceMetricSnapshots = async () => {
		try {
			const response: ApiResponse<GetAllCommerceMetricSnapshots> = await apiClient.get(
				`${COMMERCE_METRIC_SNAPSHOT.GET_ALL}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			console.error("Error fetching commerceMetricSnapshots:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	getCommerceMetricSnapshotById = async (commerceMetricSnapshotId: string) => {
		try {
			const response: ApiResponse<CommerceMetricSnapshot> = await apiClient.get(
				`${COMMERCE_METRIC_SNAPSHOT.GET_BY_ID.replace(":id", commerceMetricSnapshotId)}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			console.error("Error fetching commerceMetricSnapshot:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	createCommerceMetricSnapshot = async (data: CreateCommerceMetricSnapshot | FormData) => {
		try {
			const response: ApiResponse<CommerceMetricSnapshot> =
				data instanceof FormData
					? await apiClient.postFormData(COMMERCE_METRIC_SNAPSHOT.CREATE, data)
					: await apiClient.post(COMMERCE_METRIC_SNAPSHOT.CREATE, data);
			return response.data;
		} catch (error: any) {
			console.error("Error creating commerceMetricSnapshot:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	updateCommerceMetricSnapshot = async (commerceMetricSnapshotId: string, data: UpdateCommerceMetricSnapshot | FormData) => {
		try {
			const endpoint = COMMERCE_METRIC_SNAPSHOT.UPDATE.replace(":id", commerceMetricSnapshotId);
			const response: ApiResponse<CommerceMetricSnapshot> =
				data instanceof FormData
					? await apiClient.patchFormData(endpoint, data)
					: await apiClient.patch(endpoint, data);
			return response.data;
		} catch (error: any) {
			console.error("Error updating commerceMetricSnapshot:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	deleteCommerceMetricSnapshot = async (commerceMetricSnapshotId: string) => {
		try {
			const response: ApiResponse<CommerceMetricSnapshot> = await apiClient.delete(
				COMMERCE_METRIC_SNAPSHOT.DELETE.replace(":id", commerceMetricSnapshotId),
			);
			return response.data;
		} catch (error: any) {
			console.error("Error deleting commerceMetricSnapshot:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};
}

export default new CommerceMetricSnapshotService();
