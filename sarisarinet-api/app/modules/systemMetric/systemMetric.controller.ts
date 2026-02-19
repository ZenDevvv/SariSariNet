import { PrismaClient, TransactionStatus } from "../../../generated/prisma";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { sendError, sendSuccess } from "../_shared/http";
import { isObjectId } from "../_shared/object-id";

const recomputeSchema = z.object({
	userId: z.string().optional(),
	rangeStart: z.string().datetime().optional(),
	rangeEnd: z.string().datetime().optional(),
	sourceVersion: z.number().int().positive().optional(),
});

const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

export const controller = (prisma: PrismaClient) => {
	const recomputeCommerceMetrics = async (req: Request, res: Response, _next: NextFunction) => {
		const parsed = recomputeSchema.safeParse(req.body ?? {});
		if (!parsed.success) {
			sendError(req, res, 422, "TRANSACTIONS_METRICS_RECALC_FAILED", "Invalid recompute payload", [
				...parsed.error.issues.map((issue) => ({
					field: issue.path.join("."),
					issue: issue.code,
					message: issue.message,
				})),
			]);
			return;
		}

		if (!parsed.data.userId) {
			sendSuccess(req, res, 202, { queued: true });
			return;
		}

		if (!isObjectId(parsed.data.userId)) {
			sendError(req, res, 422, "TRANSACTIONS_METRICS_RECALC_FAILED", "userId must be a valid ObjectId");
			return;
		}

		const now = new Date();
		const start = parsed.data.rangeStart ? new Date(parsed.data.rangeStart) : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
		const end = parsed.data.rangeEnd ? new Date(parsed.data.rangeEnd) : now;

		const [soldTransactions, boughtTransactions, participantTransactions, invoiceCount] = await Promise.all([
			prisma.transaction.findMany({
				where: {
					sellerUserId: parsed.data.userId,
					status: TransactionStatus.POSTED,
					isDeleted: false,
					transactionDate: { gte: start, lte: end },
				},
			}),
			prisma.transaction.findMany({
				where: {
					buyerUserId: parsed.data.userId,
					status: TransactionStatus.POSTED,
					isDeleted: false,
					transactionDate: { gte: start, lte: end },
				},
			}),
			prisma.transaction.findMany({
				where: {
					status: TransactionStatus.POSTED,
					isDeleted: false,
					transactionDate: { gte: start, lte: end },
					OR: [{ sellerUserId: parsed.data.userId }, { buyerUserId: parsed.data.userId }],
				},
			}),
			prisma.transactionInvoice.count({
				where: {
					isDeleted: false,
					transaction: {
						OR: [{ sellerUserId: parsed.data.userId }, { buyerUserId: parsed.data.userId }],
						status: TransactionStatus.POSTED,
						transactionDate: { gte: start, lte: end },
					},
				},
			}),
		]);

		const revenue = sum(soldTransactions.map((item) => item.amount));
		const expense = sum(boughtTransactions.map((item) => item.amount));
		const profit = revenue - expense;
		const uniqueCustomers = new Set(soldTransactions.map((item) => item.buyerUserId)).size;
		const transactionCount = participantTransactions.length;

		const snapshot = await prisma.commerceMetricSnapshot.create({
			data: {
				userId: parsed.data.userId,
				rangeStart: start,
				rangeEnd: end,
				revenue,
				expense,
				profit,
				uniqueCustomers,
				transactionCount,
				invoiceCount,
				computedAt: now,
				sourceVersion: parsed.data.sourceVersion || 1,
			},
		});

		sendSuccess(req, res, 202, { queued: true, snapshot });
	};

	return {
		recomputeCommerceMetrics,
	};
};
