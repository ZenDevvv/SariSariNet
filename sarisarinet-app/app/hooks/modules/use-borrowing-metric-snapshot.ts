import { useMutation, useQuery } from "@tanstack/react-query";
import type { ApiQueryParams } from "~/services/api-service";
import { queryClient } from "~/lib/query-client";
import borrowingMetricSnapshotService from "~/services/modules/borrowing-metric-snapshot-service";
import type { CreateBorrowingMetricSnapshot, UpdateBorrowingMetricSnapshot } from "~/zod/modules/borrowing-metric-snapshot.zod";

export const useGetBorrowingMetricSnapshots = (apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["borrowingMetricSnapshots", apiParams],
		queryFn: () => {
			return borrowingMetricSnapshotService
				.select(apiParams?.fields || "")
				.search(apiParams?.query || "")
				.paginate(apiParams?.page || 1, apiParams?.limit || 10)
				.sort(apiParams?.sort, apiParams?.order)
				.filter(apiParams?.filter || "")
				.getAllBorrowingMetricSnapshots();
		},
	});
};

export const useGetBorrowingMetricSnapshotById = (borrowingMetricSnapshotId: string, apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["borrowingMetricSnapshot-by-id", borrowingMetricSnapshotId, apiParams],
		queryFn: () => {
			return borrowingMetricSnapshotService
				.select(apiParams?.fields || "")
				.getBorrowingMetricSnapshotById(borrowingMetricSnapshotId);
		},
		enabled: !!borrowingMetricSnapshotId,
	});
};

export const useCreateBorrowingMetricSnapshot = () => {
	return useMutation({
		mutationFn: (data: CreateBorrowingMetricSnapshot | FormData) => {
			return borrowingMetricSnapshotService.createBorrowingMetricSnapshot(data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["borrowingMetricSnapshots"] });
		},
	});
};

export const useUpdateBorrowingMetricSnapshot = () => {
	return useMutation({
		mutationFn: ({ borrowingMetricSnapshotId, data }: { borrowingMetricSnapshotId: string; data: UpdateBorrowingMetricSnapshot | FormData }) => {
			return borrowingMetricSnapshotService.updateBorrowingMetricSnapshot(borrowingMetricSnapshotId, data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["borrowingMetricSnapshots"] });
		},
	});
};

export const useDeleteBorrowingMetricSnapshot = () => {
	return useMutation({
		mutationFn: (borrowingMetricSnapshotId: string) => {
			return borrowingMetricSnapshotService.deleteBorrowingMetricSnapshot(borrowingMetricSnapshotId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["borrowingMetricSnapshots"] });
		},
	});
};
