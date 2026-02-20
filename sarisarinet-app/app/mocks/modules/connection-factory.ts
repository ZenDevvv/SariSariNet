import {
	ConnectionSchema,
	CreateConnectionSchema,
	UpdateConnectionSchema,
	GetAllConnectionsSchema,
	type Connection,
	type CreateConnection,
	type UpdateConnection,
	type GetAllConnections,
} from "~/zod/modules/connection.zod";
import { PaginationSchema } from "~/zod/modules/common.zod";
import { createObjectId, createPagination } from "~/mocks/modules/mock-utils";

export const buildConnectionMock = (
	overrides: Partial<Connection> = {},
	seed = 1,
): Connection => {
	const base: Connection = {
		id: createObjectId(seed + 1),
		userLowId: createObjectId(seed + 2),
		userHighId: createObjectId(seed + 3),
		sourceRequestId: seed % 2 === 0 ? null : createObjectId(seed + 4),
		isDeleted: false,
		createdBy: seed % 2 === 0 ? null : createObjectId(seed + 6),
		updatedBy: seed % 2 === 0 ? null : createObjectId(seed + 7),
		createdAt: new Date(Date.now() - (seed + 8) * 24 * 60 * 60 * 1000),
		updatedAt: new Date(Date.now() - (seed + 9) * 30 * 60 * 1000),
	};

	return ConnectionSchema.parse({ ...base, ...overrides });
};

export const buildCreateConnectionMock = (
	overrides: Partial<CreateConnection> = {},
	seed = 1,
): CreateConnection => {
	return CreateConnectionSchema.parse({
		...buildConnectionMock({}, seed),
		...overrides,
	});
};

export const buildUpdateConnectionMock = (
	overrides: Partial<UpdateConnection> = {},
	seed = 1,
): UpdateConnection => {
	return UpdateConnectionSchema.parse({
		...buildConnectionMock({}, seed),
		...overrides,
	});
};

export const buildGetAllConnectionsMock = (
	options: {
		count?: number;
		page?: number;
		limit?: number;
		seed?: number;
		overrides?: Partial<GetAllConnections>;
	} = {},
): GetAllConnections => {
	const { count = 3, page = 1, limit = 10, seed = 1, overrides = {} } = options;

	return GetAllConnectionsSchema.parse({
		connections: Array.from({ length: count }, (_, index) =>
			buildConnectionMock({}, seed + index),
		),
		pagination: PaginationSchema.parse(createPagination(count, page, limit)),
		count,
		...overrides,
	});
};
