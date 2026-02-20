import crypto from "crypto";
import { Request, Response } from "express";

export interface ErrorDetail {
	field?: string;
	issue?: string;
	value?: unknown;
	message?: string;
}

export interface ErrorEnvelope {
	success: false;
	error: {
		code: string;
		message: string;
		details?: ErrorDetail[];
	};
	requestId: string;
	timestamp: string;
}

export interface SuccessEnvelope<T> {
	success: true;
	data: T;
	meta?: Record<string, unknown>;
	requestId: string;
	timestamp: string;
}

export const getRequestId = (req: Request): string => {
	const headerRequestId = req.header("x-request-id");
	return headerRequestId || crypto.randomUUID();
};

export const sendSuccess = <T>(
	req: Request,
	res: Response,
	status: number,
	data: T,
	meta?: Record<string, unknown>,
) => {
	const payload: SuccessEnvelope<T> = {
		success: true,
		data,
		requestId: getRequestId(req),
		timestamp: new Date().toISOString(),
	};

	if (meta && Object.keys(meta).length > 0) {
		payload.meta = meta;
	}

	res.status(status).json(payload);
};

export const sendError = (
	req: Request,
	res: Response,
	status: number,
	code: string,
	message: string,
	details?: ErrorDetail[],
) => {
	const payload: ErrorEnvelope = {
		success: false,
		error: {
			code,
			message,
			...(details && details.length > 0 ? { details } : {}),
		},
		requestId: getRequestId(req),
		timestamp: new Date().toISOString(),
	};

	res.status(status).json(payload);
};
