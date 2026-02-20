import {
	ListingLifecycleEventSchema,
	CreateListingLifecycleEventSchema,
	UpdateListingLifecycleEventSchema,
	GetAllListingLifecycleEventsSchema,
	type ListingLifecycleEvent,
	type CreateListingLifecycleEvent,
	type UpdateListingLifecycleEvent,
	type GetAllListingLifecycleEvents,
} from "~/zod/modules/listing-lifecycle-event.zod";
import { PaginationSchema } from "~/zod/modules/common.zod";
import { ListingLifecycleEventType } from "~/zod/modules/prisma-enums";
import { createObjectId, createPagination } from "~/mocks/modules/mock-utils";

export const buildListingLifecycleEventMock = (
	overrides: Partial<ListingLifecycleEvent> = {},
	seed = 1,
): ListingLifecycleEvent => {
	const base: ListingLifecycleEvent = {
		id: createObjectId(seed + 1),
		listingId: createObjectId(seed + 2),
		actorUserId: createObjectId(seed + 3),
		eventType: ListingLifecycleEventType.CREATED,
		beforeState: seed % 2 === 0 ? null : { sample: "beforeState", seed, module: "listing-lifecycle-event" },
		afterState: seed % 2 === 0 ? null : { sample: "afterState", seed, module: "listing-lifecycle-event" },
		reason: seed % 2 === 0 ? null : "Reason " + seed,
		isDeleted: false,
		createdBy: seed % 2 === 0 ? null : createObjectId(seed + 9),
		updatedBy: seed % 2 === 0 ? null : createObjectId(seed + 10),
		createdAt: new Date(Date.now() - (seed + 11) * 24 * 60 * 60 * 1000),
		updatedAt: new Date(Date.now() - (seed + 12) * 30 * 60 * 1000),
	};

	return ListingLifecycleEventSchema.parse({ ...base, ...overrides });
};

export const buildCreateListingLifecycleEventMock = (
	overrides: Partial<CreateListingLifecycleEvent> = {},
	seed = 1,
): CreateListingLifecycleEvent => {
	return CreateListingLifecycleEventSchema.parse({
		...buildListingLifecycleEventMock({}, seed),
		...overrides,
	});
};

export const buildUpdateListingLifecycleEventMock = (
	overrides: Partial<UpdateListingLifecycleEvent> = {},
	seed = 1,
): UpdateListingLifecycleEvent => {
	return UpdateListingLifecycleEventSchema.parse({
		...buildListingLifecycleEventMock({}, seed),
		...overrides,
	});
};

export const buildGetAllListingLifecycleEventsMock = (
	options: {
		count?: number;
		page?: number;
		limit?: number;
		seed?: number;
		overrides?: Partial<GetAllListingLifecycleEvents>;
	} = {},
): GetAllListingLifecycleEvents => {
	const { count = 3, page = 1, limit = 10, seed = 1, overrides = {} } = options;

	return GetAllListingLifecycleEventsSchema.parse({
		listingLifecycleEvents: Array.from({ length: count }, (_, index) =>
			buildListingLifecycleEventMock({}, seed + index),
		),
		pagination: PaginationSchema.parse(createPagination(count, page, limit)),
		count,
		...overrides,
	});
};
