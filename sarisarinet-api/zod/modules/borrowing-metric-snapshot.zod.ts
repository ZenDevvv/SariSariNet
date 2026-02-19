import { z } from "zod";
import { isValidObjectId } from "mongoose";
import { PaginationSchema } from "../common.zod";

export const BorrowingMetricSnapshotSchema = z.object({
	id: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }),
	userId: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }),
	rangeStart: z.coerce.date(),
	rangeEnd: z.coerce.date(),
	totalLent: z.number(),
	totalBorrowed: z.number(),
	outstandingReceivable: z.number(),
	outstandingPayable: z.number(),
	overdueCount: z.number().int(),
	computedAt: z.coerce.date(),
	sourceVersion: z.number().int(),
	isDeleted: z.boolean(),
	createdBy: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }).optional().nullable(),
	updatedBy: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }).optional().nullable(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export const CreateBorrowingMetricSnapshotSchema = BorrowingMetricSnapshotSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
}).partial({
	isDeleted: true,
	createdBy: true,
	updatedBy: true,
});

export const UpdateBorrowingMetricSnapshotSchema = BorrowingMetricSnapshotSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	isDeleted: true,
}).partial();

export const GetAllBorrowingMetricSnapshotsSchema = z.object({
	borrowingMetricSnapshots: z.array(BorrowingMetricSnapshotSchema),
	pagination: PaginationSchema.optional(),
	count: z.number().optional(),
});

export type BorrowingMetricSnapshot = z.infer<typeof BorrowingMetricSnapshotSchema>;
export type CreateBorrowingMetricSnapshot = z.infer<typeof CreateBorrowingMetricSnapshotSchema>;
export type UpdateBorrowingMetricSnapshot = z.infer<typeof UpdateBorrowingMetricSnapshotSchema>;
