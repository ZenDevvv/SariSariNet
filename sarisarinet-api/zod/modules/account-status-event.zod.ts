import { z } from "zod";
import { isValidObjectId } from "mongoose";
import { PaginationSchema } from "../common.zod";
import { AccountStatus } from "../../generated/prisma";

export const AccountStatusEventSchema = z.object({
	id: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }),
	userId: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }),
	fromStatus: z.nativeEnum(AccountStatus),
	toStatus: z.nativeEnum(AccountStatus),
	reason: z.string(),
	actorUserId: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }).optional().nullable(),
	isDeleted: z.boolean(),
	createdBy: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }).optional().nullable(),
	updatedBy: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }).optional().nullable(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export const CreateAccountStatusEventSchema = AccountStatusEventSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
}).partial({
	actorUserId: true,
	isDeleted: true,
	createdBy: true,
	updatedBy: true,
});

export const UpdateAccountStatusEventSchema = AccountStatusEventSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	isDeleted: true,
}).partial();

export const GetAllAccountStatusEventsSchema = z.object({
	accountStatusEvents: z.array(AccountStatusEventSchema),
	pagination: PaginationSchema.optional(),
	count: z.number().optional(),
});

export type AccountStatusEvent = z.infer<typeof AccountStatusEventSchema>;
export type CreateAccountStatusEvent = z.infer<typeof CreateAccountStatusEventSchema>;
export type UpdateAccountStatusEvent = z.infer<typeof UpdateAccountStatusEventSchema>;
