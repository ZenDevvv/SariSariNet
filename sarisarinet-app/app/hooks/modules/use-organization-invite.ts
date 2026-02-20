import { useMutation, useQuery } from "@tanstack/react-query";
import type { ApiQueryParams } from "~/services/api-service";
import { queryClient } from "~/lib/query-client";
import organizationInviteService from "~/services/modules/organization-invite-service";
import type { CreateOrganizationInvite, UpdateOrganizationInvite } from "~/zod/modules/organization-invite.zod";

export const useGetOrganizationInvites = (apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["organizationInvites", apiParams],
		queryFn: () => {
			return organizationInviteService
				.select(apiParams?.fields || "")
				.search(apiParams?.query || "")
				.paginate(apiParams?.page || 1, apiParams?.limit || 10)
				.sort(apiParams?.sort, apiParams?.order)
				.filter(apiParams?.filter || "")
				.getAllOrganizationInvites();
		},
	});
};

export const useGetOrganizationInviteById = (organizationInviteId: string, apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["organizationInvite-by-id", organizationInviteId, apiParams],
		queryFn: () => {
			return organizationInviteService
				.select(apiParams?.fields || "")
				.getOrganizationInviteById(organizationInviteId);
		},
		enabled: !!organizationInviteId,
	});
};

export const useCreateOrganizationInvite = () => {
	return useMutation({
		mutationFn: (data: CreateOrganizationInvite | FormData) => {
			return organizationInviteService.createOrganizationInvite(data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["organizationInvites"] });
		},
	});
};

export const useUpdateOrganizationInvite = () => {
	return useMutation({
		mutationFn: ({ organizationInviteId, data }: { organizationInviteId: string; data: UpdateOrganizationInvite | FormData }) => {
			return organizationInviteService.updateOrganizationInvite(organizationInviteId, data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["organizationInvites"] });
		},
	});
};

export const useDeleteOrganizationInvite = () => {
	return useMutation({
		mutationFn: (organizationInviteId: string) => {
			return organizationInviteService.deleteOrganizationInvite(organizationInviteId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["organizationInvites"] });
		},
	});
};
