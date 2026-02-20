import { z } from "zod";
import { PaginationSchema, ObjectIdSchema } from "./common.zod";
import { ReportModule } from "./prisma-enums";

export const ReportViewPresetSchema = z.object({
	id: ObjectIdSchema,
	userId: ObjectIdSchema,
	name: z.string(),
	module: z.nativeEnum(ReportModule),
	filters: z.unknown(),
	isDefault: z.boolean(),
	isDeleted: z.boolean(),
	createdBy: ObjectIdSchema.optional().nullable(),
	updatedBy: ObjectIdSchema.optional().nullable(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export const CreateReportViewPresetSchema = ReportViewPresetSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
}).partial({
	isDeleted: true,
	createdBy: true,
	updatedBy: true,
});

export const UpdateReportViewPresetSchema = ReportViewPresetSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	isDeleted: true,
}).partial();

export const GetAllReportViewPresetsSchema = z.object({
	reportViewPresets: z.array(ReportViewPresetSchema),
	pagination: PaginationSchema.optional(),
	count: z.number().optional(),
});

export type ReportViewPreset = z.infer<typeof ReportViewPresetSchema>;
export type CreateReportViewPreset = z.infer<typeof CreateReportViewPresetSchema>;
export type UpdateReportViewPreset = z.infer<typeof UpdateReportViewPresetSchema>;

export type GetAllReportViewPresets = z.infer<typeof GetAllReportViewPresetsSchema>;
