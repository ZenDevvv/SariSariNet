import {
	AccountRecoveryTokenSchema,
	CreateAccountRecoveryTokenSchema,
	UpdateAccountRecoveryTokenSchema,
	GetAllAccountRecoveryTokensSchema,
	type AccountRecoveryToken,
	type CreateAccountRecoveryToken,
	type UpdateAccountRecoveryToken,
	type GetAllAccountRecoveryTokens,
} from "~/zod/modules/account-recovery-token.zod";
import { PaginationSchema } from "~/zod/modules/common.zod";
import { createObjectId, createPagination } from "~/mocks/modules/mock-utils";

export const buildAccountRecoveryTokenMock = (
	overrides: Partial<AccountRecoveryToken> = {},
	seed = 1,
): AccountRecoveryToken => {
	const base: AccountRecoveryToken = {
		id: createObjectId(seed + 1),
		userId: createObjectId(seed + 2),
		tokenHash: "hash-" + String(seed).padStart(8, "0"),
		expiresAt: new Date(Date.now() + (seed + 4) * 60 * 60 * 1000),
		consumedAt: seed % 2 === 0 ? null : new Date(Date.now() - (seed + 5) * 24 * 60 * 60 * 1000),
		attemptCount: seed + 6,
		isDeleted: false,
		createdBy: seed % 2 === 0 ? null : createObjectId(seed + 8),
		updatedBy: seed % 2 === 0 ? null : createObjectId(seed + 9),
		createdAt: new Date(Date.now() - (seed + 10) * 24 * 60 * 60 * 1000),
		updatedAt: new Date(Date.now() - (seed + 11) * 30 * 60 * 1000),
	};

	return AccountRecoveryTokenSchema.parse({ ...base, ...overrides });
};

export const buildCreateAccountRecoveryTokenMock = (
	overrides: Partial<CreateAccountRecoveryToken> = {},
	seed = 1,
): CreateAccountRecoveryToken => {
	return CreateAccountRecoveryTokenSchema.parse({
		...buildAccountRecoveryTokenMock({}, seed),
		...overrides,
	});
};

export const buildUpdateAccountRecoveryTokenMock = (
	overrides: Partial<UpdateAccountRecoveryToken> = {},
	seed = 1,
): UpdateAccountRecoveryToken => {
	return UpdateAccountRecoveryTokenSchema.parse({
		...buildAccountRecoveryTokenMock({}, seed),
		...overrides,
	});
};

export const buildGetAllAccountRecoveryTokensMock = (
	options: {
		count?: number;
		page?: number;
		limit?: number;
		seed?: number;
		overrides?: Partial<GetAllAccountRecoveryTokens>;
	} = {},
): GetAllAccountRecoveryTokens => {
	const { count = 3, page = 1, limit = 10, seed = 1, overrides = {} } = options;

	return GetAllAccountRecoveryTokensSchema.parse({
		accountRecoveryTokens: Array.from({ length: count }, (_, index) =>
			buildAccountRecoveryTokenMock({}, seed + index),
		),
		pagination: PaginationSchema.parse(createPagination(count, page, limit)),
		count,
		...overrides,
	});
};
