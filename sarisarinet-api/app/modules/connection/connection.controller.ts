import { ConnectionNotificationReferenceType, ConnectionNotificationType, ConnectionRequestStatus, PrismaClient } from "../../../generated/prisma";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { AuthenticatedRequest, isParticipantInConnection } from "../_shared/auth";
import { sendError, sendSuccess } from "../_shared/http";
import { isObjectId } from "../_shared/object-id";

const sendRequestSchema = z.object({
	receiverUserId: z.string().min(1),
});

const updateRequestSchema = z.object({
	status: z.nativeEnum(ConnectionRequestStatus),
});

const formatZodIssues = (error: z.ZodError) => {
	return error.issues.map((issue) => ({
		field: issue.path.join("."),
		issue: issue.code,
		message: issue.message,
	}));
};

export const controller = (prisma: PrismaClient) => {
	const sendRequest = async (req: Request, res: Response, _next: NextFunction) => {
		const authReq = req as AuthenticatedRequest;
		if (!authReq.user) {
			sendError(req, res, 401, "UNAUTHORIZED", "Authentication required");
			return;
		}

		const parsed = sendRequestSchema.safeParse(req.body);
		if (!parsed.success || !isObjectId(parsed.data.receiverUserId)) {
			sendError(
				req,
				res,
				422,
				"CONNECTIONS_DUPLICATE_REQUEST",
				"receiverUserId must be a valid ObjectId",
				parsed.success ? undefined : formatZodIssues(parsed.error),
			);
			return;
		}

		if (parsed.data.receiverUserId === authReq.user.id) {
			sendError(
				req,
				res,
				422,
				"CONNECTIONS_SELF_ACTION",
				"You cannot send a connection request to yourself",
			);
			return;
		}

		const [receiver, existingRequest, existingConnection] = await Promise.all([
			prisma.user.findFirst({
				where: { id: parsed.data.receiverUserId, isDeleted: false },
			}),
			prisma.connectionRequest.findFirst({
				where: {
					requesterUserId: authReq.user.id,
					receiverUserId: parsed.data.receiverUserId,
					status: "PENDING",
					isDeleted: false,
				},
			}),
			prisma.connection.findFirst({
				where: {
					isDeleted: false,
					OR: [
						{ userLowId: authReq.user.id, userHighId: parsed.data.receiverUserId },
						{ userLowId: parsed.data.receiverUserId, userHighId: authReq.user.id },
					],
				},
			}),
		]);

		if (!receiver) {
			sendError(req, res, 404, "CONNECTIONS_DUPLICATE_REQUEST", "Receiver user does not exist");
			return;
		}

		if (existingRequest || existingConnection) {
			sendError(
				req,
				res,
				409,
				"CONNECTIONS_DUPLICATE_REQUEST",
				"A pending request or active connection already exists",
			);
			return;
		}

		const requestRecord = await prisma.connectionRequest.create({
			data: {
				requesterUserId: authReq.user.id,
				receiverUserId: parsed.data.receiverUserId,
				status: "PENDING",
			},
		});

		await prisma.connectionNotification.create({
			data: {
				userId: parsed.data.receiverUserId,
				type: ConnectionNotificationType.REQUEST_RECEIVED,
				referenceType: ConnectionNotificationReferenceType.CONNECTION_REQUEST,
				referenceId: requestRecord.id,
			},
		});

		sendSuccess(req, res, 201, { request: requestRecord });
	};

	const updateRequestStatus = async (req: Request, res: Response, _next: NextFunction) => {
		const authReq = req as AuthenticatedRequest;
		if (!authReq.user) {
			sendError(req, res, 401, "UNAUTHORIZED", "Authentication required");
			return;
		}

		const { requestId } = req.params;
		if (!isObjectId(requestId)) {
			sendError(req, res, 400, "CONNECTIONS_REQUEST_NOT_PENDING", "Invalid requestId format");
			return;
		}

		const parsed = updateRequestSchema.safeParse(req.body);
		if (!parsed.success) {
			sendError(
				req,
				res,
				422,
				"CONNECTIONS_REQUEST_NOT_PENDING",
				"Invalid request status payload",
				formatZodIssues(parsed.error),
			);
			return;
		}

		const requestRecord = await prisma.connectionRequest.findFirst({
			where: {
				id: requestId,
				isDeleted: false,
			},
		});

		if (!requestRecord) {
			sendError(req, res, 404, "CONNECTIONS_REQUEST_NOT_PENDING", "Connection request not found");
			return;
		}

		if (requestRecord.status !== "PENDING") {
			sendError(
				req,
				res,
				409,
				"CONNECTIONS_REQUEST_NOT_PENDING",
				"Connection request is no longer pending",
			);
			return;
		}

		if (
			parsed.data.status === "CANCELLED" &&
			requestRecord.requesterUserId !== authReq.user.id
		) {
			sendError(req, res, 403, "FORBIDDEN", "Only the requester can cancel this request");
			return;
		}

		if (
			(parsed.data.status === "ACCEPTED" || parsed.data.status === "REJECTED") &&
			requestRecord.receiverUserId !== authReq.user.id
		) {
			sendError(req, res, 403, "FORBIDDEN", "Only the receiver can respond to this request");
			return;
		}

		const updatedRequest = await prisma.connectionRequest.update({
			where: { id: requestRecord.id },
			data: {
				status: parsed.data.status,
				respondedAt: new Date(),
			},
		});

		let connection = null;
		if (parsed.data.status === "ACCEPTED") {
			const sortedIds = [requestRecord.requesterUserId, requestRecord.receiverUserId].sort();
			connection = await prisma.connection.upsert({
				where: {
					userLowId_userHighId: {
						userLowId: sortedIds[0],
						userHighId: sortedIds[1],
					},
				},
				create: {
					userLowId: sortedIds[0],
					userHighId: sortedIds[1],
					sourceRequestId: requestRecord.id,
				},
				update: {
					isDeleted: false,
					sourceRequestId: requestRecord.id,
				},
			});
		}

		if (parsed.data.status === "ACCEPTED" || parsed.data.status === "REJECTED") {
			await prisma.connectionNotification.create({
				data: {
					userId: requestRecord.requesterUserId,
					type:
						parsed.data.status === "ACCEPTED"
							? ConnectionNotificationType.REQUEST_ACCEPTED
							: ConnectionNotificationType.REQUEST_REJECTED,
					referenceType: ConnectionNotificationReferenceType.CONNECTION_REQUEST,
					referenceId: requestRecord.id,
				},
			});
		}

		sendSuccess(req, res, 200, {
			request: updatedRequest,
			...(connection ? { connection } : {}),
		});
	};

	const removeConnection = async (req: Request, res: Response, _next: NextFunction) => {
		const authReq = req as AuthenticatedRequest;
		if (!authReq.user) {
			sendError(req, res, 401, "UNAUTHORIZED", "Authentication required");
			return;
		}

		const { connectionId } = req.params;
		if (!isObjectId(connectionId)) {
			sendError(req, res, 400, "CONNECTIONS_SELF_ACTION", "Invalid connectionId format");
			return;
		}

		const connection = await prisma.connection.findFirst({
			where: {
				id: connectionId,
				isDeleted: false,
			},
		});

		if (!connection) {
			sendError(req, res, 404, "CONNECTIONS_SELF_ACTION", "Connection not found");
			return;
		}

		if (!isParticipantInConnection(authReq.user.id, connection.userLowId, connection.userHighId)) {
			sendError(req, res, 403, "FORBIDDEN", "Only participants can remove this connection");
			return;
		}

		await prisma.connection.delete({
			where: { id: connection.id },
		});

		await prisma.connectionNotification.createMany({
			data: [
				{
					userId: connection.userLowId,
					type: ConnectionNotificationType.CONNECTION_REMOVED,
					referenceType: ConnectionNotificationReferenceType.CONNECTION,
					referenceId: connection.id,
				},
				{
					userId: connection.userHighId,
					type: ConnectionNotificationType.CONNECTION_REMOVED,
					referenceType: ConnectionNotificationReferenceType.CONNECTION,
					referenceId: connection.id,
				},
			],
		});

		sendSuccess(req, res, 200, { removed: true });
	};

	const getIncomingRequests = async (req: Request, res: Response, _next: NextFunction) => {
		const authReq = req as AuthenticatedRequest;
		if (!authReq.user) {
			sendError(req, res, 401, "UNAUTHORIZED", "Authentication required");
			return;
		}

		const requests = await prisma.connectionRequest.findMany({
			where: {
				receiverUserId: authReq.user.id,
				isDeleted: false,
			},
			orderBy: { createdAt: "desc" },
		});

		sendSuccess(req, res, 200, { requests });
	};

	const getOutgoingRequests = async (req: Request, res: Response, _next: NextFunction) => {
		const authReq = req as AuthenticatedRequest;
		if (!authReq.user) {
			sendError(req, res, 401, "UNAUTHORIZED", "Authentication required");
			return;
		}

		const requests = await prisma.connectionRequest.findMany({
			where: {
				requesterUserId: authReq.user.id,
				isDeleted: false,
			},
			orderBy: { createdAt: "desc" },
		});

		sendSuccess(req, res, 200, { requests });
	};

	const getConnections = async (req: Request, res: Response, _next: NextFunction) => {
		const authReq = req as AuthenticatedRequest;
		if (!authReq.user) {
			sendError(req, res, 401, "UNAUTHORIZED", "Authentication required");
			return;
		}

		const connections = await prisma.connection.findMany({
			where: {
				isDeleted: false,
				OR: [{ userLowId: authReq.user.id }, { userHighId: authReq.user.id }],
			},
			orderBy: { createdAt: "desc" },
		});

		sendSuccess(req, res, 200, { connections });
	};

	return {
		sendRequest,
		updateRequestStatus,
		removeConnection,
		getIncomingRequests,
		getOutgoingRequests,
		getConnections,
	};
};
