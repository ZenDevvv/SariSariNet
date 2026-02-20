import {
	BorrowingAuditEntrySchema,
	CreateBorrowingAuditEntrySchema,
	UpdateBorrowingAuditEntrySchema,
	GetAllBorrowingAuditEntrysSchema,
	type BorrowingAuditEntry,
	type CreateBorrowingAuditEntry,
	type UpdateBorrowingAuditEntry,
	type GetAllBorrowingAuditEntrys,
} from "~/zod/modules/borrowing-audit-entry.zod";
import { PaginationSchema } from "~/zod/modules/common.zod";
import { BorrowingAuditEventType } from "~/zod/modules/prisma-enums";
import { createObjectId, createPagination } from "~/mocks/modules/mock-utils";

export const buildBorrowingAuditEntryMock = (
	overrides: Partial<BorrowingAuditEntry> = {},
	seed = 1,
): BorrowingAuditEntry => {
	const base: BorrowingAuditEntry = {
		id: createObjectId(seed + 1),
		borrowingRecordId: createObjectId(seed + 2),
		eventType: BorrowingAuditEventType.RECORD_CREATED,
		payload: { sample: "payload", seed, module: "borrowing-audit-entry" },
		actorUserId: createObjectId(seed + 5),
		isDeleted: false,
		createdBy: seed % 2 === 0 ? null : createObjectId(seed + 7),
		updatedBy: seed % 2 === 0 ? null : createObjectId(seed + 8),
		createdAt: new Date(Date.now() - (seed + 9) * 24 * 60 * 60 * 1000),
		updatedAt: new Date(Date.now() - (seed + 10) * 30 * 60 * 1000),
	};

	return BorrowingAuditEntrySchema.parse({ ...base, ...overrides });
};

export const buildCreateBorrowingAuditEntryMock = (
	overrides: Partial<CreateBorrowingAuditEntry> = {},
	seed = 1,
): CreateBorrowingAuditEntry => {
	return CreateBorrowingAuditEntrySchema.parse({
		...buildBorrowingAuditEntryMock({}, seed),
		...overrides,
	});
};

export const buildUpdateBorrowingAuditEntryMock = (
	overrides: Partial<UpdateBorrowingAuditEntry> = {},
	seed = 1,
): UpdateBorrowingAuditEntry => {
	return UpdateBorrowingAuditEntrySchema.parse({
		...buildBorrowingAuditEntryMock({}, seed),
		...overrides,
	});
};

export const buildGetAllBorrowingAuditEntriesMock = (
	options: {
		count?: number;
		page?: number;
		limit?: number;
		seed?: number;
		overrides?: Partial<GetAllBorrowingAuditEntrys>;
	} = {},
): GetAllBorrowingAuditEntrys => {
	const { count = 3, page = 1, limit = 10, seed = 1, overrides = {} } = options;

	return GetAllBorrowingAuditEntrysSchema.parse({
		borrowingAuditEntries: Array.from({ length: count }, (_, index) =>
			buildBorrowingAuditEntryMock({}, seed + index),
		),
		pagination: PaginationSchema.parse(createPagination(count, page, limit)),
		count,
		...overrides,
	});
};
