import { expect } from "chai";
import express, { Express } from "express";
import request from "supertest";
import { PrismaClient } from "../generated/prisma";
import { authModule } from "../app/modules/auth";
import { borrowingModule } from "../app/modules/borrowing";
import { connectionModule } from "../app/modules/connection";
import { dashboardModule } from "../app/modules/dashboard";
import { notificationModule } from "../app/modules/notification";
import { organizationModule } from "../app/modules/organization";
import { productModule } from "../app/modules/product";
import { reportModule } from "../app/modules/report";
import { systemMetricModule } from "../app/modules/systemMetric";
import { transactionModule } from "../app/modules/transaction";
import { userModule } from "../app/modules/user";
import { controller as authController } from "../app/modules/auth/auth.controller";
import { controller as borrowingController } from "../app/modules/borrowing/borrowing.controller";
import { controller as connectionController } from "../app/modules/connection/connection.controller";
import { controller as dashboardController } from "../app/modules/dashboard/dashboard.controller";
import { controller as notificationController } from "../app/modules/notification/notification.controller";
import { controller as organizationController } from "../app/modules/organization/organization.controller";
import { controller as productController } from "../app/modules/product/product.controller";
import { controller as reportController } from "../app/modules/report/report.controller";
import { controller as systemMetricController } from "../app/modules/systemMetric/systemMetric.controller";
import { controller as transactionController } from "../app/modules/transaction/transaction.controller";
import { controller as userController } from "../app/modules/user/user.controller";

type Any = Record<string, any>;
type Method = "get" | "post" | "patch" | "put" | "delete";
type ModuleFactory = (prisma: PrismaClient) => express.Router;

const ID_A = "507f1f77bcf86cd799439011";
const ID_B = "507f191e810c19729de860ea";
const ID_C = "507f191e810c19729de860eb";
const FUTURE = new Date(Date.now() + 86400000).toISOString();
const PAST = new Date(Date.now() - 86400000).toISOString();

interface PrismaMock extends Any {
	__set(path: string, fn: (...args: any[]) => any): void;
	__value(path: string, value: any): void;
	__seq(path: string, values: any[]): void;
}

const createPrismaMock = (): PrismaMock => {
	const fns = new Map<string, (...args: any[]) => any>();
	const d = (name: string) => {
		if (name.endsWith(".findMany")) return [];
		if (name.endsWith(".count")) return 0;
		if (name.endsWith(".findFirst") || name.endsWith(".findUnique")) return null;
		if (name.endsWith(".createMany") || name.endsWith(".updateMany") || name.endsWith(".deleteMany")) return { count: 0 };
		if (name.endsWith(".create") || name.endsWith(".update") || name.endsWith(".upsert") || name.endsWith(".delete")) return {};
		return undefined;
	};
	const model = (n: string) =>
		new Proxy(
			{},
			{
				get: (_t, p) => async (...args: any[]) => {
					const k = `${n}.${String(p)}`;
					const fn = fns.get(k);
					return fn ? fn(...args) : d(k);
				},
			},
		);
	return new Proxy(
		{},
		{
			get: (t: Any, p: string | symbol) => {
				if (p === "__set") return (k: string, fn: (...args: any[]) => any) => fns.set(k, fn);
				if (p === "__value") return (k: string, v: any) => fns.set(k, async () => v);
				if (p === "__seq")
					return (k: string, arr: any[]) => {
						let i = 0;
						fns.set(k, async () => arr[Math.min(i++, arr.length - 1)]);
					};
				if (p === "$transaction") return async (ops: any[]) => Promise.all(ops);
				const k = String(p);
				if (!t[k]) t[k] = model(k);
				return t[k];
			},
		},
	) as PrismaMock;
};

