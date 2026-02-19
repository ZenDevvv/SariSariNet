import { NextFunction, Request, Response, Router } from "express";
import { PrismaClient } from "../../../generated/prisma";
import { cache } from "../../../middleware/cache";
import { requireAuth, requireOwner, requireParticipant } from "../_shared/auth";

interface IController {
	sendRequest(req: Request, res: Response, next: NextFunction): Promise<void>;
	updateRequestStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
	removeConnection(req: Request, res: Response, next: NextFunction): Promise<void>;
	getIncomingRequests(req: Request, res: Response, next: NextFunction): Promise<void>;
	getOutgoingRequests(req: Request, res: Response, next: NextFunction): Promise<void>;
	getConnections(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export const router = (
	route: Router,
	controller: IController,
	prisma: PrismaClient,
): Router => {
	const routes = Router();
	const path = "/connection";

	/**
	 * @openapi
	 * /api/connection/request:
	 *   post:
	 *     summary: Send connection request
	 *     tags: [Connection]
	 */
	routes.post("/request", requireAuth(prisma), controller.sendRequest);

	/**
	 * @openapi
	 * /api/connection/request/{requestId}/status:
	 *   patch:
	 *     summary: Respond to a connection request
	 *     tags: [Connection]
	 */
	routes.patch("/request/:requestId/status", requireOwner(prisma), controller.updateRequestStatus);

	/**
	 * @openapi
	 * /api/connection/{connectionId}:
	 *   delete:
	 *     summary: Remove connection
	 *     tags: [Connection]
	 */
	routes.delete("/:connectionId", requireParticipant(prisma), controller.removeConnection);

	/**
	 * @openapi
	 * /api/connection/request/incoming:
	 *   get:
	 *     summary: List incoming connection requests
	 *     tags: [Connection]
	 */
	routes.get(
		"/request/incoming",
		requireAuth(prisma),
		cache({ ttl: 60, keyGenerator: (req: Request) => `cache:connection:incoming:${(req as any).user?.id || "anon"}` }),
		controller.getIncomingRequests,
	);

	/**
	 * @openapi
	 * /api/connection/request/outgoing:
	 *   get:
	 *     summary: List outgoing connection requests
	 *     tags: [Connection]
	 */
	routes.get(
		"/request/outgoing",
		requireAuth(prisma),
		cache({ ttl: 60, keyGenerator: (req: Request) => `cache:connection:outgoing:${(req as any).user?.id || "anon"}` }),
		controller.getOutgoingRequests,
	);

	/**
	 * @openapi
	 * /api/connection:
	 *   get:
	 *     summary: List active connections
	 *     tags: [Connection]
	 */
	routes.get(
		"/",
		requireAuth(prisma),
		cache({ ttl: 60, keyGenerator: (req: Request) => `cache:connection:list:${(req as any).user?.id || "anon"}` }),
		controller.getConnections,
	);

	route.use(path, routes);
	return route;
};
