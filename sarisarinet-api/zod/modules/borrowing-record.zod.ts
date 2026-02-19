import { z } from "zod";
import { isValidObjectId } from "mongoose";
import { PaginationSchema } from "../common.zod";
import { BorrowingDirection, BorrowingAssetType, BorrowingRecordStatus } from "../../generated/prisma";

export const BorrowingRecordSchema = z.object({
	id: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }),
	ownerUserId: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }),
	counterpartyUserId: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }),
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
	createdBy: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }).optional().nullable(),
	updatedBy: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }).optional().nullable(),
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
