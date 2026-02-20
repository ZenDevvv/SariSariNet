import { APIService } from "~/services/api-service";
import { apiClient, type ApiResponse } from "~/lib/api-client";
import { API_ENDPOINTS } from "~/configs/endpoints";
import type {
	Organization,
	CreateOrganization,
	UpdateOrganization,
	GetAllOrganizations,
} from "~/zod/modules/organization.zod";

const { ORGANIZATION } = API_ENDPOINTS;

class OrganizationService extends APIService {
	getAllOrganizations = async () => {
		try {
			const response: ApiResponse<GetAllOrganizations> = await apiClient.get(
				`${ORGANIZATION.GET_ALL}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			console.error("Error fetching organizations:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	getOrganizationById = async (organizationId: string) => {
		try {
			const response: ApiResponse<Organization> = await apiClient.get(
				`${ORGANIZATION.GET_BY_ID.replace(":id", organizationId)}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			console.error("Error fetching organization:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	createOrganization = async (data: CreateOrganization | FormData) => {
		try {
			const response: ApiResponse<Organization> =
				data instanceof FormData
					? await apiClient.postFormData(ORGANIZATION.CREATE, data)
					: await apiClient.post(ORGANIZATION.CREATE, data);
			return response.data;
		} catch (error: any) {
			console.error("Error creating organization:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	updateOrganization = async (organizationId: string, data: UpdateOrganization | FormData) => {
		try {
			const endpoint = ORGANIZATION.UPDATE.replace(":id", organizationId);
			const response: ApiResponse<Organization> =
				data instanceof FormData
					? await apiClient.patchFormData(endpoint, data)
					: await apiClient.patch(endpoint, data);
			return response.data;
		} catch (error: any) {
			console.error("Error updating organization:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	deleteOrganization = async (organizationId: string) => {
		try {
			const response: ApiResponse<Organization> = await apiClient.delete(
				ORGANIZATION.DELETE.replace(":id", organizationId),
			);
			return response.data;
		} catch (error: any) {
			console.error("Error deleting organization:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};
}

export default new OrganizationService();
