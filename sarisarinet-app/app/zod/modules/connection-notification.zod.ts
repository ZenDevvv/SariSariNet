import { z } from "zod";
import { PaginationSchema, ObjectIdSchema } from "./common.zod";
import { ConnectionNotificationType, ConnectionNotificationReferenceType } from "./prisma-enums";

export const ConnectionNotificationSchema = z.object({
	id: ObjectIdSchema,
	userId: ObjectIdSchema,
	type: z.nativeEnum(ConnectionNotificationType),
	referenceType: z.nativeEnum(ConnectionNotificationReferenceType),
	referenceId: ObjectIdSchema,
	isRead: z.boolean(),
	isDeleted: z.boolean(),
	createdBy: ObjectIdSchema.optional().nullable(),
	updatedBy: ObjectIdSchema.optional().nullable(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export const CreateConnectionNotificationSchema = ConnectionNotificationSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
}).partial({
	isDeleted: true,
	createdBy: true,
	updatedBy: true,
});

export const UpdateConnectionNotificationSchema = ConnectionNotificationSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	isDeleted: true,
}).partial();

export const GetAllConnectionNotificationsSchema = z.object({
	connectionNotifications: z.array(ConnectionNotificationSchema),
	pagination: PaginationSchema.optional(),
	count: z.number().optional(),
});

export type ConnectionNotification = z.infer<typeof ConnectionNotificationSchema>;
export type CreateConnectionNotification = z.infer<typeof CreateConnectionNotificationSchema>;
export type UpdateConnectionNotification = z.infer<typeof UpdateConnectionNotificationSchema>;

export type GetAllConnectionNotifications = z.infer<typeof GetAllConnectionNotificationsSchema>;
