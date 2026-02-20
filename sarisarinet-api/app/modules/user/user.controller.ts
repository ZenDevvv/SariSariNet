import { NextFunction, Request, Response } from "express";
import { PrismaClient, SuggestionLayoutMode, SuggestionSortMode } from "../../../generated/prisma";
import { z } from "zod";
import { AuthenticatedRequest, hasPrivateListingAccess, sanitizeUser } from "../_shared/auth";
import { sendError, sendSuccess } from "../_shared/http";
import { isObjectId } from "../_shared/object-id";
import { parseListQuery } from "../_shared/query";

const profileUpdateSchema = z.object({
	displayName: z.string().min(1).optional(),
	storefrontName: z.string().min(1).optional().nullable(),
	bio: z.string().max(500).optional().nullable(),
	avatarUrl: z.string().url().optional().nullable(),
});

const deactivateSchema = z.object({
	confirmationText: z.string().min(1),
});

const activeOrganizationSchema = z.object({
	organizationId: z.string().min(1),
});

const suggestionLayoutSchema = z.object({
	layoutMode: z.nativeEnum(SuggestionLayoutMode),
	sortMode: z.nativeEnum(SuggestionSortMode),
});

const formatZodIssues = (error: z.ZodError) => {
	return error.issues.map((issue) => ({
		field: issue.path.join("."),
		issue: issue.code,
		message: issue.message,
	}));
};

