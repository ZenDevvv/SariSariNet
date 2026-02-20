import { useMutation, useQuery } from "@tanstack/react-query";
import type { ApiQueryParams } from "~/services/api-service";
import { queryClient } from "~/lib/query-client";
import reportExportJobService from "~/services/modules/report-export-job-service";
import type { CreateReportExportJob, UpdateReportExportJob } from "~/zod/modules/report-export-job.zod";

export const useGetReportExportJobs = (apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["reportExportJobs", apiParams],
		queryFn: () => {
			return reportExportJobService
				.select(apiParams?.fields || "")
				.search(apiParams?.query || "")
				.paginate(apiParams?.page || 1, apiParams?.limit || 10)
				.sort(apiParams?.sort, apiParams?.order)
				.filter(apiParams?.filter || "")
				.getAllReportExportJobs();
		},
	});
};

export const useGetReportExportJobById = (reportExportJobId: string, apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["reportExportJob-by-id", reportExportJobId, apiParams],
		queryFn: () => {
			return reportExportJobService
				.select(apiParams?.fields || "")
				.getReportExportJobById(reportExportJobId);
		},
		enabled: !!reportExportJobId,
	});
};

export const useCreateReportExportJob = () => {
	return useMutation({
		mutationFn: (data: CreateReportExportJob | FormData) => {
			return reportExportJobService.createReportExportJob(data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["reportExportJobs"] });
		},
	});
};

export const useUpdateReportExportJob = () => {
	return useMutation({
		mutationFn: ({ reportExportJobId, data }: { reportExportJobId: string; data: UpdateReportExportJob | FormData }) => {
			return reportExportJobService.updateReportExportJob(reportExportJobId, data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["reportExportJobs"] });
		},
	});
};

export const useDeleteReportExportJob = () => {
	return useMutation({
		mutationFn: (reportExportJobId: string) => {
			return reportExportJobService.deleteReportExportJob(reportExportJobId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["reportExportJobs"] });
		},
	});
};
