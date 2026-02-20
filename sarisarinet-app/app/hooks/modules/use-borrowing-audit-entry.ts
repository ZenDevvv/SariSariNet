import { useMutation, useQuery } from "@tanstack/react-query";
import type { ApiQueryParams } from "~/services/api-service";
import { queryClient } from "~/lib/query-client";
import borrowingAuditEntryService from "~/services/modules/borrowing-audit-entry-service";
import type { CreateBorrowingAuditEntry, UpdateBorrowingAuditEntry } from "~/zod/modules/borrowing-audit-entry.zod";

export const useGetBorrowingAuditEntries = (apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["borrowingAuditEntries", apiParams],
		queryFn: () => {
			return borrowingAuditEntryService
				.select(apiParams?.fields || "")
				.search(apiParams?.query || "")
				.paginate(apiParams?.page || 1, apiParams?.limit || 10)
				.sort(apiParams?.sort, apiParams?.order)
				.filter(apiParams?.filter || "")
				.getAllBorrowingAuditEntries();
		},
	});
};

export const useGetBorrowingAuditEntryById = (borrowingAuditEntryId: string, apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["borrowingAuditEntry-by-id", borrowingAuditEntryId, apiParams],
		queryFn: () => {
			return borrowingAuditEntryService
				.select(apiParams?.fields || "")
				.getBorrowingAuditEntryById(borrowingAuditEntryId);
		},
		enabled: !!borrowingAuditEntryId,
	});
};

export const useCreateBorrowingAuditEntry = () => {
	return useMutation({
		mutationFn: (data: CreateBorrowingAuditEntry | FormData) => {
			return borrowingAuditEntryService.createBorrowingAuditEntry(data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["borrowingAuditEntries"] });
		},
	});
};

export const useUpdateBorrowingAuditEntry = () => {
	return useMutation({
		mutationFn: ({ borrowingAuditEntryId, data }: { borrowingAuditEntryId: string; data: UpdateBorrowingAuditEntry | FormData }) => {
			return borrowingAuditEntryService.updateBorrowingAuditEntry(borrowingAuditEntryId, data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["borrowingAuditEntries"] });
		},
	});
};

export const useDeleteBorrowingAuditEntry = () => {
	return useMutation({
		mutationFn: (borrowingAuditEntryId: string) => {
			return borrowingAuditEntryService.deleteBorrowingAuditEntry(borrowingAuditEntryId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["borrowingAuditEntries"] });
		},
	});
};