const req = (o: Any = {}) => {
	const h = Object.fromEntries(Object.entries(o.headers || {}).map(([k, v]) => [k.toLowerCase(), String(v)]));
	const r: Any = { body: {}, params: {}, query: {}, cookies: {}, headers: h, ip: "127.0.0.1", ...o };
	r.header = r.header || ((n: string) => r.headers[n.toLowerCase()]);
	r.get = r.get || ((n: string) => r.header(n));
	return r;
};

const res = () => {
	const r: Any = { statusCode: 200, body: null };
	r.status = (c: number) => ((r.statusCode = c), r);
	r.json = (b: any) => ((r.body = b), r);
	r.set = () => r;
	return r;
};

const call = async (h: (...args: any[]) => any, ro: Any = {}) => {
	const rq = req(ro);
	const rs = res();
	await h(rq, rs, () => undefined);
	return rs;
};

const err = (body: Any, code?: string) => {
	expect(body.success).to.equal(false);
	expect(body.error.message).to.be.a("string");
	expect(body.requestId).to.be.a("string");
	expect(body.timestamp).to.be.a("string");
	if (code) expect(body.error.code).to.equal(code);
};

const ok = (body: Any) => {
	expect(body.success).to.equal(true);
	expect(body.data).to.exist;
	expect(body.requestId).to.be.a("string");
	expect(body.timestamp).to.be.a("string");
};

const app = (mod: ModuleFactory, prisma: PrismaMock): Express => {
	const a = express();
	a.use(express.json());
	a.use("/api", mod(prisma as unknown as PrismaClient));
	return a;
};

const hit = (a: Express, m: Method, p: string) => {
	if (m === "get") return request(a).get(p);
	if (m === "delete") return request(a).delete(p);
	if (m === "post") return request(a).post(p).send({});
	if (m === "patch") return request(a).patch(p).send({});
	return request(a).put(p).send({});
};

const unauthorized = async (a: Express, m: Method, p: string) => {
	const r = await hit(a, m, p);
	expect(r.status).to.equal(401);
	err(r.body, "UNAUTHORIZED");
};

