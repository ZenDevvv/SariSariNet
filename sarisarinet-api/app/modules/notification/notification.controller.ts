import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "../../../generated/prisma";
import { AuthenticatedRequest } from "../_shared/auth";
import { sendError, sendSuccess } from "../_shared/http";
import { isObjectId } from "../_shared/object-id";

export const controller = (prisma: PrismaClient) => {
	const getConnectionNotifications = async (req: Request, res: Response, _next: NextFunction) => {
		const authReq = req as AuthenticatedRequest;
		if (!authReq.user) {
			sendError(req, res, 401, "UNAUTHORIZED", "Authentication required");
			return;
		}

		const isReadQuery = req.query.isRead;
		const readFilter =
			typeof isReadQuery === "string" && ["true", "false"].includes(isReadQuery)
				? isReadQuery === "true"
				: undefined;

		const notifications = await prisma.connectionNotification.findMany({
			where: {
				userId: authReq.user.id,
				isDeleted: false,
				...(readFilter === undefined ? {} : { isRead: readFilter }),
			},
			orderBy: { createdAt: "desc" },
		});

		sendSuccess(req, res, 200, { notifications });
	};

	const markAsRead = async (req: Request, res: Response, _next: NextFunction) => {
		const authReq = req as AuthenticatedRequest;
		if (!authReq.user) {
			sendError(req, res, 401, "UNAUTHORIZED", "Authentication required");
			return;
		}

		const { notificationId } = req.params;
		if (!isObjectId(notificationId)) {
			sendError(req, res, 400, "CONNECTIONS_NOTIFICATION_FAILED", "Invalid notificationId format");
			return;
		}

		const notification = await prisma.connectionNotification.findFirst({
			where: {
				id: notificationId,
				isDeleted: false,
			},
		});

		if (!notification) {
			sendError(req, res, 404, "CONNECTIONS_NOTIFICATION_FAILED", "Notification not found");
			return;
		}

		if (notification.userId !== authReq.user.id) {
			sendError(req, res, 403, "FORBIDDEN", "You cannot update this notification");
			return;
		}

		const updated = await prisma.connectionNotification.update({
			where: { id: notification.id },
			data: { isRead: true },
		});

		sendSuccess(req, res, 200, { notification: updated });
	};

	return {
		getConnectionNotifications,
		markAsRead,
	};
};
