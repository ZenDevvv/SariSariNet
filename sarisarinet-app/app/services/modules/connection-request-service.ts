import { APIService } from "~/services/api-service";
import { apiClient, type ApiResponse } from "~/lib/api-client";
import { API_ENDPOINTS } from "~/configs/endpoints";
import type {
	ConnectionRequest,
	CreateConnectionRequest,
	UpdateConnectionRequest,
	GetAllConnectionRequests,
} from "~/zod/modules/connection-request.zod";

const { CONNECTION_REQUEST } = API_ENDPOINTS;

class ConnectionRequestService extends APIService {
	getAllConnectionRequests = async () => {
		try {
			const response: ApiResponse<GetAllConnectionRequests> = await apiClient.get(
				`${CONNECTION_REQUEST.GET_ALL}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			console.error("Error fetching connectionRequests:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	getConnectionRequestById = async (connectionRequestId: string) => {
		try {
			const response: ApiResponse<ConnectionRequest> = await apiClient.get(
				`${CONNECTION_REQUEST.GET_BY_ID.replace(":id", connectionRequestId)}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			console.error("Error fetching connectionRequest:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	createConnectionRequest = async (data: CreateConnectionRequest | FormData) => {
		try {
			const response: ApiResponse<ConnectionRequest> =
				data instanceof FormData
					? await apiClient.postFormData(CONNECTION_REQUEST.CREATE, data)
					: await apiClient.post(CONNECTION_REQUEST.CREATE, data);
			return response.data;
		} catch (error: any) {
			console.error("Error creating connectionRequest:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	updateConnectionRequest = async (connectionRequestId: string, data: UpdateConnectionRequest | FormData) => {
		try {
			const endpoint = CONNECTION_REQUEST.UPDATE.replace(":id", connectionRequestId);
			const response: ApiResponse<ConnectionRequest> =
				data instanceof FormData
					? await apiClient.patchFormData(endpoint, data)
					: await apiClient.patch(endpoint, data);
			return response.data;
		} catch (error: any) {
			console.error("Error updating connectionRequest:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	deleteConnectionRequest = async (connectionRequestId: string) => {
		try {
			const response: ApiResponse<ConnectionRequest> = await apiClient.delete(
				CONNECTION_REQUEST.DELETE.replace(":id", connectionRequestId),
			);
			return response.data;
		} catch (error: any) {
			console.error("Error deleting connectionRequest:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};
}

export default new ConnectionRequestService();
