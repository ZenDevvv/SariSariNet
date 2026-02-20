import {
	RepaymentSchema,
	CreateRepaymentSchema,
	UpdateRepaymentSchema,
	GetAllRepaymentsSchema,
	type Repayment,
	type CreateRepayment,
	type UpdateRepayment,
	type GetAllRepayments,
} from "~/zod/modules/repayment.zod";
import { PaginationSchema } from "~/zod/modules/common.zod";
import { createObjectId, createPagination } from "~/mocks/modules/mock-utils";

export const buildRepaymentMock = (
	overrides: Partial<Repayment> = {},
	seed = 1,
): Repayment => {
	const base: Repayment = {
		id: createObjectId(seed + 1),
		borrowingRecordId: createObjectId(seed + 2),
		amount: Number(((seed + 3) * 10.5).toFixed(2)),
		paidAt: new Date(Date.now() - (seed + 4) * 24 * 60 * 60 * 1000),
		note: seed % 2 === 0 ? null : "Note " + seed,
		actorUserId: createObjectId(seed + 6),
		isDeleted: false,
		createdBy: seed % 2 === 0 ? null : createObjectId(seed + 8),
		updatedBy: seed % 2 === 0 ? null : createObjectId(seed + 9),
		createdAt: new Date(Date.now() - (seed + 10) * 24 * 60 * 60 * 1000),
		updatedAt: new Date(Date.now() - (seed + 11) * 30 * 60 * 1000),
	};

	return RepaymentSchema.parse({ ...base, ...overrides });
};

export const buildCreateRepaymentMock = (
	overrides: Partial<CreateRepayment> = {},
	seed = 1,
): CreateRepayment => {
	return CreateRepaymentSchema.parse({
		...buildRepaymentMock({}, seed),
		...overrides,
	});
};

export const buildUpdateRepaymentMock = (
	overrides: Partial<UpdateRepayment> = {},
	seed = 1,
): UpdateRepayment => {
	return UpdateRepaymentSchema.parse({
		...buildRepaymentMock({}, seed),
		...overrides,
	});
};

export const buildGetAllRepaymentsMock = (
	options: {
		count?: number;
		page?: number;
		limit?: number;
		seed?: number;
		overrides?: Partial<GetAllRepayments>;
	} = {},
): GetAllRepayments => {
	const { count = 3, page = 1, limit = 10, seed = 1, overrides = {} } = options;

	return GetAllRepaymentsSchema.parse({
		repayments: Array.from({ length: count }, (_, index) =>
			buildRepaymentMock({}, seed + index),
		),
		pagination: PaginationSchema.parse(createPagination(count, page, limit)),
		count,
		...overrides,
	});
};
