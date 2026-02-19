import {
	BorrowingAssetType,
	BorrowingAuditEventType,
	BorrowingDirection,
	BorrowingRecordStatus,
	PrismaClient,
} from "../../../generated/prisma";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { AuthenticatedRequest } from "../_shared/auth";
import { sendError, sendSuccess } from "../_shared/http";
import { isObjectId } from "../_shared/object-id";

const createBorrowingSchema = z.object({
	counterpartyUserId: z.string().min(1),
	direction: z.nativeEnum(BorrowingDirection),
	assetType: z.nativeEnum(BorrowingAssetType),
	principalAmount: z.number().positive().optional(),
	currency: z.string().min(1).optional(),
	itemDescription: z.string().min(1).optional(),
	quantity: z.number().positive().optional(),
	dueDate: z.string().datetime(),
	termsNote: z.string().max(1000).optional().nullable(),
});

const repaymentSchema = z.object({
	amount: z.number().positive(),
	paidAt: z.string().datetime(),
	note: z.string().max(1000).optional().nullable(),
});

const settlementNoteSchema = z.object({
	note: z.string().min(1).max(1000),
});

const formatZodIssues = (error: z.ZodError) => {
	return error.issues.map((issue) => ({
		field: issue.path.join("."),
		issue: issue.code,
		message: issue.message,
	}));
};

const isBorrowingParticipant = (userId: string, ownerUserId: string, counterpartyUserId: string) => {
	return userId === ownerUserId || userId === counterpartyUserId;
};

