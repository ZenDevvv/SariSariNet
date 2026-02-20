import { APIService } from "~/services/api-service";
import { apiClient, type ApiResponse } from "~/lib/api-client";
import { API_ENDPOINTS } from "~/configs/endpoints";
import type {
	OrganizationJoinRequest,
	CreateOrganizationJoinRequest,
	UpdateOrganizationJoinRequest,
	GetAllOrganizationJoinRequests,
} from "~/zod/modules/organization-join-request.zod";

const { ORGANIZATION_JOIN_REQUEST } = API_ENDPOINTS;

class OrganizationJoinRequestService extends APIService {
	getAllOrganizationJoinRequests = async () => {
		try {
			const response: ApiResponse<GetAllOrganizationJoinRequests> = await apiClient.get(
				`${ORGANIZATION_JOIN_REQUEST.GET_ALL}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			console.error("Error fetching organizationJoinRequests:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	getOrganizationJoinRequestById = async (organizationJoinRequestId: string) => {
		try {
			const response: ApiResponse<OrganizationJoinRequest> = await apiClient.get(
				`${ORGANIZATION_JOIN_REQUEST.GET_BY_ID.replace(":id", organizationJoinRequestId)}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			console.error("Error fetching organizationJoinRequest:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	createOrganizationJoinRequest = async (data: CreateOrganizationJoinRequest | FormData) => {
		try {
			const response: ApiResponse<OrganizationJoinRequest> =
				data instanceof FormData
					? await apiClient.postFormData(ORGANIZATION_JOIN_REQUEST.CREATE, data)
					: await apiClient.post(ORGANIZATION_JOIN_REQUEST.CREATE, data);
			return response.data;
		} catch (error: any) {
			console.error("Error creating organizationJoinRequest:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	updateOrganizationJoinRequest = async (organizationJoinRequestId: string, data: UpdateOrganizationJoinRequest | FormData) => {
		try {
			const endpoint = ORGANIZATION_JOIN_REQUEST.UPDATE.replace(":id", organizationJoinRequestId);
			const response: ApiResponse<OrganizationJoinRequest> =
				data instanceof FormData
					? await apiClient.patchFormData(endpoint, data)
					: await apiClient.patch(endpoint, data);
			return response.data;
		} catch (error: any) {
			console.error("Error updating organizationJoinRequest:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	deleteOrganizationJoinRequest = async (organizationJoinRequestId: string) => {
		try {
			const response: ApiResponse<OrganizationJoinRequest> = await apiClient.delete(
				ORGANIZATION_JOIN_REQUEST.DELETE.replace(":id", organizationJoinRequestId),
			);
			return response.data;
		} catch (error: any) {
			console.error("Error deleting organizationJoinRequest:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};
}

export default new OrganizationJoinRequestService();
