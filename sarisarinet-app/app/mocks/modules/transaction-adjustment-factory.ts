import {
	TransactionAdjustmentSchema,
	CreateTransactionAdjustmentSchema,
	UpdateTransactionAdjustmentSchema,
	GetAllTransactionAdjustmentsSchema,
	type TransactionAdjustment,
	type CreateTransactionAdjustment,
	type UpdateTransactionAdjustment,
	type GetAllTransactionAdjustments,
} from "~/zod/modules/transaction-adjustment.zod";
import { PaginationSchema } from "~/zod/modules/common.zod";
import { TransactionAdjustmentAction } from "~/zod/modules/prisma-enums";
import { createObjectId, createPagination } from "~/mocks/modules/mock-utils";

export const buildTransactionAdjustmentMock = (
	overrides: Partial<TransactionAdjustment> = {},
	seed = 1,
): TransactionAdjustment => {
	const base: TransactionAdjustment = {
		id: createObjectId(seed + 1),
		transactionId: createObjectId(seed + 2),
		action: TransactionAdjustmentAction.CORRECT,
		reason: "Reason " + seed,
		beforeSnapshot: { sample: "beforeSnapshot", seed, module: "transaction-adjustment" },
		afterSnapshot: { sample: "afterSnapshot", seed, module: "transaction-adjustment" },
		actorUserId: createObjectId(seed + 7),
		isDeleted: false,
		createdBy: seed % 2 === 0 ? null : createObjectId(seed + 9),
		updatedBy: seed % 2 === 0 ? null : createObjectId(seed + 10),
		createdAt: new Date(Date.now() - (seed + 11) * 24 * 60 * 60 * 1000),
		updatedAt: new Date(Date.now() - (seed + 12) * 30 * 60 * 1000),
	};

	return TransactionAdjustmentSchema.parse({ ...base, ...overrides });
};

export const buildCreateTransactionAdjustmentMock = (
	overrides: Partial<CreateTransactionAdjustment> = {},
	seed = 1,
): CreateTransactionAdjustment => {
	return CreateTransactionAdjustmentSchema.parse({
		...buildTransactionAdjustmentMock({}, seed),
		...overrides,
	});
};

export const buildUpdateTransactionAdjustmentMock = (
	overrides: Partial<UpdateTransactionAdjustment> = {},
	seed = 1,
): UpdateTransactionAdjustment => {
	return UpdateTransactionAdjustmentSchema.parse({
		...buildTransactionAdjustmentMock({}, seed),
		...overrides,
	});
};

export const buildGetAllTransactionAdjustmentsMock = (
	options: {
		count?: number;
		page?: number;
		limit?: number;
		seed?: number;
		overrides?: Partial<GetAllTransactionAdjustments>;
	} = {},
): GetAllTransactionAdjustments => {
	const { count = 3, page = 1, limit = 10, seed = 1, overrides = {} } = options;

	return GetAllTransactionAdjustmentsSchema.parse({
		transactionAdjustments: Array.from({ length: count }, (_, index) =>
			buildTransactionAdjustmentMock({}, seed + index),
		),
		pagination: PaginationSchema.parse(createPagination(count, page, limit)),
		count,
		...overrides,
	});
};
