import { z } from "zod";
import { isValidObjectId } from "mongoose";
import { PaginationSchema } from "../common.zod";

export const RepaymentSchema = z.object({
	id: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }),
	borrowingRecordId: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }),
	amount: z.number(),
	paidAt: z.coerce.date(),
	note: z.string().optional().nullable(),
	actorUserId: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }),
	isDeleted: z.boolean(),
	createdBy: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }).optional().nullable(),
	updatedBy: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }).optional().nullable(),
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
