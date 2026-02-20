import { z } from "zod";

export const ObjectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

export const PaginationSchema = z.object({
	total: z.number(),
	page: z.number(),
	limit: z.number(),
	totalPages: z.number(),
	hasNext: z.boolean(),
	hasPrev: z.boolean(),
});

export type Pagination = z.infer<typeof PaginationSchema>;
