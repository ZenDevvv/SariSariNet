import { NextFunction, Request, Response, Router } from "express";
import { PrismaClient } from "../../../generated/prisma";
import { cache } from "../../../middleware/cache";
import { requireOwner } from "../_shared/auth";

interface IController {
	getPresets(req: Request, res: Response, next: NextFunction): Promise<void>;
	createPreset(req: Request, res: Response, next: NextFunction): Promise<void>;
	updatePreset(req: Request, res: Response, next: NextFunction): Promise<void>;
	deletePreset(req: Request, res: Response, next: NextFunction): Promise<void>;
	createExportJob(req: Request, res: Response, next: NextFunction): Promise<void>;
	getExportJob(req: Request, res: Response, next: NextFunction): Promise<void>;
	downloadExport(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export const router = (
	route: Router,
	controller: IController,
	prisma: PrismaClient,
): Router => {
	const routes = Router();
	const path = "/report";

	/**
	 * @openapi
	 * /api/report/preset:
	 *   get:
	 *     summary: List report presets
	 *     tags: [Report]
	 */
	routes.get(
		"/preset",
		requireOwner(prisma),
		cache({ ttl: 30, keyGenerator: (req: Request) => `cache:report:preset:${(req as any).user?.id || "anon"}` }),
		controller.getPresets,
	);

	/**
	 * @openapi
	 * /api/report/preset:
	 *   post:
	 *     summary: Create report preset
	 *     tags: [Report]
	 */
	routes.post("/preset", requireOwner(prisma), controller.createPreset);

	/**
	 * @openapi
	 * /api/report/preset/{presetId}:
	 *   patch:
	 *     summary: Update report preset
	 *     tags: [Report]
	 */
	routes.patch("/preset/:presetId", requireOwner(prisma), controller.updatePreset);

	/**
	 * @openapi
	 * /api/report/preset/{presetId}:
	 *   delete:
	 *     summary: Delete report preset
	 *     tags: [Report]
	 */
	routes.delete("/preset/:presetId", requireOwner(prisma), controller.deletePreset);

	/**
	 * @openapi
	 * /api/report/export:
	 *   post:
	 *     summary: Create report export job
	 *     tags: [Report]
	 */
	routes.post("/export", requireOwner(prisma), controller.createExportJob);

	/**
	 * @openapi
	 * /api/report/export/{jobId}:
	 *   get:
	 *     summary: Get report export job
	 *     tags: [Report]
	 */
	routes.get("/export/:jobId", requireOwner(prisma), controller.getExportJob);

	/**
	 * @openapi
	 * /api/report/export/{jobId}/download:
	 *   get:
	 *     summary: Download report export
	 *     tags: [Report]
	 */
	routes.get("/export/:jobId/download", requireOwner(prisma), controller.downloadExport);

	route.use(path, routes);
	return route;
};
