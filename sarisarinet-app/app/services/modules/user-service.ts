import { APIService } from "~/services/api-service";
import { apiClient, type ApiResponse } from "~/lib/api-client";
import { API_ENDPOINTS } from "~/configs/endpoints";
import type {
	User,
	CreateUser,
	UpdateUser,
	GetAllUsers,
} from "~/zod/modules/user.zod";

const { USER } = API_ENDPOINTS;

class UserService extends APIService {
	getAllUsers = async () => {
		try {
			const response: ApiResponse<GetAllUsers> = await apiClient.get(
				`${USER.GET_ALL}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			console.error("Error fetching users:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	getUserById = async (userId: string) => {
		try {
			const response: ApiResponse<User> = await apiClient.get(
				`${USER.GET_BY_ID.replace(":id", userId)}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			console.error("Error fetching user:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	createUser = async (data: CreateUser | FormData) => {
		try {
			const response: ApiResponse<User> =
				data instanceof FormData
					? await apiClient.postFormData(USER.CREATE, data)
					: await apiClient.post(USER.CREATE, data);
			return response.data;
		} catch (error: any) {
			console.error("Error creating user:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	updateUser = async (userId: string, data: UpdateUser | FormData) => {
		try {
			const endpoint = USER.UPDATE.replace(":id", userId);
			const response: ApiResponse<User> =
				data instanceof FormData
					? await apiClient.patchFormData(endpoint, data)
					: await apiClient.patch(endpoint, data);
			return response.data;
		} catch (error: any) {
			console.error("Error updating user:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	deleteUser = async (userId: string) => {
		try {
			const response: ApiResponse<User> = await apiClient.delete(
				USER.DELETE.replace(":id", userId),
			);
			return response.data;
		} catch (error: any) {
			console.error("Error deleting user:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};
}

export default new UserService();
