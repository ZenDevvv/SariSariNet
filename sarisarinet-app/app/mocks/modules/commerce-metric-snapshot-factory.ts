import {
	CommerceMetricSnapshotSchema,
	CreateCommerceMetricSnapshotSchema,
	UpdateCommerceMetricSnapshotSchema,
	GetAllCommerceMetricSnapshotsSchema,
	type CommerceMetricSnapshot,
	type CreateCommerceMetricSnapshot,
	type UpdateCommerceMetricSnapshot,
	type GetAllCommerceMetricSnapshots,
} from "~/zod/modules/commerce-metric-snapshot.zod";
import { PaginationSchema } from "~/zod/modules/common.zod";
import { createObjectId, createPagination } from "~/mocks/modules/mock-utils";

export const buildCommerceMetricSnapshotMock = (
	overrides: Partial<CommerceMetricSnapshot> = {},
	seed = 1,
): CommerceMetricSnapshot => {
	const base: CommerceMetricSnapshot = {
		id: createObjectId(seed + 1),
		userId: createObjectId(seed + 2),
		rangeStart: new Date(Date.now() - (seed + 3) * 24 * 60 * 60 * 1000),
		rangeEnd: new Date(Date.now() - (seed + 4) * 24 * 60 * 60 * 1000),
		revenue: Number(((seed + 5) * 10.5).toFixed(2)),
		expense: Number(((seed + 6) * 10.5).toFixed(2)),
		profit: Number(((seed + 7) * 10.5).toFixed(2)),
		uniqueCustomers: seed + 8,
		transactionCount: seed + 9,
		invoiceCount: seed + 10,
		computedAt: new Date(Date.now() - (seed + 11) * 24 * 60 * 60 * 1000),
		sourceVersion: seed + 12,
		isDeleted: false,
		createdBy: seed % 2 === 0 ? null : createObjectId(seed + 14),
		updatedBy: seed % 2 === 0 ? null : createObjectId(seed + 15),
		createdAt: new Date(Date.now() - (seed + 16) * 24 * 60 * 60 * 1000),
		updatedAt: new Date(Date.now() - (seed + 17) * 30 * 60 * 1000),
	};

	return CommerceMetricSnapshotSchema.parse({ ...base, ...overrides });
};

export const buildCreateCommerceMetricSnapshotMock = (
	overrides: Partial<CreateCommerceMetricSnapshot> = {},
	seed = 1,
): CreateCommerceMetricSnapshot => {
	return CreateCommerceMetricSnapshotSchema.parse({
		...buildCommerceMetricSnapshotMock({}, seed),
		...overrides,
	});
};

export const buildUpdateCommerceMetricSnapshotMock = (
	overrides: Partial<UpdateCommerceMetricSnapshot> = {},
	seed = 1,
): UpdateCommerceMetricSnapshot => {
	return UpdateCommerceMetricSnapshotSchema.parse({
		...buildCommerceMetricSnapshotMock({}, seed),
		...overrides,
	});
};

export const buildGetAllCommerceMetricSnapshotsMock = (
	options: {
		count?: number;
		page?: number;
		limit?: number;
		seed?: number;
		overrides?: Partial<GetAllCommerceMetricSnapshots>;
	} = {},
): GetAllCommerceMetricSnapshots => {
	const { count = 3, page = 1, limit = 10, seed = 1, overrides = {} } = options;

	return GetAllCommerceMetricSnapshotsSchema.parse({
		commerceMetricSnapshots: Array.from({ length: count }, (_, index) =>
			buildCommerceMetricSnapshotMock({}, seed + index),
		),
		pagination: PaginationSchema.parse(createPagination(count, page, limit)),
		count,
		...overrides,
	});
};
