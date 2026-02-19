import {
	ListingLifecycleEventType,
	ProductListingStatus,
	ProductListingVisibility,
	PrismaClient,
	SuggestionSortMode,
} from "../../../generated/prisma";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { AuthenticatedRequest, hasPrivateListingAccess } from "../_shared/auth";
import { sendError, sendSuccess } from "../_shared/http";
import { isObjectId } from "../_shared/object-id";
import { parseListQuery } from "../_shared/query";

const productCreateSchema = z.object({
	title: z.string().min(1),
	description: z.string().max(5000).optional().nullable(),
	category: z.string().min(1),
	price: z.number().min(0),
	currency: z.string().min(1),
	quantityAvailable: z.number().int().min(0),
	visibility: z.nativeEnum(ProductListingVisibility).optional(),
	imageUrls: z.array(z.string().url()).optional(),
});

const productUpdateSchema = productCreateSchema.partial();

const inventoryUpdateSchema = z.object({
	quantityAvailable: z.number().int().min(0),
});

const formatZodIssues = (error: z.ZodError) => {
	return error.issues.map((issue) => ({
		field: issue.path.join("."),
		issue: issue.code,
		message: issue.message,
	}));
};

const ensureOwnership = async (prisma: PrismaClient, productId: string, userId: string) => {
	const product = await prisma.productListing.findFirst({
		where: {
			id: productId,
			isDeleted: false,
		},
	});

	if (!product) {
		return { product: null, canEdit: false };
	}

	return {
		product,
		canEdit: product.sellerUserId === userId,
	};
};

const listingSortFromPreference = (sortMode: SuggestionSortMode) => {
	switch (sortMode) {
		case "PRICE_LOW":
			return { price: "asc" as const };
		case "PRICE_HIGH":
			return { price: "desc" as const };
		case "RECENT":
		default:
			return { createdAt: "desc" as const };
	}
};

