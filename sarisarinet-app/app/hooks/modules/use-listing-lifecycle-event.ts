import { useMutation, useQuery } from "@tanstack/react-query";
import type { ApiQueryParams } from "~/services/api-service";
import { queryClient } from "~/lib/query-client";
import listingLifecycleEventService from "~/services/modules/listing-lifecycle-event-service";
import type { CreateListingLifecycleEvent, UpdateListingLifecycleEvent } from "~/zod/modules/listing-lifecycle-event.zod";

export const useGetListingLifecycleEvents = (apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["listingLifecycleEvents", apiParams],
		queryFn: () => {
			return listingLifecycleEventService
				.select(apiParams?.fields || "")
				.search(apiParams?.query || "")
				.paginate(apiParams?.page || 1, apiParams?.limit || 10)
				.sort(apiParams?.sort, apiParams?.order)
				.filter(apiParams?.filter || "")
				.getAllListingLifecycleEvents();
		},
	});
};

export const useGetListingLifecycleEventById = (listingLifecycleEventId: string, apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["listingLifecycleEvent-by-id", listingLifecycleEventId, apiParams],
		queryFn: () => {
			return listingLifecycleEventService
				.select(apiParams?.fields || "")
				.getListingLifecycleEventById(listingLifecycleEventId);
		},
		enabled: !!listingLifecycleEventId,
	});
};

export const useCreateListingLifecycleEvent = () => {
	return useMutation({
		mutationFn: (data: CreateListingLifecycleEvent | FormData) => {
			return listingLifecycleEventService.createListingLifecycleEvent(data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["listingLifecycleEvents"] });
		},
	});
};

export const useUpdateListingLifecycleEvent = () => {
	return useMutation({
		mutationFn: ({ listingLifecycleEventId, data }: { listingLifecycleEventId: string; data: UpdateListingLifecycleEvent | FormData }) => {
			return listingLifecycleEventService.updateListingLifecycleEvent(listingLifecycleEventId, data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["listingLifecycleEvents"] });
		},
	});
};

export const useDeleteListingLifecycleEvent = () => {
	return useMutation({
		mutationFn: (listingLifecycleEventId: string) => {
			return listingLifecycleEventService.deleteListingLifecycleEvent(listingLifecycleEventId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["listingLifecycleEvents"] });
		},
	});
};