export const controller = (prisma: PrismaClient) => {
	const createRecord = async (req: Request, res: Response, _next: NextFunction) => {
		const authReq = req as AuthenticatedRequest;
		if (!authReq.user) {
			sendError(req, res, 401, "UNAUTHORIZED", "Authentication required");
			return;
		}

		const parsed = createBorrowingSchema.safeParse(req.body);
		if (!parsed.success || !isObjectId(parsed.data.counterpartyUserId)) {
			sendError(
				req,
				res,
				422,
				"BORROWING_INVALID_INPUT",
				"Invalid borrowing payload",
				parsed.success ? undefined : formatZodIssues(parsed.error),
			);
			return;
		}

		if (parsed.data.counterpartyUserId === authReq.user.id) {
			sendError(req, res, 422, "BORROWING_COUNTERPARTY_INVALID", "Counterparty cannot be yourself");
			return;
		}

		if (parsed.data.assetType === "MONEY" && (!parsed.data.principalAmount || !parsed.data.currency)) {
			sendError(
				req,
				res,
				422,
				"BORROWING_INVALID_INPUT",
				"principalAmount and currency are required for MONEY records",
			);
			return;
		}

		if (parsed.data.assetType === "ITEM" && (!parsed.data.quantity || !parsed.data.itemDescription)) {
			sendError(
				req,
				res,
				422,
				"BORROWING_INVALID_INPUT",
				"quantity and itemDescription are required for ITEM records",
			);
			return;
		}

		const remainingBalance =
			parsed.data.assetType === "MONEY"
				? parsed.data.principalAmount || 0
				: parsed.data.quantity || 0;

		const record = await prisma.borrowingRecord.create({
			data: {
				ownerUserId: authReq.user.id,
				counterpartyUserId: parsed.data.counterpartyUserId,
				direction: parsed.data.direction,
				assetType: parsed.data.assetType,
				principalAmount: parsed.data.principalAmount,
				currency: parsed.data.currency,
				itemDescription: parsed.data.itemDescription,
				quantity: parsed.data.quantity,
				dueDate: new Date(parsed.data.dueDate),
				remainingBalance,
				status: BorrowingRecordStatus.UNPAID,
				termsNote: parsed.data.termsNote,
			},
		});

		await prisma.borrowingAuditEntry.create({
			data: {
				borrowingRecordId: record.id,
				eventType: BorrowingAuditEventType.RECORD_CREATED,
				payload: {
					recordId: record.id,
					remainingBalance: record.remainingBalance,
					status: record.status,
				},
				actorUserId: authReq.user.id,
			},
		});

		sendSuccess(req, res, 201, { record });
	};

	const postRepayment = async (req: Request, res: Response, _next: NextFunction) => {
		const authReq = req as AuthenticatedRequest;
		if (!authReq.user) {
			sendError(req, res, 401, "UNAUTHORIZED", "Authentication required");
			return;
		}

		const { recordId } = req.params;
		if (!isObjectId(recordId)) {
			sendError(req, res, 400, "BORROWING_NOT_FOUND", "Invalid recordId format");
			return;
		}

		const parsed = repaymentSchema.safeParse(req.body);
		if (!parsed.success) {
			sendError(req, res, 422, "BORROWING_INVALID_INPUT", "Invalid repayment payload", formatZodIssues(parsed.error));
			return;
		}

		const record = await prisma.borrowingRecord.findFirst({
			where: {
				id: recordId,
				isDeleted: false,
			},
		});

		if (!record) {
			sendError(req, res, 404, "BORROWING_NOT_FOUND", "Borrowing record not found");
			return;
		}

		if (!isBorrowingParticipant(authReq.user.id, record.ownerUserId, record.counterpartyUserId)) {
			sendError(req, res, 403, "FORBIDDEN", "You are not a participant of this borrowing record");
			return;
		}

		if (record.status === "PAID" || record.status === "PAID_LATE") {
			sendError(req, res, 409, "BORROWING_RECORD_CLOSED", "Borrowing record is already closed");
			return;
		}

		if (parsed.data.amount > record.remainingBalance) {
			sendError(
				req,
				res,
				422,
				"BORROWING_OVERPAYMENT_INVALID",
				"Repayment amount exceeds remaining balance",
			);
			return;
		}

		const paidAt = new Date(parsed.data.paidAt);
		const remainingBalance = Number((record.remainingBalance - parsed.data.amount).toFixed(6));
		let status: BorrowingRecordStatus;
		let closedAt: Date | null = null;

		if (remainingBalance <= 0) {
			status = paidAt > record.dueDate ? BorrowingRecordStatus.PAID_LATE : BorrowingRecordStatus.PAID;
			closedAt = paidAt;
		} else {
			status = BorrowingRecordStatus.PARTIALLY_PAID;
		}

		const [repayment, updatedRecord] = await prisma.$transaction([
			prisma.repayment.create({
				data: {
					borrowingRecordId: record.id,
					amount: parsed.data.amount,
					paidAt,
					note: parsed.data.note,
					actorUserId: authReq.user.id,
				},
			}),
			prisma.borrowingRecord.update({
				where: { id: record.id },
				data: {
					remainingBalance,
					status,
					closedAt,
				},
			}),
		]);

		await prisma.borrowingAuditEntry.create({
			data: {
				borrowingRecordId: record.id,
				eventType: BorrowingAuditEventType.REPAYMENT_POSTED,
				payload: {
					repaymentId: repayment.id,
					amount: repayment.amount,
					remainingBalance: updatedRecord.remainingBalance,
					status: updatedRecord.status,
				},
				actorUserId: authReq.user.id,
			},
		});

		sendSuccess(req, res, 201, { record: updatedRecord, repayment });
	};

	const getRecord = async (req: Request, res: Response, _next: NextFunction) => {
		const authReq = req as AuthenticatedRequest;
		if (!authReq.user) {
			sendError(req, res, 401, "UNAUTHORIZED", "Authentication required");
			return;
		}

		const { recordId } = req.params;
		if (!isObjectId(recordId)) {
			sendError(req, res, 400, "BORROWING_NOT_FOUND", "Invalid recordId format");
			return;
		}

		const record = await prisma.borrowingRecord.findFirst({
			where: {
				id: recordId,
				isDeleted: false,
			},
			include: {
				repayments: {
					where: { isDeleted: false },
					orderBy: { paidAt: "asc" },
				},
				settlementNotes: {
					where: { isDeleted: false },
					orderBy: { createdAt: "desc" },
				},
			},
		});
		if (!record) {
			sendError(req, res, 404, "BORROWING_NOT_FOUND", "Borrowing record not found");
			return;
		}

		if (!isBorrowingParticipant(authReq.user.id, record.ownerUserId, record.counterpartyUserId)) {
			sendError(req, res, 403, "FORBIDDEN", "You are not a participant of this borrowing record");
			return;
		}

		sendSuccess(req, res, 200, { record, repayments: record.repayments });
	};

	const getRepayments = async (req: Request, res: Response, _next: NextFunction) => {
		const authReq = req as AuthenticatedRequest;
		if (!authReq.user) {
			sendError(req, res, 401, "UNAUTHORIZED", "Authentication required");
			return;
		}

		const { recordId } = req.params;
		if (!isObjectId(recordId)) {
			sendError(req, res, 400, "BORROWING_NOT_FOUND", "Invalid recordId format");
			return;
		}

		const record = await prisma.borrowingRecord.findFirst({
			where: {
				id: recordId,
				isDeleted: false,
			},
		});
		if (!record) {
			sendError(req, res, 404, "BORROWING_NOT_FOUND", "Borrowing record not found");
			return;
		}

		if (!isBorrowingParticipant(authReq.user.id, record.ownerUserId, record.counterpartyUserId)) {
			sendError(req, res, 403, "FORBIDDEN", "You are not a participant of this borrowing record");
			return;
		}

		const repayments = await prisma.repayment.findMany({
			where: {
				borrowingRecordId: record.id,
				isDeleted: false,
			},
			orderBy: { paidAt: "asc" },
		});

		sendSuccess(req, res, 200, { record, repayments });
	};

	const addSettlementNote = async (req: Request, res: Response, _next: NextFunction) => {
		const authReq = req as AuthenticatedRequest;
		if (!authReq.user) {
			sendError(req, res, 401, "UNAUTHORIZED", "Authentication required");
			return;
		}

		const { recordId } = req.params;
		if (!isObjectId(recordId)) {
			sendError(req, res, 400, "BORROWING_NOT_FOUND", "Invalid recordId format");
			return;
		}

		const parsed = settlementNoteSchema.safeParse(req.body);
		if (!parsed.success) {
			sendError(req, res, 422, "BORROWING_NOTE_INVALID", "Invalid settlement note payload", formatZodIssues(parsed.error));
			return;
		}

		const record = await prisma.borrowingRecord.findFirst({
			where: {
				id: recordId,
				isDeleted: false,
			},
		});
		if (!record) {
			sendError(req, res, 404, "BORROWING_NOT_FOUND", "Borrowing record not found");
			return;
		}

		if (!isBorrowingParticipant(authReq.user.id, record.ownerUserId, record.counterpartyUserId)) {
			sendError(req, res, 403, "FORBIDDEN", "You are not a participant of this borrowing record");
			return;
		}

		const noteEntry = await prisma.settlementNote.create({
			data: {
				borrowingRecordId: record.id,
				note: parsed.data.note,
				actorUserId: authReq.user.id,
			},
		});

		await prisma.borrowingAuditEntry.create({
			data: {
				borrowingRecordId: record.id,
				eventType: BorrowingAuditEventType.SETTLEMENT_NOTE_ADDED,
				payload: {
					noteId: noteEntry.id,
					note: noteEntry.note,
				},
				actorUserId: authReq.user.id,
			},
		});

		sendSuccess(req, res, 201, { noteEntry });
	};

	return {
		createRecord,
		postRepayment,
		getRecord,
		getRepayments,
		addSettlementNote,
	};
};
