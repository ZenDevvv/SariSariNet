import crypto from "crypto";
import {
	InvoiceScanStatus,
	PrismaClient,
	TransactionAdjustmentAction,
	TransactionInvoiceMimeType,
	TransactionInvoiceStatus,
	TransactionStatus,
} from "../../../generated/prisma";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { AuthenticatedRequest } from "../_shared/auth";
import { sendError, sendSuccess } from "../_shared/http";
import { isObjectId } from "../_shared/object-id";

const createTransactionSchema = z.object({
	sellerUserId: z.string().min(1),
	buyerUserId: z.string().min(1),
	productListingId: z.string().optional().nullable(),
	amount: z.number().positive(),
	currency: z.string().min(1),
	transactionDate: z.string().datetime(),
	note: z.string().max(2000).optional().nullable(),
});

const mimeTypeSchema = z.enum(["image/jpeg", "image/png", "image/webp"]);

const presignInvoiceSchema = z.object({
	mimeType: mimeTypeSchema,
	size: z.number().int().positive().max(10 * 1024 * 1024),
	sha256: z.string().length(64),
});

const attachInvoiceSchema = z.object({
	storageKey: z.string().min(1),
	mimeType: mimeTypeSchema,
	size: z.number().int().positive().max(10 * 1024 * 1024),
	sha256: z.string().length(64),
});

const adjustmentSchema = z.object({
	action: z.nativeEnum(TransactionAdjustmentAction),
	reason: z.string().min(1),
	amount: z.number().positive().optional(),
	currency: z.string().min(1).optional(),
	transactionDate: z.string().datetime().optional(),
	note: z.string().max(2000).optional().nullable(),
});

const voidSchema = z.object({
	reason: z.string().min(1),
});

const formatZodIssues = (error: z.ZodError) => {
	return error.issues.map((issue) => ({
		field: issue.path.join("."),
		issue: issue.code,
		message: issue.message,
	}));
};

const invoiceMimeTypeMap: Record<"image/jpeg" | "image/png" | "image/webp", TransactionInvoiceMimeType> = {
	"image/jpeg": TransactionInvoiceMimeType.IMAGE_JPEG,
	"image/png": TransactionInvoiceMimeType.IMAGE_PNG,
	"image/webp": TransactionInvoiceMimeType.IMAGE_WEBP,
};

const isTransactionParticipant = (userId: string, transaction: { sellerUserId: string; buyerUserId: string; recordedByUserId: string }) => {
	return (
		userId === transaction.sellerUserId ||
		userId === transaction.buyerUserId ||
		userId === transaction.recordedByUserId
	);
};

