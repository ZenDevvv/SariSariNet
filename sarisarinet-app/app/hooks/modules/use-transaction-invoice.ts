import { useMutation, useQuery } from "@tanstack/react-query";
import type { ApiQueryParams } from "~/services/api-service";
import { queryClient } from "~/lib/query-client";
import transactionInvoiceService from "~/services/modules/transaction-invoice-service";
import type { CreateTransactionInvoice, UpdateTransactionInvoice } from "~/zod/modules/transaction-invoice.zod";

export const useGetTransactionInvoices = (apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["transactionInvoices", apiParams],
		queryFn: () => {
			return transactionInvoiceService
				.select(apiParams?.fields || "")
				.search(apiParams?.query || "")
				.paginate(apiParams?.page || 1, apiParams?.limit || 10)
				.sort(apiParams?.sort, apiParams?.order)
				.filter(apiParams?.filter || "")
				.getAllTransactionInvoices();
		},
	});
};

export const useGetTransactionInvoiceById = (transactionInvoiceId: string, apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["transactionInvoice-by-id", transactionInvoiceId, apiParams],
		queryFn: () => {
			return transactionInvoiceService
				.select(apiParams?.fields || "")
				.getTransactionInvoiceById(transactionInvoiceId);
		},
		enabled: !!transactionInvoiceId,
	});
};

export const useCreateTransactionInvoice = () => {
	return useMutation({
		mutationFn: (data: CreateTransactionInvoice | FormData) => {
			return transactionInvoiceService.createTransactionInvoice(data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["transactionInvoices"] });
		},
	});
};

export const useUpdateTransactionInvoice = () => {
	return useMutation({
		mutationFn: ({ transactionInvoiceId, data }: { transactionInvoiceId: string; data: UpdateTransactionInvoice | FormData }) => {
			return transactionInvoiceService.updateTransactionInvoice(transactionInvoiceId, data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["transactionInvoices"] });
		},
	});
};

export const useDeleteTransactionInvoice = () => {
	return useMutation({
		mutationFn: (transactionInvoiceId: string) => {
			return transactionInvoiceService.deleteTransactionInvoice(transactionInvoiceId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["transactionInvoices"] });
		},
	});
};
