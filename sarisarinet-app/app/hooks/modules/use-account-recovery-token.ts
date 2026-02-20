import { useMutation, useQuery } from "@tanstack/react-query";
import type { ApiQueryParams } from "~/services/api-service";
import { queryClient } from "~/lib/query-client";
import accountRecoveryTokenService from "~/services/modules/account-recovery-token-service";
import type { CreateAccountRecoveryToken, UpdateAccountRecoveryToken } from "~/zod/modules/account-recovery-token.zod";

export const useGetAccountRecoveryTokens = (apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["accountRecoveryTokens", apiParams],
		queryFn: () => {
			return accountRecoveryTokenService
				.select(apiParams?.fields || "")
				.search(apiParams?.query || "")
				.paginate(apiParams?.page || 1, apiParams?.limit || 10)
				.sort(apiParams?.sort, apiParams?.order)
				.filter(apiParams?.filter || "")
				.getAllAccountRecoveryTokens();
		},
	});
};

export const useGetAccountRecoveryTokenById = (accountRecoveryTokenId: string, apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["accountRecoveryToken-by-id", accountRecoveryTokenId, apiParams],
		queryFn: () => {
			return accountRecoveryTokenService
				.select(apiParams?.fields || "")
				.getAccountRecoveryTokenById(accountRecoveryTokenId);
		},
		enabled: !!accountRecoveryTokenId,
	});
};

export const useCreateAccountRecoveryToken = () => {
	return useMutation({
		mutationFn: (data: CreateAccountRecoveryToken | FormData) => {
			return accountRecoveryTokenService.createAccountRecoveryToken(data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["accountRecoveryTokens"] });
		},
	});
};

export const useUpdateAccountRecoveryToken = () => {
	return useMutation({
		mutationFn: ({ accountRecoveryTokenId, data }: { accountRecoveryTokenId: string; data: UpdateAccountRecoveryToken | FormData }) => {
			return accountRecoveryTokenService.updateAccountRecoveryToken(accountRecoveryTokenId, data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["accountRecoveryTokens"] });
		},
	});
};

export const useDeleteAccountRecoveryToken = () => {
	return useMutation({
		mutationFn: (accountRecoveryTokenId: string) => {
			return accountRecoveryTokenService.deleteAccountRecoveryToken(accountRecoveryTokenId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["accountRecoveryTokens"] });
		},
	});
};