describe("Phase 5 Backend Testing - all", () => {
	before(() => {
		process.env.JWT_SECRET = "dev-secret";
		process.env.SYSTEM_TOKEN = "system-token";
	});

	describe("Unit: Controller method contracts", () => {
		it("auth methods enforce validation and behavior codes", async () => {
			const p = createPrismaMock();
			const c = authController(p as unknown as PrismaClient);
			let r = await call(c.register, { body: { email: "bad" } });
			expect(r.statusCode).to.equal(422);
			err(r.body, "IDENTITY_INVALID_INPUT");
			p.__value("user.findUnique", null);
			r = await call(c.login, { body: { email: "x@y.com", password: "password123" } });
			expect(r.statusCode).to.equal(401);
			err(r.body, "IDENTITY_AUTH_FAILED");
			r = await call(c.requestRecovery, { body: {} });
			expect(r.statusCode).to.equal(422);
			err(r.body, "IDENTITY_INVALID_INPUT");
			p.__value("accountRecoveryToken.findFirst", null);
			r = await call(c.confirmRecovery, { body: { token: "abc", newPassword: "password123" } });
			expect(r.statusCode).to.equal(422);
			err(r.body, "IDENTITY_RECOVERY_EXPIRED");
		});

		it("auth register accepts valid payload", async () => {
			const p = createPrismaMock();
			p.__value("user.findUnique", null);
			p.__value("user.create", {
				id: ID_A,
				email: "new@mail.test",
				passwordHash: "x",
				displayName: "New",
				storefrontName: null,
				bio: null,
				avatarUrl: null,
				accountStatus: "ACTIVE",
				activeOrganizationId: null,
				createdAt: new Date(),
				updatedAt: new Date(),
			});
			p.__value("authSession.create", { id: ID_B });
			const c = authController(p as unknown as PrismaClient);
			const r = await call(c.register, { body: { email: "new@mail.test", password: "password123", displayName: "New" } });
			expect(r.statusCode).to.equal(201);
			ok(r.body);
		});

		it("user controller methods expose contract outcomes", async () => {
			const p = createPrismaMock();
			const c = userController(p as unknown as PrismaClient) as Any;
			for (const m of ["getMe", "updateMyProfile", "deactivateMe", "getMyOrganizations", "setActiveOrganization", "updateSuggestionLayout"]) {
				const r = await call(c[m], {});
				expect(r.statusCode).to.equal(401);
				err(r.body, "UNAUTHORIZED");
			}
			let r = await call(c.getUserListings, { params: { userId: "bad" } });
			expect(r.statusCode).to.equal(400);
			err(r.body, "MARKETPLACE_PROFILE_NOT_FOUND");
			p.__value("user.update", {
				id: ID_A,
				email: "u@mail.test",
				displayName: "Updated",
				storefrontName: null,
				bio: null,
				avatarUrl: null,
				accountStatus: "ACTIVE",
				activeOrganizationId: null,
				createdAt: new Date(),
				updatedAt: new Date(),
			});
			r = await call(c.updateMyProfile, { user: { id: ID_A, email: "u@mail.test" }, body: { displayName: "Updated" } });
			expect(r.statusCode).to.equal(200);
			ok(r.body);
			r = await call(c.updateMyProfile, { user: { id: ID_A }, body: {} });
			expect(r.statusCode).to.equal(400);
			err(r.body, "IDENTITY_PROFILE_INVALID");
			r = await call(c.updateMyProfile, { user: { id: ID_A }, body: { bio: 123 } });
			expect(r.statusCode).to.equal(422);
			err(r.body, "IDENTITY_PROFILE_INVALID");
			r = await call(c.deactivateMe, { user: { id: ID_A }, body: { confirmationText: "WRONG" } });
			expect(r.statusCode).to.equal(422);
			err(r.body, "IDENTITY_DEACTIVATION_NOT_CONFIRMED");
		});

		it("connection controller covers auth, zod boundaries, and duplicate edge", async () => {
			const p = createPrismaMock();
			const c = connectionController(p as unknown as PrismaClient) as Any;
			for (const m of ["sendRequest", "updateRequestStatus", "removeConnection", "getIncomingRequests", "getOutgoingRequests", "getConnections"]) {
				const r = await call(c[m], {});
				expect(r.statusCode).to.equal(401);
				err(r.body, "UNAUTHORIZED");
			}
			let r = await call(c.sendRequest, { user: { id: ID_A }, body: {} });
			expect(r.statusCode).to.equal(422);
			err(r.body, "CONNECTIONS_DUPLICATE_REQUEST");
			r = await call(c.sendRequest, { user: { id: ID_A }, body: { receiverUserId: 5 } });
			expect(r.statusCode).to.equal(422);
			err(r.body, "CONNECTIONS_DUPLICATE_REQUEST");
			p.__value("user.findFirst", { id: ID_B, isDeleted: false });
			p.__value("connectionRequest.findFirst", { id: ID_C, status: "PENDING" });
			p.__value("connection.findFirst", null);
			r = await call(c.sendRequest, { user: { id: ID_A }, body: { receiverUserId: ID_B } });
			expect(r.statusCode).to.equal(409);
			err(r.body, "CONNECTIONS_DUPLICATE_REQUEST");
		});

		it("notification controller covers auth and invalid id edge", async () => {
			const p = createPrismaMock();
			const c = notificationController(p as unknown as PrismaClient) as Any;
			let r = await call(c.getConnectionNotifications, {});
			expect(r.statusCode).to.equal(401);
			err(r.body, "UNAUTHORIZED");
			r = await call(c.markAsRead, {});
			expect(r.statusCode).to.equal(401);
			err(r.body, "UNAUTHORIZED");
			r = await call(c.markAsRead, { user: { id: ID_A }, params: { notificationId: "bad" } });
			expect(r.statusCode).to.equal(400);
			err(r.body, "CONNECTIONS_NOTIFICATION_FAILED");
		});

		it("organization controller covers auth, zod boundaries, and last-admin edge", async () => {
			const p = createPrismaMock();
			const c = organizationController(p as unknown as PrismaClient) as Any;
			for (const m of ["createOrganization", "getOrganizations", "inviteUser", "createJoinRequest", "updateJoinRequestStatus", "updateInviteStatus", "getMemberships", "updateMembershipRole", "removeMembership"]) {
				const r = await call(c[m], {});
				expect(r.statusCode).to.equal(401);
				err(r.body, "UNAUTHORIZED");
			}
			let r = await call(c.createOrganization, { user: { id: ID_A }, body: { slug: "org-only" } });
			expect(r.statusCode).to.equal(422);
			err(r.body, "ORGS_NAME_INVALID");
			r = await call(c.createOrganization, { user: { id: ID_A }, body: { name: 9, slug: "org" } });
			expect(r.statusCode).to.equal(422);
			err(r.body, "ORGS_NAME_INVALID");
			p.__value("organization.create", { id: ID_B, name: "Org", slug: "org", ownerUserId: ID_A });
			p.__value("organizationMembership.create", { id: ID_C });
			r = await call(c.createOrganization, { user: { id: ID_A }, body: { name: "Org", slug: "org" } });
			expect(r.statusCode).to.equal(201);
			ok(r.body);
			p.__value("organization.findFirst", { id: ID_B, ownerUserId: ID_A, isDeleted: false });
			p.__set("organizationMembership.findFirst", async (a: Any) => (a?.where?.id === ID_C ? { id: ID_C, role: "ADMIN", status: "ACTIVE", organizationId: ID_B } : null));
			p.__value("organizationMembership.count", 1);
			r = await call(c.updateMembershipRole, { user: { id: ID_A }, params: { orgId: ID_B, membershipId: ID_C }, body: { role: "MEMBER" } });
			expect(r.statusCode).to.equal(409);
			err(r.body, "ORGS_LAST_ADMIN_PROTECTED");
		});

		it("borrowing controller covers auth, zod boundaries, and overpayment edge", async () => {
			const p = createPrismaMock();
			const c = borrowingController(p as unknown as PrismaClient) as Any;
			for (const m of ["createRecord", "postRepayment", "getRecord", "getRepayments", "addSettlementNote"]) {
				const r = await call(c[m], {});
				expect(r.statusCode).to.equal(401);
				err(r.body, "UNAUTHORIZED");
			}
			let r = await call(c.createRecord, { user: { id: ID_A }, body: { direction: "BORROWED" } });
			expect(r.statusCode).to.equal(422);
			err(r.body, "BORROWING_INVALID_INPUT");
			r = await call(c.createRecord, {
				user: { id: ID_A },
				body: { counterpartyUserId: ID_B, direction: "BORROWED", assetType: "ITEM", quantity: "10", itemDescription: "Rice", dueDate: FUTURE },
			});
			expect(r.statusCode).to.equal(422);
			err(r.body, "BORROWING_INVALID_INPUT");
			p.__value("borrowingRecord.create", { id: ID_C, ownerUserId: ID_A, counterpartyUserId: ID_B, assetType: "MONEY", principalAmount: 100, currency: "PHP", remainingBalance: 100, status: "UNPAID", dueDate: new Date(FUTURE) });
			p.__value("borrowingAuditEntry.create", { id: "audit" });
			r = await call(c.createRecord, { user: { id: ID_A }, body: { counterpartyUserId: ID_B, direction: "BORROWED", assetType: "MONEY", principalAmount: 100, currency: "PHP", dueDate: FUTURE } });
			expect(r.statusCode).to.equal(201);
			ok(r.body);
			p.__value("borrowingRecord.findFirst", { id: ID_C, ownerUserId: ID_A, counterpartyUserId: ID_B, remainingBalance: 100, status: "UNPAID", dueDate: new Date(FUTURE) });
			r = await call(c.postRepayment, { user: { id: ID_A }, params: { recordId: ID_C }, body: { amount: 200, paidAt: FUTURE } });
			expect(r.statusCode).to.equal(422);
			err(r.body, "BORROWING_OVERPAYMENT_INVALID");
		});

		it("product controller covers auth, public behavior, zod boundaries, and private-forbidden edge", async () => {
			const p = createPrismaMock();
			const c = productController(p as unknown as PrismaClient) as Any;
			for (const m of ["createProduct", "updateProduct", "archiveProduct", "unarchiveProduct", "updateInventory", "getSuggestionFeed"]) {
				const r = await call(c[m], {});
				expect(r.statusCode).to.equal(401);
				err(r.body, "UNAUTHORIZED");
			}
			let r = await call(c.createProduct, { user: { id: ID_A }, body: { category: "Household" } });
			expect(r.statusCode).to.equal(422);
			err(r.body, "MARKETPLACE_PRODUCT_INVALID");
			r = await call(c.createProduct, { user: { id: ID_A }, body: { title: "Soap", category: "Household", price: "30", currency: "PHP", quantityAvailable: 1 } });
			expect(r.statusCode).to.equal(422);
			err(r.body, "MARKETPLACE_PRODUCT_INVALID");
			p.__value("productListing.create", { id: ID_C, sellerUserId: ID_A, title: "Soap", category: "Household", price: 30, currency: "PHP", quantityAvailable: 1, visibility: "PUBLIC", status: "ACTIVE", imageUrls: [] });
			p.__value("listingLifecycleEvent.create", { id: "l1" });
			r = await call(c.createProduct, { user: { id: ID_A }, body: { title: "Soap", category: "Household", price: 30, currency: "PHP", quantityAvailable: 1 } });
			expect(r.statusCode).to.equal(201);
			ok(r.body);
			p.__value("productListing.findFirst", { id: ID_C, sellerUserId: ID_B, visibility: "PRIVATE", isDeleted: false });
			r = await call(c.getProductById, { params: { productId: ID_C } });
			expect(r.statusCode).to.equal(403);
			err(r.body, "MARKETPLACE_PRIVATE_FORBIDDEN");
			p.__value("productListing.findMany", []);
			p.__value("productListing.count", 0);
			r = await call(c.getMarketplace, {});
			expect(r.statusCode).to.equal(200);
			ok(r.body);
			r = await call(c.searchMarketplace, { query: {} });
			expect(r.statusCode).to.equal(422);
			err(r.body, "MARKETPLACE_SEARCH_INVALID");
		});

		it("transaction controller covers auth, zod boundaries, and invoice edge", async () => {
			const p = createPrismaMock();
			const c = transactionController(p as unknown as PrismaClient) as Any;
			for (const m of ["createTransaction", "getTransactionById", "presignInvoiceUpload", "attachInvoice", "downloadInvoice", "createAdjustment", "voidTransaction"]) {
				const r = await call(c[m], {});
				expect(r.statusCode).to.equal(401);
				err(r.body, "UNAUTHORIZED");
			}
			let r = await call(c.createTransaction, { user: { id: ID_A }, body: { sellerUserId: ID_A, amount: 250, currency: "PHP", transactionDate: FUTURE } });
			expect(r.statusCode).to.equal(422);
			err(r.body, "TRANSACTIONS_PARTICIPANT_REQUIRED");
			r = await call(c.createTransaction, { user: { id: ID_A }, body: { sellerUserId: ID_A, buyerUserId: ID_B, amount: "bad", currency: "PHP", transactionDate: FUTURE } });
			expect(r.statusCode).to.equal(422);
			err(r.body, "TRANSACTIONS_PARTICIPANT_REQUIRED");
			p.__value("transaction.create", { id: ID_C, sellerUserId: ID_A, buyerUserId: ID_B, recordedByUserId: ID_A, amount: 250, currency: "PHP", status: "POSTED", invoiceStatus: "NONE", transactionDate: new Date(FUTURE) });
			r = await call(c.createTransaction, { user: { id: ID_A }, body: { sellerUserId: ID_A, buyerUserId: ID_B, amount: 250, currency: "PHP", transactionDate: FUTURE } });
			expect(r.statusCode).to.equal(201);
			ok(r.body);
			r = await call(c.presignInvoiceUpload, { user: { id: ID_A }, params: { transactionId: ID_C }, body: { mimeType: "image/png", size: 11 * 1024 * 1024, sha256: "a".repeat(64) } });
			expect(r.statusCode).to.equal(422);
			err(r.body, "TRANSACTIONS_INVOICE_FILE_INVALID");
		});

		it("dashboard controller covers auth and invalid range edges", async () => {
			const p = createPrismaMock();
			const c = dashboardController(p as unknown as PrismaClient) as Any;
			let r = await call(c.getCommerceDashboard, {});
			expect(r.statusCode).to.equal(401);
			err(r.body, "UNAUTHORIZED");
			r = await call(c.getBorrowingDashboard, {});
			expect(r.statusCode).to.equal(401);
			err(r.body, "UNAUTHORIZED");
			r = await call(c.getCommerceDashboard, { user: { id: ID_A }, query: { rangeStart: FUTURE, rangeEnd: PAST } });
			expect(r.statusCode).to.equal(422);
			err(r.body, "TRANSACTIONS_PERIOD_INVALID");
			r = await call(c.getBorrowingDashboard, { user: { id: ID_A }, query: { rangeStart: FUTURE, rangeEnd: PAST } });
			expect(r.statusCode).to.equal(422);
			err(r.body, "REPORTING_FILTER_INVALID");
		});

		it("report controller covers auth, zod boundaries, and expired-export edge", async () => {
			const p = createPrismaMock();
			const c = reportController(p as unknown as PrismaClient) as Any;
			for (const m of ["getPresets", "createPreset", "updatePreset", "deletePreset", "createExportJob", "getExportJob", "downloadExport"]) {
				const r = await call(c[m], {});
				expect(r.statusCode).to.equal(401);
				err(r.body, "UNAUTHORIZED");
			}
			let r = await call(c.createPreset, { user: { id: ID_A }, body: { module: "COMMERCE", filters: {} } });
			expect(r.statusCode).to.equal(422);
			err(r.body, "REPORTING_PRESET_INVALID");
			r = await call(c.createPreset, { user: { id: ID_A }, body: { name: "Preset", module: "COMMERCE", filters: {}, isDefault: "true" } });
			expect(r.statusCode).to.equal(422);
			err(r.body, "REPORTING_PRESET_INVALID");
			p.__value("reportViewPreset.create", { id: ID_C, userId: ID_A, name: "Preset", module: "COMMERCE", filters: {}, isDefault: false });
			r = await call(c.createPreset, { user: { id: ID_A }, body: { name: "Preset", module: "COMMERCE", filters: {} } });
			expect(r.statusCode).to.equal(201);
			ok(r.body);
			p.__value("reportExportJob.findFirst", { id: ID_C, userId: ID_A, status: "READY", storageKey: "x", expiresAt: new Date(PAST) });
			r = await call(c.downloadExport, { user: { id: ID_A }, params: { jobId: ID_C } });
			expect(r.statusCode).to.equal(410);
			err(r.body, "REPORTING_EXPORT_FAILED");
		});

		it("systemMetric controller covers zod boundaries and recompute behavior", async () => {
			const p = createPrismaMock();
			const c = systemMetricController(p as unknown as PrismaClient);
			let r = await call(c.recomputeCommerceMetrics, { body: { sourceVersion: "bad" } });
			expect(r.statusCode).to.equal(422);
			err(r.body, "TRANSACTIONS_METRICS_RECALC_FAILED");
			r = await call(c.recomputeCommerceMetrics, { body: {} });
			expect(r.statusCode).to.equal(202);
			ok(r.body);
			r = await call(c.recomputeCommerceMetrics, { body: { userId: "bad" } });
			expect(r.statusCode).to.equal(422);
			err(r.body, "TRANSACTIONS_METRICS_RECALC_FAILED");
			p.__seq("transaction.findMany", [[{ amount: 300, buyerUserId: ID_B }], [{ amount: 100 }], [{ amount: 300 }, { amount: 100 }]]);
			p.__value("transactionInvoice.count", 1);
			p.__value("commerceMetricSnapshot.create", { id: ID_C, userId: ID_A, revenue: 300, expense: 100, profit: 200, uniqueCustomers: 1, transactionCount: 2, invoiceCount: 1 });
			r = await call(c.recomputeCommerceMetrics, { body: { userId: ID_A, sourceVersion: 2 } });
			expect(r.statusCode).to.equal(202);
			ok(r.body);
		});
	});

	describe("Integration: Route map + auth outcomes via real HTTP", () => {
		it("auth public routes validate payloads", async () => {
			const p = createPrismaMock();
			const a = app(authModule, p);
			let r = await request(a).post("/api/auth/register").send({ email: "bad" });
			expect(r.status).to.equal(422);
			err(r.body, "IDENTITY_INVALID_INPUT");
			r = await request(a).post("/api/auth/login").send({});
			expect(r.status).to.equal(422);
			err(r.body, "IDENTITY_INVALID_INPUT");
			r = await request(a).post("/api/auth/recovery/request").send({});
			expect(r.status).to.equal(422);
			err(r.body, "IDENTITY_INVALID_INPUT");
			r = await request(a).post("/api/auth/recovery/confirm").send({});
			expect(r.status).to.equal(422);
			err(r.body, "IDENTITY_INVALID_INPUT");
		});

		it("user routes enforce auth and listing path validation", async () => {
			const p = createPrismaMock();
			const a = app(userModule, p);
			for (const [m, path] of [
				["get", "/api/user/me"],
				["patch", "/api/user/me/profile"],
				["post", "/api/user/me/deactivate"],
				["get", "/api/user/me/organization"],
				["put", "/api/user/me/active-organization"],
				["put", "/api/user/me/suggestion-layout"],
			] as Array<[Method, string]>) {
				await unauthorized(a, m, path);
			}
			const r = await request(a).get("/api/user/not-an-id/listing");
			expect(r.status).to.equal(400);
			err(r.body, "MARKETPLACE_PROFILE_NOT_FOUND");
		});

		it("connection routes enforce auth on all endpoints", async () => {
			const p = createPrismaMock();
			const a = app(connectionModule, p);
			for (const [m, path] of [
				["post", "/api/connection/request"],
				["patch", `/api/connection/request/${ID_B}/status`],
				["delete", `/api/connection/${ID_B}`],
				["get", "/api/connection/request/incoming"],
				["get", "/api/connection/request/outgoing"],
				["get", "/api/connection"],
			] as Array<[Method, string]>) {
				await unauthorized(a, m, path);
			}
		});

		it("notification routes enforce auth on list/read", async () => {
			const p = createPrismaMock();
			const a = app(notificationModule, p);
			await unauthorized(a, "get", "/api/notification/connection");
			await unauthorized(a, "patch", `/api/notification/${ID_B}/read`);
		});

		it("organization routes enforce auth on full membership lifecycle", async () => {
			const p = createPrismaMock();
			const a = app(organizationModule, p);
			for (const [m, path] of [
				["post", "/api/organization"],
				["get", "/api/organization"],
				["post", `/api/organization/${ID_B}/invite`],
				["post", `/api/organization/${ID_B}/join-request`],
				["patch", `/api/organization/${ID_B}/join-request/${ID_C}/status`],
				["patch", `/api/organization/${ID_B}/invite/${ID_C}/status`],
				["get", `/api/organization/${ID_B}/membership`],
				["patch", `/api/organization/${ID_B}/membership/${ID_C}/role`],
				["delete", `/api/organization/${ID_B}/membership/${ID_C}`],
			] as Array<[Method, string]>) {
				await unauthorized(a, m, path);
			}
		});

		it("borrowing routes enforce auth on create, repayment, read, and notes", async () => {
			const p = createPrismaMock();
			const a = app(borrowingModule, p);
			for (const [m, path] of [
				["post", "/api/borrowing"],
				["post", `/api/borrowing/${ID_B}/repayment`],
				["get", `/api/borrowing/${ID_B}`],
				["get", `/api/borrowing/${ID_B}/repayment`],
				["post", `/api/borrowing/${ID_B}/settlement-note`],
			] as Array<[Method, string]>) {
				await unauthorized(a, m, path);
			}
		});

		it("product routes enforce auth for protected routes and validate public behavior", async () => {
			const p = createPrismaMock();
			const a = app(productModule, p);
			for (const [m, path] of [
				["post", "/api/product"],
				["patch", `/api/product/${ID_B}`],
				["patch", `/api/product/${ID_B}/archive`],
				["patch", `/api/product/${ID_B}/unarchive`],
				["patch", `/api/product/${ID_B}/inventory`],
				["get", "/api/suggestion"],
			] as Array<[Method, string]>) {
				await unauthorized(a, m, path);
			}
			let r = await request(a).get("/api/product/not-an-id");
			expect(r.status).to.equal(400);
			err(r.body, "MARKETPLACE_NOT_FOUND");
			p.__value("productListing.findMany", []);
			p.__value("productListing.count", 0);
			r = await request(a).get("/api/marketplace");
			expect(r.status).to.equal(200);
			ok(r.body);
			r = await request(a).get("/api/search");
			expect(r.status).to.equal(422);
			err(r.body, "MARKETPLACE_SEARCH_INVALID");
		});

		it("transaction routes enforce auth for all transaction/invoice/adjustment endpoints", async () => {
			const p = createPrismaMock();
			const a = app(transactionModule, p);
			for (const [m, path] of [
				["post", "/api/transaction"],
				["get", `/api/transaction/${ID_B}`],
				["post", `/api/transaction/${ID_B}/invoice/presign`],
				["post", `/api/transaction/${ID_B}/invoice/attach`],
				["get", `/api/transaction/${ID_B}/invoice/download`],
				["post", `/api/transaction/${ID_B}/adjustment`],
				["post", `/api/transaction/${ID_B}/void`],
			] as Array<[Method, string]>) {
				await unauthorized(a, m, path);
			}
		});

		it("dashboard routes enforce auth for commerce and borrowing metrics", async () => {
			const p = createPrismaMock();
			const a = app(dashboardModule, p);
			await unauthorized(a, "get", "/api/dashboard/commerce");
			await unauthorized(a, "get", "/api/dashboard/borrowing");
		});

		it("report routes enforce auth for presets and exports", async () => {
			const p = createPrismaMock();
			const a = app(reportModule, p);
			for (const [m, path] of [
				["get", "/api/report/preset"],
				["post", "/api/report/preset"],
				["patch", `/api/report/preset/${ID_B}`],
				["delete", `/api/report/preset/${ID_B}`],
				["post", "/api/report/export"],
				["get", `/api/report/export/${ID_B}`],
				["get", `/api/report/export/${ID_B}/download`],
			] as Array<[Method, string]>) {
				await unauthorized(a, m, path);
			}
		});

		it("system metric route enforces system token and payload validation", async () => {
			const p = createPrismaMock();
			const a = app(systemMetricModule, p);
			let r = await request(a).post("/api/system/metric/commerce/recompute").send({});
			expect(r.status).to.equal(403);
			err(r.body, "FORBIDDEN");
			r = await request(a).post("/api/system/metric/commerce/recompute").set("x-system-token", "system-token").send({ sourceVersion: "bad" });
			expect(r.status).to.equal(422);
			err(r.body, "TRANSACTIONS_METRICS_RECALC_FAILED");
		});
	});
});
