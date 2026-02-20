import { z } from "zod";
import { PaginationSchema, ObjectIdSchema } from "./common.zod";
import { ConnectionRequestStatus } from "./prisma-enums";

export const ConnectionRequestSchema = z.object({
	id: ObjectIdSchema,
	requesterUserId: ObjectIdSchema,
	receiverUserId: ObjectIdSchema,
	status: z.nativeEnum(ConnectionRequestStatus),
	respondedAt: z.coerce.date().optional().nullable(),
	isDeleted: z.boolean(),
	createdBy: ObjectIdSchema.optional().nullable(),
	updatedBy: ObjectIdSchema.optional().nullable(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export const CreateConnectionRequestSchema = ConnectionRequestSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
}).partial({
	respondedAt: true,
	isDeleted: true,
	createdBy: true,
	updatedBy: true,
});

export const UpdateConnectionRequestSchema = ConnectionRequestSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	isDeleted: true,
}).partial();

export const GetAllConnectionRequestsSchema = z.object({
	connectionRequests: z.array(ConnectionRequestSchema),
	pagination: PaginationSchema.optional(),
	count: z.number().optional(),
});

export type ConnectionRequest = z.infer<typeof ConnectionRequestSchema>;
export type CreateConnectionRequest = z.infer<typeof CreateConnectionRequestSchema>;
export type UpdateConnectionRequest = z.infer<typeof UpdateConnectionRequestSchema>;

export type GetAllConnectionRequests = z.infer<typeof GetAllConnectionRequestsSchema>;
