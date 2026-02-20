import { z } from "zod";
import { PaginationSchema, ObjectIdSchema } from "./common.zod";

export const RepaymentSchema = z.object({
	id: ObjectIdSchema,
	borrowingRecordId: ObjectIdSchema,
	amount: z.number(),
	paidAt: z.coerce.date(),
	note: z.string().optional().nullable(),
	actorUserId: ObjectIdSchema,
	isDeleted: z.boolean(),
	createdBy: ObjectIdSchema.optional().nullable(),
	updatedBy: ObjectIdSchema.optional().nullable(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export const CreateRepaymentSchema = RepaymentSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
}).partial({
	note: true,
	isDeleted: true,
	createdBy: true,
	updatedBy: true,
});

export const UpdateRepaymentSchema = RepaymentSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	isDeleted: true,
}).partial();

export const GetAllRepaymentsSchema = z.object({
	repayments: z.array(RepaymentSchema),
	pagination: PaginationSchema.optional(),
	count: z.number().optional(),
});

export type Repayment = z.infer<typeof RepaymentSchema>;
export type CreateRepayment = z.infer<typeof CreateRepaymentSchema>;
export type UpdateRepayment = z.infer<typeof UpdateRepaymentSchema>;

export type GetAllRepayments = z.infer<typeof GetAllRepaymentsSchema>;
