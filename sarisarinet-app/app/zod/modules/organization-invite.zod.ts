import { z } from "zod";
import { PaginationSchema, ObjectIdSchema } from "./common.zod";
import { OrganizationInviteStatus } from "./prisma-enums";

export const OrganizationInviteSchema = z.object({
	id: ObjectIdSchema,
	organizationId: ObjectIdSchema,
	invitedUserId: ObjectIdSchema,
	invitedByUserId: ObjectIdSchema,
	status: z.nativeEnum(OrganizationInviteStatus),
	expiresAt: z.coerce.date(),
	respondedAt: z.coerce.date().optional().nullable(),
	isDeleted: z.boolean(),
	createdBy: ObjectIdSchema.optional().nullable(),
	updatedBy: ObjectIdSchema.optional().nullable(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export const CreateOrganizationInviteSchema = OrganizationInviteSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
}).partial({
	respondedAt: true,
	isDeleted: true,
	createdBy: true,
	updatedBy: true,
});

export const UpdateOrganizationInviteSchema = OrganizationInviteSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	isDeleted: true,
}).partial();

export const GetAllOrganizationInvitesSchema = z.object({
	organizationInvites: z.array(OrganizationInviteSchema),
	pagination: PaginationSchema.optional(),
	count: z.number().optional(),
});

export type OrganizationInvite = z.infer<typeof OrganizationInviteSchema>;
export type CreateOrganizationInvite = z.infer<typeof CreateOrganizationInviteSchema>;
export type UpdateOrganizationInvite = z.infer<typeof UpdateOrganizationInviteSchema>;

export type GetAllOrganizationInvites = z.infer<typeof GetAllOrganizationInvitesSchema>;
