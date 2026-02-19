import { NextFunction, Request, Response, Router } from "express";
import { PrismaClient } from "../../../generated/prisma";
import { cache } from "../../../middleware/cache";
import { requireAuth, requireOwner, requireParticipant } from "../_shared/auth";

interface IController {
	createOrganization(req: Request, res: Response, next: NextFunction): Promise<void>;
	getOrganizations(req: Request, res: Response, next: NextFunction): Promise<void>;
	inviteUser(req: Request, res: Response, next: NextFunction): Promise<void>;
	createJoinRequest(req: Request, res: Response, next: NextFunction): Promise<void>;
	updateJoinRequestStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
	updateInviteStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
	getMemberships(req: Request, res: Response, next: NextFunction): Promise<void>;
	updateMembershipRole(req: Request, res: Response, next: NextFunction): Promise<void>;
	removeMembership(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export const router = (
	route: Router,
	controller: IController,
	prisma: PrismaClient,
): Router => {
	const routes = Router();
	const path = "/organization";

	/**
	 * @openapi
	 * /api/organization:
	 *   post:
	 *     summary: Create organization
	 *     tags: [Organization]
	 */
	routes.post("/", requireAuth(prisma), controller.createOrganization);

	/**
	 * @openapi
	 * /api/organization:
	 *   get:
	 *     summary: List organizations for current user
	 *     tags: [Organization]
	 */
	routes.get(
		"/",
		requireAuth(prisma),
		cache({ ttl: 60, keyGenerator: (req: Request) => `cache:organization:list:${(req as any).user?.id || "anon"}` }),
		controller.getOrganizations,
	);

	/**
	 * @openapi
	 * /api/organization/{orgId}/invite:
	 *   post:
	 *     summary: Invite user to organization
	 *     tags: [Organization]
	 */
	routes.post("/:orgId/invite", requireParticipant(prisma), controller.inviteUser);

	/**
	 * @openapi
	 * /api/organization/{orgId}/join-request:
	 *   post:
	 *     summary: Create organization join request
	 *     tags: [Organization]
	 */
	routes.post("/:orgId/join-request", requireAuth(prisma), controller.createJoinRequest);

	/**
	 * @openapi
	 * /api/organization/{orgId}/join-request/{requestId}/status:
	 *   patch:
	 *     summary: Approve or reject join request
	 *     tags: [Organization]
	 */
	routes.patch(
		"/:orgId/join-request/:requestId/status",
		requireParticipant(prisma),
		controller.updateJoinRequestStatus,
	);

	/**
	 * @openapi
	 * /api/organization/{orgId}/invite/{inviteId}/status:
	 *   patch:
	 *     summary: Update invite status
	 *     tags: [Organization]
	 */
	routes.patch("/:orgId/invite/:inviteId/status", requireOwner(prisma), controller.updateInviteStatus);

	/**
	 * @openapi
	 * /api/organization/{orgId}/membership:
	 *   get:
	 *     summary: List memberships
	 *     tags: [Organization]
	 */
	routes.get("/:orgId/membership", requireParticipant(prisma), controller.getMemberships);

	/**
	 * @openapi
	 * /api/organization/{orgId}/membership/{membershipId}/role:
	 *   patch:
	 *     summary: Update membership role
	 *     tags: [Organization]
	 */
	routes.patch(
		"/:orgId/membership/:membershipId/role",
		requireParticipant(prisma),
		controller.updateMembershipRole,
	);

	/**
	 * @openapi
	 * /api/organization/{orgId}/membership/{membershipId}:
	 *   delete:
	 *     summary: Remove membership
	 *     tags: [Organization]
	 */
	routes.delete(
		"/:orgId/membership/:membershipId",
		requireParticipant(prisma),
		controller.removeMembership,
	);

	route.use(path, routes);
	return route;
};
