import { z } from "zod";
import { PaginationSchema, ObjectIdSchema } from "./common.zod";
import { OrganizationStatus } from "./prisma-enums";

export const OrganizationSchema = z.object({
	id: ObjectIdSchema,
	name: z.string(),
	slug: z.string(),
	description: z.string().optional().nullable(),
	ownerUserId: ObjectIdSchema,
	status: z.nativeEnum(OrganizationStatus),
	isDeleted: z.boolean(),
	createdBy: ObjectIdSchema.optional().nullable(),
	updatedBy: ObjectIdSchema.optional().nullable(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export const CreateOrganizationSchema = OrganizationSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
}).partial({
	description: true,
	isDeleted: true,
	createdBy: true,
	updatedBy: true,
});

export const UpdateOrganizationSchema = OrganizationSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	isDeleted: true,
}).partial();

export const GetAllOrganizationsSchema = z.object({
	organizations: z.array(OrganizationSchema),
	pagination: PaginationSchema.optional(),
	count: z.number().optional(),
});

export type Organization = z.infer<typeof OrganizationSchema>;
export type CreateOrganization = z.infer<typeof CreateOrganizationSchema>;
export type UpdateOrganization = z.infer<typeof UpdateOrganizationSchema>;

export type GetAllOrganizations = z.infer<typeof GetAllOrganizationsSchema>;
