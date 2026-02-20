import { useMutation, useQuery } from "@tanstack/react-query";
import type { ApiQueryParams } from "~/services/api-service";
import { queryClient } from "~/lib/query-client";
import reportViewPresetService from "~/services/modules/report-view-preset-service";
import type { CreateReportViewPreset, UpdateReportViewPreset } from "~/zod/modules/report-view-preset.zod";

export const useGetReportViewPresets = (apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["reportViewPresets", apiParams],
		queryFn: () => {
			return reportViewPresetService
				.select(apiParams?.fields || "")
				.search(apiParams?.query || "")
				.paginate(apiParams?.page || 1, apiParams?.limit || 10)
				.sort(apiParams?.sort, apiParams?.order)
				.filter(apiParams?.filter || "")
				.getAllReportViewPresets();
		},
	});
};

export const useGetReportViewPresetById = (reportViewPresetId: string, apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["reportViewPreset-by-id", reportViewPresetId, apiParams],
		queryFn: () => {
			return reportViewPresetService
				.select(apiParams?.fields || "")
				.getReportViewPresetById(reportViewPresetId);
		},
		enabled: !!reportViewPresetId,
	});
};

export const useCreateReportViewPreset = () => {
	return useMutation({
		mutationFn: (data: CreateReportViewPreset | FormData) => {
			return reportViewPresetService.createReportViewPreset(data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["reportViewPresets"] });
		},
	});
};

export const useUpdateReportViewPreset = () => {
	return useMutation({
		mutationFn: ({ reportViewPresetId, data }: { reportViewPresetId: string; data: UpdateReportViewPreset | FormData }) => {
			return reportViewPresetService.updateReportViewPreset(reportViewPresetId, data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["reportViewPresets"] });
		},
	});
};

export const useDeleteReportViewPreset = () => {
	return useMutation({
		mutationFn: (reportViewPresetId: string) => {
			return reportViewPresetService.deleteReportViewPreset(reportViewPresetId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["reportViewPresets"] });
		},
	});
};
