import { APIService } from "~/services/api-service";
import { apiClient, type ApiResponse } from "~/lib/api-client";
import { API_ENDPOINTS } from "~/configs/endpoints";
import type {
	ConnectionNotification,
	CreateConnectionNotification,
	UpdateConnectionNotification,
	GetAllConnectionNotifications,
} from "~/zod/modules/connection-notification.zod";

const { CONNECTION_NOTIFICATION } = API_ENDPOINTS;

class ConnectionNotificationService extends APIService {
	getAllConnectionNotifications = async () => {
		try {
			const response: ApiResponse<GetAllConnectionNotifications> = await apiClient.get(
				`${CONNECTION_NOTIFICATION.GET_ALL}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			console.error("Error fetching connectionNotifications:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	getConnectionNotificationById = async (connectionNotificationId: string) => {
		try {
			const response: ApiResponse<ConnectionNotification> = await apiClient.get(
				`${CONNECTION_NOTIFICATION.GET_BY_ID.replace(":id", connectionNotificationId)}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			console.error("Error fetching connectionNotification:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	createConnectionNotification = async (data: CreateConnectionNotification | FormData) => {
		try {
			const response: ApiResponse<ConnectionNotification> =
				data instanceof FormData
					? await apiClient.postFormData(CONNECTION_NOTIFICATION.CREATE, data)
					: await apiClient.post(CONNECTION_NOTIFICATION.CREATE, data);
			return response.data;
		} catch (error: any) {
			console.error("Error creating connectionNotification:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	updateConnectionNotification = async (connectionNotificationId: string, data: UpdateConnectionNotification | FormData) => {
		try {
			const endpoint = CONNECTION_NOTIFICATION.UPDATE.replace(":id", connectionNotificationId);
			const response: ApiResponse<ConnectionNotification> =
				data instanceof FormData
					? await apiClient.patchFormData(endpoint, data)
					: await apiClient.patch(endpoint, data);
			return response.data;
		} catch (error: any) {
			console.error("Error updating connectionNotification:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	deleteConnectionNotification = async (connectionNotificationId: string) => {
		try {
			const response: ApiResponse<ConnectionNotification> = await apiClient.delete(
				CONNECTION_NOTIFICATION.DELETE.replace(":id", connectionNotificationId),
			);
			return response.data;
		} catch (error: any) {
			console.error("Error deleting connectionNotification:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};
}

export default new ConnectionNotificationService();
