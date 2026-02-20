import { APIService } from "~/services/api-service";
import { apiClient, type ApiResponse } from "~/lib/api-client";
import { API_ENDPOINTS } from "~/configs/endpoints";
import type {
	ProductListing,
	CreateProductListing,
	UpdateProductListing,
	GetAllProductListings,
} from "~/zod/modules/product-listing.zod";

const { PRODUCT_LISTING } = API_ENDPOINTS;

class ProductListingService extends APIService {
	getAllProductListings = async () => {
		try {
			const response: ApiResponse<GetAllProductListings> = await apiClient.get(
				`${PRODUCT_LISTING.GET_ALL}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			console.error("Error fetching productListings:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	getProductListingById = async (productListingId: string) => {
		try {
			const response: ApiResponse<ProductListing> = await apiClient.get(
				`${PRODUCT_LISTING.GET_BY_ID.replace(":id", productListingId)}${this.getQueryString()}`,
			);
			return response.data;
		} catch (error: any) {
			console.error("Error fetching productListing:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	createProductListing = async (data: CreateProductListing | FormData) => {
		try {
			const response: ApiResponse<ProductListing> =
				data instanceof FormData
					? await apiClient.postFormData(PRODUCT_LISTING.CREATE, data)
					: await apiClient.post(PRODUCT_LISTING.CREATE, data);
			return response.data;
		} catch (error: any) {
			console.error("Error creating productListing:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	updateProductListing = async (productListingId: string, data: UpdateProductListing | FormData) => {
		try {
			const endpoint = PRODUCT_LISTING.UPDATE.replace(":id", productListingId);
			const response: ApiResponse<ProductListing> =
				data instanceof FormData
					? await apiClient.patchFormData(endpoint, data)
					: await apiClient.patch(endpoint, data);
			return response.data;
		} catch (error: any) {
			console.error("Error updating productListing:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};

	deleteProductListing = async (productListingId: string) => {
		try {
			const response: ApiResponse<ProductListing> = await apiClient.delete(
				PRODUCT_LISTING.DELETE.replace(":id", productListingId),
			);
			return response.data;
		} catch (error: any) {
			console.error("Error deleting productListing:", error);
			throw new Error(
				error.data?.errors?.[0]?.message || error.message || "An error has occurred",
			);
		}
	};
}

export default new ProductListingService();
