import { z } from "zod";
import { isValidObjectId } from "mongoose";
import { PaginationSchema } from "../common.zod";
import { TransactionAdjustmentAction } from "../../generated/prisma";

export const TransactionAdjustmentSchema = z.object({
	id: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }),
	transactionId: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }),
	action: z.nativeEnum(TransactionAdjustmentAction),
	reason: z.string(),
	beforeSnapshot: z.unknown(),
	afterSnapshot: z.unknown(),
	actorUserId: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }),
	isDeleted: z.boolean(),
	createdBy: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }).optional().nullable(),
	updatedBy: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }).optional().nullable(),
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
