import { APIService } from "~/services/api-service";
import { apiClient, type ApiResponse } from "~/lib/api-client";
import { API_ENDPOINTS } from "~/configs/endpoints";
import type {
	SettlementNote,
	CreateSettlementNote,
	UpdateSettlementNote,
	GetAllSettlementNotes,
} from "~/zod/modules/settlement-note.zod";

const { SETTLEMENT_NOTE } = API_ENDPOINTS;

class SettlementNoteService extends APIService {
	getAllSettlementNotes = async () => {
		try {
			const response: ApiResponse<GetAllSettlementNotes> = await apiClient.get(
				`${SETTLEMENT_NOTE.GET_ALL}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			console.error("Error fetching settlementNotes:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	getSettlementNoteById = async (settlementNoteId: string) => {
		try {
			const response: ApiResponse<SettlementNote> = await apiClient.get(
				`${SETTLEMENT_NOTE.GET_BY_ID.replace(":id", settlementNoteId)}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			console.error("Error fetching settlementNote:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	createSettlementNote = async (data: CreateSettlementNote | FormData) => {
		try {
			const response: ApiResponse<SettlementNote> =
				data instanceof FormData
					? await apiClient.postFormData(SETTLEMENT_NOTE.CREATE, data)
					: await apiClient.post(SETTLEMENT_NOTE.CREATE, data);
			return response.data;
		} catch (error: any) {
			console.error("Error creating settlementNote:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	updateSettlementNote = async (settlementNoteId: string, data: UpdateSettlementNote | FormData) => {
		try {
			const endpoint = SETTLEMENT_NOTE.UPDATE.replace(":id", settlementNoteId);
			const response: ApiResponse<SettlementNote> =
				data instanceof FormData
					? await apiClient.patchFormData(endpoint, data)
					: await apiClient.patch(endpoint, data);
			return response.data;
		} catch (error: any) {
			console.error("Error updating settlementNote:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	deleteSettlementNote = async (settlementNoteId: string) => {
		try {
			const response: ApiResponse<SettlementNote> = await apiClient.delete(
				SETTLEMENT_NOTE.DELETE.replace(":id", settlementNoteId),
			);
			return response.data;
		} catch (error: any) {
			console.error("Error deleting settlementNote:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};
}

export default new SettlementNoteService();
