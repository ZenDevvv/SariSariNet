import { z } from "zod";
import { PaginationSchema, ObjectIdSchema } from "./common.zod";
import { BorrowingDirection, BorrowingAssetType, BorrowingRecordStatus } from "./prisma-enums";

export const BorrowingRecordSchema = z.object({
	id: ObjectIdSchema,
	ownerUserId: ObjectIdSchema,
	counterpartyUserId: ObjectIdSchema,
	direction: z.nativeEnum(BorrowingDirection),
	assetType: z.nativeEnum(BorrowingAssetType),
	principalAmount: z.number().optional().nullable(),
	currency: z.string().optional().nullable(),
	itemDescription: z.string().optional().nullable(),
	quantity: z.number().optional().nullable(),
	dueDate: z.coerce.date(),
	status: z.nativeEnum(BorrowingRecordStatus),
	remainingBalance: z.number(),
	termsNote: z.string().optional().nullable(),
	closedAt: z.coerce.date().optional().nullable(),
	isDeleted: z.boolean(),
	createdBy: ObjectIdSchema.optional().nullable(),
	updatedBy: ObjectIdSchema.optional().nullable(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export const CreateBorrowingRecordSchema = BorrowingRecordSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
}).partial({
	principalAmount: true,
	currency: true,
	itemDescription: true,
	quantity: true,
	termsNote: true,
	closedAt: true,
	isDeleted: true,
	createdBy: true,
	updatedBy: true,
});

export const UpdateBorrowingRecordSchema = BorrowingRecordSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	isDeleted: true,
}).partial();

export const GetAllBorrowingRecordsSchema = z.object({
	borrowingRecords: z.array(BorrowingRecordSchema),
	pagination: PaginationSchema.optional(),
	count: z.number().optional(),
});

export type BorrowingRecord = z.infer<typeof BorrowingRecordSchema>;
export type CreateBorrowingRecord = z.infer<typeof CreateBorrowingRecordSchema>;
export type UpdateBorrowingRecord = z.infer<typeof UpdateBorrowingRecordSchema>;

export type GetAllBorrowingRecords = z.infer<typeof GetAllBorrowingRecordsSchema>;
