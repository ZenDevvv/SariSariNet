import { useMutation, useQuery } from "@tanstack/react-query";
import type { ApiQueryParams } from "~/services/api-service";
import { queryClient } from "~/lib/query-client";
import transactionService from "~/services/modules/transaction-service";
import type { CreateTransaction, UpdateTransaction } from "~/zod/modules/transaction.zod";

export const useGetTransactions = (apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["transactions", apiParams],
		queryFn: () => {
			return transactionService
				.select(apiParams?.fields || "")
				.search(apiParams?.query || "")
				.paginate(apiParams?.page || 1, apiParams?.limit || 10)
				.sort(apiParams?.sort, apiParams?.order)
				.filter(apiParams?.filter || "")
				.getAllTransactions();
		},
	});
};

export const useGetTransactionById = (transactionId: string, apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["transaction-by-id", transactionId, apiParams],
		queryFn: () => {
			return transactionService
				.select(apiParams?.fields || "")
				.getTransactionById(transactionId);
		},
		enabled: !!transactionId,
	});
};

export const useCreateTransaction = () => {
	return useMutation({
		mutationFn: (data: CreateTransaction | FormData) => {
			return transactionService.createTransaction(data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
		},
	});
};

export const useUpdateTransaction = () => {
	return useMutation({
		mutationFn: ({ transactionId, data }: { transactionId: string; data: UpdateTransaction | FormData }) => {
			return transactionService.updateTransaction(transactionId, data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
		},
	});
};

export const useDeleteTransaction = () => {
	return useMutation({
		mutationFn: (transactionId: string) => {
			return transactionService.deleteTransaction(transactionId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
		},
	});
};
