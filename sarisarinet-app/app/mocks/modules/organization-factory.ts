import {
	OrganizationSchema,
	CreateOrganizationSchema,
	UpdateOrganizationSchema,
	GetAllOrganizationsSchema,
	type Organization,
	type CreateOrganization,
	type UpdateOrganization,
	type GetAllOrganizations,
} from "~/zod/modules/organization.zod";
import { PaginationSchema } from "~/zod/modules/common.zod";
import { OrganizationStatus } from "~/zod/modules/prisma-enums";
import { createObjectId, createPagination } from "~/mocks/modules/mock-utils";

export const buildOrganizationMock = (
	overrides: Partial<Organization> = {},
	seed = 1,
): Organization => {
	const base: Organization = {
		id: createObjectId(seed + 1),
		name: "Sample Name " + seed,
		slug: "sample-slug-" + seed,
		description: seed % 2 === 0 ? null : "Sample description for organization " + seed,
		ownerUserId: createObjectId(seed + 5),
		status: OrganizationStatus.ACTIVE,
		isDeleted: false,
		createdBy: seed % 2 === 0 ? null : createObjectId(seed + 8),
		updatedBy: seed % 2 === 0 ? null : createObjectId(seed + 9),
		createdAt: new Date(Date.now() - (seed + 10) * 24 * 60 * 60 * 1000),
		updatedAt: new Date(Date.now() - (seed + 11) * 30 * 60 * 1000),
	};

	return OrganizationSchema.parse({ ...base, ...overrides });
};

export const buildCreateOrganizationMock = (
	overrides: Partial<CreateOrganization> = {},
	seed = 1,
): CreateOrganization => {
	return CreateOrganizationSchema.parse({
		...buildOrganizationMock({}, seed),
		...overrides,
	});
};

export const buildUpdateOrganizationMock = (
	overrides: Partial<UpdateOrganization> = {},
	seed = 1,
): UpdateOrganization => {
	return UpdateOrganizationSchema.parse({
		...buildOrganizationMock({}, seed),
		...overrides,
	});
};

export const buildGetAllOrganizationsMock = (
	options: {
		count?: number;
		page?: number;
		limit?: number;
		seed?: number;
		overrides?: Partial<GetAllOrganizations>;
	} = {},
): GetAllOrganizations => {
	const { count = 3, page = 1, limit = 10, seed = 1, overrides = {} } = options;

	return GetAllOrganizationsSchema.parse({
		organizations: Array.from({ length: count }, (_, index) =>
			buildOrganizationMock({}, seed + index),
		),
		pagination: PaginationSchema.parse(createPagination(count, page, limit)),
		count,
		...overrides,
	});
};
