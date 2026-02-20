import { useMutation, useQuery } from "@tanstack/react-query";
import type { ApiQueryParams } from "~/services/api-service";
import { queryClient } from "~/lib/query-client";
import commerceMetricSnapshotService from "~/services/modules/commerce-metric-snapshot-service";
import type { CreateCommerceMetricSnapshot, UpdateCommerceMetricSnapshot } from "~/zod/modules/commerce-metric-snapshot.zod";

export const useGetCommerceMetricSnapshots = (apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["commerceMetricSnapshots", apiParams],
		queryFn: () => {
			return commerceMetricSnapshotService
				.select(apiParams?.fields || "")
				.search(apiParams?.query || "")
				.paginate(apiParams?.page || 1, apiParams?.limit || 10)
				.sort(apiParams?.sort, apiParams?.order)
				.filter(apiParams?.filter || "")
				.getAllCommerceMetricSnapshots();
		},
	});
};

export const useGetCommerceMetricSnapshotById = (commerceMetricSnapshotId: string, apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["commerceMetricSnapshot-by-id", commerceMetricSnapshotId, apiParams],
		queryFn: () => {
			return commerceMetricSnapshotService
				.select(apiParams?.fields || "")
				.getCommerceMetricSnapshotById(commerceMetricSnapshotId);
		},
		enabled: !!commerceMetricSnapshotId,
	});
};

export const useCreateCommerceMetricSnapshot = () => {
	return useMutation({
		mutationFn: (data: CreateCommerceMetricSnapshot | FormData) => {
			return commerceMetricSnapshotService.createCommerceMetricSnapshot(data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["commerceMetricSnapshots"] });
		},
	});
};

export const useUpdateCommerceMetricSnapshot = () => {
	return useMutation({
		mutationFn: ({ commerceMetricSnapshotId, data }: { commerceMetricSnapshotId: string; data: UpdateCommerceMetricSnapshot | FormData }) => {
			return commerceMetricSnapshotService.updateCommerceMetricSnapshot(commerceMetricSnapshotId, data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["commerceMetricSnapshots"] });
		},
	});
};

export const useDeleteCommerceMetricSnapshot = () => {
	return useMutation({
		mutationFn: (commerceMetricSnapshotId: string) => {
			return commerceMetricSnapshotService.deleteCommerceMetricSnapshot(commerceMetricSnapshotId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["commerceMetricSnapshots"] });
		},
	});
};
