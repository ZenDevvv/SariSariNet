import { useMutation, useQuery } from "@tanstack/react-query";
import type { ApiQueryParams } from "~/services/api-service";
import { queryClient } from "~/lib/query-client";
import connectionNotificationService from "~/services/modules/connection-notification-service";
import type { CreateConnectionNotification, UpdateConnectionNotification } from "~/zod/modules/connection-notification.zod";

export const useGetConnectionNotifications = (apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["connectionNotifications", apiParams],
		queryFn: () => {
			return connectionNotificationService
				.select(apiParams?.fields || "")
				.search(apiParams?.query || "")
				.paginate(apiParams?.page || 1, apiParams?.limit || 10)
				.sort(apiParams?.sort, apiParams?.order)
				.filter(apiParams?.filter || "")
				.getAllConnectionNotifications();
		},
	});
};

export const useGetConnectionNotificationById = (connectionNotificationId: string, apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["connectionNotification-by-id", connectionNotificationId, apiParams],
		queryFn: () => {
			return connectionNotificationService
				.select(apiParams?.fields || "")
				.getConnectionNotificationById(connectionNotificationId);
		},
		enabled: !!connectionNotificationId,
	});
};

export const useCreateConnectionNotification = () => {
	return useMutation({
		mutationFn: (data: CreateConnectionNotification | FormData) => {
			return connectionNotificationService.createConnectionNotification(data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["connectionNotifications"] });
		},
	});
};

export const useUpdateConnectionNotification = () => {
	return useMutation({
		mutationFn: ({ connectionNotificationId, data }: { connectionNotificationId: string; data: UpdateConnectionNotification | FormData }) => {
			return connectionNotificationService.updateConnectionNotification(connectionNotificationId, data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["connectionNotifications"] });
		},
	});
};

export const useDeleteConnectionNotification = () => {
	return useMutation({
		mutationFn: (connectionNotificationId: string) => {
			return connectionNotificationService.deleteConnectionNotification(connectionNotificationId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["connectionNotifications"] });
		},
	});
};
