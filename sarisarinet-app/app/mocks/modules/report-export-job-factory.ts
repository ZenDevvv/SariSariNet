import {
	ReportExportJobSchema,
	CreateReportExportJobSchema,
	UpdateReportExportJobSchema,
	GetAllReportExportJobsSchema,
	type ReportExportJob,
	type CreateReportExportJob,
	type UpdateReportExportJob,
	type GetAllReportExportJobs,
} from "~/zod/modules/report-export-job.zod";
import { PaginationSchema } from "~/zod/modules/common.zod";
import { ReportModule, ReportExportFormat, ReportExportJobStatus } from "~/zod/modules/prisma-enums";
import { createObjectId, createPagination } from "~/mocks/modules/mock-utils";

export const buildReportExportJobMock = (
	overrides: Partial<ReportExportJob> = {},
	seed = 1,
): ReportExportJob => {
	const base: ReportExportJob = {
		id: createObjectId(seed + 1),
		userId: createObjectId(seed + 2),
		module: ReportModule.COMMERCE,
		format: ReportExportFormat.CSV,
		filters: { sample: "filters", seed, module: "report-export-job" },
		status: ReportExportJobStatus.QUEUED,
		storageKey: seed % 2 === 0 ? null : "exports/report-" + seed + ".csv",
		errorCode: seed % 2 === 0 ? null : "Error Code " + seed,
		expiresAt: new Date(Date.now() + (seed + 9) * 60 * 60 * 1000),
		isDeleted: false,
		createdBy: seed % 2 === 0 ? null : createObjectId(seed + 11),
		updatedBy: seed % 2 === 0 ? null : createObjectId(seed + 12),
		createdAt: new Date(Date.now() - (seed + 13) * 24 * 60 * 60 * 1000),
		updatedAt: new Date(Date.now() - (seed + 14) * 30 * 60 * 1000),
	};

	return ReportExportJobSchema.parse({ ...base, ...overrides });
};

export const buildCreateReportExportJobMock = (
	overrides: Partial<CreateReportExportJob> = {},
	seed = 1,
): CreateReportExportJob => {
	return CreateReportExportJobSchema.parse({
		...buildReportExportJobMock({}, seed),
		...overrides,
	});
};

export const buildUpdateReportExportJobMock = (
	overrides: Partial<UpdateReportExportJob> = {},
	seed = 1,
): UpdateReportExportJob => {
	return UpdateReportExportJobSchema.parse({
		...buildReportExportJobMock({}, seed),
		...overrides,
	});
};

export const buildGetAllReportExportJobsMock = (
	options: {
		count?: number;
		page?: number;
		limit?: number;
		seed?: number;
		overrides?: Partial<GetAllReportExportJobs>;
	} = {},
): GetAllReportExportJobs => {
	const { count = 3, page = 1, limit = 10, seed = 1, overrides = {} } = options;

	return GetAllReportExportJobsSchema.parse({
		reportExportJobs: Array.from({ length: count }, (_, index) =>
			buildReportExportJobMock({}, seed + index),
		),
		pagination: PaginationSchema.parse(createPagination(count, page, limit)),
		count,
		...overrides,
	});
};
