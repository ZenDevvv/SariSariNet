import { z } from "zod";
import { PaginationSchema, ObjectIdSchema } from "./common.zod";

export const CommerceMetricSnapshotSchema = z.object({
	id: ObjectIdSchema,
	userId: ObjectIdSchema,
	rangeStart: z.coerce.date(),
	rangeEnd: z.coerce.date(),
	revenue: z.number(),
	expense: z.number(),
	profit: z.number(),
	uniqueCustomers: z.number().int(),
	transactionCount: z.number().int(),
	invoiceCount: z.number().int(),
	computedAt: z.coerce.date(),
	sourceVersion: z.number().int(),
	isDeleted: z.boolean(),
	createdBy: ObjectIdSchema.optional().nullable(),
	updatedBy: ObjectIdSchema.optional().nullable(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export const CreateCommerceMetricSnapshotSchema = CommerceMetricSnapshotSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
}).partial({
	isDeleted: true,
	createdBy: true,
	updatedBy: true,
});

export const UpdateCommerceMetricSnapshotSchema = CommerceMetricSnapshotSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	isDeleted: true,
}).partial();

export const GetAllCommerceMetricSnapshotsSchema = z.object({
	commerceMetricSnapshots: z.array(CommerceMetricSnapshotSchema),
	pagination: PaginationSchema.optional(),
	count: z.number().optional(),
});

export type CommerceMetricSnapshot = z.infer<typeof CommerceMetricSnapshotSchema>;
export type CreateCommerceMetricSnapshot = z.infer<typeof CreateCommerceMetricSnapshotSchema>;
export type UpdateCommerceMetricSnapshot = z.infer<typeof UpdateCommerceMetricSnapshotSchema>;

export type GetAllCommerceMetricSnapshots = z.infer<typeof GetAllCommerceMetricSnapshotsSchema>;
