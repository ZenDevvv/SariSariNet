import { z } from "zod";
import { PaginationSchema, ObjectIdSchema } from "./common.zod";
import { OrganizationMembershipRole, OrganizationMembershipStatus } from "./prisma-enums";

export const OrganizationMembershipSchema = z.object({
	id: ObjectIdSchema,
	organizationId: ObjectIdSchema,
	userId: ObjectIdSchema,
	role: z.nativeEnum(OrganizationMembershipRole),
	status: z.nativeEnum(OrganizationMembershipStatus),
	joinedAt: z.coerce.date(),
	removedAt: z.coerce.date().optional().nullable(),
	isDeleted: z.boolean(),
	createdBy: ObjectIdSchema.optional().nullable(),
	updatedBy: ObjectIdSchema.optional().nullable(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export const CreateOrganizationMembershipSchema = OrganizationMembershipSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
}).partial({
	removedAt: true,
	isDeleted: true,
	createdBy: true,
	updatedBy: true,
});

export const UpdateOrganizationMembershipSchema = OrganizationMembershipSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	isDeleted: true,
}).partial();

export const GetAllOrganizationMembershipsSchema = z.object({
	organizationMemberships: z.array(OrganizationMembershipSchema),
	pagination: PaginationSchema.optional(),
	count: z.number().optional(),
});

export type OrganizationMembership = z.infer<typeof OrganizationMembershipSchema>;
export type CreateOrganizationMembership = z.infer<typeof CreateOrganizationMembershipSchema>;
export type UpdateOrganizationMembership = z.infer<typeof UpdateOrganizationMembershipSchema>;

export type GetAllOrganizationMemberships = z.infer<typeof GetAllOrganizationMembershipsSchema>;
