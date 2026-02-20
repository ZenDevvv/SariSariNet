import { z } from "zod";
import { PaginationSchema, ObjectIdSchema } from "./common.zod";
import { BorrowingAuditEventType } from "./prisma-enums";

export const BorrowingAuditEntrySchema = z.object({
	id: ObjectIdSchema,
	borrowingRecordId: ObjectIdSchema,
	eventType: z.nativeEnum(BorrowingAuditEventType),
	payload: z.unknown(),
	actorUserId: ObjectIdSchema,
	isDeleted: z.boolean(),
	createdBy: ObjectIdSchema.optional().nullable(),
	updatedBy: ObjectIdSchema.optional().nullable(),
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

export type GetAllBorrowingAuditEntrys = z.infer<typeof GetAllBorrowingAuditEntrysSchema>;
