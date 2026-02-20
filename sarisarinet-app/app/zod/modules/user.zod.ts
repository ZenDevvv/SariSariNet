import { z } from "zod";
import { PaginationSchema, ObjectIdSchema } from "./common.zod";
import { AccountStatus } from "./prisma-enums";

export const UserSchema = z.object({
	id: ObjectIdSchema,
	email: z.string(),
	passwordHash: z.string(),
	displayName: z.string(),
	storefrontName: z.string().optional().nullable(),
	bio: z.string().optional().nullable(),
	avatarUrl: z.string().optional().nullable(),
	accountStatus: z.nativeEnum(AccountStatus),
	activeOrganizationId: ObjectIdSchema.optional().nullable(),
	isDeleted: z.boolean(),
	createdBy: ObjectIdSchema.optional().nullable(),
	updatedBy: ObjectIdSchema.optional().nullable(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export const CreateUserSchema = UserSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
}).partial({
	storefrontName: true,
	bio: true,
	avatarUrl: true,
	activeOrganizationId: true,
	isDeleted: true,
	createdBy: true,
	updatedBy: true,
});

export const UpdateUserSchema = UserSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	isDeleted: true,
}).partial();

export const GetAllUsersSchema = z.object({
	users: z.array(UserSchema),
	pagination: PaginationSchema.optional(),
	count: z.number().optional(),
});

export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;

export type GetAllUsers = z.infer<typeof GetAllUsersSchema>;
