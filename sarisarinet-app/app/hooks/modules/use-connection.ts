import { useMutation, useQuery } from "@tanstack/react-query";
import type { ApiQueryParams } from "~/services/api-service";
import { queryClient } from "~/lib/query-client";
import connectionService from "~/services/modules/connection-service";
import type { CreateConnection, UpdateConnection } from "~/zod/modules/connection.zod";

export const useGetConnections = (apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["connections", apiParams],
		queryFn: () => {
			return connectionService
				.select(apiParams?.fields || "")
				.search(apiParams?.query || "")
				.paginate(apiParams?.page || 1, apiParams?.limit || 10)
				.sort(apiParams?.sort, apiParams?.order)
				.filter(apiParams?.filter || "")
				.getAllConnections();
		},
	});
};

export const useGetConnectionById = (connectionId: string, apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["connection-by-id", connectionId, apiParams],
		queryFn: () => {
			return connectionService
				.select(apiParams?.fields || "")
				.getConnectionById(connectionId);
		},
		enabled: !!connectionId,
	});
};

export const useCreateConnection = () => {
	return useMutation({
		mutationFn: (data: CreateConnection | FormData) => {
			return connectionService.createConnection(data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["connections"] });
		},
	});
};

export const useUpdateConnection = () => {
	return useMutation({
		mutationFn: ({ connectionId, data }: { connectionId: string; data: UpdateConnection | FormData }) => {
			return connectionService.updateConnection(connectionId, data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["connections"] });
		},
	});
};

export const useDeleteConnection = () => {
	return useMutation({
		mutationFn: (connectionId: string) => {
			return connectionService.deleteConnection(connectionId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["connections"] });
		},
	});
};
