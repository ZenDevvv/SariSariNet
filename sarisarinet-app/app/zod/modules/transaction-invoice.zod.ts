import { z } from "zod";
import { PaginationSchema, ObjectIdSchema } from "./common.zod";
import { TransactionInvoiceMimeType, InvoiceScanStatus } from "./prisma-enums";

export const TransactionInvoiceSchema = z.object({
	id: ObjectIdSchema,
	transactionId: ObjectIdSchema,
	storageKey: z.string(),
	mimeType: z.nativeEnum(TransactionInvoiceMimeType),
	size: z.number().int(),
	sha256: z.string(),
	scanStatus: z.nativeEnum(InvoiceScanStatus),
	uploadedByUserId: ObjectIdSchema,
	uploadedAt: z.coerce.date(),
	isDeleted: z.boolean(),
	createdBy: ObjectIdSchema.optional().nullable(),
	updatedBy: ObjectIdSchema.optional().nullable(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export const CreateTransactionInvoiceSchema = TransactionInvoiceSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
}).partial({
	isDeleted: true,
	createdBy: true,
	updatedBy: true,
});

export const UpdateTransactionInvoiceSchema = TransactionInvoiceSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	isDeleted: true,
}).partial();

export const GetAllTransactionInvoicesSchema = z.object({
	transactionInvoices: z.array(TransactionInvoiceSchema),
	pagination: PaginationSchema.optional(),
	count: z.number().optional(),
});

export type TransactionInvoice = z.infer<typeof TransactionInvoiceSchema>;
export type CreateTransactionInvoice = z.infer<typeof CreateTransactionInvoiceSchema>;
export type UpdateTransactionInvoice = z.infer<typeof UpdateTransactionInvoiceSchema>;

export type GetAllTransactionInvoices = z.infer<typeof GetAllTransactionInvoicesSchema>;
