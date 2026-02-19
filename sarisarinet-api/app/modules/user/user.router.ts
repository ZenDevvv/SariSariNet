import { NextFunction, Request, Response, Router } from "express";
import { PrismaClient } from "../../../generated/prisma";
import { cache } from "../../../middleware/cache";
import { attachOptionalAuth, requireAuth, requireOwner } from "../_shared/auth";

interface IController {
	getMe(req: Request, res: Response, next: NextFunction): Promise<void>;
	updateMyProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
	deactivateMe(req: Request, res: Response, next: NextFunction): Promise<void>;
	getMyOrganizations(req: Request, res: Response, next: NextFunction): Promise<void>;
	setActiveOrganization(req: Request, res: Response, next: NextFunction): Promise<void>;
	getUserListings(req: Request, res: Response, next: NextFunction): Promise<void>;
	updateSuggestionLayout(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export const router = (
	route: Router,
	controller: IController,
	prisma: PrismaClient,
): Router => {
	const routes = Router();
	const path = "/user";

	/**
	 * @openapi
	 * /api/user/me:
	 *   get:
	 *     summary: Get current user profile
	 *     tags: [User]
	 *     security:
	 *       - bearerAuth: []
	 */
	routes.get("/me", requireAuth(prisma), controller.getMe);

	/**
	 * @openapi
	 * /api/user/me/profile:
	 *   patch:
	 *     summary: Update current user profile
	 *     tags: [User]
	 *     security:
	 *       - bearerAuth: []
	 */
	routes.patch("/me/profile", requireOwner(prisma), controller.updateMyProfile);

	/**
	 * @openapi
	 * /api/user/me/deactivate:
	 *   post:
	 *     summary: Deactivate current user account
	 *     tags: [User]
	 *     security:
	 *       - bearerAuth: []
	 */
	routes.post("/me/deactivate", requireOwner(prisma), controller.deactivateMe);

	/**
	 * @openapi
	 * /api/user/me/organization:
	 *   get:
	 *     summary: List organizations for current user
	 *     tags: [User]
	 *     security:
	 *       - bearerAuth: []
	 */
	routes.get("/me/organization", requireOwner(prisma), controller.getMyOrganizations);

	/**
	 * @openapi
	 * /api/user/me/active-organization:
	 *   put:
	 *     summary: Update active organization context
	 *     tags: [User]
	 *     security:
	 *       - bearerAuth: []
	 */
	routes.put("/me/active-organization", requireOwner(prisma), controller.setActiveOrganization);

	/**
	 * @openapi
	 * /api/user/me/suggestion-layout:
	 *   put:
	 *     summary: Update suggestion layout preference
	 *     tags: [User]
	 *     security:
	 *       - bearerAuth: []
	 */
	routes.put("/me/suggestion-layout", requireOwner(prisma), controller.updateSuggestionLayout);

	/**
	 * @openapi
	 * /api/user/{userId}/listing:
	 *   get:
	 *     summary: Get seller listings for profile view
	 *     tags: [Marketplace]
	 */
	routes.get(
		"/:userId/listing",
		attachOptionalAuth(prisma),
		cache({
			ttl: 60,
			keyGenerator: (req: Request) => {
				const queryKey = Buffer.from(JSON.stringify(req.query || {})).toString("base64");
				return `cache:user-listing:${req.params.userId}:${queryKey}`;
			},
		}),
		controller.getUserListings,
	);

	route.use(path, routes);
	return route;
};
