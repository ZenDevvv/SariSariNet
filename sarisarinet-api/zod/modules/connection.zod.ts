import { z } from "zod";
import { isValidObjectId } from "mongoose";
import { PaginationSchema } from "../common.zod";

export const ConnectionSchema = z.object({
	id: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }),
	userLowId: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }),
	userHighId: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }),
	sourceRequestId: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }).optional().nullable(),
	isDeleted: z.boolean(),
	createdBy: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }).optional().nullable(),
	updatedBy: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }).optional().nullable(),
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
