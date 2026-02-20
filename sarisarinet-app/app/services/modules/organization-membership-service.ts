import { APIService } from "~/services/api-service";
import { apiClient, type ApiResponse } from "~/lib/api-client";
import { API_ENDPOINTS } from "~/configs/endpoints";
import type {
	OrganizationMembership,
	CreateOrganizationMembership,
	UpdateOrganizationMembership,
	GetAllOrganizationMemberships,
} from "~/zod/modules/organization-membership.zod";

const { ORGANIZATION_MEMBERSHIP } = API_ENDPOINTS;

class OrganizationMembershipService extends APIService {
	getAllOrganizationMemberships = async () => {
		try {
			const response: ApiResponse<GetAllOrganizationMemberships> = await apiClient.get(
				`${ORGANIZATION_MEMBERSHIP.GET_ALL}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			console.error("Error fetching organizationMemberships:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	getOrganizationMembershipById = async (organizationMembershipId: string) => {
		try {
			const response: ApiResponse<OrganizationMembership> = await apiClient.get(
				`${ORGANIZATION_MEMBERSHIP.GET_BY_ID.replace(":id", organizationMembershipId)}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			console.error("Error fetching organizationMembership:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	createOrganizationMembership = async (data: CreateOrganizationMembership | FormData) => {
		try {
			const response: ApiResponse<OrganizationMembership> =
				data instanceof FormData
					? await apiClient.postFormData(ORGANIZATION_MEMBERSHIP.CREATE, data)
					: await apiClient.post(ORGANIZATION_MEMBERSHIP.CREATE, data);
			return response.data;
		} catch (error: any) {
			console.error("Error creating organizationMembership:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	updateOrganizationMembership = async (organizationMembershipId: string, data: UpdateOrganizationMembership | FormData) => {
		try {
			const endpoint = ORGANIZATION_MEMBERSHIP.UPDATE.replace(":id", organizationMembershipId);
			const response: ApiResponse<OrganizationMembership> =
				data instanceof FormData
					? await apiClient.patchFormData(endpoint, data)
					: await apiClient.patch(endpoint, data);
			return response.data;
		} catch (error: any) {
			console.error("Error updating organizationMembership:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	deleteOrganizationMembership = async (organizationMembershipId: string) => {
		try {
			const response: ApiResponse<OrganizationMembership> = await apiClient.delete(
				ORGANIZATION_MEMBERSHIP.DELETE.replace(":id", organizationMembershipId),
			);
			return response.data;
		} catch (error: any) {
			console.error("Error deleting organizationMembership:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};
}

export default new OrganizationMembershipService();
