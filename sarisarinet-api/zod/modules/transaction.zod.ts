import { z } from "zod";
import { isValidObjectId } from "mongoose";
import { PaginationSchema } from "../common.zod";
import { TransactionStatus, TransactionInvoiceStatus } from "../../generated/prisma";

export const TransactionSchema = z.object({
	id: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }),
	sellerUserId: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }),
	buyerUserId: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }),
	recordedByUserId: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }),
	productListingId: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }).optional().nullable(),
	amount: z.number(),
	currency: z.string(),
	transactionDate: z.coerce.date(),
	note: z.string().optional().nullable(),
	status: z.nativeEnum(TransactionStatus),
	invoiceStatus: z.nativeEnum(TransactionInvoiceStatus),
	voidedAt: z.coerce.date().optional().nullable(),
	voidReason: z.string().optional().nullable(),
	isDeleted: z.boolean(),
	createdBy: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }).optional().nullable(),
	updatedBy: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }).optional().nullable(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export const CreateTransactionSchema = TransactionSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
}).partial({
	productListingId: true,
	note: true,
	voidedAt: true,
	voidReason: true,
	isDeleted: true,
	createdBy: true,
	updatedBy: true,
});

export const UpdateTransactionSchema = TransactionSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	isDeleted: true,
}).partial();

export const GetAllTransactionsSchema = z.object({
	transactions: z.array(TransactionSchema),
	pagination: PaginationSchema.optional(),
	count: z.number().optional(),
});

export type Transaction = z.infer<typeof TransactionSchema>;
export type CreateTransaction = z.infer<typeof CreateTransactionSchema>;
export type UpdateTransaction = z.infer<typeof UpdateTransactionSchema>;
