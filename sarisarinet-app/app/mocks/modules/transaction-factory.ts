import {
	TransactionSchema,
	CreateTransactionSchema,
	UpdateTransactionSchema,
	GetAllTransactionsSchema,
	type Transaction,
	type CreateTransaction,
	type UpdateTransaction,
	type GetAllTransactions,
} from "~/zod/modules/transaction.zod";
import { PaginationSchema } from "~/zod/modules/common.zod";
import { TransactionStatus, TransactionInvoiceStatus } from "~/zod/modules/prisma-enums";
import { createObjectId, createPagination } from "~/mocks/modules/mock-utils";

export const buildTransactionMock = (
	overrides: Partial<Transaction> = {},
	seed = 1,
): Transaction => {
	const base: Transaction = {
		id: createObjectId(seed + 1),
		sellerUserId: createObjectId(seed + 2),
		buyerUserId: createObjectId(seed + 3),
		recordedByUserId: createObjectId(seed + 4),
		productListingId: seed % 2 === 0 ? null : createObjectId(seed + 5),
		amount: Number(((seed + 6) * 10.5).toFixed(2)),
		currency: "PHP",
		transactionDate: new Date(Date.now() - (seed + 8) * 24 * 60 * 60 * 1000),
		note: seed % 2 === 0 ? null : "Note " + seed,
		status: TransactionStatus.POSTED,
		invoiceStatus: TransactionInvoiceStatus.NONE,
		voidedAt: seed % 2 === 0 ? null : new Date(Date.now() - (seed + 12) * 24 * 60 * 60 * 1000),
		voidReason: seed % 2 === 0 ? null : "Reason " + seed,
		isDeleted: false,
		createdBy: seed % 2 === 0 ? null : createObjectId(seed + 15),
		updatedBy: seed % 2 === 0 ? null : createObjectId(seed + 16),
		createdAt: new Date(Date.now() - (seed + 17) * 24 * 60 * 60 * 1000),
		updatedAt: new Date(Date.now() - (seed + 18) * 30 * 60 * 1000),
	};

	return TransactionSchema.parse({ ...base, ...overrides });
};

export const buildCreateTransactionMock = (
	overrides: Partial<CreateTransaction> = {},
	seed = 1,
): CreateTransaction => {
	return CreateTransactionSchema.parse({
		...buildTransactionMock({}, seed),
		...overrides,
	});
};

export const buildUpdateTransactionMock = (
	overrides: Partial<UpdateTransaction> = {},
	seed = 1,
): UpdateTransaction => {
	return UpdateTransactionSchema.parse({
		...buildTransactionMock({}, seed),
		...overrides,
	});
};

export const buildGetAllTransactionsMock = (
	options: {
		count?: number;
		page?: number;
		limit?: number;
		seed?: number;
		overrides?: Partial<GetAllTransactions>;
	} = {},
): GetAllTransactions => {
	const { count = 3, page = 1, limit = 10, seed = 1, overrides = {} } = options;

	return GetAllTransactionsSchema.parse({
		transactions: Array.from({ length: count }, (_, index) =>
			buildTransactionMock({}, seed + index),
		),
		pagination: PaginationSchema.parse(createPagination(count, page, limit)),
		count,
		...overrides,
	});
};
