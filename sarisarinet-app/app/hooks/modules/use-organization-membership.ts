import { useMutation, useQuery } from "@tanstack/react-query";
import type { ApiQueryParams } from "~/services/api-service";
import { queryClient } from "~/lib/query-client";
import organizationMembershipService from "~/services/modules/organization-membership-service";
import type { CreateOrganizationMembership, UpdateOrganizationMembership } from "~/zod/modules/organization-membership.zod";

export const useGetOrganizationMemberships = (apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["organizationMemberships", apiParams],
		queryFn: () => {
			return organizationMembershipService
				.select(apiParams?.fields || "")
				.search(apiParams?.query || "")
				.paginate(apiParams?.page || 1, apiParams?.limit || 10)
				.sort(apiParams?.sort, apiParams?.order)
				.filter(apiParams?.filter || "")
				.getAllOrganizationMemberships();
		},
	});
};

export const useGetOrganizationMembershipById = (organizationMembershipId: string, apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["organizationMembership-by-id", organizationMembershipId, apiParams],
		queryFn: () => {
			return organizationMembershipService
				.select(apiParams?.fields || "")
				.getOrganizationMembershipById(organizationMembershipId);
		},
		enabled: !!organizationMembershipId,
	});
};

export const useCreateOrganizationMembership = () => {
	return useMutation({
		mutationFn: (data: CreateOrganizationMembership | FormData) => {
			return organizationMembershipService.createOrganizationMembership(data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["organizationMemberships"] });
		},
	});
};

export const useUpdateOrganizationMembership = () => {
	return useMutation({
		mutationFn: ({ organizationMembershipId, data }: { organizationMembershipId: string; data: UpdateOrganizationMembership | FormData }) => {
			return organizationMembershipService.updateOrganizationMembership(organizationMembershipId, data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["organizationMemberships"] });
		},
	});
};

export const useDeleteOrganizationMembership = () => {
	return useMutation({
		mutationFn: (organizationMembershipId: string) => {
			return organizationMembershipService.deleteOrganizationMembership(organizationMembershipId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["organizationMemberships"] });
		},
	});
};
