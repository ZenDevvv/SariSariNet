import { useMutation, useQuery } from "@tanstack/react-query";
import type { ApiQueryParams } from "~/services/api-service";
import { queryClient } from "~/lib/query-client";
import accountStatusEventService from "~/services/modules/account-status-event-service";
import type { CreateAccountStatusEvent, UpdateAccountStatusEvent } from "~/zod/modules/account-status-event.zod";

export const useGetAccountStatusEvents = (apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["accountStatusEvents", apiParams],
		queryFn: () => {
			return accountStatusEventService
				.select(apiParams?.fields || "")
				.search(apiParams?.query || "")
				.paginate(apiParams?.page || 1, apiParams?.limit || 10)
				.sort(apiParams?.sort, apiParams?.order)
				.filter(apiParams?.filter || "")
				.getAllAccountStatusEvents();
		},
	});
};

export const useGetAccountStatusEventById = (accountStatusEventId: string, apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["accountStatusEvent-by-id", accountStatusEventId, apiParams],
		queryFn: () => {
			return accountStatusEventService
				.select(apiParams?.fields || "")
				.getAccountStatusEventById(accountStatusEventId);
		},
		enabled: !!accountStatusEventId,
	});
};

export const useCreateAccountStatusEvent = () => {
	return useMutation({
		mutationFn: (data: CreateAccountStatusEvent | FormData) => {
			return accountStatusEventService.createAccountStatusEvent(data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["accountStatusEvents"] });
		},
	});
};

export const useUpdateAccountStatusEvent = () => {
	return useMutation({
		mutationFn: ({ accountStatusEventId, data }: { accountStatusEventId: string; data: UpdateAccountStatusEvent | FormData }) => {
			return accountStatusEventService.updateAccountStatusEvent(accountStatusEventId, data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["accountStatusEvents"] });
		},
	});
};

export const useDeleteAccountStatusEvent = () => {
	return useMutation({
		mutationFn: (accountStatusEventId: string) => {
			return accountStatusEventService.deleteAccountStatusEvent(accountStatusEventId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["accountStatusEvents"] });
		},
	});
};
