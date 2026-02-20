import { z } from "zod";
import { PaginationSchema, ObjectIdSchema } from "./common.zod";
import { OrganizationJoinRequestStatus } from "./prisma-enums";

export const OrganizationJoinRequestSchema = z.object({
	id: ObjectIdSchema,
	organizationId: ObjectIdSchema,
	requesterUserId: ObjectIdSchema,
	status: z.nativeEnum(OrganizationJoinRequestStatus),
	reviewedByUserId: ObjectIdSchema.optional().nullable(),
	reviewedAt: z.coerce.date().optional().nullable(),
	isDeleted: z.boolean(),
	createdBy: ObjectIdSchema.optional().nullable(),
	updatedBy: ObjectIdSchema.optional().nullable(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export const CreateOrganizationJoinRequestSchema = OrganizationJoinRequestSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
}).partial({
	reviewedByUserId: true,
	reviewedAt: true,
	isDeleted: true,
	createdBy: true,
	updatedBy: true,
});

export const UpdateOrganizationJoinRequestSchema = OrganizationJoinRequestSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	isDeleted: true,
}).partial();

export const GetAllOrganizationJoinRequestsSchema = z.object({
	organizationJoinRequests: z.array(OrganizationJoinRequestSchema),
	pagination: PaginationSchema.optional(),
	count: z.number().optional(),
});

export type OrganizationJoinRequest = z.infer<typeof OrganizationJoinRequestSchema>;
export type CreateOrganizationJoinRequest = z.infer<typeof CreateOrganizationJoinRequestSchema>;
export type UpdateOrganizationJoinRequest = z.infer<typeof UpdateOrganizationJoinRequestSchema>;

export type GetAllOrganizationJoinRequests = z.infer<typeof GetAllOrganizationJoinRequestsSchema>;
