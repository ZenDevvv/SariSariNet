import { BorrowingDirection, BorrowingRecordStatus, PrismaClient, TransactionStatus } from "../../../generated/prisma";
import { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest } from "../_shared/auth";
import { sendError, sendSuccess } from "../_shared/http";

const parseRange = (req: Request) => {
	const now = new Date();
	const defaultStart = new Date(now);
	defaultStart.setDate(defaultStart.getDate() - 30);

	const start =
		typeof req.query.rangeStart === "string"
			? new Date(req.query.rangeStart)
			: defaultStart;
	const end =
		typeof req.query.rangeEnd === "string" ? new Date(req.query.rangeEnd) : now;

	if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || start > end) {
		return null;
	}

	return { start, end };
};

const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

export const controller = (prisma: PrismaClient) => {
	const getCommerceDashboard = async (req: Request, res: Response, _next: NextFunction) => {
		const authReq = req as AuthenticatedRequest;
		if (!authReq.user) {
			sendError(req, res, 401, "UNAUTHORIZED", "Authentication required");
			return;
		}

		const range = parseRange(req);
		if (!range) {
			sendError(req, res, 422, "TRANSACTIONS_PERIOD_INVALID", "Invalid date range filters");
			return;
		}

		const [soldTransactions, boughtTransactions, participantTransactions] = await Promise.all([
			prisma.transaction.findMany({
				where: {
					sellerUserId: authReq.user.id,
					isDeleted: false,
					status: TransactionStatus.POSTED,
					transactionDate: { gte: range.start, lte: range.end },
				},
				orderBy: { transactionDate: "asc" },
			}),
			prisma.transaction.findMany({
				where: {
					buyerUserId: authReq.user.id,
					isDeleted: false,
					status: TransactionStatus.POSTED,
					transactionDate: { gte: range.start, lte: range.end },
				},
				orderBy: { transactionDate: "asc" },
			}),
			prisma.transaction.findMany({
				where: {
					isDeleted: false,
					status: TransactionStatus.POSTED,
					transactionDate: { gte: range.start, lte: range.end },
					OR: [{ sellerUserId: authReq.user.id }, { buyerUserId: authReq.user.id }],
				},
			}),
		]);

		const revenue = sum(soldTransactions.map((item) => item.amount));
		const expense = sum(boughtTransactions.map((item) => item.amount));
		const profit = revenue - expense;
		const uniqueCustomers = new Set(soldTransactions.map((item) => item.buyerUserId)).size;
		const transactionCount = participantTransactions.length;

		const invoiceCount = await prisma.transactionInvoice.count({
			where: {
				isDeleted: false,
				transaction: {
					OR: [{ sellerUserId: authReq.user.id }, { buyerUserId: authReq.user.id }],
					status: TransactionStatus.POSTED,
					transactionDate: { gte: range.start, lte: range.end },
				},
			},
		});

		const trend = soldTransactions.map((item) => ({
			date: item.transactionDate,
			amount: item.amount,
			type: "revenue",
		}));

		sendSuccess(req, res, 200, {
			metrics: {
				rangeStart: range.start,
				rangeEnd: range.end,
				revenue,
				expense,
				profit,
				uniqueCustomers,
				transactionCount,
				invoiceCount,
			},
			trend,
		});
	};

	const getBorrowingDashboard = async (req: Request, res: Response, _next: NextFunction) => {
		const authReq = req as AuthenticatedRequest;
		if (!authReq.user) {
			sendError(req, res, 401, "UNAUTHORIZED", "Authentication required");
			return;
		}

		const range = parseRange(req);
		if (!range) {
			sendError(req, res, 422, "REPORTING_FILTER_INVALID", "Invalid date range filters");
			return;
		}

		const records = await prisma.borrowingRecord.findMany({
			where: {
				ownerUserId: authReq.user.id,
				isDeleted: false,
				createdAt: { gte: range.start, lte: range.end },
			},
			orderBy: { createdAt: "desc" },
		});

		const totalLent = sum(
			records
				.filter((item) => item.direction === BorrowingDirection.LENT)
				.map((item) => item.principalAmount ?? item.quantity ?? 0),
		);
		const totalBorrowed = sum(
			records
				.filter((item) => item.direction === BorrowingDirection.BORROWED)
				.map((item) => item.principalAmount ?? item.quantity ?? 0),
		);

		const outstandingReceivable = sum(
			records
				.filter(
					(item) =>
						item.direction === BorrowingDirection.LENT &&
						(item.status === BorrowingRecordStatus.UNPAID || item.status === BorrowingRecordStatus.PARTIALLY_PAID),
				)
				.map((item) => item.remainingBalance),
		);
		const outstandingPayable = sum(
			records
				.filter(
					(item) =>
						item.direction === BorrowingDirection.BORROWED &&
						(item.status === BorrowingRecordStatus.UNPAID || item.status === BorrowingRecordStatus.PARTIALLY_PAID),
				)
				.map((item) => item.remainingBalance),
		);

		const overdue = records.filter(
			(item) =>
				item.dueDate < new Date() &&
				(item.status === BorrowingRecordStatus.UNPAID || item.status === BorrowingRecordStatus.PARTIALLY_PAID),
		);

		sendSuccess(req, res, 200, {
			metrics: {
				rangeStart: range.start,
				rangeEnd: range.end,
				totalLent,
				totalBorrowed,
				outstandingReceivable,
				outstandingPayable,
				overdueCount: overdue.length,
			},
			overdue,
		});
	};

	return {
		getCommerceDashboard,
		getBorrowingDashboard,
	};
};
