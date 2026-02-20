import { useMutation, useQuery } from "@tanstack/react-query";
import type { ApiQueryParams } from "~/services/api-service";
import { queryClient } from "~/lib/query-client";
import authSessionService from "~/services/modules/auth-session-service";
import type { CreateAuthSession, UpdateAuthSession } from "~/zod/modules/auth-session.zod";

export const useGetAuthSessions = (apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["authSessions", apiParams],
		queryFn: () => {
			return authSessionService
				.select(apiParams?.fields || "")
				.search(apiParams?.query || "")
				.paginate(apiParams?.page || 1, apiParams?.limit || 10)
				.sort(apiParams?.sort, apiParams?.order)
				.filter(apiParams?.filter || "")
				.getAllAuthSessions();
		},
	});
};

export const useGetAuthSessionById = (authSessionId: string, apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["authSession-by-id", authSessionId, apiParams],
		queryFn: () => {
			return authSessionService
				.select(apiParams?.fields || "")
				.getAuthSessionById(authSessionId);
		},
		enabled: !!authSessionId,
	});
};

export const useCreateAuthSession = () => {
	return useMutation({
		mutationFn: (data: CreateAuthSession | FormData) => {
			return authSessionService.createAuthSession(data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["authSessions"] });
		},
	});
};

export const useUpdateAuthSession = () => {
	return useMutation({
		mutationFn: ({ authSessionId, data }: { authSessionId: string; data: UpdateAuthSession | FormData }) => {
			return authSessionService.updateAuthSession(authSessionId, data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["authSessions"] });
		},
	});
};

export const useDeleteAuthSession = () => {
	return useMutation({
		mutationFn: (authSessionId: string) => {
			return authSessionService.deleteAuthSession(authSessionId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["authSessions"] });
		},
	});
};
