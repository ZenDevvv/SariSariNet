import { APIService } from "~/services/api-service";
import { apiClient, type ApiResponse } from "~/lib/api-client";
import { API_ENDPOINTS } from "~/configs/endpoints";
import type {
	ListingLifecycleEvent,
	CreateListingLifecycleEvent,
	UpdateListingLifecycleEvent,
	GetAllListingLifecycleEvents,
} from "~/zod/modules/listing-lifecycle-event.zod";

const { LISTING_LIFECYCLE_EVENT } = API_ENDPOINTS;

class ListingLifecycleEventService extends APIService {
	getAllListingLifecycleEvents = async () => {
		try {
			const response: ApiResponse<GetAllListingLifecycleEvents> = await apiClient.get(
				`${LISTING_LIFECYCLE_EVENT.GET_ALL}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			console.error("Error fetching listingLifecycleEvents:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	getListingLifecycleEventById = async (listingLifecycleEventId: string) => {
		try {
			const response: ApiResponse<ListingLifecycleEvent> = await apiClient.get(
				`${LISTING_LIFECYCLE_EVENT.GET_BY_ID.replace(":id", listingLifecycleEventId)}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			console.error("Error fetching listingLifecycleEvent:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	createListingLifecycleEvent = async (data: CreateListingLifecycleEvent | FormData) => {
		try {
			const response: ApiResponse<ListingLifecycleEvent> =
				data instanceof FormData
					? await apiClient.postFormData(LISTING_LIFECYCLE_EVENT.CREATE, data)
					: await apiClient.post(LISTING_LIFECYCLE_EVENT.CREATE, data);
			return response.data;
		} catch (error: any) {
			console.error("Error creating listingLifecycleEvent:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	updateListingLifecycleEvent = async (listingLifecycleEventId: string, data: UpdateListingLifecycleEvent | FormData) => {
		try {
			const endpoint = LISTING_LIFECYCLE_EVENT.UPDATE.replace(":id", listingLifecycleEventId);
			const response: ApiResponse<ListingLifecycleEvent> =
				data instanceof FormData
					? await apiClient.patchFormData(endpoint, data)
					: await apiClient.patch(endpoint, data);
			return response.data;
		} catch (error: any) {
			console.error("Error updating listingLifecycleEvent:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	deleteListingLifecycleEvent = async (listingLifecycleEventId: string) => {
		try {
			const response: ApiResponse<ListingLifecycleEvent> = await apiClient.delete(
				LISTING_LIFECYCLE_EVENT.DELETE.replace(":id", listingLifecycleEventId),
			);
			return response.data;
		} catch (error: any) {
			console.error("Error deleting listingLifecycleEvent:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};
}

export default new ListingLifecycleEventService();
