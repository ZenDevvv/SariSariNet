import { useMutation, useQuery } from "@tanstack/react-query";
import type { ApiQueryParams } from "~/services/api-service";
import { queryClient } from "~/lib/query-client";
import settlementNoteService from "~/services/modules/settlement-note-service";
import type { CreateSettlementNote, UpdateSettlementNote } from "~/zod/modules/settlement-note.zod";

export const useGetSettlementNotes = (apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["settlementNotes", apiParams],
		queryFn: () => {
			return settlementNoteService
				.select(apiParams?.fields || "")
				.search(apiParams?.query || "")
				.paginate(apiParams?.page || 1, apiParams?.limit || 10)
				.sort(apiParams?.sort, apiParams?.order)
				.filter(apiParams?.filter || "")
				.getAllSettlementNotes();
		},
	});
};

export const useGetSettlementNoteById = (settlementNoteId: string, apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["settlementNote-by-id", settlementNoteId, apiParams],
		queryFn: () => {
			return settlementNoteService
				.select(apiParams?.fields || "")
				.getSettlementNoteById(settlementNoteId);
		},
		enabled: !!settlementNoteId,
	});
};

export const useCreateSettlementNote = () => {
	return useMutation({
		mutationFn: (data: CreateSettlementNote | FormData) => {
			return settlementNoteService.createSettlementNote(data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["settlementNotes"] });
		},
	});
};

export const useUpdateSettlementNote = () => {
	return useMutation({
		mutationFn: ({ settlementNoteId, data }: { settlementNoteId: string; data: UpdateSettlementNote | FormData }) => {
			return settlementNoteService.updateSettlementNote(settlementNoteId, data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["settlementNotes"] });
		},
	});
};

export const useDeleteSettlementNote = () => {
	return useMutation({
		mutationFn: (settlementNoteId: string) => {
			return settlementNoteService.deleteSettlementNote(settlementNoteId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["settlementNotes"] });
		},
	});
};
