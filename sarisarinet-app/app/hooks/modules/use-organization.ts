import { useMutation, useQuery } from "@tanstack/react-query";
import type { ApiQueryParams } from "~/services/api-service";
import { queryClient } from "~/lib/query-client";
import organizationService from "~/services/modules/organization-service";
import type { CreateOrganization, UpdateOrganization } from "~/zod/modules/organization.zod";

export const useGetOrganizations = (apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["organizations", apiParams],
		queryFn: () => {
			return organizationService
				.select(apiParams?.fields || "")
				.search(apiParams?.query || "")
				.paginate(apiParams?.page || 1, apiParams?.limit || 10)
				.sort(apiParams?.sort, apiParams?.order)
				.filter(apiParams?.filter || "")
				.getAllOrganizations();
		},
	});
};

export const useGetOrganizationById = (organizationId: string, apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["organization-by-id", organizationId, apiParams],
		queryFn: () => {
			return organizationService
				.select(apiParams?.fields || "")
				.getOrganizationById(organizationId);
		},
		enabled: !!organizationId,
	});
};

export const useCreateOrganization = () => {
	return useMutation({
		mutationFn: (data: CreateOrganization | FormData) => {
			return organizationService.createOrganization(data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["organizations"] });
		},
	});
};

export const useUpdateOrganization = () => {
	return useMutation({
		mutationFn: ({ organizationId, data }: { organizationId: string; data: UpdateOrganization | FormData }) => {
			return organizationService.updateOrganization(organizationId, data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["organizations"] });
		},
	});
};

export const useDeleteOrganization = () => {
	return useMutation({
		mutationFn: (organizationId: string) => {
			return organizationService.deleteOrganization(organizationId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["organizations"] });
		},
	});
};
