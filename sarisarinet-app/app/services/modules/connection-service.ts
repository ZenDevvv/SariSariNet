import { APIService } from "~/services/api-service";
import { apiClient, type ApiResponse } from "~/lib/api-client";
import { API_ENDPOINTS } from "~/configs/endpoints";
import type {
	Connection,
	CreateConnection,
	UpdateConnection,
	GetAllConnections,
} from "~/zod/modules/connection.zod";

const { CONNECTION } = API_ENDPOINTS;

class ConnectionService extends APIService {
	getAllConnections = async () => {
		try {
			const response: ApiResponse<GetAllConnections> = await apiClient.get(
				`${CONNECTION.GET_ALL}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			console.error("Error fetching connections:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	getConnectionById = async (connectionId: string) => {
		try {
			const response: ApiResponse<Connection> = await apiClient.get(
				`${CONNECTION.GET_BY_ID.replace(":id", connectionId)}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			console.error("Error fetching connection:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	createConnection = async (data: CreateConnection | FormData) => {
		try {
			const response: ApiResponse<Connection> =
				data instanceof FormData
					? await apiClient.postFormData(CONNECTION.CREATE, data)
					: await apiClient.post(CONNECTION.CREATE, data);
			return response.data;
		} catch (error: any) {
			console.error("Error creating connection:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	updateConnection = async (connectionId: string, data: UpdateConnection | FormData) => {
		try {
			const endpoint = CONNECTION.UPDATE.replace(":id", connectionId);
			const response: ApiResponse<Connection> =
				data instanceof FormData
					? await apiClient.patchFormData(endpoint, data)
					: await apiClient.patch(endpoint, data);
			return response.data;
		} catch (error: any) {
			console.error("Error updating connection:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	deleteConnection = async (connectionId: string) => {
		try {
			const response: ApiResponse<Connection> = await apiClient.delete(
				CONNECTION.DELETE.replace(":id", connectionId),
			);
			return response.data;
		} catch (error: any) {
			console.error("Error deleting connection:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};
}

export default new ConnectionService();
