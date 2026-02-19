import {
	Prisma,
	PrismaClient,
	ReportExportFormat,
	ReportExportJobStatus,
	ReportModule,
} from "../../../generated/prisma";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { AuthenticatedRequest } from "../_shared/auth";
import { sendError, sendSuccess } from "../_shared/http";
import { isObjectId } from "../_shared/object-id";

const createPresetSchema = z.object({
	name: z.string().min(1),
	module: z.nativeEnum(ReportModule),
	filters: z.unknown(),
	isDefault: z.boolean().optional(),
});

const updatePresetSchema = createPresetSchema.partial();

const createExportSchema = z.object({
	module: z.nativeEnum(ReportModule),
	format: z.nativeEnum(ReportExportFormat),
	filters: z.unknown(),
});

const formatZodIssues = (error: z.ZodError) => {
	return error.issues.map((issue) => ({
		field: issue.path.join("."),
		issue: issue.code,
		message: issue.message,
	}));
};

const asInputJson = (value: unknown): Prisma.InputJsonValue => {
	return value as Prisma.InputJsonValue;
};

export const controller = (prisma: PrismaClient) => {
	const getPresets = async (req: Request, res: Response, _next: NextFunction) => {
		const authReq = req as AuthenticatedRequest;
		if (!authReq.user) {
			sendError(req, res, 401, "UNAUTHORIZED", "Authentication required");
			return;
		}

		const presets = await prisma.reportViewPreset.findMany({
			where: {
				userId: authReq.user.id,
				isDeleted: false,
			},
			orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
		});

		sendSuccess(req, res, 200, { presets });
	};

	const createPreset = async (req: Request, res: Response, _next: NextFunction) => {
		const authReq = req as AuthenticatedRequest;
		if (!authReq.user) {
			sendError(req, res, 401, "UNAUTHORIZED", "Authentication required");
			return;
		}

		const parsed = createPresetSchema.safeParse(req.body);
		if (!parsed.success) {
			sendError(
				req,
				res,
				422,
				"REPORTING_PRESET_INVALID",
				"Invalid preset payload",
				formatZodIssues(parsed.error),
			);
			return;
		}

		try {
			if (parsed.data.isDefault) {
				await prisma.reportViewPreset.updateMany({
					where: {
						userId: authReq.user.id,
						isDeleted: false,
					},
					data: { isDefault: false },
				});
			}

			const preset = await prisma.reportViewPreset.create({
				data: {
					userId: authReq.user.id,
					name: parsed.data.name,
					module: parsed.data.module,
					filters: asInputJson(parsed.data.filters),
					isDefault: parsed.data.isDefault || false,
				},
			});

			sendSuccess(req, res, 201, { preset });
		} catch (error) {
			sendError(req, res, 500, "REPORTING_PRESET_INVALID", "Failed to create preset", [
				{ message: error instanceof Error ? error.message : "Unknown error" },
			]);
		}
	};

	const updatePreset = async (req: Request, res: Response, _next: NextFunction) => {
		const authReq = req as AuthenticatedRequest;
		if (!authReq.user) {
			sendError(req, res, 401, "UNAUTHORIZED", "Authentication required");
			return;
		}

		const { presetId } = req.params;
		if (!isObjectId(presetId)) {
			sendError(req, res, 400, "REPORTING_PRESET_INVALID", "Invalid presetId format");
			return;
		}

		const parsed = updatePresetSchema.safeParse(req.body);
		if (!parsed.success || Object.keys(parsed.data).length === 0) {
			sendError(
				req,
				res,
				422,
				"REPORTING_PRESET_INVALID",
				"Invalid preset update payload",
				parsed.success ? undefined : formatZodIssues(parsed.error),
			);
			return;
		}

		const preset = await prisma.reportViewPreset.findFirst({
			where: {
				id: presetId,
				userId: authReq.user.id,
				isDeleted: false,
			},
		});
		if (!preset) {
			sendError(req, res, 404, "REPORTING_PRESET_INVALID", "Preset not found");
			return;
		}

		if (parsed.data.isDefault) {
			await prisma.reportViewPreset.updateMany({
				where: {
					userId: authReq.user.id,
					isDeleted: false,
				},
				data: { isDefault: false },
			});
		}

		const updatedPreset = await prisma.reportViewPreset.update({
			where: { id: preset.id },
			data: {
				...(parsed.data.name !== undefined ? { name: parsed.data.name } : {}),
				...(parsed.data.module !== undefined ? { module: parsed.data.module } : {}),
				...(parsed.data.filters !== undefined
					? { filters: asInputJson(parsed.data.filters) }
					: {}),
				...(parsed.data.isDefault !== undefined ? { isDefault: parsed.data.isDefault } : {}),
			},
		});

		sendSuccess(req, res, 200, { preset: updatedPreset });
	};

	const deletePreset = async (req: Request, res: Response, _next: NextFunction) => {
		const authReq = req as AuthenticatedRequest;
		if (!authReq.user) {
			sendError(req, res, 401, "UNAUTHORIZED", "Authentication required");
			return;
		}

		const { presetId } = req.params;
		if (!isObjectId(presetId)) {
			sendError(req, res, 400, "REPORTING_PRESET_INVALID", "Invalid presetId format");
			return;
		}

		const preset = await prisma.reportViewPreset.findFirst({
			where: {
				id: presetId,
				userId: authReq.user.id,
				isDeleted: false,
			},
		});
		if (!preset) {
			sendError(req, res, 404, "REPORTING_PRESET_INVALID", "Preset not found");
			return;
		}

		await prisma.reportViewPreset.delete({
			where: { id: preset.id },
		});

		sendSuccess(req, res, 200, { deleted: true });
	};

	const createExportJob = async (req: Request, res: Response, _next: NextFunction) => {
		const authReq = req as AuthenticatedRequest;
		if (!authReq.user) {
			sendError(req, res, 401, "UNAUTHORIZED", "Authentication required");
			return;
		}

		const parsed = createExportSchema.safeParse(req.body);
		if (!parsed.success) {
			sendError(
				req,
				res,
				422,
				"REPORTING_EXPORT_FAILED",
				"Invalid export payload",
				formatZodIssues(parsed.error),
			);
			return;
		}

		const storageKey = `report-export/${authReq.user.id}/${Date.now()}-${parsed.data.format.toLowerCase()}`;
		const exportJob = await prisma.reportExportJob.create({
			data: {
				userId: authReq.user.id,
				module: parsed.data.module,
				format: parsed.data.format,
				filters: asInputJson(parsed.data.filters),
				status: ReportExportJobStatus.READY,
				storageKey,
				expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
			},
		});

		sendSuccess(req, res, 201, { job: exportJob });
	};

	const getExportJob = async (req: Request, res: Response, _next: NextFunction) => {
		const authReq = req as AuthenticatedRequest;
		if (!authReq.user) {
			sendError(req, res, 401, "UNAUTHORIZED", "Authentication required");
			return;
		}

		const { jobId } = req.params;
		if (!isObjectId(jobId)) {
			sendError(req, res, 400, "REPORTING_EXPORT_FAILED", "Invalid jobId format");
			return;
		}

		const job = await prisma.reportExportJob.findFirst({
			where: {
				id: jobId,
				userId: authReq.user.id,
				isDeleted: false,
			},
		});
		if (!job) {
			sendError(req, res, 404, "REPORTING_EXPORT_FAILED", "Export job not found");
			return;
		}

		sendSuccess(req, res, 200, { job });
	};

	const downloadExport = async (req: Request, res: Response, _next: NextFunction) => {
		const authReq = req as AuthenticatedRequest;
		if (!authReq.user) {
			sendError(req, res, 401, "UNAUTHORIZED", "Authentication required");
			return;
		}

		const { jobId } = req.params;
		if (!isObjectId(jobId)) {
			sendError(req, res, 400, "REPORTING_EXPORT_FAILED", "Invalid jobId format");
			return;
		}

		const job = await prisma.reportExportJob.findFirst({
			where: {
				id: jobId,
				userId: authReq.user.id,
				isDeleted: false,
			},
		});
		if (!job || !job.storageKey) {
			sendError(req, res, 404, "REPORTING_EXPORT_FAILED", "Export file not found");
			return;
		}

		if (job.status !== ReportExportJobStatus.READY) {
			sendError(req, res, 409, "REPORTING_EXPORT_FAILED", "Export is not ready yet");
			return;
		}

		if (job.expiresAt <= new Date()) {
			sendError(req, res, 410, "REPORTING_EXPORT_FAILED", "Export has expired");
			return;
		}

		const downloadUrl = `https://download.sarisarinet.local/${encodeURIComponent(job.storageKey)}`;
		sendSuccess(req, res, 200, { downloadUrl });
	};

	return {
		getPresets,
		createPreset,
		updatePreset,
		deletePreset,
		createExportJob,
		getExportJob,
		downloadExport,
	};
};
