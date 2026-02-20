import { z } from "zod";
import { PaginationSchema, ObjectIdSchema } from "./common.zod";

export const ConnectionSchema = z.object({
	id: ObjectIdSchema,
	userLowId: ObjectIdSchema,
	userHighId: ObjectIdSchema,
	sourceRequestId: ObjectIdSchema.optional().nullable(),
	isDeleted: z.boolean(),
	createdBy: ObjectIdSchema.optional().nullable(),
	updatedBy: ObjectIdSchema.optional().nullable(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export const CreateConnectionSchema = ConnectionSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
}).partial({
	sourceRequestId: true,
	isDeleted: true,
	createdBy: true,
	updatedBy: true,
});

export const UpdateConnectionSchema = ConnectionSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	isDeleted: true,
}).partial();

export const GetAllConnectionsSchema = z.object({
	connections: z.array(ConnectionSchema),
	pagination: PaginationSchema.optional(),
	count: z.number().optional(),
});

export type Connection = z.infer<typeof ConnectionSchema>;
export type CreateConnection = z.infer<typeof CreateConnectionSchema>;
export type UpdateConnection = z.infer<typeof UpdateConnectionSchema>;

export type GetAllConnections = z.infer<typeof GetAllConnectionsSchema>;
