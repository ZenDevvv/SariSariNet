import { z } from "zod";
import { isValidObjectId } from "mongoose";
import { PaginationSchema } from "../common.zod";
import { ProductListingVisibility, ProductListingStatus } from "../../generated/prisma";

export const ProductListingSchema = z.object({
	id: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }),
	sellerUserId: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }),
	title: z.string(),
	description: z.string().optional().nullable(),
	category: z.string(),
	price: z.number(),
	currency: z.string(),
	quantityAvailable: z.number().int(),
	visibility: z.nativeEnum(ProductListingVisibility),
	status: z.nativeEnum(ProductListingStatus),
	imageUrls: z.array(z.string()),
	isDeleted: z.boolean(),
	createdBy: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }).optional().nullable(),
	updatedBy: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }).optional().nullable(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export const CreateProductListingSchema = ProductListingSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
}).partial({
	description: true,
	isDeleted: true,
	createdBy: true,
	updatedBy: true,
});

export const UpdateProductListingSchema = ProductListingSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	isDeleted: true,
}).partial();

export const GetAllProductListingsSchema = z.object({
	productListings: z.array(ProductListingSchema),
	pagination: PaginationSchema.optional(),
	count: z.number().optional(),
});

export type ProductListing = z.infer<typeof ProductListingSchema>;
export type CreateProductListing = z.infer<typeof CreateProductListingSchema>;
export type UpdateProductListing = z.infer<typeof UpdateProductListingSchema>;
