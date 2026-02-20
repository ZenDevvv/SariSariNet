import { NextFunction, Request, Response, Router } from "express";
import { PrismaClient } from "../../../generated/prisma";
import { cache } from "../../../middleware/cache";
import { requireOwner } from "../_shared/auth";

interface IController {
	getCommerceDashboard(req: Request, res: Response, next: NextFunction): Promise<void>;
	getBorrowingDashboard(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export const router = (
	route: Router,
	controller: IController,
	prisma: PrismaClient,
): Router => {
	const routes = Router();
	const path = "/dashboard";

	/**
	 * @openapi
	 * /api/dashboard/commerce:
	 *   get:
	 *     summary: Get commerce dashboard metrics
	 *     tags: [Dashboard]
	 */
	routes.get(
		"/commerce",
		requireOwner(prisma),
		cache({ ttl: 30, keyGenerator: (req: Request) => `cache:dashboard:commerce:${(req as any).user?.id || "anon"}:${JSON.stringify(req.query || {})}` }),
		controller.getCommerceDashboard,
	);

	/**
	 * @openapi
	 * /api/dashboard/borrowing:
	 *   get:
	 *     summary: Get borrowing dashboard metrics
	 *     tags: [Dashboard]
	 */
	routes.get(
		"/borrowing",
		requireOwner(prisma),
		cache({ ttl: 30, keyGenerator: (req: Request) => `cache:dashboard:borrowing:${(req as any).user?.id || "anon"}:${JSON.stringify(req.query || {})}` }),
		controller.getBorrowingDashboard,
	);

	route.use(path, routes);
	return route;
};
