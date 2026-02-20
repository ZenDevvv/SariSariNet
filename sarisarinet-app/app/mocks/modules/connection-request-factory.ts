import {
	ConnectionRequestSchema,
	CreateConnectionRequestSchema,
	UpdateConnectionRequestSchema,
	GetAllConnectionRequestsSchema,
	type ConnectionRequest,
	type CreateConnectionRequest,
	type UpdateConnectionRequest,
	type GetAllConnectionRequests,
} from "~/zod/modules/connection-request.zod";
import { PaginationSchema } from "~/zod/modules/common.zod";
import { ConnectionRequestStatus } from "~/zod/modules/prisma-enums";
import { createObjectId, createPagination } from "~/mocks/modules/mock-utils";

export const buildConnectionRequestMock = (
	overrides: Partial<ConnectionRequest> = {},
	seed = 1,
): ConnectionRequest => {
	const base: ConnectionRequest = {
		id: createObjectId(seed + 1),
		requesterUserId: createObjectId(seed + 2),
		receiverUserId: createObjectId(seed + 3),
		status: ConnectionRequestStatus.PENDING,
		respondedAt: seed % 2 === 0 ? null : new Date(Date.now() - (seed + 5) * 24 * 60 * 60 * 1000),
		isDeleted: false,
		createdBy: seed % 2 === 0 ? null : createObjectId(seed + 7),
		updatedBy: seed % 2 === 0 ? null : createObjectId(seed + 8),
		createdAt: new Date(Date.now() - (seed + 9) * 24 * 60 * 60 * 1000),
		updatedAt: new Date(Date.now() - (seed + 10) * 30 * 60 * 1000),
	};

	return ConnectionRequestSchema.parse({ ...base, ...overrides });
};

export const buildCreateConnectionRequestMock = (
	overrides: Partial<CreateConnectionRequest> = {},
	seed = 1,
): CreateConnectionRequest => {
	return CreateConnectionRequestSchema.parse({
		...buildConnectionRequestMock({}, seed),
		...overrides,
	});
};

export const buildUpdateConnectionRequestMock = (
	overrides: Partial<UpdateConnectionRequest> = {},
	seed = 1,
): UpdateConnectionRequest => {
	return UpdateConnectionRequestSchema.parse({
		...buildConnectionRequestMock({}, seed),
		...overrides,
	});
};

export const buildGetAllConnectionRequestsMock = (
	options: {
		count?: number;
		page?: number;
		limit?: number;
		seed?: number;
		overrides?: Partial<GetAllConnectionRequests>;
	} = {},
): GetAllConnectionRequests => {
	const { count = 3, page = 1, limit = 10, seed = 1, overrides = {} } = options;

	return GetAllConnectionRequestsSchema.parse({
		connectionRequests: Array.from({ length: count }, (_, index) =>
			buildConnectionRequestMock({}, seed + index),
		),
		pagination: PaginationSchema.parse(createPagination(count, page, limit)),
		count,
		...overrides,
	});
};
