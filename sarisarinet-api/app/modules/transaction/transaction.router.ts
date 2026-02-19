import { NextFunction, Request, Response, Router } from "express";
import { PrismaClient } from "../../../generated/prisma";
import { cache } from "../../../middleware/cache";
import { requireAuth, requireParticipant } from "../_shared/auth";

interface IController {
	createTransaction(req: Request, res: Response, next: NextFunction): Promise<void>;
	getTransactionById(req: Request, res: Response, next: NextFunction): Promise<void>;
	presignInvoiceUpload(req: Request, res: Response, next: NextFunction): Promise<void>;
	attachInvoice(req: Request, res: Response, next: NextFunction): Promise<void>;
	downloadInvoice(req: Request, res: Response, next: NextFunction): Promise<void>;
	createAdjustment(req: Request, res: Response, next: NextFunction): Promise<void>;
	voidTransaction(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export const router = (
	route: Router,
	controller: IController,
	prisma: PrismaClient,
): Router => {
	const routes = Router();
	const path = "/transaction";

	/**
	 * @openapi
	 * /api/transaction:
	 *   post:
	 *     summary: Create transaction
	 *     tags: [Transaction]
	 */
	routes.post("/", requireAuth(prisma), controller.createTransaction);

	/**
	 * @openapi
	 * /api/transaction/{transactionId}:
	 *   get:
	 *     summary: Get transaction by ID
	 *     tags: [Transaction]
	 */
	routes.get(
		"/:transactionId",
		requireParticipant(prisma),
		cache({ ttl: 90, keyGenerator: (req: Request) => `cache:transaction:byId:${req.params.transactionId}` }),
		controller.getTransactionById,
	);

	/**
	 * @openapi
	 * /api/transaction/{transactionId}/invoice/presign:
	 *   post:
	 *     summary: Presign transaction invoice upload
	 *     tags: [Transaction]
	 */
	routes.post("/:transactionId/invoice/presign", requireParticipant(prisma), controller.presignInvoiceUpload);

	/**
	 * @openapi
	 * /api/transaction/{transactionId}/invoice/attach:
	 *   post:
	 *     summary: Attach uploaded invoice
	 *     tags: [Transaction]
	 */
	routes.post("/:transactionId/invoice/attach", requireParticipant(prisma), controller.attachInvoice);

	/**
	 * @openapi
	 * /api/transaction/{transactionId}/invoice/download:
	 *   get:
	 *     summary: Get invoice download URL
	 *     tags: [Transaction]
	 */
	routes.get("/:transactionId/invoice/download", requireParticipant(prisma), controller.downloadInvoice);

	/**
	 * @openapi
	 * /api/transaction/{transactionId}/adjustment:
	 *   post:
	 *     summary: Adjust transaction
	 *     tags: [Transaction]
	 */
	routes.post("/:transactionId/adjustment", requireParticipant(prisma), controller.createAdjustment);

	/**
	 * @openapi
	 * /api/transaction/{transactionId}/void:
	 *   post:
	 *     summary: Void transaction
	 *     tags: [Transaction]
	 */
	routes.post("/:transactionId/void", requireParticipant(prisma), controller.voidTransaction);

	route.use(path, routes);
	return route;
};
