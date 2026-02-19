import { z } from "zod";
import { isValidObjectId } from "mongoose";
import { PaginationSchema } from "../common.zod";
import { ConnectionNotificationType, ConnectionNotificationReferenceType } from "../../generated/prisma";

export const ConnectionNotificationSchema = z.object({
	id: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }),
	userId: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }),
	type: z.nativeEnum(ConnectionNotificationType),
	referenceType: z.nativeEnum(ConnectionNotificationReferenceType),
	referenceId: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }),
	isRead: z.boolean(),
	isDeleted: z.boolean(),
	createdBy: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }).optional().nullable(),
	updatedBy: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }).optional().nullable(),
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
