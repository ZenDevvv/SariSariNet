import {
	BorrowingMetricSnapshotSchema,
	CreateBorrowingMetricSnapshotSchema,
	UpdateBorrowingMetricSnapshotSchema,
	GetAllBorrowingMetricSnapshotsSchema,
	type BorrowingMetricSnapshot,
	type CreateBorrowingMetricSnapshot,
	type UpdateBorrowingMetricSnapshot,
	type GetAllBorrowingMetricSnapshots,
} from "~/zod/modules/borrowing-metric-snapshot.zod";
import { PaginationSchema } from "~/zod/modules/common.zod";
import { createObjectId, createPagination } from "~/mocks/modules/mock-utils";

export const buildBorrowingMetricSnapshotMock = (
	overrides: Partial<BorrowingMetricSnapshot> = {},
	seed = 1,
): BorrowingMetricSnapshot => {
	const base: BorrowingMetricSnapshot = {
		id: createObjectId(seed + 1),
		userId: createObjectId(seed + 2),
		rangeStart: new Date(Date.now() - (seed + 3) * 24 * 60 * 60 * 1000),
		rangeEnd: new Date(Date.now() - (seed + 4) * 24 * 60 * 60 * 1000),
		totalLent: Number(((seed + 5) * 10.5).toFixed(2)),
		totalBorrowed: Number(((seed + 6) * 10.5).toFixed(2)),
		outstandingReceivable: Number(((seed + 7) * 10.5).toFixed(2)),
		outstandingPayable: Number(((seed + 8) * 10.5).toFixed(2)),
		overdueCount: seed + 9,
		computedAt: new Date(Date.now() - (seed + 10) * 24 * 60 * 60 * 1000),
		sourceVersion: seed + 11,
		isDeleted: false,
		createdBy: seed % 2 === 0 ? null : createObjectId(seed + 13),
		updatedBy: seed % 2 === 0 ? null : createObjectId(seed + 14),
		createdAt: new Date(Date.now() - (seed + 15) * 24 * 60 * 60 * 1000),
		updatedAt: new Date(Date.now() - (seed + 16) * 30 * 60 * 1000),
	};

	return BorrowingMetricSnapshotSchema.parse({ ...base, ...overrides });
};

export const buildCreateBorrowingMetricSnapshotMock = (
	overrides: Partial<CreateBorrowingMetricSnapshot> = {},
	seed = 1,
): CreateBorrowingMetricSnapshot => {
	return CreateBorrowingMetricSnapshotSchema.parse({
		...buildBorrowingMetricSnapshotMock({}, seed),
		...overrides,
	});
};

export const buildUpdateBorrowingMetricSnapshotMock = (
	overrides: Partial<UpdateBorrowingMetricSnapshot> = {},
	seed = 1,
): UpdateBorrowingMetricSnapshot => {
	return UpdateBorrowingMetricSnapshotSchema.parse({
		...buildBorrowingMetricSnapshotMock({}, seed),
		...overrides,
	});
};

export const buildGetAllBorrowingMetricSnapshotsMock = (
	options: {
		count?: number;
		page?: number;
		limit?: number;
		seed?: number;
		overrides?: Partial<GetAllBorrowingMetricSnapshots>;
	} = {},
): GetAllBorrowingMetricSnapshots => {
	const { count = 3, page = 1, limit = 10, seed = 1, overrides = {} } = options;

	return GetAllBorrowingMetricSnapshotsSchema.parse({
		borrowingMetricSnapshots: Array.from({ length: count }, (_, index) =>
			buildBorrowingMetricSnapshotMock({}, seed + index),
		),
		pagination: PaginationSchema.parse(createPagination(count, page, limit)),
		count,
		...overrides,
	});
};
