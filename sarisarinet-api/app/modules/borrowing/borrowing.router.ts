import { NextFunction, Request, Response, Router } from "express";
import { PrismaClient } from "../../../generated/prisma";
import { cache } from "../../../middleware/cache";
import { requireAuth, requireParticipant } from "../_shared/auth";

interface IController {
	createRecord(req: Request, res: Response, next: NextFunction): Promise<void>;
	postRepayment(req: Request, res: Response, next: NextFunction): Promise<void>;
	getRecord(req: Request, res: Response, next: NextFunction): Promise<void>;
	getRepayments(req: Request, res: Response, next: NextFunction): Promise<void>;
	addSettlementNote(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export const router = (
	route: Router,
	controller: IController,
	prisma: PrismaClient,
): Router => {
	const routes = Router();
	const path = "/borrowing";

	/**
	 * @openapi
	 * /api/borrowing:
	 *   post:
	 *     summary: Create borrowing record
	 *     tags: [Borrowing]
	 */
	routes.post("/", requireAuth(prisma), controller.createRecord);

	/**
	 * @openapi
	 * /api/borrowing/{recordId}/repayment:
	 *   post:
	 *     summary: Post repayment
	 *     tags: [Borrowing]
	 */
	routes.post("/:recordId/repayment", requireParticipant(prisma), controller.postRepayment);

	/**
	 * @openapi
	 * /api/borrowing/{recordId}:
	 *   get:
	 *     summary: Get borrowing record details
	 *     tags: [Borrowing]
	 */
	routes.get(
		"/:recordId",
		requireParticipant(prisma),
		cache({ ttl: 60, keyGenerator: (req: Request) => `cache:borrowing:record:${req.params.recordId}` }),
		controller.getRecord,
	);

	/**
	 * @openapi
	 * /api/borrowing/{recordId}/repayment:
	 *   get:
	 *     summary: Get repayment history
	 *     tags: [Borrowing]
	 */
	routes.get(
		"/:recordId/repayment",
		requireParticipant(prisma),
		cache({ ttl: 60, keyGenerator: (req: Request) => `cache:borrowing:repayments:${req.params.recordId}` }),
		controller.getRepayments,
	);

	/**
	 * @openapi
	 * /api/borrowing/{recordId}/settlement-note:
	 *   post:
	 *     summary: Add settlement note
	 *     tags: [Borrowing]
	 */
	routes.post("/:recordId/settlement-note", requireParticipant(prisma), controller.addSettlementNote);

	route.use(path, routes);
	return route;
};
