import { z } from "zod";
import { isValidObjectId } from "mongoose";
import { PaginationSchema } from "../common.zod";
import { OrganizationJoinRequestStatus } from "../../generated/prisma";

export const OrganizationJoinRequestSchema = z.object({
	id: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }),
	organizationId: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }),
	requesterUserId: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }),
	status: z.nativeEnum(OrganizationJoinRequestStatus),
	reviewedByUserId: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }).optional().nullable(),
	reviewedAt: z.coerce.date().optional().nullable(),
	isDeleted: z.boolean(),
	createdBy: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }).optional().nullable(),
	updatedBy: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }).optional().nullable(),
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
