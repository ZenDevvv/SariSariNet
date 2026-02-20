import { useMutation, useQuery } from "@tanstack/react-query";
import type { ApiQueryParams } from "~/services/api-service";
import { queryClient } from "~/lib/query-client";
import transactionAdjustmentService from "~/services/modules/transaction-adjustment-service";
import type { CreateTransactionAdjustment, UpdateTransactionAdjustment } from "~/zod/modules/transaction-adjustment.zod";

export const useGetTransactionAdjustments = (apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["transactionAdjustments", apiParams],
		queryFn: () => {
			return transactionAdjustmentService
				.select(apiParams?.fields || "")
				.search(apiParams?.query || "")
				.paginate(apiParams?.page || 1, apiParams?.limit || 10)
				.sort(apiParams?.sort, apiParams?.order)
				.filter(apiParams?.filter || "")
				.getAllTransactionAdjustments();
		},
	});
};

export const useGetTransactionAdjustmentById = (transactionAdjustmentId: string, apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["transactionAdjustment-by-id", transactionAdjustmentId, apiParams],
		queryFn: () => {
			return transactionAdjustmentService
				.select(apiParams?.fields || "")
				.getTransactionAdjustmentById(transactionAdjustmentId);
		},
		enabled: !!transactionAdjustmentId,
	});
};

export const useCreateTransactionAdjustment = () => {
	return useMutation({
		mutationFn: (data: CreateTransactionAdjustment | FormData) => {
			return transactionAdjustmentService.createTransactionAdjustment(data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["transactionAdjustments"] });
		},
	});
};

export const useUpdateTransactionAdjustment = () => {
	return useMutation({
		mutationFn: ({ transactionAdjustmentId, data }: { transactionAdjustmentId: string; data: UpdateTransactionAdjustment | FormData }) => {
			return transactionAdjustmentService.updateTransactionAdjustment(transactionAdjustmentId, data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["transactionAdjustments"] });
		},
	});
};

export const useDeleteTransactionAdjustment = () => {
	return useMutation({
		mutationFn: (transactionAdjustmentId: string) => {
			return transactionAdjustmentService.deleteTransactionAdjustment(transactionAdjustmentId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["transactionAdjustments"] });
		},
	});
};
