import { useMutation, useQuery } from "@tanstack/react-query";
import type { ApiQueryParams } from "~/services/api-service";
import { queryClient } from "~/lib/query-client";
import productListingService from "~/services/modules/product-listing-service";
import type { CreateProductListing, UpdateProductListing } from "~/zod/modules/product-listing.zod";

export const useGetProductListings = (apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["productListings", apiParams],
		queryFn: () => {
			return productListingService
				.select(apiParams?.fields || "")
				.search(apiParams?.query || "")
				.paginate(apiParams?.page || 1, apiParams?.limit || 10)
				.sort(apiParams?.sort, apiParams?.order)
				.filter(apiParams?.filter || "")
				.getAllProductListings();
		},
	});
};

export const useGetProductListingById = (productListingId: string, apiParams?: ApiQueryParams) => {
	return useQuery({
		queryKey: ["productListing-by-id", productListingId, apiParams],
		queryFn: () => {
			return productListingService
				.select(apiParams?.fields || "")
				.getProductListingById(productListingId);
		},
		enabled: !!productListingId,
	});
};

export const useCreateProductListing = () => {
	return useMutation({
		mutationFn: (data: CreateProductListing | FormData) => {
			return productListingService.createProductListing(data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["productListings"] });
		},
	});
};

export const useUpdateProductListing = () => {
	return useMutation({
		mutationFn: ({ productListingId, data }: { productListingId: string; data: UpdateProductListing | FormData }) => {
			return productListingService.updateProductListing(productListingId, data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["productListings"] });
		},
	});
};

export const useDeleteProductListing = () => {
	return useMutation({
		mutationFn: (productListingId: string) => {
			return productListingService.deleteProductListing(productListingId);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["productListings"] });
		},
	});
};
