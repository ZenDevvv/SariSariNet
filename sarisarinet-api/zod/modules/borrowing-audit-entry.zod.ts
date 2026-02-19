import { z } from "zod";
import { isValidObjectId } from "mongoose";
import { PaginationSchema } from "../common.zod";
import { BorrowingAuditEventType } from "../../generated/prisma";

export const BorrowingAuditEntrySchema = z.object({
	id: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }),
	borrowingRecordId: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }),
	eventType: z.nativeEnum(BorrowingAuditEventType),
	payload: z.unknown(),
	actorUserId: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }),
	isDeleted: z.boolean(),
	createdBy: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }).optional().nullable(),
	updatedBy: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }).optional().nullable(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export const CreateBorrowingAuditEntrySchema = BorrowingAuditEntrySchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
}).partial({
	isDeleted: true,
	createdBy: true,
	updatedBy: true,
});

export const UpdateBorrowingAuditEntrySchema = BorrowingAuditEntrySchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	isDeleted: true,
}).partial();

export const GetAllBorrowingAuditEntrysSchema = z.object({
	borrowingAuditEntries: z.array(BorrowingAuditEntrySchema),
	pagination: PaginationSchema.optional(),
	count: z.number().optional(),
});

export type BorrowingAuditEntry = z.infer<typeof BorrowingAuditEntrySchema>;
export type CreateBorrowingAuditEntry = z.infer<typeof CreateBorrowingAuditEntrySchema>;
export type UpdateBorrowingAuditEntry = z.infer<typeof UpdateBorrowingAuditEntrySchema>;
