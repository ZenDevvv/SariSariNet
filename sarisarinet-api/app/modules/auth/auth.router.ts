import { NextFunction, Request, Response, Router } from "express";

interface IController {
	register(req: Request, res: Response, next: NextFunction): Promise<void>;
	login(req: Request, res: Response, next: NextFunction): Promise<void>;
	requestRecovery(req: Request, res: Response, next: NextFunction): Promise<void>;
	confirmRecovery(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export const router = (route: Router, controller: IController): Router => {
	const routes = Router();
	const path = "/auth";

	/**
	 * @openapi
	 * /api/auth/register:
	 *   post:
	 *     summary: Register user
	 *     tags: [Auth]
	 */
	routes.post("/register", controller.register);

	/**
	 * @openapi
	 * /api/auth/login:
	 *   post:
	 *     summary: Login user
	 *     tags: [Auth]
	 */
	routes.post("/login", controller.login);

	/**
	 * @openapi
	 * /api/auth/recovery/request:
	 *   post:
	 *     summary: Request account recovery
	 *     tags: [Auth]
	 */
	routes.post("/recovery/request", controller.requestRecovery);

	/**
	 * @openapi
	 * /api/auth/recovery/confirm:
	 *   post:
	 *     summary: Confirm account recovery
	 *     tags: [Auth]
	 */
	routes.post("/recovery/confirm", controller.confirmRecovery);

	route.use(path, routes);
	return route;
};
