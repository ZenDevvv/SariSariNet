import { z } from "zod";
import { PaginationSchema, ObjectIdSchema } from "./common.zod";
import { SuggestionLayoutMode, SuggestionSortMode } from "./prisma-enums";

export const SuggestionLayoutPreferenceSchema = z.object({
	id: ObjectIdSchema,
	userId: ObjectIdSchema,
	layoutMode: z.nativeEnum(SuggestionLayoutMode),
	sortMode: z.nativeEnum(SuggestionSortMode),
	isDeleted: z.boolean(),
	createdBy: ObjectIdSchema.optional().nullable(),
	updatedBy: ObjectIdSchema.optional().nullable(),
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

export type GetAllSuggestionLayoutPreferences = z.infer<typeof GetAllSuggestionLayoutPreferencesSchema>;
