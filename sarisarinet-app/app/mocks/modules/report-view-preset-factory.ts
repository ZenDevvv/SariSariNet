import {
	ReportViewPresetSchema,
	CreateReportViewPresetSchema,
	UpdateReportViewPresetSchema,
	GetAllReportViewPresetsSchema,
	type ReportViewPreset,
	type CreateReportViewPreset,
	type UpdateReportViewPreset,
	type GetAllReportViewPresets,
} from "~/zod/modules/report-view-preset.zod";
import { PaginationSchema } from "~/zod/modules/common.zod";
import { ReportModule } from "~/zod/modules/prisma-enums";
import { createObjectId, createPagination } from "~/mocks/modules/mock-utils";

export const buildReportViewPresetMock = (
	overrides: Partial<ReportViewPreset> = {},
	seed = 1,
): ReportViewPreset => {
	const base: ReportViewPreset = {
		id: createObjectId(seed + 1),
		userId: createObjectId(seed + 2),
		name: "Sample Name " + seed,
		module: ReportModule.COMMERCE,
		filters: { sample: "filters", seed, module: "report-view-preset" },
		isDefault: seed % 2 === 0,
		isDeleted: false,
		createdBy: seed % 2 === 0 ? null : createObjectId(seed + 8),
		updatedBy: seed % 2 === 0 ? null : createObjectId(seed + 9),
		createdAt: new Date(Date.now() - (seed + 10) * 24 * 60 * 60 * 1000),
		updatedAt: new Date(Date.now() - (seed + 11) * 30 * 60 * 1000),
	};

	return ReportViewPresetSchema.parse({ ...base, ...overrides });
};

export const buildCreateReportViewPresetMock = (
	overrides: Partial<CreateReportViewPreset> = {},
	seed = 1,
): CreateReportViewPreset => {
	return CreateReportViewPresetSchema.parse({
		...buildReportViewPresetMock({}, seed),
		...overrides,
	});
};

export const buildUpdateReportViewPresetMock = (
	overrides: Partial<UpdateReportViewPreset> = {},
	seed = 1,
): UpdateReportViewPreset => {
	return UpdateReportViewPresetSchema.parse({
		...buildReportViewPresetMock({}, seed),
		...overrides,
	});
};

export const buildGetAllReportViewPresetsMock = (
	options: {
		count?: number;
		page?: number;
		limit?: number;
		seed?: number;
		overrides?: Partial<GetAllReportViewPresets>;
	} = {},
): GetAllReportViewPresets => {
	const { count = 3, page = 1, limit = 10, seed = 1, overrides = {} } = options;

	return GetAllReportViewPresetsSchema.parse({
		reportViewPresets: Array.from({ length: count }, (_, index) =>
			buildReportViewPresetMock({}, seed + index),
		),
		pagination: PaginationSchema.parse(createPagination(count, page, limit)),
		count,
		...overrides,
	});
};
