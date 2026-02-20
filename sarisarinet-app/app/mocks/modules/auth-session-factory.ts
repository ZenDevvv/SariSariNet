import {
	AuthSessionSchema,
	CreateAuthSessionSchema,
	UpdateAuthSessionSchema,
	GetAllAuthSessionsSchema,
	type AuthSession,
	type CreateAuthSession,
	type UpdateAuthSession,
	type GetAllAuthSessions,
} from "~/zod/modules/auth-session.zod";
import { PaginationSchema } from "~/zod/modules/common.zod";
import { createObjectId, createPagination } from "~/mocks/modules/mock-utils";

export const buildAuthSessionMock = (
	overrides: Partial<AuthSession> = {},
	seed = 1,
): AuthSession => {
	const base: AuthSession = {
		id: createObjectId(seed + 1),
		userId: createObjectId(seed + 2),
		refreshTokenHash: "hash-" + String(seed).padStart(8, "0"),
		deviceInfo: { sample: "deviceInfo", seed, module: "auth-session" },
		expiresAt: new Date(Date.now() + (seed + 5) * 60 * 60 * 1000),
		revokedAt: seed % 2 === 0 ? null : new Date(Date.now() - (seed + 6) * 24 * 60 * 60 * 1000),
		isDeleted: false,
		createdBy: seed % 2 === 0 ? null : createObjectId(seed + 8),
		updatedBy: seed % 2 === 0 ? null : createObjectId(seed + 9),
		createdAt: new Date(Date.now() - (seed + 10) * 24 * 60 * 60 * 1000),
		updatedAt: new Date(Date.now() - (seed + 11) * 30 * 60 * 1000),
	};

	return AuthSessionSchema.parse({ ...base, ...overrides });
};

export const buildCreateAuthSessionMock = (
	overrides: Partial<CreateAuthSession> = {},
	seed = 1,
): CreateAuthSession => {
	return CreateAuthSessionSchema.parse({
		...buildAuthSessionMock({}, seed),
		...overrides,
	});
};

export const buildUpdateAuthSessionMock = (
	overrides: Partial<UpdateAuthSession> = {},
	seed = 1,
): UpdateAuthSession => {
	return UpdateAuthSessionSchema.parse({
		...buildAuthSessionMock({}, seed),
		...overrides,
	});
};

export const buildGetAllAuthSessionsMock = (
	options: {
		count?: number;
		page?: number;
		limit?: number;
		seed?: number;
		overrides?: Partial<GetAllAuthSessions>;
	} = {},
): GetAllAuthSessions => {
	const { count = 3, page = 1, limit = 10, seed = 1, overrides = {} } = options;

	return GetAllAuthSessionsSchema.parse({
		authSessions: Array.from({ length: count }, (_, index) =>
			buildAuthSessionMock({}, seed + index),
		),
		pagination: PaginationSchema.parse(createPagination(count, page, limit)),
		count,
		...overrides,
	});
};
