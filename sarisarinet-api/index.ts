import cookieParser from "cookie-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import { PrismaClient } from "./generated/prisma";
import { authModule } from "./app/modules/auth";
import { borrowingModule } from "./app/modules/borrowing";
import { connectionModule } from "./app/modules/connection";
import { dashboardModule } from "./app/modules/dashboard";
import { notificationModule } from "./app/modules/notification";
import { organizationModule } from "./app/modules/organization";
import { productModule } from "./app/modules/product";
import { reportModule } from "./app/modules/report";
import { systemMetricModule } from "./app/modules/systemMetric";
import { transactionModule } from "./app/modules/transaction";
import { userModule } from "./app/modules/user";
import { config } from "./config/config";
import { connectAllDatabases, disconnectAllDatabases } from "./config/database";
import openApiSpecs from "./docs/openApiSpecs";
import { devSecurityMiddleware, securityMiddleware } from "./middleware/security";

const app = express();
const prisma = new PrismaClient();

app.use(process.env.NODE_ENV === "production" ? securityMiddleware : devSecurityMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
	cors({
		origin: config.cors.origins,
		credentials: config.cors.credentials,
	}),
);

app.get("/", (_req: Request, res: Response) => {
	res.status(200).json({ status: "healthy", timestamp: new Date().toISOString() });
});

app.get("/health", (_req: Request, res: Response) => {
	res.status(200).json({ status: "healthy", timestamp: new Date().toISOString(), uptime: process.uptime() });
});

if (process.env.NODE_ENV !== "production") {
	app.use(`${config.baseApiPath}/swagger`, swaggerUi.serve, swaggerUi.setup(openApiSpecs()));
}

const auth = authModule(prisma);
const user = userModule(prisma);
const connection = connectionModule(prisma);
const notification = notificationModule(prisma);
const organization = organizationModule(prisma);
const borrowing = borrowingModule(prisma);
const product = productModule(prisma);
const transaction = transactionModule(prisma);
const dashboard = dashboardModule(prisma);
const report = reportModule(prisma);
const systemMetric = systemMetricModule(prisma);

app.use(config.baseApiPath, auth);
app.use(config.baseApiPath, user);
app.use(config.baseApiPath, connection);
app.use(config.baseApiPath, notification);
app.use(config.baseApiPath, organization);
app.use(config.baseApiPath, borrowing);
app.use(config.baseApiPath, product);
app.use(config.baseApiPath, transaction);
app.use(config.baseApiPath, dashboard);
app.use(config.baseApiPath, report);
app.use(config.baseApiPath, systemMetric);

app.use((error: unknown, req: Request, res: Response, _next: NextFunction) => {
	const message = error instanceof Error ? error.message : "Internal server error";
	res.status(500).json({
		success: false,
		error: {
			code: "INTERNAL_SERVER_ERROR",
			message,
		},
		requestId: req.header("x-request-id") || "n/a",
		timestamp: new Date().toISOString(),
	});
});

const server = app.listen(config.port, async () => {
	await connectAllDatabases();
	console.log(`Server is running on port ${config.port}`);
});

const gracefulShutdown = async (signal: string) => {
	console.log(`Received ${signal}, shutting down gracefully...`);
	try {
		await prisma.$disconnect();
		await disconnectAllDatabases();
		server.close(() => process.exit(0));
	} catch (error) {
		console.error("Error during shutdown:", error);
		process.exit(1);
	}
};

process.on("SIGINT", () => {
	void gracefulShutdown("SIGINT");
});
process.on("SIGTERM", () => {
	void gracefulShutdown("SIGTERM");
});
