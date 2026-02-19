import crypto from "crypto";
import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "../../../generated/prisma";
import argon2 from "argon2";
import { z } from "zod";
import { issueSessionTokens, sanitizeUser } from "../_shared/auth";
import { sendError, sendSuccess } from "../_shared/http";

const registerSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
	displayName: z.string().min(1),
	storefrontName: z.string().optional(),
	bio: z.string().optional(),
	avatarUrl: z.string().url().optional(),
});

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1),
});

const recoveryRequestSchema = z.object({
	email: z.string().email(),
});

const recoveryConfirmSchema = z.object({
	token: z.string().min(1),
	newPassword: z.string().min(8),
});

const formatZodIssues = (error: z.ZodError) => {
	return error.issues.map((issue) => ({
		field: issue.path.join("."),
		issue: issue.code,
		message: issue.message,
	}));
};

const hashRecoveryToken = (token: string) => {
	return crypto.createHash("sha256").update(token).digest("hex");
};

export const controller = (prisma: PrismaClient) => {
	const register = async (req: Request, res: Response, _next: NextFunction) => {
		const parsed = registerSchema.safeParse(req.body);
		if (!parsed.success) {
			sendError(
				req,
				res,
				422,
				"IDENTITY_INVALID_INPUT",
				"Registration payload is invalid",
				formatZodIssues(parsed.error),
			);
			return;
		}

		try {
			const existingUser = await prisma.user.findUnique({
				where: { email: parsed.data.email },
			});

			if (existingUser) {
				sendError(
					req,
					res,
					409,
					"IDENTITY_AUTH_FAILED",
					"An account with this email already exists",
				);
				return;
			}

			const passwordHash = await argon2.hash(parsed.data.password);
			const createdUser = await prisma.user.create({
				data: {
					email: parsed.data.email,
					passwordHash,
					displayName: parsed.data.displayName,
					storefrontName: parsed.data.storefrontName,
					bio: parsed.data.bio,
					avatarUrl: parsed.data.avatarUrl,
				},
			});

			const tokens = await issueSessionTokens(prisma, createdUser.id, req);
			sendSuccess(req, res, 201, {
				user: sanitizeUser(createdUser),
				accessToken: tokens.accessToken,
				sessionToken: tokens.sessionToken,
			});
		} catch (error) {
			sendError(req, res, 500, "IDENTITY_AUTH_FAILED", "Failed to register user", [
				{ message: error instanceof Error ? error.message : "Unknown error" },
			]);
		}
	};

	const login = async (req: Request, res: Response, _next: NextFunction) => {
		const parsed = loginSchema.safeParse(req.body);
		if (!parsed.success) {
			sendError(
				req,
				res,
				422,
				"IDENTITY_INVALID_INPUT",
				"Login payload is invalid",
				formatZodIssues(parsed.error),
			);
			return;
		}

		try {
			const user = await prisma.user.findUnique({
				where: { email: parsed.data.email },
			});

			if (!user || user.isDeleted || user.accountStatus !== "ACTIVE") {
				sendError(req, res, 401, "IDENTITY_AUTH_FAILED", "Invalid credentials");
				return;
			}

			const matches = await argon2.verify(user.passwordHash, parsed.data.password);
			if (!matches) {
				sendError(req, res, 401, "IDENTITY_AUTH_FAILED", "Invalid credentials");
				return;
			}

			const tokens = await issueSessionTokens(prisma, user.id, req);
			sendSuccess(req, res, 200, {
				user: sanitizeUser(user),
				accessToken: tokens.accessToken,
				sessionToken: tokens.sessionToken,
			});
		} catch (error) {
			sendError(req, res, 500, "IDENTITY_AUTH_FAILED", "Failed to login", [
				{ message: error instanceof Error ? error.message : "Unknown error" },
			]);
		}
	};

	const requestRecovery = async (req: Request, res: Response, _next: NextFunction) => {
		const parsed = recoveryRequestSchema.safeParse(req.body);
		if (!parsed.success) {
			sendError(
				req,
				res,
				422,
				"IDENTITY_INVALID_INPUT",
				"Recovery request payload is invalid",
				formatZodIssues(parsed.error),
			);
			return;
		}

		try {
			const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
			if (!user || user.isDeleted) {
				sendSuccess(req, res, 200, { requested: true });
				return;
			}

			const recoveryToken = crypto.randomBytes(32).toString("hex");
			await prisma.accountRecoveryToken.create({
				data: {
					userId: user.id,
					tokenHash: hashRecoveryToken(recoveryToken),
					expiresAt: new Date(Date.now() + 15 * 60 * 1000),
					attemptCount: 0,
				},
			});

			sendSuccess(req, res, 200, {
				requested: true,
				...(process.env.NODE_ENV !== "production" ? { token: recoveryToken } : {}),
			});
		} catch (error) {
			sendError(
				req,
				res,
				500,
				"IDENTITY_RECOVERY_RATE_LIMITED",
				"Unable to create recovery request",
				[{ message: error instanceof Error ? error.message : "Unknown error" }],
			);
		}
	};

	const confirmRecovery = async (req: Request, res: Response, _next: NextFunction) => {
		const parsed = recoveryConfirmSchema.safeParse(req.body);
		if (!parsed.success) {
			sendError(
				req,
				res,
				422,
				"IDENTITY_INVALID_INPUT",
				"Recovery confirmation payload is invalid",
				formatZodIssues(parsed.error),
			);
			return;
		}

		try {
			const tokenHash = hashRecoveryToken(parsed.data.token);
			const tokenRecord = await prisma.accountRecoveryToken.findFirst({
				where: {
					tokenHash,
					isDeleted: false,
					consumedAt: null,
					expiresAt: { gt: new Date() },
				},
			});

			if (!tokenRecord) {
				sendError(
					req,
					res,
					422,
					"IDENTITY_RECOVERY_EXPIRED",
					"Recovery token is invalid or expired",
				);
				return;
			}

			const passwordHash = await argon2.hash(parsed.data.newPassword);
			await prisma.$transaction([
				prisma.user.update({
					where: { id: tokenRecord.userId },
					data: { passwordHash },
				}),
				prisma.accountRecoveryToken.update({
					where: { id: tokenRecord.id },
					data: { consumedAt: new Date() },
				}),
			]);

			sendSuccess(req, res, 200, { recovered: true });
		} catch (error) {
			sendError(
				req,
				res,
				500,
				"IDENTITY_RECOVERY_EXPIRED",
				"Unable to reset password",
				[{ message: error instanceof Error ? error.message : "Unknown error" }],
			);
		}
	};

	return {
		register,
		login,
		requestRecovery,
		confirmRecovery,
	};
};
