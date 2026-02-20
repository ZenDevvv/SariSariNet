import { z } from "zod";
import { PaginationSchema, ObjectIdSchema } from "./common.zod";
import { TransactionAdjustmentAction } from "./prisma-enums";

export const TransactionAdjustmentSchema = z.object({
	id: ObjectIdSchema,
	transactionId: ObjectIdSchema,
	action: z.nativeEnum(TransactionAdjustmentAction),
	reason: z.string(),
	beforeSnapshot: z.unknown(),
	afterSnapshot: z.unknown(),
	actorUserId: ObjectIdSchema,
	isDeleted: z.boolean(),
	createdBy: ObjectIdSchema.optional().nullable(),
	updatedBy: ObjectIdSchema.optional().nullable(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export const CreateTransactionAdjustmentSchema = TransactionAdjustmentSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
}).partial({
	isDeleted: true,
	createdBy: true,
	updatedBy: true,
});

export const UpdateTransactionAdjustmentSchema = TransactionAdjustmentSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	isDeleted: true,
}).partial();

export const GetAllTransactionAdjustmentsSchema = z.object({
	transactionAdjustments: z.array(TransactionAdjustmentSchema),
	pagination: PaginationSchema.optional(),
	count: z.number().optional(),
});

export type TransactionAdjustment = z.infer<typeof TransactionAdjustmentSchema>;
export type CreateTransactionAdjustment = z.infer<typeof CreateTransactionAdjustmentSchema>;
export type UpdateTransactionAdjustment = z.infer<typeof UpdateTransactionAdjustmentSchema>;

export type GetAllTransactionAdjustments = z.infer<typeof GetAllTransactionAdjustmentsSchema>;
