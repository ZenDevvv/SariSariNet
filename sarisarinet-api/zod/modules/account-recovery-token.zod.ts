import { z } from "zod";
import { isValidObjectId } from "mongoose";
import { PaginationSchema } from "../common.zod";

export const AccountRecoveryTokenSchema = z.object({
	id: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }),
	userId: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }),
	tokenHash: z.string(),
	expiresAt: z.coerce.date(),
	consumedAt: z.coerce.date().optional().nullable(),
	attemptCount: z.number().int(),
	isDeleted: z.boolean(),
	createdBy: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }).optional().nullable(),
	updatedBy: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }).optional().nullable(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export const CreateAccountRecoveryTokenSchema = AccountRecoveryTokenSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
}).partial({
	consumedAt: true,
	isDeleted: true,
	createdBy: true,
	updatedBy: true,
});

export const UpdateAccountRecoveryTokenSchema = AccountRecoveryTokenSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	isDeleted: true,
}).partial();

export const GetAllAccountRecoveryTokensSchema = z.object({
	accountRecoveryTokens: z.array(AccountRecoveryTokenSchema),
	pagination: PaginationSchema.optional(),
	count: z.number().optional(),
});

export type AccountRecoveryToken = z.infer<typeof AccountRecoveryTokenSchema>;
export type CreateAccountRecoveryToken = z.infer<typeof CreateAccountRecoveryTokenSchema>;
export type UpdateAccountRecoveryToken = z.infer<typeof UpdateAccountRecoveryTokenSchema>;
