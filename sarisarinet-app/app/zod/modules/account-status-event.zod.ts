import { z } from "zod";
import { PaginationSchema, ObjectIdSchema } from "./common.zod";
import { AccountStatus } from "./prisma-enums";

export const AccountStatusEventSchema = z.object({
	id: ObjectIdSchema,
	userId: ObjectIdSchema,
	fromStatus: z.nativeEnum(AccountStatus),
	toStatus: z.nativeEnum(AccountStatus),
	reason: z.string(),
	actorUserId: ObjectIdSchema.optional().nullable(),
	isDeleted: z.boolean(),
	createdBy: ObjectIdSchema.optional().nullable(),
	updatedBy: ObjectIdSchema.optional().nullable(),
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

export type GetAllAccountStatusEvents = z.infer<typeof GetAllAccountStatusEventsSchema>;
