import { z } from "zod";
import { PaginationSchema, ObjectIdSchema } from "./common.zod";
import { ReportModule, ReportExportFormat, ReportExportJobStatus } from "./prisma-enums";

export const ReportExportJobSchema = z.object({
	id: ObjectIdSchema,
	userId: ObjectIdSchema,
	module: z.nativeEnum(ReportModule),
	format: z.nativeEnum(ReportExportFormat),
	filters: z.unknown(),
	status: z.nativeEnum(ReportExportJobStatus),
	storageKey: z.string().optional().nullable(),
	errorCode: z.string().optional().nullable(),
	expiresAt: z.coerce.date(),
	isDeleted: z.boolean(),
	createdBy: ObjectIdSchema.optional().nullable(),
	updatedBy: ObjectIdSchema.optional().nullable(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export const CreateReportExportJobSchema = ReportExportJobSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
}).partial({
	storageKey: true,
	errorCode: true,
	isDeleted: true,
	createdBy: true,
	updatedBy: true,
});

export const UpdateReportExportJobSchema = ReportExportJobSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	isDeleted: true,
}).partial();

export const GetAllReportExportJobsSchema = z.object({
	reportExportJobs: z.array(ReportExportJobSchema),
	pagination: PaginationSchema.optional(),
	count: z.number().optional(),
});

export type ReportExportJob = z.infer<typeof ReportExportJobSchema>;
export type CreateReportExportJob = z.infer<typeof CreateReportExportJobSchema>;
export type UpdateReportExportJob = z.infer<typeof UpdateReportExportJobSchema>;

export type GetAllReportExportJobs = z.infer<typeof GetAllReportExportJobsSchema>;
