import { useMutation, useQuery } from "@tanstack/react-query";
import supplierService from "~/services/supplier-service";
import type { ApiQueryParams } from "~/services/api-service";
import { queryClient } from "~/lib/query-client";

export const useGetSuppliers = (apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["suppliers", apiParams],
		queryFn: () => {
			return supplierService
				.select(apiParams?.fields || "")
				.search(apiParams?.query || "")
				.paginate(apiParams?.page || 1, apiParams?.limit || 10)
				.sort(apiParams?.sort, apiParams?.order)
				.filter(apiParams?.filter || "")
				.getAllSuppliers();
		},
	});
};

export const useGetSupplierById = (supplierId: string, apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["supplier-by-id", supplierId, apiParams],
		queryFn: () => {
			return supplierService.select(apiParams?.fields || "").getSupplierById(supplierId);
		},
		enabled: !!supplierId,
	});
};

export const useCreateSupplier = () => {
	return useMutation({
		mutationFn: (data: object | FormData) => {
			return supplierService.createSupplier(data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["suppliers"] });
		},
	});
};

export const useUpdateSupplier = () => {
	return useMutation({
		mutationFn: ({ supplierId, data }: { supplierId: string; data: object | FormData }) => {
			return supplierService.updateSupplier(supplierId, data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["suppliers"] });
		},
	});
};

export const useDeleteSupplier = () => {
	return useMutation({
		mutationFn: (supplierId: string) => {
			return supplierService.deleteSupplier(supplierId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["suppliers"] });
		},
	});
};
