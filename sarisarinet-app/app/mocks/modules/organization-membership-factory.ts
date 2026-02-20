import {
	OrganizationMembershipSchema,
	CreateOrganizationMembershipSchema,
	UpdateOrganizationMembershipSchema,
	GetAllOrganizationMembershipsSchema,
	type OrganizationMembership,
	type CreateOrganizationMembership,
	type UpdateOrganizationMembership,
	type GetAllOrganizationMemberships,
} from "~/zod/modules/organization-membership.zod";
import { PaginationSchema } from "~/zod/modules/common.zod";
import { OrganizationMembershipRole, OrganizationMembershipStatus } from "~/zod/modules/prisma-enums";
import { createObjectId, createPagination } from "~/mocks/modules/mock-utils";

export const buildOrganizationMembershipMock = (
	overrides: Partial<OrganizationMembership> = {},
	seed = 1,
): OrganizationMembership => {
	const base: OrganizationMembership = {
		id: createObjectId(seed + 1),
		organizationId: createObjectId(seed + 2),
		userId: createObjectId(seed + 3),
		role: OrganizationMembershipRole.ADMIN,
		status: OrganizationMembershipStatus.ACTIVE,
		joinedAt: new Date(Date.now() - (seed + 6) * 24 * 60 * 60 * 1000),
		removedAt: seed % 2 === 0 ? null : new Date(Date.now() - (seed + 7) * 24 * 60 * 60 * 1000),
		isDeleted: false,
		createdBy: seed % 2 === 0 ? null : createObjectId(seed + 9),
		updatedBy: seed % 2 === 0 ? null : createObjectId(seed + 10),
		createdAt: new Date(Date.now() - (seed + 11) * 24 * 60 * 60 * 1000),
		updatedAt: new Date(Date.now() - (seed + 12) * 30 * 60 * 1000),
	};

	return OrganizationMembershipSchema.parse({ ...base, ...overrides });
};

export const buildCreateOrganizationMembershipMock = (
	overrides: Partial<CreateOrganizationMembership> = {},
	seed = 1,
): CreateOrganizationMembership => {
	return CreateOrganizationMembershipSchema.parse({
		...buildOrganizationMembershipMock({}, seed),
		...overrides,
	});
};

export const buildUpdateOrganizationMembershipMock = (
	overrides: Partial<UpdateOrganizationMembership> = {},
	seed = 1,
): UpdateOrganizationMembership => {
	return UpdateOrganizationMembershipSchema.parse({
		...buildOrganizationMembershipMock({}, seed),
		...overrides,
	});
};

export const buildGetAllOrganizationMembershipsMock = (
	options: {
		count?: number;
		page?: number;
		limit?: number;
		seed?: number;
		overrides?: Partial<GetAllOrganizationMemberships>;
	} = {},
): GetAllOrganizationMemberships => {
	const { count = 3, page = 1, limit = 10, seed = 1, overrides = {} } = options;

	return GetAllOrganizationMembershipsSchema.parse({
		organizationMemberships: Array.from({ length: count }, (_, index) =>
			buildOrganizationMembershipMock({}, seed + index),
		),
		pagination: PaginationSchema.parse(createPagination(count, page, limit)),
		count,
		...overrides,
	});
};
