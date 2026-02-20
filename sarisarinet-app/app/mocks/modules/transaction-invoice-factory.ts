import {
	TransactionInvoiceSchema,
	CreateTransactionInvoiceSchema,
	UpdateTransactionInvoiceSchema,
	GetAllTransactionInvoicesSchema,
	type TransactionInvoice,
	type CreateTransactionInvoice,
	type UpdateTransactionInvoice,
	type GetAllTransactionInvoices,
} from "~/zod/modules/transaction-invoice.zod";
import { PaginationSchema } from "~/zod/modules/common.zod";
import { TransactionInvoiceMimeType, InvoiceScanStatus } from "~/zod/modules/prisma-enums";
import { createObjectId, createPagination } from "~/mocks/modules/mock-utils";

export const buildTransactionInvoiceMock = (
	overrides: Partial<TransactionInvoice> = {},
	seed = 1,
): TransactionInvoice => {
	const base: TransactionInvoice = {
		id: createObjectId(seed + 1),
		transactionId: createObjectId(seed + 2),
		storageKey: "exports/report-" + seed + ".csv",
		mimeType: TransactionInvoiceMimeType.IMAGE_JPEG,
		size: 1024 * (seed + 5),
		sha256: "sha256-" + String(seed).padStart(16, "0"),
		scanStatus: InvoiceScanStatus.PENDING,
		uploadedByUserId: createObjectId(seed + 8),
		uploadedAt: new Date(Date.now() - (seed + 9) * 24 * 60 * 60 * 1000),
		isDeleted: false,
		createdBy: seed % 2 === 0 ? null : createObjectId(seed + 11),
		updatedBy: seed % 2 === 0 ? null : createObjectId(seed + 12),
		createdAt: new Date(Date.now() - (seed + 13) * 24 * 60 * 60 * 1000),
		updatedAt: new Date(Date.now() - (seed + 14) * 30 * 60 * 1000),
	};

	return TransactionInvoiceSchema.parse({ ...base, ...overrides });
};

export const buildCreateTransactionInvoiceMock = (
	overrides: Partial<CreateTransactionInvoice> = {},
	seed = 1,
): CreateTransactionInvoice => {
	return CreateTransactionInvoiceSchema.parse({
		...buildTransactionInvoiceMock({}, seed),
		...overrides,
	});
};

export const buildUpdateTransactionInvoiceMock = (
	overrides: Partial<UpdateTransactionInvoice> = {},
	seed = 1,
): UpdateTransactionInvoice => {
	return UpdateTransactionInvoiceSchema.parse({
		...buildTransactionInvoiceMock({}, seed),
		...overrides,
	});
};

export const buildGetAllTransactionInvoicesMock = (
	options: {
		count?: number;
		page?: number;
		limit?: number;
		seed?: number;
		overrides?: Partial<GetAllTransactionInvoices>;
	} = {},
): GetAllTransactionInvoices => {
	const { count = 3, page = 1, limit = 10, seed = 1, overrides = {} } = options;

	return GetAllTransactionInvoicesSchema.parse({
		transactionInvoices: Array.from({ length: count }, (_, index) =>
			buildTransactionInvoiceMock({}, seed + index),
		),
		pagination: PaginationSchema.parse(createPagination(count, page, limit)),
		count,
		...overrides,
	});
};