export const controller = (prisma: PrismaClient) => {
	const createProduct = async (req: Request, res: Response, _next: NextFunction) => {
		const authReq = req as AuthenticatedRequest;
		if (!authReq.user) {
			sendError(req, res, 401, "UNAUTHORIZED", "Authentication required");
			return;
		}

		const parsed = productCreateSchema.safeParse(req.body);
		if (!parsed.success) {
			sendError(
				req,
				res,
				422,
				"MARKETPLACE_PRODUCT_INVALID",
				"Invalid product payload",
				formatZodIssues(parsed.error),
			);
			return;
		}

		const product = await prisma.productListing.create({
			data: {
				sellerUserId: authReq.user.id,
				title: parsed.data.title,
				description: parsed.data.description,
				category: parsed.data.category,
				price: parsed.data.price,
				currency: parsed.data.currency,
				quantityAvailable: parsed.data.quantityAvailable,
				visibility: parsed.data.visibility || "PUBLIC",
				status: parsed.data.quantityAvailable > 0 ? "ACTIVE" : "SOLD_OUT",
				imageUrls: parsed.data.imageUrls || [],
			},
		});

		await prisma.listingLifecycleEvent.create({
			data: {
				listingId: product.id,
				actorUserId: authReq.user.id,
				eventType: ListingLifecycleEventType.CREATED,
				afterState: product,
			},
		});

		sendSuccess(req, res, 201, { product });
	};

	const updateProduct = async (req: Request, res: Response, _next: NextFunction) => {
		const authReq = req as AuthenticatedRequest;
		if (!authReq.user) {
			sendError(req, res, 401, "UNAUTHORIZED", "Authentication required");
			return;
		}

		const { productId } = req.params;
		if (!isObjectId(productId)) {
			sendError(req, res, 400, "MARKETPLACE_PRODUCT_INVALID", "Invalid productId format");
			return;
		}

		const parsed = productUpdateSchema.safeParse(req.body);
		if (!parsed.success) {
			sendError(req, res, 422, "MARKETPLACE_PRODUCT_INVALID", "Invalid product payload", formatZodIssues(parsed.error));
			return;
		}

		if (Object.keys(parsed.data).length === 0) {
			sendError(req, res, 400, "MARKETPLACE_PRODUCT_INVALID", "No fields provided for update");
			return;
		}

		const { product, canEdit } = await ensureOwnership(prisma, productId, authReq.user.id);
		if (!product) {
			sendError(req, res, 404, "MARKETPLACE_NOT_FOUND", "Product not found");
			return;
		}
		if (!canEdit) {
			sendError(req, res, 403, "MARKETPLACE_LISTING_FORBIDDEN", "You do not own this listing");
			return;
		}

		const updatedProduct = await prisma.productListing.update({
			where: { id: product.id },
			data: parsed.data,
		});

		await prisma.listingLifecycleEvent.create({
			data: {
				listingId: product.id,
				actorUserId: authReq.user.id,
				eventType: ListingLifecycleEventType.UPDATED,
				beforeState: product,
				afterState: updatedProduct,
			},
		});

		sendSuccess(req, res, 200, { product: updatedProduct });
	};

	const getProductById = async (req: Request, res: Response, _next: NextFunction) => {
		const authReq = req as AuthenticatedRequest;
		const { productId } = req.params;
		if (!isObjectId(productId)) {
			sendError(req, res, 400, "MARKETPLACE_NOT_FOUND", "Invalid productId format");
			return;
		}

		const product = await prisma.productListing.findFirst({
			where: {
				id: productId,
				isDeleted: false,
			},
		});
		if (!product) {
			sendError(req, res, 404, "MARKETPLACE_NOT_FOUND", "Product not found");
			return;
		}

		if (product.visibility === "PRIVATE") {
			if (!authReq.user) {
				sendError(req, res, 403, "MARKETPLACE_PRIVATE_FORBIDDEN", "Private listing access denied");
				return;
			}

			const isEligible = await hasPrivateListingAccess(prisma, authReq.user.id, product.sellerUserId);
			if (!isEligible) {
				sendError(req, res, 403, "MARKETPLACE_PRIVATE_FORBIDDEN", "Private listing access denied");
				return;
			}
		}

		sendSuccess(req, res, 200, { product });
	};

	const archiveProduct = async (req: Request, res: Response, _next: NextFunction) => {
		const authReq = req as AuthenticatedRequest;
		if (!authReq.user) {
			sendError(req, res, 401, "UNAUTHORIZED", "Authentication required");
			return;
		}

		const { productId } = req.params;
		if (!isObjectId(productId)) {
			sendError(req, res, 400, "MARKETPLACE_STATE_CONFLICT", "Invalid productId format");
			return;
		}

		const { product, canEdit } = await ensureOwnership(prisma, productId, authReq.user.id);
		if (!product) {
			sendError(req, res, 404, "MARKETPLACE_NOT_FOUND", "Product not found");
			return;
		}
		if (!canEdit) {
			sendError(req, res, 403, "MARKETPLACE_LISTING_FORBIDDEN", "You do not own this listing");
			return;
		}

		if (product.status === ProductListingStatus.ARCHIVED) {
			sendError(req, res, 409, "MARKETPLACE_STATE_CONFLICT", "Product is already archived");
			return;
		}

		const updatedProduct = await prisma.productListing.update({
			where: { id: product.id },
			data: { status: ProductListingStatus.ARCHIVED },
		});

		await prisma.listingLifecycleEvent.create({
			data: {
				listingId: product.id,
				actorUserId: authReq.user.id,
				eventType: ListingLifecycleEventType.ARCHIVED,
				beforeState: product,
				afterState: updatedProduct,
			},
		});

		sendSuccess(req, res, 200, { product: updatedProduct });
	};

	const unarchiveProduct = async (req: Request, res: Response, _next: NextFunction) => {
		const authReq = req as AuthenticatedRequest;
		if (!authReq.user) {
			sendError(req, res, 401, "UNAUTHORIZED", "Authentication required");
			return;
		}

		const { product, canEdit } = await ensureOwnership(prisma, req.params.productId, authReq.user.id);
		if (!product) {
			sendError(req, res, 404, "MARKETPLACE_NOT_FOUND", "Product not found");
			return;
		}
		if (!canEdit) {
			sendError(req, res, 403, "MARKETPLACE_LISTING_FORBIDDEN", "You do not own this listing");
			return;
		}

		if (product.status !== ProductListingStatus.ARCHIVED) {
			sendError(req, res, 409, "MARKETPLACE_STATE_CONFLICT", "Product is not archived");
			return;
		}

		const updatedProduct = await prisma.productListing.update({
			where: { id: product.id },
			data: {
				status: product.quantityAvailable > 0 ? ProductListingStatus.ACTIVE : ProductListingStatus.SOLD_OUT,
			},
		});

		await prisma.listingLifecycleEvent.create({
			data: {
				listingId: product.id,
				actorUserId: authReq.user.id,
				eventType: ListingLifecycleEventType.UNARCHIVED,
				beforeState: product,
				afterState: updatedProduct,
			},
		});

		sendSuccess(req, res, 200, { product: updatedProduct });
	};

	const updateInventory = async (req: Request, res: Response, _next: NextFunction) => {
		const authReq = req as AuthenticatedRequest;
		if (!authReq.user) {
			sendError(req, res, 401, "UNAUTHORIZED", "Authentication required");
			return;
		}

		const parsed = inventoryUpdateSchema.safeParse(req.body);
		if (!parsed.success) {
			sendError(req, res, 422, "MARKETPLACE_PRODUCT_INVALID", "Invalid inventory payload", formatZodIssues(parsed.error));
			return;
		}

		const { product, canEdit } = await ensureOwnership(prisma, req.params.productId, authReq.user.id);
		if (!product) {
			sendError(req, res, 404, "MARKETPLACE_NOT_FOUND", "Product not found");
			return;
		}
		if (!canEdit) {
			sendError(req, res, 403, "MARKETPLACE_LISTING_FORBIDDEN", "You do not own this listing");
			return;
		}

		const status =
			product.status === ProductListingStatus.ARCHIVED
				? ProductListingStatus.ARCHIVED
				: parsed.data.quantityAvailable > 0
					? ProductListingStatus.ACTIVE
					: ProductListingStatus.SOLD_OUT;

		const updatedProduct = await prisma.productListing.update({
			where: { id: product.id },
			data: {
				quantityAvailable: parsed.data.quantityAvailable,
				status,
			},
		});

		await prisma.listingLifecycleEvent.create({
			data: {
				listingId: product.id,
				actorUserId: authReq.user.id,
				eventType: ListingLifecycleEventType.INVENTORY_UPDATED,
				beforeState: product,
				afterState: updatedProduct,
			},
		});

		sendSuccess(req, res, 200, { product: updatedProduct });
	};

	const getMarketplace = async (req: Request, res: Response, _next: NextFunction) => {
		const listQuery = parseListQuery(req);
		const where: any = {
			isDeleted: false,
			visibility: ProductListingVisibility.PUBLIC,
			status: ProductListingStatus.ACTIVE,
		};

		if (listQuery.query) {
			where.OR = [
				{ title: { contains: listQuery.query, mode: "insensitive" } },
				{ description: { contains: listQuery.query, mode: "insensitive" } },
				{ category: { contains: listQuery.query, mode: "insensitive" } },
			];
		}

		const [products, total] = await Promise.all([
			prisma.productListing.findMany({
				where,
				take: listQuery.limit,
				skip: listQuery.skip,
				orderBy: { [listQuery.sortField]: listQuery.sortOrder },
			}),
			prisma.productListing.count({ where }),
		]);

		sendSuccess(
			req,
			res,
			200,
			{ products },
			listQuery.pagination
				? {
					pagination: {
						page: listQuery.page,
						limit: listQuery.limit,
						total,
						totalPages: Math.ceil(total / listQuery.limit),
					},
				}
				: undefined,
		);
	};

	const searchMarketplace = async (req: Request, res: Response, _next: NextFunction) => {
		const rawQuery = req.query.query;
		if (typeof rawQuery !== "string" || rawQuery.trim().length === 0) {
			sendError(req, res, 422, "MARKETPLACE_SEARCH_INVALID", "query is required for search");
			return;
		}

		const listQuery = parseListQuery(req);
		const where = {
			isDeleted: false,
			visibility: ProductListingVisibility.PUBLIC,
			status: ProductListingStatus.ACTIVE,
			OR: [
				{ title: { contains: rawQuery.trim(), mode: "insensitive" as const } },
				{ description: { contains: rawQuery.trim(), mode: "insensitive" as const } },
				{ category: { contains: rawQuery.trim(), mode: "insensitive" as const } },
			],
		};

		const [products, total] = await Promise.all([
			prisma.productListing.findMany({
				where,
				take: listQuery.limit,
				skip: listQuery.skip,
				orderBy: { [listQuery.sortField]: listQuery.sortOrder },
			}),
			prisma.productListing.count({ where }),
		]);

		sendSuccess(
			req,
			res,
			200,
			{ products },
			listQuery.pagination
				? {
					pagination: {
						page: listQuery.page,
						limit: listQuery.limit,
						total,
						totalPages: Math.ceil(total / listQuery.limit),
					},
				}
				: undefined,
		);
	};

	const getSuggestionFeed = async (req: Request, res: Response, _next: NextFunction) => {
		const authReq = req as AuthenticatedRequest;
		if (!authReq.user) {
			sendError(req, res, 401, "UNAUTHORIZED", "Authentication required");
			return;
		}

		const preference = await prisma.suggestionLayoutPreference.findUnique({
			where: { userId: authReq.user.id },
		});

		const sortMode = preference?.sortMode || SuggestionSortMode.RECENT;
		const orderBy = listingSortFromPreference(sortMode);

		const products = await prisma.productListing.findMany({
			where: {
				isDeleted: false,
				visibility: ProductListingVisibility.PUBLIC,
				status: ProductListingStatus.ACTIVE,
			},
			take: 30,
			orderBy,
		});

		sendSuccess(req, res, 200, {
			products,
			layout: preference || {
				layoutMode: "GRID",
				sortMode,
			},
		});
	};

	return {
		createProduct,
		updateProduct,
		getProductById,
		archiveProduct,
		unarchiveProduct,
		updateInventory,
		getMarketplace,
		searchMarketplace,
		getSuggestionFeed,
	};
};
