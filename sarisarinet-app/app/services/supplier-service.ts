import { APIService } from "./api-service";
import { apiClient, type ApiResponse } from "~/lib/api-client";
import { API_ENDPOINTS } from "~/configs/endpoints";
import type { GetAllSuppliers, Supplier, SupplierWithRelation } from "~/zod/supplier.zod";

const { SUPPLIER } = API_ENDPOINTS;

class SupplierService extends APIService {
	getAllSuppliers = async () => {
		try {
			const response: ApiResponse<GetAllSuppliers> = await apiClient.get(
				`${SUPPLIER.GET_ALL}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	getSupplierById = async (supplierId: string) => {
		try {
			const response: ApiResponse<SupplierWithRelation> = await apiClient.get(
				`${SUPPLIER.GET_BY_ID.replace(":id", supplierId)}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	createSupplier = async (data: object | FormData) => {
		try {
			let response;
			if (data instanceof FormData) {
				response = await apiClient.postFormData(SUPPLIER.CREATE, data);
			} else {
				response = await apiClient.post(SUPPLIER.CREATE, data);
			}
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	updateSupplier = async (supplierId: string, data: object | FormData) => {
		try {
			let response;
			if (data instanceof FormData) {
				response = await apiClient.patchFormData(
					SUPPLIER.UPDATE.replace(":id", supplierId),
					data,
				);
			} else {
				response = await apiClient.patch(SUPPLIER.UPDATE.replace(":id", supplierId), data);
			}
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	deleteSupplier = async (supplierId: string) => {
		try {
			const response = await apiClient.put(SUPPLIER.DELETE.replace(":id", supplierId));
			return response.data;
		} catch (error: any) {
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};
}

export default new SupplierService();
