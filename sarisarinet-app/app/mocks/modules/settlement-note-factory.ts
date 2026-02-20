import {
	SettlementNoteSchema,
	CreateSettlementNoteSchema,
	UpdateSettlementNoteSchema,
	GetAllSettlementNotesSchema,
	type SettlementNote,
	type CreateSettlementNote,
	type UpdateSettlementNote,
	type GetAllSettlementNotes,
} from "~/zod/modules/settlement-note.zod";
import { PaginationSchema } from "~/zod/modules/common.zod";
import { createObjectId, createPagination } from "~/mocks/modules/mock-utils";

export const buildSettlementNoteMock = (
	overrides: Partial<SettlementNote> = {},
	seed = 1,
): SettlementNote => {
	const base: SettlementNote = {
		id: createObjectId(seed + 1),
		borrowingRecordId: createObjectId(seed + 2),
		note: "Note " + seed,
		actorUserId: createObjectId(seed + 4),
		isDeleted: false,
		createdBy: seed % 2 === 0 ? null : createObjectId(seed + 6),
		updatedBy: seed % 2 === 0 ? null : createObjectId(seed + 7),
		createdAt: new Date(Date.now() - (seed + 8) * 24 * 60 * 60 * 1000),
		updatedAt: new Date(Date.now() - (seed + 9) * 30 * 60 * 1000),
	};

	return SettlementNoteSchema.parse({ ...base, ...overrides });
};

export const buildCreateSettlementNoteMock = (
	overrides: Partial<CreateSettlementNote> = {},
	seed = 1,
): CreateSettlementNote => {
	return CreateSettlementNoteSchema.parse({
		...buildSettlementNoteMock({}, seed),
		...overrides,
	});
};

export const buildUpdateSettlementNoteMock = (
	overrides: Partial<UpdateSettlementNote> = {},
	seed = 1,
): UpdateSettlementNote => {
	return UpdateSettlementNoteSchema.parse({
		...buildSettlementNoteMock({}, seed),
		...overrides,
	});
};

export const buildGetAllSettlementNotesMock = (
	options: {
		count?: number;
		page?: number;
		limit?: number;
		seed?: number;
		overrides?: Partial<GetAllSettlementNotes>;
	} = {},
): GetAllSettlementNotes => {
	const { count = 3, page = 1, limit = 10, seed = 1, overrides = {} } = options;

	return GetAllSettlementNotesSchema.parse({
		settlementNotes: Array.from({ length: count }, (_, index) =>
			buildSettlementNoteMock({}, seed + index),
		),
		pagination: PaginationSchema.parse(createPagination(count, page, limit)),
		count,
		...overrides,
	});
};