export const controller = (prisma: PrismaClient) => {
	const getMe = async (req: Request, res: Response, _next: NextFunction) => {
		const authReq = req as AuthenticatedRequest;
		if (!authReq.user) {
			sendError(req, res, 401, "UNAUTHORIZED", "Authentication required");
			return;
		}

		const user = await prisma.user.findFirst({
			where: {
				id: authReq.user.id,
				isDeleted: false,
			},
		});

		if (!user) {
			sendError(req, res, 404, "IDENTITY_PROFILE_SAVE_FAILED", "User not found");
			return;
		}

		sendSuccess(req, res, 200, { user: sanitizeUser(user) });
	};

	const updateMyProfile = async (req: Request, res: Response, _next: NextFunction) => {
		const authReq = req as AuthenticatedRequest;
		if (!authReq.user) {
			sendError(req, res, 401, "UNAUTHORIZED", "Authentication required");
			return;
		}

		const parsed = profileUpdateSchema.safeParse(req.body);
		if (!parsed.success) {
			sendError(
				req,
				res,
				422,
				"IDENTITY_PROFILE_INVALID",
				"Profile payload is invalid",
				formatZodIssues(parsed.error),
			);
			return;
		}

		if (Object.keys(parsed.data).length === 0) {
			sendError(req, res, 400, "IDENTITY_PROFILE_INVALID", "No profile fields provided");
			return;
		}

		try {
			const updated = await prisma.user.update({
				where: { id: authReq.user.id },
				data: parsed.data,
			});

			sendSuccess(req, res, 200, { user: sanitizeUser(updated) });
		} catch (error) {
			sendError(req, res, 500, "IDENTITY_PROFILE_SAVE_FAILED", "Failed to update profile", [
				{ message: error instanceof Error ? error.message : "Unknown error" },
			]);
		}
	};

	const deactivateMe = async (req: Request, res: Response, _next: NextFunction) => {
		const authReq = req as AuthenticatedRequest;
		if (!authReq.user) {
			sendError(req, res, 401, "UNAUTHORIZED", "Authentication required");
			return;
		}

		const parsed = deactivateSchema.safeParse(req.body);
		if (!parsed.success) {
			sendError(
				req,
				res,
				422,
				"IDENTITY_DEACTIVATION_NOT_CONFIRMED",
				"Deactivation payload is invalid",
				formatZodIssues(parsed.error),
			);
			return;
		}

		if (parsed.data.confirmationText !== "DEACTIVATE") {
			sendError(
				req,
				res,
				422,
				"IDENTITY_DEACTIVATION_NOT_CONFIRMED",
				"confirmationText must be DEACTIVATE",
			);
			return;
		}

		try {
			const existingUser = await prisma.user.findUnique({ where: { id: authReq.user.id } });
			if (!existingUser) {
				sendError(req, res, 404, "IDENTITY_DEACTIVATION_FAILED", "User not found");
				return;
			}

			await prisma.$transaction([
				prisma.user.update({
					where: { id: authReq.user.id },
					data: { accountStatus: "DEACTIVATED" },
				}),
				prisma.accountStatusEvent.create({
					data: {
						userId: authReq.user.id,
						fromStatus: existingUser.accountStatus,
						toStatus: "DEACTIVATED",
						reason: "Self-deactivation",
						actorUserId: authReq.user.id,
					},
				}),
				prisma.authSession.updateMany({
					where: {
						userId: authReq.user.id,
						revokedAt: null,
					},
					data: { revokedAt: new Date() },
				}),
			]);

			sendSuccess(req, res, 200, { accountStatus: "DEACTIVATED" });
		} catch (error) {
			sendError(req, res, 500, "IDENTITY_DEACTIVATION_FAILED", "Failed to deactivate account", [
				{ message: error instanceof Error ? error.message : "Unknown error" },
			]);
		}
	};

	const getMyOrganizations = async (req: Request, res: Response, _next: NextFunction) => {
		const authReq = req as AuthenticatedRequest;
		if (!authReq.user) {
			sendError(req, res, 401, "UNAUTHORIZED", "Authentication required");
			return;
		}

		const memberships = await prisma.organizationMembership.findMany({
			where: {
				userId: authReq.user.id,
				isDeleted: false,
				status: "ACTIVE",
			},
			include: {
				organization: true,
			},
			orderBy: { createdAt: "desc" },
		});

		sendSuccess(req, res, 200, {
			activeOrganizationId: authReq.user.activeOrganizationId || null,
			organizations: memberships.map((membership) => ({
				membershipId: membership.id,
				role: membership.role,
				status: membership.status,
				organization: membership.organization,
			})),
		});
	};

	const setActiveOrganization = async (req: Request, res: Response, _next: NextFunction) => {
		const authReq = req as AuthenticatedRequest;
		if (!authReq.user) {
			sendError(req, res, 401, "UNAUTHORIZED", "Authentication required");
			return;
		}

		const parsed = activeOrganizationSchema.safeParse(req.body);
		if (!parsed.success || !isObjectId(parsed.data.organizationId)) {
			sendError(
				req,
				res,
				422,
				"ORGS_CONTEXT_SWITCH_FAILED",
				"organizationId must be a valid ObjectId",
			);
			return;
		}

		const membership = await prisma.organizationMembership.findFirst({
			where: {
				organizationId: parsed.data.organizationId,
				userId: authReq.user.id,
				isDeleted: false,
				status: "ACTIVE",
			},
		});

		if (!membership) {
			sendError(
				req,
				res,
				403,
				"ORGS_CONTEXT_FORBIDDEN",
				"You are not a member of this organization",
			);
			return;
		}

		const user = await prisma.user.update({
			where: { id: authReq.user.id },
			data: { activeOrganizationId: parsed.data.organizationId },
		});

		sendSuccess(req, res, 200, {
			activeOrganizationId: user.activeOrganizationId,
		});
	};

	const getUserListings = async (req: Request, res: Response, _next: NextFunction) => {
		const authReq = req as AuthenticatedRequest;
		const sellerUserId = req.params.userId;
		if (!isObjectId(sellerUserId)) {
			sendError(req, res, 400, "MARKETPLACE_PROFILE_NOT_FOUND", "Invalid userId format");
			return;
		}

		const seller = await prisma.user.findFirst({
			where: { id: sellerUserId, isDeleted: false },
		});
		if (!seller) {
			sendError(req, res, 404, "MARKETPLACE_PROFILE_NOT_FOUND", "Seller profile not found");
			return;
		}

		const listQuery = parseListQuery(req);
		const whereBase = {
			sellerUserId,
			isDeleted: false,
			...(listQuery.query
				? {
					OR: [
						{ title: { contains: listQuery.query, mode: "insensitive" as const } },
						{ description: { contains: listQuery.query, mode: "insensitive" as const } },
					],
				}
				: {}),
		};

		let whereClause: any = { ...whereBase, visibility: "PUBLIC" };
		let visibilityScope = "PUBLIC_ONLY";

		if (authReq.user) {
			const isEligible = await hasPrivateListingAccess(prisma, authReq.user.id, sellerUserId);
			if (isEligible) {
				whereClause = whereBase;
				visibilityScope = "PUBLIC_AND_PRIVATE";
			}
		}

		const [products, total] = await Promise.all([
			prisma.productListing.findMany({
				where: whereClause,
				take: listQuery.limit,
				skip: listQuery.skip,
				orderBy: { [listQuery.sortField]: listQuery.sortOrder },
			}),
			prisma.productListing.count({ where: whereClause }),
		]);

		sendSuccess(
			req,
			res,
			200,
			{ products, visibilityScope },
			listQuery.pagination
				? {
					pagination: {
						page: listQuery.page,
						limit: listQuery.limit,
						total,
						totalPages: Math.ceil(total / listQuery.limit),
					},
				}
				: undefined,
		);
	};

	const updateSuggestionLayout = async (req: Request, res: Response, _next: NextFunction) => {
		const authReq = req as AuthenticatedRequest;
		if (!authReq.user) {
			sendError(req, res, 401, "UNAUTHORIZED", "Authentication required");
			return;
		}

		const parsed = suggestionLayoutSchema.safeParse(req.body);
		if (!parsed.success) {
			sendError(
				req,
				res,
				422,
				"MARKETPLACE_PREF_SAVE_FAILED",
				"Suggestion layout payload is invalid",
				formatZodIssues(parsed.error),
			);
			return;
		}

		const preference = await prisma.suggestionLayoutPreference.upsert({
			where: { userId: authReq.user.id },
			create: {
				userId: authReq.user.id,
				layoutMode: parsed.data.layoutMode,
				sortMode: parsed.data.sortMode,
			},
			update: {
				layoutMode: parsed.data.layoutMode,
				sortMode: parsed.data.sortMode,
			},
		});

		sendSuccess(req, res, 200, { preference });
	};

	return {
		getMe,
		updateMyProfile,
		deactivateMe,
		getMyOrganizations,
		setActiveOrganization,
		getUserListings,
		updateSuggestionLayout,
	};
};
