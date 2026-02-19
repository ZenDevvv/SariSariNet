import {
	OrganizationInviteStatus,
	OrganizationJoinRequestStatus,
	OrganizationMembershipRole,
	PrismaClient,
} from "../../../generated/prisma";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { AuthenticatedRequest } from "../_shared/auth";
import { sendError, sendSuccess } from "../_shared/http";
import { isObjectId } from "../_shared/object-id";

const createOrganizationSchema = z.object({
	name: z.string().min(1),
	slug: z.string().min(1),
	description: z.string().optional().nullable(),
});

const inviteSchema = z.object({
	invitedUserId: z.string().min(1),
	expiresAt: z.string().datetime().optional(),
});

const joinRequestStatusSchema = z.object({
	status: z.nativeEnum(OrganizationJoinRequestStatus),
});

const inviteStatusSchema = z.object({
	status: z.nativeEnum(OrganizationInviteStatus),
});

const roleUpdateSchema = z.object({
	role: z.nativeEnum(OrganizationMembershipRole),
});

const isAdminOrOwner = async (prisma: PrismaClient, orgId: string, userId: string) => {
	const organization = await prisma.organization.findFirst({
		where: {
			id: orgId,
			isDeleted: false,
		},
	});

	if (!organization) {
		return false;
	}

	if (organization.ownerUserId === userId) {
		return true;
	}

	const adminMembership = await prisma.organizationMembership.findFirst({
		where: {
			organizationId: orgId,
			userId,
			isDeleted: false,
			status: "ACTIVE",
			role: "ADMIN",
		},
	});

	return Boolean(adminMembership);
};

const isActiveParticipant = async (prisma: PrismaClient, orgId: string, userId: string) => {
	const [organization, membership] = await Promise.all([
		prisma.organization.findFirst({
			where: { id: orgId, isDeleted: false },
		}),
		prisma.organizationMembership.findFirst({
			where: {
				organizationId: orgId,
				userId,
				isDeleted: false,
				status: "ACTIVE",
			},
		}),
	]);

	if (!organization) {
		return false;
	}

	return organization.ownerUserId === userId || Boolean(membership);
};

const formatZodIssues = (error: z.ZodError) => {
	return error.issues.map((issue) => ({
		field: issue.path.join("."),
		issue: issue.code,
		message: issue.message,
	}));
};

