import { z } from "zod";
import { isValidObjectId } from "mongoose";
import { PaginationSchema } from "../common.zod";
import { OrganizationMembershipRole, OrganizationMembershipStatus } from "../../generated/prisma";

export const OrganizationMembershipSchema = z.object({
	id: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }),
	organizationId: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }),
	userId: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }),
	role: z.nativeEnum(OrganizationMembershipRole),
	status: z.nativeEnum(OrganizationMembershipStatus),
	joinedAt: z.coerce.date(),
	removedAt: z.coerce.date().optional().nullable(),
	isDeleted: z.boolean(),
	createdBy: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }).optional().nullable(),
	updatedBy: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }).optional().nullable(),
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
