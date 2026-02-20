import type { Pagination } from "~/zod/modules/common.zod";

export const createObjectId = (seed: number): string => {
	return seed.toString(16).padStart(24, "0").slice(-24);
};

export const createPagination = (total: number, page = 1, limit = 10): Pagination => {
	const totalPages = Math.max(1, Math.ceil(total / limit));

	return {
		total,
		page,
		limit,
		totalPages,
		hasNext: page < totalPages,
		hasPrev: page > 1,
	};
};
