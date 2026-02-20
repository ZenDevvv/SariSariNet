import {
	BorrowingRecordSchema,
	CreateBorrowingRecordSchema,
	UpdateBorrowingRecordSchema,
	GetAllBorrowingRecordsSchema,
	type BorrowingRecord,
	type CreateBorrowingRecord,
	type UpdateBorrowingRecord,
	type GetAllBorrowingRecords,
} from "~/zod/modules/borrowing-record.zod";
import { PaginationSchema } from "~/zod/modules/common.zod";
import { BorrowingDirection, BorrowingAssetType, BorrowingRecordStatus } from "~/zod/modules/prisma-enums";
import { createObjectId, createPagination } from "~/mocks/modules/mock-utils";

export const buildBorrowingRecordMock = (
	overrides: Partial<BorrowingRecord> = {},
	seed = 1,
): BorrowingRecord => {
	const base: BorrowingRecord = {
		id: createObjectId(seed + 1),
		ownerUserId: createObjectId(seed + 2),
		counterpartyUserId: createObjectId(seed + 3),
		direction: BorrowingDirection.BORROWED,
		assetType: BorrowingAssetType.MONEY,
		principalAmount: seed % 2 === 0 ? null : Number(((seed + 6) * 10.5).toFixed(2)),
		currency: seed % 2 === 0 ? null : "PHP",
		itemDescription: seed % 2 === 0 ? null : "Sample description for borrowing-record " + seed,
		quantity: seed % 2 === 0 ? null : Number(((seed + 9) * 10.5).toFixed(2)),
		dueDate: new Date(Date.now() - (seed + 10) * 24 * 60 * 60 * 1000),
		status: BorrowingRecordStatus.UNPAID,
		remainingBalance: Number(((seed + 12) * 10.5).toFixed(2)),
		termsNote: seed % 2 === 0 ? null : "Note " + seed,
		closedAt: seed % 2 === 0 ? null : new Date(Date.now() - (seed + 14) * 24 * 60 * 60 * 1000),
		isDeleted: false,
		createdBy: seed % 2 === 0 ? null : createObjectId(seed + 16),
		updatedBy: seed % 2 === 0 ? null : createObjectId(seed + 17),
		createdAt: new Date(Date.now() - (seed + 18) * 24 * 60 * 60 * 1000),
		updatedAt: new Date(Date.now() - (seed + 19) * 30 * 60 * 1000),
	};

	return BorrowingRecordSchema.parse({ ...base, ...overrides });
};

export const buildCreateBorrowingRecordMock = (
	overrides: Partial<CreateBorrowingRecord> = {},
	seed = 1,
): CreateBorrowingRecord => {
	return CreateBorrowingRecordSchema.parse({
		...buildBorrowingRecordMock({}, seed),
		...overrides,
	});
};

export const buildUpdateBorrowingRecordMock = (
	overrides: Partial<UpdateBorrowingRecord> = {},
	seed = 1,
): UpdateBorrowingRecord => {
	return UpdateBorrowingRecordSchema.parse({
		...buildBorrowingRecordMock({}, seed),
		...overrides,
	});
};

export const buildGetAllBorrowingRecordsMock = (
	options: {
		count?: number;
		page?: number;
		limit?: number;
		seed?: number;
		overrides?: Partial<GetAllBorrowingRecords>;
	} = {},
): GetAllBorrowingRecords => {
	const { count = 3, page = 1, limit = 10, seed = 1, overrides = {} } = options;

	return GetAllBorrowingRecordsSchema.parse({
		borrowingRecords: Array.from({ length: count }, (_, index) =>
			buildBorrowingRecordMock({}, seed + index),
		),
		pagination: PaginationSchema.parse(createPagination(count, page, limit)),
		count,
		...overrides,
	});
};
