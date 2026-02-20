import { useMutation, useQuery } from "@tanstack/react-query";
import type { ApiQueryParams } from "~/services/api-service";
import { queryClient } from "~/lib/query-client";
import suggestionLayoutPreferenceService from "~/services/modules/suggestion-layout-preference-service";
import type { CreateSuggestionLayoutPreference, UpdateSuggestionLayoutPreference } from "~/zod/modules/suggestion-layout-preference.zod";

export const useGetSuggestionLayoutPreferences = (apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["suggestionLayoutPreferences", apiParams],
		queryFn: () => {
			return suggestionLayoutPreferenceService
				.select(apiParams?.fields || "")
				.search(apiParams?.query || "")
				.paginate(apiParams?.page || 1, apiParams?.limit || 10)
				.sort(apiParams?.sort, apiParams?.order)
				.filter(apiParams?.filter || "")
				.getAllSuggestionLayoutPreferences();
		},
	});
};

export const useGetSuggestionLayoutPreferenceById = (suggestionLayoutPreferenceId: string, apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["suggestionLayoutPreference-by-id", suggestionLayoutPreferenceId, apiParams],
		queryFn: () => {
			return suggestionLayoutPreferenceService
				.select(apiParams?.fields || "")
				.getSuggestionLayoutPreferenceById(suggestionLayoutPreferenceId);
		},
		enabled: !!suggestionLayoutPreferenceId,
	});
};

export const useCreateSuggestionLayoutPreference = () => {
	return useMutation({
		mutationFn: (data: CreateSuggestionLayoutPreference | FormData) => {
			return suggestionLayoutPreferenceService.createSuggestionLayoutPreference(data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["suggestionLayoutPreferences"] });
		},
	});
};

export const useUpdateSuggestionLayoutPreference = () => {
	return useMutation({
		mutationFn: ({ suggestionLayoutPreferenceId, data }: { suggestionLayoutPreferenceId: string; data: UpdateSuggestionLayoutPreference | FormData }) => {
			return suggestionLayoutPreferenceService.updateSuggestionLayoutPreference(suggestionLayoutPreferenceId, data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["suggestionLayoutPreferences"] });
		},
	});
};

export const useDeleteSuggestionLayoutPreference = () => {
	return useMutation({
		mutationFn: (suggestionLayoutPreferenceId: string) => {
			return suggestionLayoutPreferenceService.deleteSuggestionLayoutPreference(suggestionLayoutPreferenceId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["suggestionLayoutPreferences"] });
		},
	});
};
