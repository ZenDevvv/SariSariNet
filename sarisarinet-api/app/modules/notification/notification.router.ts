import { NextFunction, Request, Response, Router } from "express";
import { PrismaClient } from "../../../generated/prisma";
import { cache } from "../../../middleware/cache";
import { requireAuth, requireOwner } from "../_shared/auth";

interface IController {
	getConnectionNotifications(req: Request, res: Response, next: NextFunction): Promise<void>;
	markAsRead(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export const router = (
	route: Router,
	controller: IController,
	prisma: PrismaClient,
): Router => {
	const routes = Router();
	const path = "/notification";

	/**
	 * @openapi
	 * /api/notification/connection:
	 *   get:
	 *     summary: List connection notifications
	 *     tags: [Notification]
	 */
	routes.get(
		"/connection",
		requireAuth(prisma),
		cache({ ttl: 30, keyGenerator: (req: Request) => `cache:notification:connection:${(req as any).user?.id || "anon"}` }),
		controller.getConnectionNotifications,
	);

	/**
	 * @openapi
	 * /api/notification/{notificationId}/read:
	 *   patch:
	 *     summary: Mark notification as read
	 *     tags: [Notification]
	 */
	routes.patch("/:notificationId/read", requireOwner(prisma), controller.markAsRead);

	route.use(path, routes);
	return route;
};
