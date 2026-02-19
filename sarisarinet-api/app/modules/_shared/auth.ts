import crypto from "crypto";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "../../../generated/prisma";
import { sendError } from "./http";

export interface AuthUserContext {
	id: string;
	email: string;
	activeOrganizationId?: string | null;
}

export interface AuthenticatedRequest extends Request {
	user?: AuthUserContext;
}

interface AccessTokenPayload {
	userId: string;
	sessionId: string;
}

const getJwtSecret = (): string => {
	return process.env.JWT_SECRET || "dev-secret";
};

const hashToken = (token: string): string => {
	return crypto.createHash("sha256").update(token).digest("hex");
};

const signAccessToken = (payload: AccessTokenPayload): string => {
	return jwt.sign(payload, getJwtSecret(), { expiresIn: "15m" });
};

const decodeToken = (token: string): AccessTokenPayload | null => {
	try {
		return jwt.verify(token, getJwtSecret()) as AccessTokenPayload;
	} catch {
		return null;
	}
};

export const issueSessionTokens = async (prisma: PrismaClient, userId: string, req: Request) => {
	const sessionToken = crypto.randomBytes(48).toString("hex");
	const refreshTokenHash = hashToken(sessionToken);
	const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
	const createdSession = await prisma.authSession.create({
		data: {
			userId,
			refreshTokenHash,
			deviceInfo: {
				userAgent: req.get("user-agent") || "unknown",
				ip: req.ip,
			},
			expiresAt,
		},
	});

	const accessToken = signAccessToken({
		userId,
		sessionId: createdSession.id,
	});

	return {
		accessToken,
		sessionToken,
		sessionId: createdSession.id,
		expiresAt,
	};
};

const tokenFromRequest = (req: Request): string | null => {
	const authHeader = req.header("authorization");
	if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
		return authHeader.slice(7).trim();
	}

	const cookieToken = (req as any).cookies?.token as string | undefined;
	if (cookieToken) {
		return cookieToken;
	}

	return null;
};

export const requireAuth = (prisma: PrismaClient) => {
	return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
		const token = tokenFromRequest(req);
		if (!token) {
			sendError(req, res, 401, "UNAUTHORIZED", "Missing access token");
			return;
		}

		const payload = decodeToken(token);
		if (!payload) {
			sendError(req, res, 401, "UNAUTHORIZED", "Invalid access token");
			return;
		}

		const [session, user] = await Promise.all([
			prisma.authSession.findFirst({
				where: {
					id: payload.sessionId,
					userId: payload.userId,
					isDeleted: false,
					revokedAt: null,
					expiresAt: { gt: new Date() },
				},
			}),
			prisma.user.findFirst({
				where: {
					id: payload.userId,
					isDeleted: false,
					accountStatus: "ACTIVE",
				},
			}),
		]);

		if (!session || !user) {
			sendError(req, res, 401, "UNAUTHORIZED", "Session is invalid or expired");
			return;
		}

		req.user = {
			id: user.id,
			email: user.email,
			activeOrganizationId: user.activeOrganizationId,
		};

		next();
	};
};

export const attachOptionalAuth = (prisma: PrismaClient) => {
	return async (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
		const token = tokenFromRequest(req);
		if (!token) {
			next();
			return;
		}

		const payload = decodeToken(token);
		if (!payload) {
			next();
			return;
		}

		const user = await prisma.user.findFirst({
			where: {
				id: payload.userId,
				isDeleted: false,
				accountStatus: "ACTIVE",
			},
		});

		if (user) {
			req.user = {
				id: user.id,
				email: user.email,
				activeOrganizationId: user.activeOrganizationId,
			};
		}

		next();
	};
};

export const requireOwner = (prisma: PrismaClient) => requireAuth(prisma);
export const requireParticipant = (prisma: PrismaClient) => requireAuth(prisma);
export const requireEligible = (prisma: PrismaClient) => requireAuth(prisma);

export const requireSystemToken = () => {
	return (req: Request, res: Response, next: NextFunction) => {
		const expected = process.env.SYSTEM_TOKEN || "system-token";
		const provided = req.header("x-system-token");

		if (!provided || provided !== expected) {
			sendError(req, res, 403, "FORBIDDEN", "Invalid system token");
			return;
		}

		next();
	};
};

export const isParticipantInConnection = (userId: string, userLowId: string, userHighId: string) => {
	return userId === userLowId || userId === userHighId;
};

export const hasPrivateListingAccess = async (
	prisma: PrismaClient,
	viewerUserId: string,
	sellerUserId: string,
): Promise<boolean> => {
	if (viewerUserId === sellerUserId) {
		return true;
	}

	const [connection, sharedOrganization] = await Promise.all([
		prisma.connection.findFirst({
			where: {
				isDeleted: false,
				OR: [
					{ userLowId: viewerUserId, userHighId: sellerUserId },
					{ userLowId: sellerUserId, userHighId: viewerUserId },
				],
			},
		}),
		prisma.organizationMembership.findFirst({
			where: {
				isDeleted: false,
				status: "ACTIVE",
				organization: {
					memberships: {
						some: {
							isDeleted: false,
							status: "ACTIVE",
							userId: sellerUserId,
						},
					},
				},
				userId: viewerUserId,
			},
		}),
	]);

	return Boolean(connection || sharedOrganization);
};

export const sanitizeUser = (user: {
	id: string;
	email: string;
	displayName: string;
	storefrontName: string | null;
	bio: string | null;
	avatarUrl: string | null;
	accountStatus: string;
	activeOrganizationId: string | null;
	createdAt: Date;
	updatedAt: Date;
}) => {
	return {
		id: user.id,
		email: user.email,
		displayName: user.displayName,
		storefrontName: user.storefrontName,
		bio: user.bio,
		avatarUrl: user.avatarUrl,
		accountStatus: user.accountStatus,
		activeOrganizationId: user.activeOrganizationId,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt,
	};
};
