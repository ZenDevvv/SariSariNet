import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
	userId: string;
}

interface JwtPayload {
	userId: string;
	sessionId?: string;
	iat?: number;
	exp?: number;
}

const getSecret = () => process.env.JWT_SECRET || "dev-secret";

const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
	const authHeader = req.header("authorization");
	const token = authHeader?.startsWith("Bearer ")
		? authHeader.slice(7).trim()
		: ((req as any).cookies?.token as string | undefined);

	if (!token) {
		res.status(401).json({ success: false, error: { code: "UNAUTHORIZED", message: "Missing access token" } });
		return;
	}

	try {
		const payload = jwt.verify(token, getSecret()) as JwtPayload;
		req.userId = payload.userId;
		next();
	} catch (_error) {
		res.status(401).json({ success: false, error: { code: "UNAUTHORIZED", message: "Invalid access token" } });
	}
};

export default verifyToken;