export const controller = (prisma: PrismaClient) => {
	const createOrganization = async (req: Request, res: Response, _next: NextFunction) => {
		const authReq = req as AuthenticatedRequest;
		if (!authReq.user) {
			sendError(req, res, 401, "UNAUTHORIZED", "Authentication required");
			return;
		}

		const parsed = createOrganizationSchema.safeParse(req.body);
		if (!parsed.success) {
			sendError(req, res, 422, "ORGS_NAME_INVALID", "Invalid organization payload", formatZodIssues(parsed.error));
			return;
		}

		try {
			const organization = await prisma.organization.create({
				data: {
					name: parsed.data.name,
					slug: parsed.data.slug,
					description: parsed.data.description,
					ownerUserId: authReq.user.id,
				},
			});

			await prisma.organizationMembership.create({
				data: {
					organizationId: organization.id,
					userId: authReq.user.id,
					role: "ADMIN",
					status: "ACTIVE",
					joinedAt: new Date(),
				},
			});

			sendSuccess(req, res, 201, { organization });
		} catch (error) {
			sendError(req, res, 500, "ORGS_CREATE_FAILED", "Failed to create organization", [
				{ message: error instanceof Error ? error.message : "Unknown error" },
			]);
		}
	};

	const getOrganizations = async (req: Request, res: Response, _next: NextFunction) => {
		const authReq = req as AuthenticatedRequest;
		if (!authReq.user) {
			sendError(req, res, 401, "UNAUTHORIZED", "Authentication required");
			return;
		}

		const organizations = await prisma.organization.findMany({
			where: {
				isDeleted: false,
				OR: [
					{ ownerUserId: authReq.user.id },
					{
						memberships: {
							some: {
								userId: authReq.user.id,
								isDeleted: false,
								status: "ACTIVE",
							},
						},
					},
				],
			},
			orderBy: { createdAt: "desc" },
		});

		sendSuccess(req, res, 200, { organizations });
	};

	const inviteUser = async (req: Request, res: Response, _next: NextFunction) => {
		const authReq = req as AuthenticatedRequest;
		if (!authReq.user) {
			sendError(req, res, 401, "UNAUTHORIZED", "Authentication required");
			return;
		}

		const { orgId } = req.params;
		if (!isObjectId(orgId)) {
			sendError(req, res, 400, "ORGS_APPROVAL_FORBIDDEN", "Invalid orgId format");
			return;
		}

		const parsed = inviteSchema.safeParse(req.body);
		if (!parsed.success || !isObjectId(parsed.data.invitedUserId)) {
			sendError(
				req,
				res,
				422,
				"ORGS_MEMBERSHIP_ALREADY_EXISTS",
				"Invalid invite payload",
				parsed.success ? undefined : formatZodIssues(parsed.error),
			);
			return;
		}

		const canInvite = await isAdminOrOwner(prisma, orgId, authReq.user.id);
		if (!canInvite) {
			sendError(req, res, 403, "ORGS_APPROVAL_FORBIDDEN", "Only organization admins can invite users");
			return;
		}

		const [existingMembership, pendingInvite] = await Promise.all([
			prisma.organizationMembership.findFirst({
				where: {
					organizationId: orgId,
					userId: parsed.data.invitedUserId,
					isDeleted: false,
					status: "ACTIVE",
				},
			}),
			prisma.organizationInvite.findFirst({
				where: {
					organizationId: orgId,
					invitedUserId: parsed.data.invitedUserId,
					isDeleted: false,
					status: "PENDING",
				},
			}),
		]);

		if (existingMembership || pendingInvite) {
			sendError(
				req,
				res,
				409,
				"ORGS_MEMBERSHIP_ALREADY_EXISTS",
				"Membership or pending invite already exists",
			);
			return;
		}

		const invite = await prisma.organizationInvite.create({
			data: {
				organizationId: orgId,
				invitedUserId: parsed.data.invitedUserId,
				invitedByUserId: authReq.user.id,
				expiresAt: parsed.data.expiresAt
					? new Date(parsed.data.expiresAt)
					: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
			},
		});

		sendSuccess(req, res, 201, { invite });
	};

	const createJoinRequest = async (req: Request, res: Response, _next: NextFunction) => {
		const authReq = req as AuthenticatedRequest;
		if (!authReq.user) {
			sendError(req, res, 401, "UNAUTHORIZED", "Authentication required");
			return;
		}

		const { orgId } = req.params;
		if (!isObjectId(orgId)) {
			sendError(req, res, 400, "ORGS_MEMBERSHIP_ALREADY_EXISTS", "Invalid orgId format");
			return;
		}

		const [existingMembership, pendingJoinRequest] = await Promise.all([
			prisma.organizationMembership.findFirst({
				where: {
					organizationId: orgId,
					userId: authReq.user.id,
					isDeleted: false,
					status: "ACTIVE",
				},
			}),
			prisma.organizationJoinRequest.findFirst({
				where: {
					organizationId: orgId,
					requesterUserId: authReq.user.id,
					isDeleted: false,
					status: "PENDING",
				},
			}),
		]);

		if (existingMembership || pendingJoinRequest) {
			sendError(
				req,
				res,
				409,
				"ORGS_MEMBERSHIP_ALREADY_EXISTS",
				"Membership or pending join request already exists",
			);
			return;
		}

		const joinRequest = await prisma.organizationJoinRequest.create({
			data: {
				organizationId: orgId,
				requesterUserId: authReq.user.id,
				status: "PENDING",
			},
		});

		sendSuccess(req, res, 201, { joinRequest });
	};

	const updateJoinRequestStatus = async (req: Request, res: Response, _next: NextFunction) => {
		const authReq = req as AuthenticatedRequest;
		if (!authReq.user) {
			sendError(req, res, 401, "UNAUTHORIZED", "Authentication required");
			return;
		}

		const { orgId, requestId } = req.params;
		if (!isObjectId(orgId) || !isObjectId(requestId)) {
			sendError(req, res, 400, "ORGS_APPROVAL_FORBIDDEN", "Invalid path parameters");
			return;
		}

		const parsed = joinRequestStatusSchema.safeParse(req.body);
		if (!parsed.success) {
			sendError(req, res, 422, "ORGS_APPROVAL_FORBIDDEN", "Invalid join request status payload", formatZodIssues(parsed.error));
			return;
		}

		const canApprove = await isAdminOrOwner(prisma, orgId, authReq.user.id);
		if (!canApprove) {
			sendError(req, res, 403, "ORGS_APPROVAL_FORBIDDEN", "Only organization admins can review join requests");
			return;
		}

		const joinRequest = await prisma.organizationJoinRequest.findFirst({
			where: {
				id: requestId,
				organizationId: orgId,
				isDeleted: false,
			},
		});

		if (!joinRequest || joinRequest.status !== "PENDING") {
			sendError(req, res, 409, "ORGS_APPROVAL_FORBIDDEN", "Join request is not pending");
			return;
		}

		const updatedJoinRequest = await prisma.organizationJoinRequest.update({
			where: { id: joinRequest.id },
			data: {
				status: parsed.data.status,
				reviewedByUserId: authReq.user.id,
				reviewedAt: new Date(),
			},
		});

		let membership = null;
		if (parsed.data.status === "APPROVED") {
			membership = await prisma.organizationMembership.upsert({
				where: {
					organizationId_userId_status: {
						organizationId: orgId,
						userId: joinRequest.requesterUserId,
						status: "ACTIVE",
					},
				},
				create: {
					organizationId: orgId,
					userId: joinRequest.requesterUserId,
					role: "MEMBER",
					status: "ACTIVE",
					joinedAt: new Date(),
				},
				update: {
					isDeleted: false,
					role: "MEMBER",
					status: "ACTIVE",
					removedAt: null,
				},
			});
		}

		sendSuccess(req, res, 200, {
			joinRequest: updatedJoinRequest,
			...(membership ? { membership } : {}),
		});
	};

	const updateInviteStatus = async (req: Request, res: Response, _next: NextFunction) => {
		const authReq = req as AuthenticatedRequest;
		if (!authReq.user) {
			sendError(req, res, 401, "UNAUTHORIZED", "Authentication required");
			return;
		}

		const { orgId, inviteId } = req.params;
		if (!isObjectId(orgId) || !isObjectId(inviteId)) {
			sendError(req, res, 400, "ORGS_APPROVAL_FORBIDDEN", "Invalid path parameters");
			return;
		}

		const parsed = inviteStatusSchema.safeParse(req.body);
		if (!parsed.success) {
			sendError(req, res, 422, "ORGS_APPROVAL_FORBIDDEN", "Invalid invite status payload", formatZodIssues(parsed.error));
			return;
		}

		const invite = await prisma.organizationInvite.findFirst({
			where: {
				id: inviteId,
				organizationId: orgId,
				isDeleted: false,
			},
		});

		if (!invite || invite.status !== "PENDING") {
			sendError(req, res, 409, "ORGS_APPROVAL_FORBIDDEN", "Invite is not pending");
			return;
		}

		const canUpdate =
			invite.invitedUserId === authReq.user.id || (await isAdminOrOwner(prisma, orgId, authReq.user.id));
		if (!canUpdate) {
			sendError(req, res, 403, "ORGS_APPROVAL_FORBIDDEN", "You cannot update this invite");
			return;
		}

		const updatedInvite = await prisma.organizationInvite.update({
			where: { id: invite.id },
			data: {
				status: parsed.data.status,
				respondedAt: new Date(),
			},
		});

		let membership = null;
		if (parsed.data.status === "ACCEPTED") {
			membership = await prisma.organizationMembership.upsert({
				where: {
					organizationId_userId_status: {
						organizationId: orgId,
						userId: invite.invitedUserId,
						status: "ACTIVE",
					},
				},
				create: {
					organizationId: orgId,
					userId: invite.invitedUserId,
					role: "MEMBER",
					status: "ACTIVE",
					joinedAt: new Date(),
				},
				update: {
					isDeleted: false,
					status: "ACTIVE",
					removedAt: null,
				},
			});
		}

		sendSuccess(req, res, 200, {
			invite: updatedInvite,
			...(membership ? { membership } : {}),
		});
	};

	const getMemberships = async (req: Request, res: Response, _next: NextFunction) => {
		const authReq = req as AuthenticatedRequest;
		if (!authReq.user) {
			sendError(req, res, 401, "UNAUTHORIZED", "Authentication required");
			return;
		}

		const { orgId } = req.params;
		if (!isObjectId(orgId)) {
			sendError(req, res, 400, "ORGS_NOT_FOUND", "Invalid orgId format");
			return;
		}

		const canView = await isActiveParticipant(prisma, orgId, authReq.user.id);
		if (!canView) {
			sendError(req, res, 403, "FORBIDDEN", "You are not allowed to view this organization");
			return;
		}

		const memberships = await prisma.organizationMembership.findMany({
			where: {
				organizationId: orgId,
				isDeleted: false,
				status: "ACTIVE",
			},
			include: { user: true },
			orderBy: { createdAt: "asc" },
		});

		sendSuccess(req, res, 200, { memberships });
	};

	const updateMembershipRole = async (req: Request, res: Response, _next: NextFunction) => {
		const authReq = req as AuthenticatedRequest;
		if (!authReq.user) {
			sendError(req, res, 401, "UNAUTHORIZED", "Authentication required");
			return;
		}

		const { orgId, membershipId } = req.params;
		if (!isObjectId(orgId) || !isObjectId(membershipId)) {
			sendError(req, res, 400, "ORGS_ROLE_INVALID", "Invalid path parameters");
			return;
		}

		const parsed = roleUpdateSchema.safeParse(req.body);
		if (!parsed.success) {
			sendError(req, res, 422, "ORGS_ROLE_INVALID", "Invalid role payload", formatZodIssues(parsed.error));
			return;
		}

		const canManage = await isAdminOrOwner(prisma, orgId, authReq.user.id);
		if (!canManage) {
			sendError(req, res, 403, "ORGS_APPROVAL_FORBIDDEN", "Only organization admins can update roles");
			return;
		}

		const membership = await prisma.organizationMembership.findFirst({
			where: {
				id: membershipId,
				organizationId: orgId,
				isDeleted: false,
				status: "ACTIVE",
			},
		});
		if (!membership) {
			sendError(req, res, 404, "ORGS_ROLE_INVALID", "Membership not found");
			return;
		}

		if (membership.role === "ADMIN" && parsed.data.role === "MEMBER") {
			const activeAdminCount = await prisma.organizationMembership.count({
				where: {
					organizationId: orgId,
					isDeleted: false,
					status: "ACTIVE",
					role: "ADMIN",
				},
			});
			if (activeAdminCount <= 1) {
				sendError(
					req,
					res,
					409,
					"ORGS_LAST_ADMIN_PROTECTED",
					"At least one admin must remain in the organization",
				);
				return;
			}
		}

		const updatedMembership = await prisma.organizationMembership.update({
			where: { id: membership.id },
			data: { role: parsed.data.role },
		});

		sendSuccess(req, res, 200, { membership: updatedMembership });
	};

	const removeMembership = async (req: Request, res: Response, _next: NextFunction) => {
		const authReq = req as AuthenticatedRequest;
		if (!authReq.user) {
			sendError(req, res, 401, "UNAUTHORIZED", "Authentication required");
			return;
		}

		const { orgId, membershipId } = req.params;
		if (!isObjectId(orgId) || !isObjectId(membershipId)) {
			sendError(req, res, 400, "ORGS_LAST_ADMIN_PROTECTED", "Invalid path parameters");
			return;
		}

		const canManage = await isAdminOrOwner(prisma, orgId, authReq.user.id);
		if (!canManage) {
			sendError(req, res, 403, "ORGS_APPROVAL_FORBIDDEN", "Only organization admins can remove members");
			return;
		}

		const membership = await prisma.organizationMembership.findFirst({
			where: {
				id: membershipId,
				organizationId: orgId,
				isDeleted: false,
				status: "ACTIVE",
			},
		});
		if (!membership) {
			sendError(req, res, 404, "ORGS_ROLE_INVALID", "Membership not found");
			return;
		}

		if (membership.role === "ADMIN") {
			const activeAdminCount = await prisma.organizationMembership.count({
				where: {
					organizationId: orgId,
					isDeleted: false,
					status: "ACTIVE",
					role: "ADMIN",
				},
			});
			if (activeAdminCount <= 1) {
				sendError(
					req,
					res,
					409,
					"ORGS_LAST_ADMIN_PROTECTED",
					"At least one admin must remain in the organization",
				);
				return;
			}
		}

		const updatedMembership = await prisma.organizationMembership.update({
			where: { id: membership.id },
			data: {
				status: "REMOVED",
				removedAt: new Date(),
			},
		});

		sendSuccess(req, res, 200, { membership: updatedMembership });
	};

	return {
		createOrganization,
		getOrganizations,
		inviteUser,
		createJoinRequest,
		updateJoinRequestStatus,
		updateInviteStatus,
		getMemberships,
		updateMembershipRole,
		removeMembership,
	};
};
