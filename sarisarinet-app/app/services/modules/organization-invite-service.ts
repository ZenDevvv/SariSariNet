import { APIService } from "~/services/api-service";
import { apiClient, type ApiResponse } from "~/lib/api-client";
import { API_ENDPOINTS } from "~/configs/endpoints";
import type {
	OrganizationInvite,
	CreateOrganizationInvite,
	UpdateOrganizationInvite,
	GetAllOrganizationInvites,
} from "~/zod/modules/organization-invite.zod";

const { ORGANIZATION_INVITE } = API_ENDPOINTS;

class OrganizationInviteService extends APIService {
	getAllOrganizationInvites = async () => {
		try {
			const response: ApiResponse<GetAllOrganizationInvites> = await apiClient.get(
				`${ORGANIZATION_INVITE.GET_ALL}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			console.error("Error fetching organizationInvites:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	getOrganizationInviteById = async (organizationInviteId: string) => {
		try {
			const response: ApiResponse<OrganizationInvite> = await apiClient.get(
				`${ORGANIZATION_INVITE.GET_BY_ID.replace(":id", organizationInviteId)}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			console.error("Error fetching organizationInvite:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	createOrganizationInvite = async (data: CreateOrganizationInvite | FormData) => {
		try {
			const response: ApiResponse<OrganizationInvite> =
				data instanceof FormData
					? await apiClient.postFormData(ORGANIZATION_INVITE.CREATE, data)
					: await apiClient.post(ORGANIZATION_INVITE.CREATE, data);
			return response.data;
		} catch (error: any) {
			console.error("Error creating organizationInvite:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	updateOrganizationInvite = async (organizationInviteId: string, data: UpdateOrganizationInvite | FormData) => {
		try {
			const endpoint = ORGANIZATION_INVITE.UPDATE.replace(":id", organizationInviteId);
			const response: ApiResponse<OrganizationInvite> =
				data instanceof FormData
					? await apiClient.patchFormData(endpoint, data)
					: await apiClient.patch(endpoint, data);
			return response.data;
		} catch (error: any) {
			console.error("Error updating organizationInvite:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	deleteOrganizationInvite = async (organizationInviteId: string) => {
		try {
			const response: ApiResponse<OrganizationInvite> = await apiClient.delete(
				ORGANIZATION_INVITE.DELETE.replace(":id", organizationInviteId),
			);
			return response.data;
		} catch (error: any) {
			console.error("Error deleting organizationInvite:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};
}

export default new OrganizationInviteService();
