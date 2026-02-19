import { z } from "zod";
import { isValidObjectId } from "mongoose";
import { PaginationSchema } from "../common.zod";
import { OrganizationInviteStatus } from "../../generated/prisma";

export const OrganizationInviteSchema = z.object({
	id: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }),
	organizationId: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }),
	invitedUserId: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }),
	invitedByUserId: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }),
	status: z.nativeEnum(OrganizationInviteStatus),
	expiresAt: z.coerce.date(),
	respondedAt: z.coerce.date().optional().nullable(),
	isDeleted: z.boolean(),
	createdBy: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }).optional().nullable(),
	updatedBy: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }).optional().nullable(),
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
