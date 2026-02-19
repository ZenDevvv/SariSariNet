import { z } from "zod";
import { isValidObjectId } from "mongoose";
import { PaginationSchema } from "../common.zod";
import { ListingLifecycleEventType } from "../../generated/prisma";

export const ListingLifecycleEventSchema = z.object({
	id: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }),
	listingId: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }),
	actorUserId: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }),
	eventType: z.nativeEnum(ListingLifecycleEventType),
	beforeState: z.unknown().optional().nullable(),
	afterState: z.unknown().optional().nullable(),
	reason: z.string().optional().nullable(),
	isDeleted: z.boolean(),
	createdBy: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }).optional().nullable(),
	updatedBy: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }).optional().nullable(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export const CreateListingLifecycleEventSchema = ListingLifecycleEventSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
}).partial({
	beforeState: true,
	afterState: true,
	reason: true,
	isDeleted: true,
	createdBy: true,
	updatedBy: true,
});

export const UpdateListingLifecycleEventSchema = ListingLifecycleEventSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	isDeleted: true,
}).partial();

export const GetAllListingLifecycleEventsSchema = z.object({
	listingLifecycleEvents: z.array(ListingLifecycleEventSchema),
	pagination: PaginationSchema.optional(),
	count: z.number().optional(),
});

export type ListingLifecycleEvent = z.infer<typeof ListingLifecycleEventSchema>;
export type CreateListingLifecycleEvent = z.infer<typeof CreateListingLifecycleEventSchema>;
export type UpdateListingLifecycleEvent = z.infer<typeof UpdateListingLifecycleEventSchema>;
