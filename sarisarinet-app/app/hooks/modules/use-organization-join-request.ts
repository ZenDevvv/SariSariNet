import { useMutation, useQuery } from "@tanstack/react-query";
import type { ApiQueryParams } from "~/services/api-service";
import { queryClient } from "~/lib/query-client";
import organizationJoinRequestService from "~/services/modules/organization-join-request-service";
import type { CreateOrganizationJoinRequest, UpdateOrganizationJoinRequest } from "~/zod/modules/organization-join-request.zod";

export const useGetOrganizationJoinRequests = (apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["organizationJoinRequests", apiParams],
		queryFn: () => {
			return organizationJoinRequestService
				.select(apiParams?.fields || "")
				.search(apiParams?.query || "")
				.paginate(apiParams?.page || 1, apiParams?.limit || 10)
				.sort(apiParams?.sort, apiParams?.order)
				.filter(apiParams?.filter || "")
				.getAllOrganizationJoinRequests();
		},
	});
};

export const useGetOrganizationJoinRequestById = (organizationJoinRequestId: string, apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["organizationJoinRequest-by-id", organizationJoinRequestId, apiParams],
		queryFn: () => {
			return organizationJoinRequestService
				.select(apiParams?.fields || "")
				.getOrganizationJoinRequestById(organizationJoinRequestId);
		},
		enabled: !!organizationJoinRequestId,
	});
};

export const useCreateOrganizationJoinRequest = () => {
	return useMutation({
		mutationFn: (data: CreateOrganizationJoinRequest | FormData) => {
			return organizationJoinRequestService.createOrganizationJoinRequest(data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["organizationJoinRequests"] });
		},
	});
};

export const useUpdateOrganizationJoinRequest = () => {
	return useMutation({
		mutationFn: ({ organizationJoinRequestId, data }: { organizationJoinRequestId: string; data: UpdateOrganizationJoinRequest | FormData }) => {
			return organizationJoinRequestService.updateOrganizationJoinRequest(organizationJoinRequestId, data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["organizationJoinRequests"] });
		},
	});
};

export const useDeleteOrganizationJoinRequest = () => {
	return useMutation({
		mutationFn: (organizationJoinRequestId: string) => {
			return organizationJoinRequestService.deleteOrganizationJoinRequest(organizationJoinRequestId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["organizationJoinRequests"] });
		},
	});
};
