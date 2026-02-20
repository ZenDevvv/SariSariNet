import { useMutation, useQuery } from "@tanstack/react-query";
import type { ApiQueryParams } from "~/services/api-service";
import { queryClient } from "~/lib/query-client";
import repaymentService from "~/services/modules/repayment-service";
import type { CreateRepayment, UpdateRepayment } from "~/zod/modules/repayment.zod";

export const useGetRepayments = (apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["repayments", apiParams],
		queryFn: () => {
			return repaymentService
				.select(apiParams?.fields || "")
				.search(apiParams?.query || "")
				.paginate(apiParams?.page || 1, apiParams?.limit || 10)
				.sort(apiParams?.sort, apiParams?.order)
				.filter(apiParams?.filter || "")
				.getAllRepayments();
		},
	});
};

export const useGetRepaymentById = (repaymentId: string, apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["repayment-by-id", repaymentId, apiParams],
		queryFn: () => {
			return repaymentService
				.select(apiParams?.fields || "")
				.getRepaymentById(repaymentId);
		},
		enabled: !!repaymentId,
	});
};

export const useCreateRepayment = () => {
	return useMutation({
		mutationFn: (data: CreateRepayment | FormData) => {
			return repaymentService.createRepayment(data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["repayments"] });
		},
	});
};

export const useUpdateRepayment = () => {
	return useMutation({
		mutationFn: ({ repaymentId, data }: { repaymentId: string; data: UpdateRepayment | FormData }) => {
			return repaymentService.updateRepayment(repaymentId, data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["repayments"] });
		},
	});
};

export const useDeleteRepayment = () => {
	return useMutation({
		mutationFn: (repaymentId: string) => {
			return repaymentService.deleteRepayment(repaymentId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["repayments"] });
		},
	});
};