export const controller = (prisma: PrismaClient) => {
	const createTransaction = async (req: Request, res: Response, _next: NextFunction) => {
		const authReq = req as AuthenticatedRequest;
		if (!authReq.user) {
			sendError(req, res, 401, "UNAUTHORIZED", "Authentication required");
			return;
		}

		const parsed = createTransactionSchema.safeParse(req.body);
		if (
			!parsed.success ||
			!isObjectId(parsed.data.sellerUserId) ||
			!isObjectId(parsed.data.buyerUserId) ||
			(parsed.data.productListingId && !isObjectId(parsed.data.productListingId))
		) {
			sendError(
				req,
				res,
				422,
				"TRANSACTIONS_PARTICIPANT_REQUIRED",
				"Invalid transaction payload",
				parsed.success ? undefined : formatZodIssues(parsed.error),
			);
			return;
		}

		if (parsed.data.sellerUserId === parsed.data.buyerUserId) {
			sendError(
				req,
				res,
				422,
				"TRANSACTIONS_PARTICIPANT_REQUIRED",
				"sellerUserId and buyerUserId must be different",
			);
			return;
		}

		const transaction = await prisma.transaction.create({
			data: {
				sellerUserId: parsed.data.sellerUserId,
				buyerUserId: parsed.data.buyerUserId,
				recordedByUserId: authReq.user.id,
				productListingId: parsed.data.productListingId,
				amount: parsed.data.amount,
				currency: parsed.data.currency,
				transactionDate: new Date(parsed.data.transactionDate),
				note: parsed.data.note,
				status: TransactionStatus.POSTED,
				invoiceStatus: TransactionInvoiceStatus.NONE,
			},
		});

		sendSuccess(req, res, 201, { transaction });
	};

	const getTransactionById = async (req: Request, res: Response, _next: NextFunction) => {
		const authReq = req as AuthenticatedRequest;
		if (!authReq.user) {
			sendError(req, res, 401, "UNAUTHORIZED", "Authentication required");
			return;
		}

		const { transactionId } = req.params;
		if (!isObjectId(transactionId)) {
			sendError(req, res, 400, "TRANSACTION_NOT_FOUND", "Invalid transactionId format");
			return;
		}

		const transaction = await prisma.transaction.findFirst({
			where: {
				id: transactionId,
				isDeleted: false,
			},
			include: {
				invoice: true,
				adjustments: {
					where: { isDeleted: false },
					orderBy: { createdAt: "desc" },
				},
			},
		});

		if (!transaction) {
			sendError(req, res, 404, "TRANSACTION_NOT_FOUND", "Transaction not found");
			return;
		}

		if (!isTransactionParticipant(authReq.user.id, transaction)) {
			sendError(req, res, 403, "FORBIDDEN", "You are not a participant of this transaction");
			return;
		}

		sendSuccess(req, res, 200, { transaction });
	};

	const presignInvoiceUpload = async (req: Request, res: Response, _next: NextFunction) => {
		const authReq = req as AuthenticatedRequest;
		if (!authReq.user) {
			sendError(req, res, 401, "UNAUTHORIZED", "Authentication required");
			return;
		}

		const { transactionId } = req.params;
		if (!isObjectId(transactionId)) {
			sendError(req, res, 400, "TRANSACTION_NOT_FOUND", "Invalid transactionId format");
			return;
		}

		const parsed = presignInvoiceSchema.safeParse(req.body);
		if (!parsed.success) {
			sendError(
				req,
				res,
				422,
				"TRANSACTIONS_INVOICE_FILE_INVALID",
				"Invalid invoice upload payload",
				formatZodIssues(parsed.error),
			);
			return;
		}

		const transaction = await prisma.transaction.findFirst({
			where: {
				id: transactionId,
				isDeleted: false,
			},
		});
		if (!transaction) {
			sendError(req, res, 404, "TRANSACTION_NOT_FOUND", "Transaction not found");
			return;
		}

		if (!isTransactionParticipant(authReq.user.id, transaction)) {
			sendError(req, res, 403, "FORBIDDEN", "You are not a participant of this transaction");
			return;
		}

		const storageKey = `invoice/${transaction.id}/${Date.now()}-${crypto.randomUUID()}`;
		const uploadUrl = `https://upload.sarisarinet.local/${encodeURIComponent(storageKey)}`;

		sendSuccess(req, res, 200, { uploadUrl, storageKey });
	};

	const attachInvoice = async (req: Request, res: Response, _next: NextFunction) => {
		const authReq = req as AuthenticatedRequest;
		if (!authReq.user) {
			sendError(req, res, 401, "UNAUTHORIZED", "Authentication required");
			return;
		}

		const { transactionId } = req.params;
		if (!isObjectId(transactionId)) {
			sendError(req, res, 400, "TRANSACTION_NOT_FOUND", "Invalid transactionId format");
			return;
		}

		const parsed = attachInvoiceSchema.safeParse(req.body);
		if (!parsed.success) {
			sendError(
				req,
				res,
				422,
				"TRANSACTIONS_INVOICE_UPLOAD_FAILED",
				"Invalid invoice attachment payload",
				formatZodIssues(parsed.error),
			);
			return;
		}

		const transaction = await prisma.transaction.findFirst({
			where: {
				id: transactionId,
				isDeleted: false,
			},
		});
		if (!transaction) {
			sendError(req, res, 404, "TRANSACTION_NOT_FOUND", "Transaction not found");
			return;
		}
		if (!isTransactionParticipant(authReq.user.id, transaction)) {
			sendError(req, res, 403, "FORBIDDEN", "You are not a participant of this transaction");
			return;
		}

		const invoice = await prisma.transactionInvoice.upsert({
			where: { transactionId: transaction.id },
			create: {
				transactionId: transaction.id,
				storageKey: parsed.data.storageKey,
				mimeType: invoiceMimeTypeMap[parsed.data.mimeType],
				size: parsed.data.size,
				sha256: parsed.data.sha256,
				scanStatus: InvoiceScanStatus.PENDING,
				uploadedByUserId: authReq.user.id,
				uploadedAt: new Date(),
			},
			update: {
				storageKey: parsed.data.storageKey,
				mimeType: invoiceMimeTypeMap[parsed.data.mimeType],
				size: parsed.data.size,
				sha256: parsed.data.sha256,
				scanStatus: InvoiceScanStatus.PENDING,
				uploadedByUserId: authReq.user.id,
				uploadedAt: new Date(),
			},
		});

		await prisma.transaction.update({
			where: { id: transaction.id },
			data: {
				invoiceStatus: TransactionInvoiceStatus.PENDING_SCAN,
			},
		});

		sendSuccess(req, res, 200, { invoice });
	};

	const downloadInvoice = async (req: Request, res: Response, _next: NextFunction) => {
		const authReq = req as AuthenticatedRequest;
		if (!authReq.user) {
			sendError(req, res, 401, "UNAUTHORIZED", "Authentication required");
			return;
		}

		const { transactionId } = req.params;
		if (!isObjectId(transactionId)) {
			sendError(req, res, 400, "TRANSACTION_NOT_FOUND", "Invalid transactionId format");
			return;
		}

		const transaction = await prisma.transaction.findFirst({
			where: {
				id: transactionId,
				isDeleted: false,
			},
			include: {
				invoice: true,
			},
		});
		if (!transaction) {
			sendError(req, res, 404, "TRANSACTION_NOT_FOUND", "Transaction not found");
			return;
		}
		if (!isTransactionParticipant(authReq.user.id, transaction)) {
			sendError(req, res, 403, "FORBIDDEN", "You are not a participant of this transaction");
			return;
		}
		if (!transaction.invoice) {
			sendError(req, res, 404, "TRANSACTIONS_INVOICE_UPLOAD_FAILED", "Invoice not found");
			return;
		}

		const downloadUrl = `https://download.sarisarinet.local/${encodeURIComponent(transaction.invoice.storageKey)}`;
		sendSuccess(req, res, 200, { downloadUrl });
	};

	const createAdjustment = async (req: Request, res: Response, _next: NextFunction) => {
		const authReq = req as AuthenticatedRequest;
		if (!authReq.user) {
			sendError(req, res, 401, "UNAUTHORIZED", "Authentication required");
			return;
		}

		const { transactionId } = req.params;
		if (!isObjectId(transactionId)) {
			sendError(req, res, 400, "TRANSACTION_NOT_FOUND", "Invalid transactionId format");
			return;
		}

		const parsed = adjustmentSchema.safeParse(req.body);
		if (!parsed.success) {
			sendError(
				req,
				res,
				422,
				"TRANSACTIONS_ADJUST_REASON_REQUIRED",
				"Invalid adjustment payload",
				formatZodIssues(parsed.error),
			);
			return;
		}

		if (parsed.data.action !== TransactionAdjustmentAction.CORRECT) {
			sendError(
				req,
				res,
				422,
				"TRANSACTIONS_ADJUST_REASON_REQUIRED",
				"/adjustment only supports CORRECT action",
			);
			return;
		}

		const transaction = await prisma.transaction.findFirst({
			where: {
				id: transactionId,
				isDeleted: false,
			},
		});
		if (!transaction) {
			sendError(req, res, 404, "TRANSACTION_NOT_FOUND", "Transaction not found");
			return;
		}
		if (!isTransactionParticipant(authReq.user.id, transaction)) {
			sendError(req, res, 403, "TRANSACTIONS_ADJUST_FORBIDDEN", "You cannot adjust this transaction");
			return;
		}

		const updateData: Record<string, unknown> = {
			...(parsed.data.amount !== undefined ? { amount: parsed.data.amount } : {}),
			...(parsed.data.currency !== undefined ? { currency: parsed.data.currency } : {}),
			...(parsed.data.transactionDate !== undefined
				? { transactionDate: new Date(parsed.data.transactionDate) }
				: {}),
			...(parsed.data.note !== undefined ? { note: parsed.data.note } : {}),
		};

		if (Object.keys(updateData).length === 0) {
			sendError(
				req,
				res,
				422,
				"TRANSACTIONS_ADJUST_REASON_REQUIRED",
				"At least one updatable transaction field is required",
			);
			return;
		}

		const updatedTransaction = await prisma.transaction.update({
			where: { id: transaction.id },
			data: updateData,
		});

		const adjustment = await prisma.transactionAdjustment.create({
			data: {
				transactionId: transaction.id,
				action: TransactionAdjustmentAction.CORRECT,
				reason: parsed.data.reason,
				beforeSnapshot: transaction,
				afterSnapshot: updatedTransaction,
				actorUserId: authReq.user.id,
			},
		});

		sendSuccess(req, res, 201, {
			transaction: updatedTransaction,
			adjustment,
		});
	};

	const voidTransaction = async (req: Request, res: Response, _next: NextFunction) => {
		const authReq = req as AuthenticatedRequest;
		if (!authReq.user) {
			sendError(req, res, 401, "UNAUTHORIZED", "Authentication required");
			return;
		}

		const { transactionId } = req.params;
		if (!isObjectId(transactionId)) {
			sendError(req, res, 400, "TRANSACTION_NOT_FOUND", "Invalid transactionId format");
			return;
		}

		const parsed = voidSchema.safeParse(req.body);
		if (!parsed.success) {
			sendError(
				req,
				res,
				422,
				"TRANSACTIONS_ADJUST_REASON_REQUIRED",
				"Void payload must include a reason",
				formatZodIssues(parsed.error),
			);
			return;
		}

		const transaction = await prisma.transaction.findFirst({
			where: {
				id: transactionId,
				isDeleted: false,
			},
		});
		if (!transaction) {
			sendError(req, res, 404, "TRANSACTION_NOT_FOUND", "Transaction not found");
			return;
		}
		if (!isTransactionParticipant(authReq.user.id, transaction)) {
			sendError(req, res, 403, "TRANSACTIONS_ADJUST_FORBIDDEN", "You cannot void this transaction");
			return;
		}
		if (transaction.status === TransactionStatus.VOIDED) {
			sendError(req, res, 409, "TRANSACTIONS_ADJUST_FORBIDDEN", "Transaction is already voided");
			return;
		}

		const voidedTransaction = await prisma.transaction.update({
			where: { id: transaction.id },
			data: {
				status: TransactionStatus.VOIDED,
				voidedAt: new Date(),
				voidReason: parsed.data.reason,
			},
		});

		const adjustment = await prisma.transactionAdjustment.create({
			data: {
				transactionId: transaction.id,
				action: TransactionAdjustmentAction.VOID,
				reason: parsed.data.reason,
				beforeSnapshot: transaction,
				afterSnapshot: voidedTransaction,
				actorUserId: authReq.user.id,
			},
		});

		sendSuccess(req, res, 201, {
			transaction: voidedTransaction,
			adjustment,
		});
	};

	return {
		createTransaction,
		getTransactionById,
		presignInvoiceUpload,
		attachInvoice,
		downloadInvoice,
		createAdjustment,
		voidTransaction,
	};
};
