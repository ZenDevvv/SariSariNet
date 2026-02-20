import {
	ConnectionNotificationSchema,
	CreateConnectionNotificationSchema,
	UpdateConnectionNotificationSchema,
	GetAllConnectionNotificationsSchema,
	type ConnectionNotification,
	type CreateConnectionNotification,
	type UpdateConnectionNotification,
	type GetAllConnectionNotifications,
} from "~/zod/modules/connection-notification.zod";
import { PaginationSchema } from "~/zod/modules/common.zod";
import { ConnectionNotificationType, ConnectionNotificationReferenceType } from "~/zod/modules/prisma-enums";
import { createObjectId, createPagination } from "~/mocks/modules/mock-utils";

export const buildConnectionNotificationMock = (
	overrides: Partial<ConnectionNotification> = {},
	seed = 1,
): ConnectionNotification => {
	const base: ConnectionNotification = {
		id: createObjectId(seed + 1),
		userId: createObjectId(seed + 2),
		type: ConnectionNotificationType.REQUEST_RECEIVED,
		referenceType: ConnectionNotificationReferenceType.CONNECTION_REQUEST,
		referenceId: createObjectId(seed + 5),
		isRead: seed % 2 === 0,
		isDeleted: false,
		createdBy: seed % 2 === 0 ? null : createObjectId(seed + 8),
		updatedBy: seed % 2 === 0 ? null : createObjectId(seed + 9),
		createdAt: new Date(Date.now() - (seed + 10) * 24 * 60 * 60 * 1000),
		updatedAt: new Date(Date.now() - (seed + 11) * 30 * 60 * 1000),
	};

	return ConnectionNotificationSchema.parse({ ...base, ...overrides });
};

export const buildCreateConnectionNotificationMock = (
	overrides: Partial<CreateConnectionNotification> = {},
	seed = 1,
): CreateConnectionNotification => {
	return CreateConnectionNotificationSchema.parse({
		...buildConnectionNotificationMock({}, seed),
		...overrides,
	});
};

export const buildUpdateConnectionNotificationMock = (
	overrides: Partial<UpdateConnectionNotification> = {},
	seed = 1,
): UpdateConnectionNotification => {
	return UpdateConnectionNotificationSchema.parse({
		...buildConnectionNotificationMock({}, seed),
		...overrides,
	});
};

export const buildGetAllConnectionNotificationsMock = (
	options: {
		count?: number;
		page?: number;
		limit?: number;
		seed?: number;
		overrides?: Partial<GetAllConnectionNotifications>;
	} = {},
): GetAllConnectionNotifications => {
	const { count = 3, page = 1, limit = 10, seed = 1, overrides = {} } = options;

	return GetAllConnectionNotificationsSchema.parse({
		connectionNotifications: Array.from({ length: count }, (_, index) =>
			buildConnectionNotificationMock({}, seed + index),
		),
		pagination: PaginationSchema.parse(createPagination(count, page, limit)),
		count,
		...overrides,
	});
};
