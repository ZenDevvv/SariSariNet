import { useMutation, useQuery } from "@tanstack/react-query";
import type { ApiQueryParams } from "~/services/api-service";
import { queryClient } from "~/lib/query-client";
import connectionRequestService from "~/services/modules/connection-request-service";
import type { CreateConnectionRequest, UpdateConnectionRequest } from "~/zod/modules/connection-request.zod";

export const useGetConnectionRequests = (apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["connectionRequests", apiParams],
		queryFn: () => {
			return connectionRequestService
				.select(apiParams?.fields || "")
				.search(apiParams?.query || "")
				.paginate(apiParams?.page || 1, apiParams?.limit || 10)
				.sort(apiParams?.sort, apiParams?.order)
				.filter(apiParams?.filter || "")
				.getAllConnectionRequests();
		},
	});
};

export const useGetConnectionRequestById = (connectionRequestId: string, apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["connectionRequest-by-id", connectionRequestId, apiParams],
		queryFn: () => {
			return connectionRequestService
				.select(apiParams?.fields || "")
				.getConnectionRequestById(connectionRequestId);
		},
		enabled: !!connectionRequestId,
	});
};

export const useCreateConnectionRequest = () => {
	return useMutation({
		mutationFn: (data: CreateConnectionRequest | FormData) => {
			return connectionRequestService.createConnectionRequest(data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["connectionRequests"] });
		},
	});
};

export const useUpdateConnectionRequest = () => {
	return useMutation({
		mutationFn: ({ connectionRequestId, data }: { connectionRequestId: string; data: UpdateConnectionRequest | FormData }) => {
			return connectionRequestService.updateConnectionRequest(connectionRequestId, data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["connectionRequests"] });
		},
	});
};

export const useDeleteConnectionRequest = () => {
	return useMutation({
		mutationFn: (connectionRequestId: string) => {
			return connectionRequestService.deleteConnectionRequest(connectionRequestId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["connectionRequests"] });
		},
	});
};
