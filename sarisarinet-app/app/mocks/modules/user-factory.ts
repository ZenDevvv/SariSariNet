import {
	UserSchema,
	CreateUserSchema,
	UpdateUserSchema,
	GetAllUsersSchema,
	type User,
	type CreateUser,
	type UpdateUser,
	type GetAllUsers,
} from "~/zod/modules/user.zod";
import { PaginationSchema } from "~/zod/modules/common.zod";
import { AccountStatus } from "~/zod/modules/prisma-enums";
import { createObjectId, createPagination } from "~/mocks/modules/mock-utils";

export const buildUserMock = (
	overrides: Partial<User> = {},
	seed = 1,
): User => {
	const base: User = {
		id: createObjectId(seed + 1),
		email: "user-" + seed + "@example.com",
		passwordHash: "hash-" + String(seed).padStart(8, "0"),
		displayName: "Sample Display Name " + seed,
		storefrontName: seed % 2 === 0 ? null : "Sample Storefront Name " + seed,
		bio: seed % 2 === 0 ? null : "Bio " + seed,
		avatarUrl: seed % 2 === 0 ? null : "https://example.com/user/" + seed,
		accountStatus: AccountStatus.ACTIVE,
		activeOrganizationId: seed % 2 === 0 ? null : createObjectId(seed + 9),
		isDeleted: false,
		createdBy: seed % 2 === 0 ? null : createObjectId(seed + 11),
		updatedBy: seed % 2 === 0 ? null : createObjectId(seed + 12),
		createdAt: new Date(Date.now() - (seed + 13) * 24 * 60 * 60 * 1000),
		updatedAt: new Date(Date.now() - (seed + 14) * 30 * 60 * 1000),
	};

	return UserSchema.parse({ ...base, ...overrides });
};

export const buildCreateUserMock = (
	overrides: Partial<CreateUser> = {},
	seed = 1,
): CreateUser => {
	return CreateUserSchema.parse({
		...buildUserMock({}, seed),
		...overrides,
	});
};

export const buildUpdateUserMock = (
	overrides: Partial<UpdateUser> = {},
	seed = 1,
): UpdateUser => {
	return UpdateUserSchema.parse({
		...buildUserMock({}, seed),
		...overrides,
	});
};

export const buildGetAllUsersMock = (
	options: {
		count?: number;
		page?: number;
		limit?: number;
		seed?: number;
		overrides?: Partial<GetAllUsers>;
	} = {},
): GetAllUsers => {
	const { count = 3, page = 1, limit = 10, seed = 1, overrides = {} } = options;

	return GetAllUsersSchema.parse({
		users: Array.from({ length: count }, (_, index) =>
			buildUserMock({}, seed + index),
		),
		pagination: PaginationSchema.parse(createPagination(count, page, limit)),
		count,
		...overrides,
	});
};
