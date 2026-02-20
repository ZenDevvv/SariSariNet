import {
	OrganizationJoinRequestSchema,
	CreateOrganizationJoinRequestSchema,
	UpdateOrganizationJoinRequestSchema,
	GetAllOrganizationJoinRequestsSchema,
	type OrganizationJoinRequest,
	type CreateOrganizationJoinRequest,
	type UpdateOrganizationJoinRequest,
	type GetAllOrganizationJoinRequests,
} from "~/zod/modules/organization-join-request.zod";
import { PaginationSchema } from "~/zod/modules/common.zod";
import { OrganizationJoinRequestStatus } from "~/zod/modules/prisma-enums";
import { createObjectId, createPagination } from "~/mocks/modules/mock-utils";

export const buildOrganizationJoinRequestMock = (
	overrides: Partial<OrganizationJoinRequest> = {},
	seed = 1,
): OrganizationJoinRequest => {
	const base: OrganizationJoinRequest = {
		id: createObjectId(seed + 1),
		organizationId: createObjectId(seed + 2),
		requesterUserId: createObjectId(seed + 3),
		status: OrganizationJoinRequestStatus.PENDING,
		reviewedByUserId: seed % 2 === 0 ? null : createObjectId(seed + 5),
		reviewedAt: seed % 2 === 0 ? null : new Date(Date.now() - (seed + 6) * 24 * 60 * 60 * 1000),
		isDeleted: false,
		createdBy: seed % 2 === 0 ? null : createObjectId(seed + 8),
		updatedBy: seed % 2 === 0 ? null : createObjectId(seed + 9),
		createdAt: new Date(Date.now() - (seed + 10) * 24 * 60 * 60 * 1000),
		updatedAt: new Date(Date.now() - (seed + 11) * 30 * 60 * 1000),
	};

	return OrganizationJoinRequestSchema.parse({ ...base, ...overrides });
};

export const buildCreateOrganizationJoinRequestMock = (
	overrides: Partial<CreateOrganizationJoinRequest> = {},
	seed = 1,
): CreateOrganizationJoinRequest => {
	return CreateOrganizationJoinRequestSchema.parse({
		...buildOrganizationJoinRequestMock({}, seed),
		...overrides,
	});
};

export const buildUpdateOrganizationJoinRequestMock = (
	overrides: Partial<UpdateOrganizationJoinRequest> = {},
	seed = 1,
): UpdateOrganizationJoinRequest => {
	return UpdateOrganizationJoinRequestSchema.parse({
		...buildOrganizationJoinRequestMock({}, seed),
		...overrides,
	});
};

export const buildGetAllOrganizationJoinRequestsMock = (
	options: {
		count?: number;
		page?: number;
		limit?: number;
		seed?: number;
		overrides?: Partial<GetAllOrganizationJoinRequests>;
	} = {},
): GetAllOrganizationJoinRequests => {
	const { count = 3, page = 1, limit = 10, seed = 1, overrides = {} } = options;

	return GetAllOrganizationJoinRequestsSchema.parse({
		organizationJoinRequests: Array.from({ length: count }, (_, index) =>
			buildOrganizationJoinRequestMock({}, seed + index),
		),
		pagination: PaginationSchema.parse(createPagination(count, page, limit)),
		count,
		...overrides,
	});
};
