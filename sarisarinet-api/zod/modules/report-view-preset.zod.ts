import { z } from "zod";
import { isValidObjectId } from "mongoose";
import { PaginationSchema } from "../common.zod";
import { ReportModule } from "../../generated/prisma";

export const ReportViewPresetSchema = z.object({
	id: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }),
	userId: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }),
	name: z.string(),
	module: z.nativeEnum(ReportModule),
	filters: z.unknown(),
	isDefault: z.boolean(),
	isDeleted: z.boolean(),
	createdBy: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }).optional().nullable(),
	updatedBy: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }).optional().nullable(),
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
