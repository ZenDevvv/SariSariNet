import {
	SuggestionLayoutPreferenceSchema,
	CreateSuggestionLayoutPreferenceSchema,
	UpdateSuggestionLayoutPreferenceSchema,
	GetAllSuggestionLayoutPreferencesSchema,
	type SuggestionLayoutPreference,
	type CreateSuggestionLayoutPreference,
	type UpdateSuggestionLayoutPreference,
	type GetAllSuggestionLayoutPreferences,
} from "~/zod/modules/suggestion-layout-preference.zod";
import { PaginationSchema } from "~/zod/modules/common.zod";
import { SuggestionLayoutMode, SuggestionSortMode } from "~/zod/modules/prisma-enums";
import { createObjectId, createPagination } from "~/mocks/modules/mock-utils";

export const buildSuggestionLayoutPreferenceMock = (
	overrides: Partial<SuggestionLayoutPreference> = {},
	seed = 1,
): SuggestionLayoutPreference => {
	const base: SuggestionLayoutPreference = {
		id: createObjectId(seed + 1),
		userId: createObjectId(seed + 2),
		layoutMode: SuggestionLayoutMode.GRID,
		sortMode: SuggestionSortMode.RECENT,
		isDeleted: false,
		createdBy: seed % 2 === 0 ? null : createObjectId(seed + 6),
		updatedBy: seed % 2 === 0 ? null : createObjectId(seed + 7),
		createdAt: new Date(Date.now() - (seed + 8) * 24 * 60 * 60 * 1000),
		updatedAt: new Date(Date.now() - (seed + 9) * 30 * 60 * 1000),
	};

	return SuggestionLayoutPreferenceSchema.parse({ ...base, ...overrides });
};

export const buildCreateSuggestionLayoutPreferenceMock = (
	overrides: Partial<CreateSuggestionLayoutPreference> = {},
	seed = 1,
): CreateSuggestionLayoutPreference => {
	return CreateSuggestionLayoutPreferenceSchema.parse({
		...buildSuggestionLayoutPreferenceMock({}, seed),
		...overrides,
	});
};

export const buildUpdateSuggestionLayoutPreferenceMock = (
	overrides: Partial<UpdateSuggestionLayoutPreference> = {},
	seed = 1,
): UpdateSuggestionLayoutPreference => {
	return UpdateSuggestionLayoutPreferenceSchema.parse({
		...buildSuggestionLayoutPreferenceMock({}, seed),
		...overrides,
	});
};

export const buildGetAllSuggestionLayoutPreferencesMock = (
	options: {
		count?: number;
		page?: number;
		limit?: number;
		seed?: number;
		overrides?: Partial<GetAllSuggestionLayoutPreferences>;
	} = {},
): GetAllSuggestionLayoutPreferences => {
	const { count = 3, page = 1, limit = 10, seed = 1, overrides = {} } = options;

	return GetAllSuggestionLayoutPreferencesSchema.parse({
		suggestionLayoutPreferences: Array.from({ length: count }, (_, index) =>
			buildSuggestionLayoutPreferenceMock({}, seed + index),
		),
		pagination: PaginationSchema.parse(createPagination(count, page, limit)),
		count,
		...overrides,
	});
};
