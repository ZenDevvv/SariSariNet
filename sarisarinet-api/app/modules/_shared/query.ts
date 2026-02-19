import { Request } from "express";

export interface ListQuery {
	page: number;
	limit: number;
	skip: number;
	sortField: string;
	sortOrder: "asc" | "desc";
	query: string;
	document: boolean;
	count: boolean;
	pagination: boolean;
	fields?: string;
}

export const parseListQuery = (req: Request): ListQuery => {
	const page = Math.max(1, Number(req.query.page || 1));
	const limit = Math.min(100, Math.max(1, Number(req.query.limit || 10)));
	const sortField = typeof req.query.sort === "string" ? req.query.sort : "createdAt";
	const sortOrder = req.query.order === "asc" ? "asc" : "desc";
	const query = typeof req.query.query === "string" ? req.query.query.trim() : "";
	const document = req.query.document === "true" || req.query.document === undefined;
	const count = req.query.count === "true";
	const pagination = req.query.pagination === "true";
	const fields = typeof req.query.fields === "string" ? req.query.fields : undefined;

	return {
		page,
		limit,
		skip: (page - 1) * limit,
		sortField,
		sortOrder,
		query,
		document,
		count,
		pagination,
		fields,
	};
};

export const toSelect = (fields?: string) => {
	if (!fields) {
		return undefined;
	}

	const select = fields
		.split(",")
		.map((value) => value.trim())
		.filter(Boolean)
		.reduce<Record<string, boolean>>((acc, field) => {
			acc[field] = true;
			return acc;
		}, {});

	if (Object.keys(select).length === 0) {
		return undefined;
	}

	return select;
};
