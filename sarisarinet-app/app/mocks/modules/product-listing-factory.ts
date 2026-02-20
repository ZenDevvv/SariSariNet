import {
	ProductListingSchema,
	CreateProductListingSchema,
	UpdateProductListingSchema,
	GetAllProductListingsSchema,
	type ProductListing,
	type CreateProductListing,
	type UpdateProductListing,
	type GetAllProductListings,
} from "~/zod/modules/product-listing.zod";
import { PaginationSchema } from "~/zod/modules/common.zod";
import { ProductListingVisibility, ProductListingStatus } from "~/zod/modules/prisma-enums";
import { createObjectId, createPagination } from "~/mocks/modules/mock-utils";

export const buildProductListingMock = (
	overrides: Partial<ProductListing> = {},
	seed = 1,
): ProductListing => {
	const base: ProductListing = {
		id: createObjectId(seed + 1),
		sellerUserId: createObjectId(seed + 2),
		title: "Sample Title " + seed,
		description: seed % 2 === 0 ? null : "Sample description for product-listing " + seed,
		category: "General",
		price: Number(((seed + 6) * 10.5).toFixed(2)),
		currency: "PHP",
		quantityAvailable: seed + 8,
		visibility: ProductListingVisibility.PUBLIC,
		status: ProductListingStatus.ACTIVE,
		imageUrls: ["https://cdn.example.com/product-listing/" + seed + ".jpg", "https://cdn.example.com/product-listing/" + (seed + 1) + ".jpg"],
		isDeleted: false,
		createdBy: seed % 2 === 0 ? null : createObjectId(seed + 13),
		updatedBy: seed % 2 === 0 ? null : createObjectId(seed + 14),
		createdAt: new Date(Date.now() - (seed + 15) * 24 * 60 * 60 * 1000),
		updatedAt: new Date(Date.now() - (seed + 16) * 30 * 60 * 1000),
	};

	return ProductListingSchema.parse({ ...base, ...overrides });
};

export const buildCreateProductListingMock = (
	overrides: Partial<CreateProductListing> = {},
	seed = 1,
): CreateProductListing => {
	return CreateProductListingSchema.parse({
		...buildProductListingMock({}, seed),
		...overrides,
	});
};

export const buildUpdateProductListingMock = (
	overrides: Partial<UpdateProductListing> = {},
	seed = 1,
): UpdateProductListing => {
	return UpdateProductListingSchema.parse({
		...buildProductListingMock({}, seed),
		...overrides,
	});
};

export const buildGetAllProductListingsMock = (
	options: {
		count?: number;
		page?: number;
		limit?: number;
		seed?: number;
		overrides?: Partial<GetAllProductListings>;
	} = {},
): GetAllProductListings => {
	const { count = 3, page = 1, limit = 10, seed = 1, overrides = {} } = options;

	return GetAllProductListingsSchema.parse({
		productListings: Array.from({ length: count }, (_, index) =>
			buildProductListingMock({}, seed + index),
		),
		pagination: PaginationSchema.parse(createPagination(count, page, limit)),
		count,
		...overrides,
	});
};
