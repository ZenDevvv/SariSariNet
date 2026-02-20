import {
	OrganizationInviteSchema,
	CreateOrganizationInviteSchema,
	UpdateOrganizationInviteSchema,
	GetAllOrganizationInvitesSchema,
	type OrganizationInvite,
	type CreateOrganizationInvite,
	type UpdateOrganizationInvite,
	type GetAllOrganizationInvites,
} from "~/zod/modules/organization-invite.zod";
import { PaginationSchema } from "~/zod/modules/common.zod";
import { OrganizationInviteStatus } from "~/zod/modules/prisma-enums";
import { createObjectId, createPagination } from "~/mocks/modules/mock-utils";

export const buildOrganizationInviteMock = (
	overrides: Partial<OrganizationInvite> = {},
	seed = 1,
): OrganizationInvite => {
	const base: OrganizationInvite = {
		id: createObjectId(seed + 1),
		organizationId: createObjectId(seed + 2),
		invitedUserId: createObjectId(seed + 3),
		invitedByUserId: createObjectId(seed + 4),
		status: OrganizationInviteStatus.PENDING,
		expiresAt: new Date(Date.now() + (seed + 6) * 60 * 60 * 1000),
		respondedAt: seed % 2 === 0 ? null : new Date(Date.now() - (seed + 7) * 24 * 60 * 60 * 1000),
		isDeleted: false,
		createdBy: seed % 2 === 0 ? null : createObjectId(seed + 9),
		updatedBy: seed % 2 === 0 ? null : createObjectId(seed + 10),
		createdAt: new Date(Date.now() - (seed + 11) * 24 * 60 * 60 * 1000),
		updatedAt: new Date(Date.now() - (seed + 12) * 30 * 60 * 1000),
	};

	return OrganizationInviteSchema.parse({ ...base, ...overrides });
};

export const buildCreateOrganizationInviteMock = (
	overrides: Partial<CreateOrganizationInvite> = {},
	seed = 1,
): CreateOrganizationInvite => {
	return CreateOrganizationInviteSchema.parse({
		...buildOrganizationInviteMock({}, seed),
		...overrides,
	});
};

export const buildUpdateOrganizationInviteMock = (
	overrides: Partial<UpdateOrganizationInvite> = {},
	seed = 1,
): UpdateOrganizationInvite => {
	return UpdateOrganizationInviteSchema.parse({
		...buildOrganizationInviteMock({}, seed),
		...overrides,
	});
};

export const buildGetAllOrganizationInvitesMock = (
	options: {
		count?: number;
		page?: number;
		limit?: number;
		seed?: number;
		overrides?: Partial<GetAllOrganizationInvites>;
	} = {},
): GetAllOrganizationInvites => {
	const { count = 3, page = 1, limit = 10, seed = 1, overrides = {} } = options;

	return GetAllOrganizationInvitesSchema.parse({
		organizationInvites: Array.from({ length: count }, (_, index) =>
			buildOrganizationInviteMock({}, seed + index),
		),
		pagination: PaginationSchema.parse(createPagination(count, page, limit)),
		count,
		...overrides,
	});
};
