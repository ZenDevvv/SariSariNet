import { z } from "zod";
import { isValidObjectId } from "mongoose";
import { PaginationSchema } from "../common.zod";
import { SuggestionLayoutMode, SuggestionSortMode } from "../../generated/prisma";

export const SuggestionLayoutPreferenceSchema = z.object({
	id: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }),
	userId: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }),
	layoutMode: z.nativeEnum(SuggestionLayoutMode),
	sortMode: z.nativeEnum(SuggestionSortMode),
	isDeleted: z.boolean(),
	createdBy: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }).optional().nullable(),
	updatedBy: z.string().refine((value) => isValidObjectId(value), { message: "Invalid ObjectId" }).optional().nullable(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
});

export const CreateSuggestionLayoutPreferenceSchema = SuggestionLayoutPreferenceSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
}).partial({
	isDeleted: true,
	createdBy: true,
	updatedBy: true,
});

export const UpdateSuggestionLayoutPreferenceSchema = SuggestionLayoutPreferenceSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	isDeleted: true,
}).partial();

export const GetAllSuggestionLayoutPreferencesSchema = z.object({
	suggestionLayoutPreferences: z.array(SuggestionLayoutPreferenceSchema),
	pagination: PaginationSchema.optional(),
	count: z.number().optional(),
});

export type SuggestionLayoutPreference = z.infer<typeof SuggestionLayoutPreferenceSchema>;
export type CreateSuggestionLayoutPreference = z.infer<typeof CreateSuggestionLayoutPreferenceSchema>;
export type UpdateSuggestionLayoutPreference = z.infer<typeof UpdateSuggestionLayoutPreferenceSchema>;
