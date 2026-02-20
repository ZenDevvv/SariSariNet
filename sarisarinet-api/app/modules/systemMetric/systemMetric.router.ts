import { NextFunction, Request, Response, Router } from "express";
import { requireSystemToken } from "../_shared/auth";

interface IController {
	recomputeCommerceMetrics(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export const router = (route: Router, controller: IController): Router => {
	const routes = Router();
	const path = "/system/metric";

	/**
	 * @openapi
	 * /api/system/metric/commerce/recompute:
	 *   post:
	 *     summary: Recompute commerce metrics
	 *     tags: [System]
	 */
	routes.post("/commerce/recompute", requireSystemToken(), controller.recomputeCommerceMetrics);

	route.use(path, routes);
	return route;
};
