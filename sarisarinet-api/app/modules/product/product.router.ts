import { NextFunction, Request, Response, Router } from "express";
import { PrismaClient } from "../../../generated/prisma";
import { cache } from "../../../middleware/cache";
import { attachOptionalAuth, requireAuth, requireOwner } from "../_shared/auth";

interface IController {
	createProduct(req: Request, res: Response, next: NextFunction): Promise<void>;
	updateProduct(req: Request, res: Response, next: NextFunction): Promise<void>;
	getProductById(req: Request, res: Response, next: NextFunction): Promise<void>;
	archiveProduct(req: Request, res: Response, next: NextFunction): Promise<void>;
	unarchiveProduct(req: Request, res: Response, next: NextFunction): Promise<void>;
	updateInventory(req: Request, res: Response, next: NextFunction): Promise<void>;
	getMarketplace(req: Request, res: Response, next: NextFunction): Promise<void>;
	searchMarketplace(req: Request, res: Response, next: NextFunction): Promise<void>;
	getSuggestionFeed(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export const router = (
	route: Router,
	controller: IController,
	prisma: PrismaClient,
): Router => {
	const routes = Router();

	/**
	 * @openapi
	 * /api/product:
	 *   post:
	 *     summary: Create product listing
	 *     tags: [Marketplace]
	 */
	routes.post("/product", requireAuth(prisma), controller.createProduct);

	/**
	 * @openapi
	 * /api/product/{productId}:
	 *   patch:
	 *     summary: Update product listing
	 *     tags: [Marketplace]
	 */
	routes.patch("/product/:productId", requireOwner(prisma), controller.updateProduct);

	/**
	 * @openapi
	 * /api/product/{productId}:
	 *   get:
	 *     summary: Get product listing by ID
	 *     tags: [Marketplace]
	 */
	routes.get(
		"/product/:productId",
		attachOptionalAuth(prisma),
		cache({ ttl: 120, keyGenerator: (req: Request) => `cache:product:byId:${req.params.productId}:${(req as any).user?.id || "anon"}` }),
		controller.getProductById,
	);

	/**
	 * @openapi
	 * /api/product/{productId}/archive:
	 *   patch:
	 *     summary: Archive product listing
	 *     tags: [Marketplace]
	 */
	routes.patch("/product/:productId/archive", requireOwner(prisma), controller.archiveProduct);

	/**
	 * @openapi
	 * /api/product/{productId}/unarchive:
	 *   patch:
	 *     summary: Unarchive product listing
	 *     tags: [Marketplace]
	 */
	routes.patch("/product/:productId/unarchive", requireOwner(prisma), controller.unarchiveProduct);

	/**
	 * @openapi
	 * /api/product/{productId}/inventory:
	 *   patch:
	 *     summary: Update product inventory
	 *     tags: [Marketplace]
	 */
	routes.patch("/product/:productId/inventory", requireOwner(prisma), controller.updateInventory);

	/**
	 * @openapi
	 * /api/marketplace:
	 *   get:
	 *     summary: Browse public marketplace listings
	 *     tags: [Marketplace]
	 */
	routes.get(
		"/marketplace",
		cache({ ttl: 60, keyGenerator: (req: Request) => `cache:marketplace:list:${Buffer.from(JSON.stringify(req.query || {})).toString("base64")}` }),
		controller.getMarketplace,
	);

	/**
	 * @openapi
	 * /api/search:
	 *   get:
	 *     summary: Search public marketplace listings
	 *     tags: [Marketplace]
	 */
	routes.get(
		"/search",
		cache({ ttl: 60, keyGenerator: (req: Request) => `cache:marketplace:search:${Buffer.from(JSON.stringify(req.query || {})).toString("base64")}` }),
		controller.searchMarketplace,
	);

	/**
	 * @openapi
	 * /api/suggestion:
	 *   get:
	 *     summary: Get personalized suggestion feed
	 *     tags: [Marketplace]
	 */
	routes.get("/suggestion", requireAuth(prisma), controller.getSuggestionFeed);

	route.use("/", routes);
	return route;
};
