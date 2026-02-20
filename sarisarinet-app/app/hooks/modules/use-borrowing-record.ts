import { useMutation, useQuery } from "@tanstack/react-query";
import type { ApiQueryParams } from "~/services/api-service";
import { queryClient } from "~/lib/query-client";
import borrowingRecordService from "~/services/modules/borrowing-record-service";
import type { CreateBorrowingRecord, UpdateBorrowingRecord } from "~/zod/modules/borrowing-record.zod";

export const useGetBorrowingRecords = (apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["borrowingRecords", apiParams],
		queryFn: () => {
			return borrowingRecordService
				.select(apiParams?.fields || "")
				.search(apiParams?.query || "")
				.paginate(apiParams?.page || 1, apiParams?.limit || 10)
				.sort(apiParams?.sort, apiParams?.order)
				.filter(apiParams?.filter || "")
				.getAllBorrowingRecords();
		},
	});
};

export const useGetBorrowingRecordById = (borrowingRecordId: string, apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["borrowingRecord-by-id", borrowingRecordId, apiParams],
		queryFn: () => {
			return borrowingRecordService
				.select(apiParams?.fields || "")
				.getBorrowingRecordById(borrowingRecordId);
		},
		enabled: !!borrowingRecordId,
	});
};

export const useCreateBorrowingRecord = () => {
	return useMutation({
		mutationFn: (data: CreateBorrowingRecord | FormData) => {
			return borrowingRecordService.createBorrowingRecord(data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["borrowingRecords"] });
		},
	});
};

export const useUpdateBorrowingRecord = () => {
	return useMutation({
		mutationFn: ({ borrowingRecordId, data }: { borrowingRecordId: string; data: UpdateBorrowingRecord | FormData }) => {
			return borrowingRecordService.updateBorrowingRecord(borrowingRecordId, data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["borrowingRecords"] });
		},
	});
};

export const useDeleteBorrowingRecord = () => {
	return useMutation({
		mutationFn: (borrowingRecordId: string) => {
			return borrowingRecordService.deleteBorrowingRecord(borrowingRecordId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["borrowingRecords"] });
		},
	});
};
