import { z } from "zod";
import { PaginationSchema, ObjectIdSchema } from "./common.zod";

export const AuthSessionSchema = z.object({
	id: ObjectIdSchema,
	userId: ObjectIdSchema,
	refreshTokenHash: z.string(),
	deviceInfo: z.unknown(),
	expiresAt: z.coerce.date(),
	revokedAt: z.coerce.date().optional().nullable(),
	isDeleted: z.boolean(),
	createdBy: ObjectIdSchema.optional().nullable(),
	updatedBy: ObjectIdSchema.optional().nullable(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export const CreateAuthSessionSchema = AuthSessionSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
}).partial({
	revokedAt: true,
	isDeleted: true,
	createdBy: true,
	updatedBy: true,
});

export const UpdateAuthSessionSchema = AuthSessionSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	isDeleted: true,
}).partial();

export const GetAllAuthSessionsSchema = z.object({
	authSessions: z.array(AuthSessionSchema),
	pagination: PaginationSchema.optional(),
	count: z.number().optional(),
});

export type AuthSession = z.infer<typeof AuthSessionSchema>;
export type CreateAuthSession = z.infer<typeof CreateAuthSessionSchema>;
export type UpdateAuthSession = z.infer<typeof UpdateAuthSessionSchema>;

export type GetAllAuthSessions = z.infer<typeof GetAllAuthSessionsSchema>;
