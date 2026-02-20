import {
	AccountStatusEventSchema,
	CreateAccountStatusEventSchema,
	UpdateAccountStatusEventSchema,
	GetAllAccountStatusEventsSchema,
	type AccountStatusEvent,
	type CreateAccountStatusEvent,
	type UpdateAccountStatusEvent,
	type GetAllAccountStatusEvents,
} from "~/zod/modules/account-status-event.zod";
import { PaginationSchema } from "~/zod/modules/common.zod";
import { AccountStatus } from "~/zod/modules/prisma-enums";
import { createObjectId, createPagination } from "~/mocks/modules/mock-utils";

export const buildAccountStatusEventMock = (
	overrides: Partial<AccountStatusEvent> = {},
	seed = 1,
): AccountStatusEvent => {
	const base: AccountStatusEvent = {
		id: createObjectId(seed + 1),
		userId: createObjectId(seed + 2),
		fromStatus: AccountStatus.ACTIVE,
		toStatus: AccountStatus.ACTIVE,
		reason: "Reason " + seed,
		actorUserId: seed % 2 === 0 ? null : createObjectId(seed + 6),
		isDeleted: false,
		createdBy: seed % 2 === 0 ? null : createObjectId(seed + 8),
		updatedBy: seed % 2 === 0 ? null : createObjectId(seed + 9),
		createdAt: new Date(Date.now() - (seed + 10) * 24 * 60 * 60 * 1000),
		updatedAt: new Date(Date.now() - (seed + 11) * 30 * 60 * 1000),
	};

	return AccountStatusEventSchema.parse({ ...base, ...overrides });
};

export const buildCreateAccountStatusEventMock = (
	overrides: Partial<CreateAccountStatusEvent> = {},
	seed = 1,
): CreateAccountStatusEvent => {
	return CreateAccountStatusEventSchema.parse({
		...buildAccountStatusEventMock({}, seed),
		...overrides,
	});
};

export const buildUpdateAccountStatusEventMock = (
	overrides: Partial<UpdateAccountStatusEvent> = {},
	seed = 1,
): UpdateAccountStatusEvent => {
	return UpdateAccountStatusEventSchema.parse({
		...buildAccountStatusEventMock({}, seed),
		...overrides,
	});
};

export const buildGetAllAccountStatusEventsMock = (
	options: {
		count?: number;
		page?: number;
		limit?: number;
		seed?: number;
		overrides?: Partial<GetAllAccountStatusEvents>;
	} = {},
): GetAllAccountStatusEvents => {
	const { count = 3, page = 1, limit = 10, seed = 1, overrides = {} } = options;

	return GetAllAccountStatusEventsSchema.parse({
		accountStatusEvents: Array.from({ length: count }, (_, index) =>
			buildAccountStatusEventMock({}, seed + index),
		),
		pagination: PaginationSchema.parse(createPagination(count, page, limit)),
		count,
		...overrides,
	});
};
