import * as crypto from "crypto";
import * as argon2 from "argon2";
import { Prisma, PrismaClient } from "../generated/prisma";
import { ObjectId } from "mongodb";

const prisma = new PrismaClient();

type SeedEnvironment = "dev" | "staging" | "test";

type SeedProfile = {
	baseCount: number;
	organizationCount: number;
	repaymentCount: number;
	description: string;
};

const SEED_PROFILES: Record<SeedEnvironment, SeedProfile> = {
	dev: {
		baseCount: 8,
		organizationCount: 6,
		repaymentCount: 7,
		description: "Small dataset with realistic edge cases",
	},
	staging: {
		baseCount: 60,
		organizationCount: 58,
		repaymentCount: 59,
		description: "Medium dataset simulating real usage",
	},
	test: {
		baseCount: 3,
		organizationCount: 2,
		repaymentCount: 2,
		description: "Minimal dataset for fast test runs",
	},
};

type SeedData = {
	users: Prisma.UserCreateManyInput[];
	authSessions: Prisma.AuthSessionCreateManyInput[];
	accountRecoveryTokens: Prisma.AccountRecoveryTokenCreateManyInput[];
	accountStatusEvents: Prisma.AccountStatusEventCreateManyInput[];
	connections: Prisma.ConnectionCreateManyInput[];
	connectionRequests: Prisma.ConnectionRequestCreateManyInput[];
	connectionNotifications: Prisma.ConnectionNotificationCreateManyInput[];
	organizations: Prisma.OrganizationCreateManyInput[];
	organizationMemberships: Prisma.OrganizationMembershipCreateManyInput[];
	organizationInvites: Prisma.OrganizationInviteCreateManyInput[];
	organizationJoinRequests: Prisma.OrganizationJoinRequestCreateManyInput[];
	suggestionLayoutPreferences: Prisma.SuggestionLayoutPreferenceCreateManyInput[];
	productListings: Prisma.ProductListingCreateManyInput[];
	listingLifecycleEvents: Prisma.ListingLifecycleEventCreateManyInput[];
	transactions: Prisma.TransactionCreateManyInput[];
	transactionInvoices: Prisma.TransactionInvoiceCreateManyInput[];
	transactionAdjustments: Prisma.TransactionAdjustmentCreateManyInput[];
	borrowingRecords: Prisma.BorrowingRecordCreateManyInput[];
	repayments: Prisma.RepaymentCreateManyInput[];
	settlementNotes: Prisma.SettlementNoteCreateManyInput[];
	borrowingAuditEntries: Prisma.BorrowingAuditEntryCreateManyInput[];
	commerceMetricSnapshots: Prisma.CommerceMetricSnapshotCreateManyInput[];
	borrowingMetricSnapshots: Prisma.BorrowingMetricSnapshotCreateManyInput[];
	reportViewPresets: Prisma.ReportViewPresetCreateManyInput[];
	reportExportJobs: Prisma.ReportExportJobCreateManyInput[];
};

const asJson = (value: unknown): Prisma.InputJsonValue => value as Prisma.InputJsonValue;
const makeId = (): string => new ObjectId().toHexString();
const hashValue = (value: string): string =>
	crypto.createHash("sha256").update(value).digest("hex");

const day = (offset: number): Date => {
	const value = new Date();
	value.setHours(10, 0, 0, 0);
	value.setDate(value.getDate() + offset);
	return value;
};

const minutesAfter = (date: Date, minutes: number): Date => {
	return new Date(date.getTime() + minutes * 60 * 1000);
};

const padText = (seed: string, length: number): string => {
	if (seed.length >= length) return seed.slice(0, length);
	return `${seed}${" ".repeat(length - seed.length)}`;
};

const parseSeedEnvironment = (value: string | undefined): SeedEnvironment | null => {
	if (!value) return null;
	const normalized = value.toLowerCase();
	if (normalized === "dev" || normalized === "development") return "dev";
	if (normalized === "staging" || normalized === "production") return "staging";
	if (normalized === "test" || normalized === "ci") return "test";
	return null;
};

const resolveSeedEnvironment = (): SeedEnvironment =>
	parseSeedEnvironment(process.env.SEED_ENV) ||
	parseSeedEnvironment(process.env.NODE_ENV) ||
	"dev";

const firstNames = [
	"Ana",
	"Mateo",
	"Liza",
	"Rafael",
	"Camille",
	"Noel",
	"Bianca",
	"Tomas",
	"Nina",
	"Jasper",
	"Elena",
	"Marco",
];
const lastNames = [
	"Santos",
	"Cruz",
	"Reyes",
	"Torres",
	"Villanueva",
	"Dela Rosa",
	"Mendoza",
	"Lopez",
	"Navarro",
	"Bautista",
	"Garcia",
	"Fernandez",
];
const productWords = [
	"Rice",
	"Coffee",
	"Noodles",
	"Sardines",
	"Detergent",
	"Sugar",
	"Vinegar",
	"Cooking Oil",
	"Soap",
	"Canned Tuna",
];
const categories = [
	"Grocery",
	"Snacks",
	"Household",
	"Beverages",
	"Personal Care",
	"Kitchen Essentials",
];
const organizationNames = [
	"Barangay North Cooperative",
	"Market Vendors Circle",
	"Sari-Sari Growth Guild",
	"Community Retail Network",
	"Lakeside Sellers Union",
	"Metro Neighborhood Traders",
];
const invoiceScanCycle = ["CLEAN", "PENDING", "FAILED", "INFECTED"] as const;
const invoiceStatusFromScan = (scan: (typeof invoiceScanCycle)[number]) => {
	if (scan === "CLEAN") return "READY";
	if (scan === "PENDING") return "PENDING_SCAN";
	return "REJECTED";
};

const buildSeedData = async (
	environment: SeedEnvironment,
	profile: SeedProfile,
): Promise<SeedData> => {
	const passwordHash = await argon2.hash("Password123!");
	const userIds = Array.from({ length: profile.baseCount }, () => makeId());
	const deactivatedUserId = userIds[userIds.length - 1];

	const users: Prisma.UserCreateManyInput[] = userIds.map((id, index) => {
		const firstName = firstNames[index % firstNames.length];
		const lastName = lastNames[(index * 3) % lastNames.length];
		const normalizedName = `${firstName}.${lastName}`.toLowerCase().replace(/\s+/g, ".");
		return {
			id,
			email: `${normalizedName}${index + 1}@sarisarinet.ph`,
			passwordHash,
			displayName: `${firstName} ${lastName}`,
			storefrontName: index % 5 === 0 ? null : `${firstName}'s Neighborhood Store`,
			bio:
				index === 0
					? padText(
							"Focused on fair pricing, neighborhood delivery, and transparent records for repeat buyers.",
							500,
					  )
					: index % 4 === 0
						? null
						: `${firstName} manages a local sari-sari inventory with weekly restocking and customer tracking.`,
			avatarUrl:
				index % 3 === 0
					? null
					: `https://cdn.sarisarinet.local/avatar/${environment}/${index + 1}.jpg`,
			accountStatus: id === deactivatedUserId ? "DEACTIVATED" : "ACTIVE",
			activeOrganizationId: null,
		};
	});

	const organizationIds = Array.from({ length: profile.organizationCount }, () => makeId());
	const organizations: Prisma.OrganizationCreateManyInput[] = organizationIds.map((id, index) => ({
		id,
		name: `${organizationNames[index % organizationNames.length]} ${index + 1}`,
		slug: `org-${environment}-${index + 1}`,
		description:
			index % 4 === 0
				? null
				: `Community organization ${index + 1} supporting local sellers.`,
		ownerUserId: userIds[index % userIds.length],
		status: index % 9 === 0 ? "ARCHIVED" : "ACTIVE",
	}));

	users.forEach((user, index) => {
		if (user.id === deactivatedUserId || index % 4 === 0) return;
		user.activeOrganizationId = organizationIds[index % organizationIds.length];
	});

	const authSessions: Prisma.AuthSessionCreateManyInput[] = users.map((user, index) => ({
		id: makeId(),
		userId: user.id as string,
		refreshTokenHash: hashValue(`session-${environment}-${index}-${user.email}`),
		deviceInfo: asJson({
			userAgent: index % 2 === 0 ? "Mozilla/5.0 (Windows)" : "Mozilla/5.0 (Android)",
			ip: `10.0.${index % 10}.${index + 10}`,
		}),
		expiresAt: day(20 + (index % 12)),
		revokedAt: user.id === deactivatedUserId ? day(-2) : null,
	}));

	const accountRecoveryTokens: Prisma.AccountRecoveryTokenCreateManyInput[] = users.map(
		(user, index) => ({
			id: makeId(),
			userId: user.id as string,
			tokenHash: hashValue(`recovery-${environment}-${index}-${user.email}`),
			expiresAt: index % 5 === 0 ? day(-1) : day(2 + (index % 4)),
			consumedAt: index % 6 === 0 ? day(-2) : null,
			attemptCount: index % 3,
		}),
	);

	const accountStatusEvents: Prisma.AccountStatusEventCreateManyInput[] = users.map(
		(user, index) => ({
			id: makeId(),
			userId: user.id as string,
			fromStatus: "ACTIVE",
			toStatus: user.id === deactivatedUserId ? "DEACTIVATED" : "ACTIVE",
			reason:
				user.id === deactivatedUserId
					? "User requested account deactivation"
					: "Periodic account status verification",
			actorUserId: index % 2 === 0 ? (user.id as string) : userIds[0],
		}),
	);

	const allPairs: Array<[string, string]> = [];
	for (let first = 0; first < userIds.length; first += 1) {
		for (let second = first + 1; second < userIds.length; second += 1) {
			allPairs.push([userIds[first], userIds[second]]);
		}
	}

	const connections: Prisma.ConnectionCreateManyInput[] = allPairs
		.slice(0, Math.min(profile.baseCount, allPairs.length))
		.map(([userLowId, userHighId], index) => ({
			id: makeId(),
			userLowId,
			userHighId,
			sourceRequestId: null,
			createdAt: day(-40 + index),
		}));

	const connectionRequestStatuses = ["PENDING", "ACCEPTED", "REJECTED", "CANCELLED", "EXPIRED"] as const;
	const connectionRequests: Prisma.ConnectionRequestCreateManyInput[] = [];
	const requestKeys = new Set<string>();
	let requestCursor = 0;
	while (connectionRequests.length < profile.baseCount) {
		const requesterUserId = userIds[requestCursor % userIds.length];
		const receiverUserId = userIds[(requestCursor + 2) % userIds.length];
		const status =
			connectionRequestStatuses[
				Math.floor(requestCursor / userIds.length) % connectionRequestStatuses.length
			];
		const key = `${requesterUserId}:${receiverUserId}:${status}`;
		if (requesterUserId !== receiverUserId && !requestKeys.has(key)) {
			requestKeys.add(key);
			connectionRequests.push({
				id: makeId(),
				requesterUserId,
				receiverUserId,
				status,
				respondedAt: status === "PENDING" ? null : day(-(requestCursor % 12) - 1),
				createdAt: day(-35 + requestCursor),
			});
		}
		requestCursor += 1;
	}

	connections.forEach((connection, index) => {
		connection.sourceRequestId = connectionRequests[index % connectionRequests.length].id;
	});

	const notificationTypes = ["REQUEST_RECEIVED", "REQUEST_ACCEPTED", "REQUEST_REJECTED", "CONNECTION_REMOVED"] as const;
	const connectionNotifications: Prisma.ConnectionNotificationCreateManyInput[] = Array.from(
		{ length: profile.baseCount },
		(_, index) => {
			const type = notificationTypes[index % notificationTypes.length];
			if (type === "CONNECTION_REMOVED") {
				const connection = connections[index % connections.length];
				return {
					id: makeId(),
					userId: index % 2 === 0 ? connection.userLowId : connection.userHighId,
					type,
					referenceType: "CONNECTION",
					referenceId: connection.id,
					isRead: index % 3 === 0,
					createdAt: day(-(index % 14)),
				};
			}
			const request = connectionRequests[index % connectionRequests.length];
			return {
				id: makeId(),
				userId: type === "REQUEST_RECEIVED" ? request.receiverUserId : request.requesterUserId,
				type,
				referenceType: "CONNECTION_REQUEST",
				referenceId: request.id,
				isRead: index % 4 === 0,
				createdAt: day(-(index % 14)),
			};
		},
	);

	const organizationMemberships: Prisma.OrganizationMembershipCreateManyInput[] = [];
	const membershipKeys = new Set<string>();
	organizations.forEach((organization, index) => {
		const key = `${organization.id}:${organization.ownerUserId}:ACTIVE`;
		membershipKeys.add(key);
		organizationMemberships.push({
			id: makeId(),
			organizationId: organization.id as string,
			userId: organization.ownerUserId as string,
			role: "ADMIN",
			status: "ACTIVE",
			joinedAt: day(-90 + index),
			removedAt: null,
		});
	});

	let membershipCursor = 0;
	while (organizationMemberships.length < profile.baseCount) {
		const organizationId = organizationIds[membershipCursor % organizationIds.length];
		const userId = userIds[(membershipCursor + 1) % userIds.length];
		const status = profile.baseCount > 3 && membershipCursor === 0 ? "REMOVED" : "ACTIVE";
		const key = `${organizationId}:${userId}:${status}`;
		if (!membershipKeys.has(key)) {
			membershipKeys.add(key);
			organizationMemberships.push({
				id: makeId(),
				organizationId,
				userId,
				role: membershipCursor % 7 === 0 ? "ADMIN" : "MEMBER",
				status,
				joinedAt: day(-40 + membershipCursor),
				removedAt: status === "REMOVED" ? day(-2) : null,
			});
		}
		membershipCursor += 1;
	}

	const inviteStatuses = ["PENDING", "ACCEPTED", "DECLINED", "EXPIRED"] as const;
	const organizationInvites: Prisma.OrganizationInviteCreateManyInput[] = [];
	const inviteKeys = new Set<string>();
	let inviteCursor = 0;
	while (organizationInvites.length < profile.baseCount) {
		const organization = organizations[inviteCursor % organizations.length];
		const invitedUserId = userIds[(inviteCursor + 2) % userIds.length];
		const status = inviteStatuses[Math.floor(inviteCursor / organizations.length) % inviteStatuses.length];
		const key = `${organization.id}:${invitedUserId}:${status}`;
		if (invitedUserId !== organization.ownerUserId && !inviteKeys.has(key)) {
			inviteKeys.add(key);
			organizationInvites.push({
				id: makeId(),
				organizationId: organization.id as string,
				invitedUserId,
				invitedByUserId: organization.ownerUserId as string,
				status,
				expiresAt: status === "EXPIRED" ? day(-2) : day(7 + (inviteCursor % 5)),
				respondedAt: status === "ACCEPTED" || status === "DECLINED" ? day(-(inviteCursor % 8) - 1) : null,
				createdAt: day(-30 + inviteCursor),
			});
		}
		inviteCursor += 1;
	}

	const joinStatuses = ["PENDING", "APPROVED", "REJECTED", "CANCELLED"] as const;
	const organizationJoinRequests: Prisma.OrganizationJoinRequestCreateManyInput[] = [];
	const joinKeys = new Set<string>();
	let joinCursor = 0;
	while (organizationJoinRequests.length < profile.baseCount) {
		const organization = organizations[joinCursor % organizations.length];
		const requesterUserId = userIds[(joinCursor + 3) % userIds.length];
		const status = joinStatuses[Math.floor(joinCursor / organizations.length) % joinStatuses.length];
		const key = `${organization.id}:${requesterUserId}:${status}`;
		if (requesterUserId !== organization.ownerUserId && !joinKeys.has(key)) {
			joinKeys.add(key);
			organizationJoinRequests.push({
				id: makeId(),
				organizationId: organization.id as string,
				requesterUserId,
				status,
				reviewedByUserId: status === "PENDING" ? null : (organization.ownerUserId as string),
				reviewedAt: status === "PENDING" ? null : day(-(joinCursor % 6) - 1),
				createdAt: day(-26 + joinCursor),
			});
		}
		joinCursor += 1;
	}

	const suggestionLayoutPreferences: Prisma.SuggestionLayoutPreferenceCreateManyInput[] = users.map(
		(user, index) => ({
			id: makeId(),
			userId: user.id as string,
			layoutMode: index % 3 === 0 ? "GRID" : index % 3 === 1 ? "COMPACT" : "CARD",
			sortMode: index % 3 === 0 ? "RECENT" : index % 3 === 1 ? "PRICE_LOW" : "PRICE_HIGH",
		}),
	);

	const productListings: Prisma.ProductListingCreateManyInput[] = Array.from(
		{ length: profile.baseCount },
		(_, index) => {
			const quantityAvailable = index % 6 === 0 ? 0 : (index % 12) + 1;
			const status =
				index % 7 === 0 ? "ARCHIVED" : quantityAvailable === 0 ? "SOLD_OUT" : "ACTIVE";
			return {
				id: makeId(),
				sellerUserId: userIds[index % userIds.length],
				title: `${productWords[index % productWords.length]} Pack ${index + 1}`,
				description:
					index === 0
						? padText("Bulk assortment with full handling notes for wholesale buyers.", 5000)
						: index % 4 === 0
							? null
							: `Popular ${categories[index % categories.length].toLowerCase()} item with dependable weekly supply.`,
				category: categories[index % categories.length],
				price: Number((index === 1 ? 0 : 15 + (index % 9) * 8.5).toFixed(2)),
				currency: index % 8 === 0 ? "USD" : "PHP",
				quantityAvailable,
				visibility: index % 3 === 0 ? "PRIVATE" : "PUBLIC",
				status,
				imageUrls:
					index % 3 === 0
						? []
						: [`https://cdn.sarisarinet.local/product/${environment}/${index + 1}.jpg`],
				createdAt: day(-50 + index),
			};
		},
	);

	const listingEvents = ["CREATED", "UPDATED", "ARCHIVED", "UNARCHIVED", "INVENTORY_UPDATED", "SOLD_OUT", "RESTOCKED"] as const;
	const listingLifecycleEvents: Prisma.ListingLifecycleEventCreateManyInput[] = Array.from(
		{ length: profile.baseCount },
		(_, index) => {
			const listing = productListings[index % productListings.length];
			const eventType = listingEvents[index % listingEvents.length];
			return {
				id: makeId(),
				listingId: listing.id as string,
				actorUserId: listing.sellerUserId as string,
				eventType,
				beforeState: eventType === "CREATED" ? null : asJson({ status: listing.status, quantityAvailable: listing.quantityAvailable }),
				afterState: asJson({ status: listing.status, quantityAvailable: listing.quantityAvailable }),
				reason: eventType === "ARCHIVED" ? "Seller paused listing during stock audit" : null,
				createdAt: day(-30 + index),
			};
		},
	);

	const listingsBySeller = new Map<string, string[]>();
	productListings.forEach((listing) => {
		const sellerId = listing.sellerUserId as string;
		const existing = listingsBySeller.get(sellerId) || [];
		existing.push(listing.id as string);
		listingsBySeller.set(sellerId, existing);
	});

	const transactions: Prisma.TransactionCreateManyInput[] = Array.from(
		{ length: profile.baseCount },
		(_, index) => {
			const sellerUserId = userIds[index % userIds.length];
			const buyerUserId = userIds[(index + 1) % userIds.length];
			const recordedByUserId = index % 2 === 0 ? sellerUserId : buyerUserId;
			const scan = invoiceScanCycle[index % invoiceScanCycle.length];
			const transactionDate = day(-20 + index);
			const status = index % 4 === 0 ? "VOIDED" : "POSTED";
			return {
				id: makeId(),
				sellerUserId,
				buyerUserId,
				recordedByUserId,
				productListingId: index % 5 === 0 ? null : (listingsBySeller.get(sellerUserId)?.[0] ?? null),
				amount: Number((95 + (index % 11) * 17.75).toFixed(2)),
				currency: index % 9 === 0 ? "USD" : "PHP",
				transactionDate,
				note: index === 0 ? padText("Transaction includes full invoice verification steps.", 2000) : index % 4 === 0 ? null : "Confirmed handoff at community pickup point.",
				status,
				invoiceStatus: invoiceStatusFromScan(scan),
				voidedAt: status === "VOIDED" ? minutesAfter(transactionDate, 180) : null,
				voidReason: status === "VOIDED" ? "Counterparty requested cancellation before release." : null,
				createdAt: day(-20 + index),
			};
		},
	);

	const transactionInvoices: Prisma.TransactionInvoiceCreateManyInput[] = transactions.map((transaction, index) => {
		const scan = invoiceScanCycle[index % invoiceScanCycle.length];
		return {
			id: makeId(),
			transactionId: transaction.id as string,
			storageKey: `invoice/${environment}/${transaction.id}.bin`,
			mimeType: index % 3 === 0 ? "IMAGE_JPEG" : index % 3 === 1 ? "IMAGE_PNG" : "IMAGE_WEBP",
			size: 140_000 + index * 2_048,
			sha256: hashValue(`invoice-${environment}-${transaction.id}-${index}`),
			scanStatus: scan,
			uploadedByUserId: transaction.recordedByUserId as string,
			uploadedAt: minutesAfter(transaction.transactionDate as Date, 20),
		};
	});

	const transactionAdjustments: Prisma.TransactionAdjustmentCreateManyInput[] = transactions.map((transaction, index) => {
		const action = transaction.status === "VOIDED" ? "VOID" : "CORRECT";
		return {
			id: makeId(),
			transactionId: transaction.id as string,
			action,
			reason: action === "CORRECT" ? "Adjusted amount after invoice reconciliation." : "Voided due to duplicate posting.",
			beforeSnapshot: asJson({ amount: transaction.amount, status: transaction.status, currency: transaction.currency }),
			afterSnapshot: asJson({ amount: action === "CORRECT" ? Number(((transaction.amount as number) + 3.25).toFixed(2)) : transaction.amount, status: action === "VOID" ? "VOIDED" : transaction.status, currency: transaction.currency }),
			actorUserId: transaction.recordedByUserId as string,
			createdAt: minutesAfter(transaction.transactionDate as Date, 60 + index),
		};
	});

	const borrowingStatuses = ["UNPAID", "PARTIALLY_PAID", "PAID", "PAID_LATE"] as const;
	const borrowingRecords: Prisma.BorrowingRecordCreateManyInput[] = Array.from(
		{ length: profile.baseCount },
		(_, index) => {
			const assetType = index % 2 === 0 ? "MONEY" : "ITEM";
			const principalAmount =
				assetType === "MONEY" ? Number((250 + (index % 9) * 40).toFixed(2)) : null;
			const quantity =
				assetType === "ITEM" ? Number((1 + (index % 6) * 0.5).toFixed(2)) : null;
			const fullAmount = principalAmount ?? quantity ?? 0;
			const status = borrowingStatuses[index % borrowingStatuses.length];
			const dueDate = day((index % 12) - 6);
			const remainingBalance =
				status === "UNPAID"
					? fullAmount
					: status === "PARTIALLY_PAID"
						? Number((fullAmount * 0.4).toFixed(2))
						: 0;
			const closedAt =
				status === "PAID"
					? day((index % 12) - 7)
					: status === "PAID_LATE"
						? day((index % 12) + 2)
						: null;
			return {
				id: makeId(),
				ownerUserId: userIds[index % userIds.length],
				counterpartyUserId: userIds[(index + 2) % userIds.length],
				direction: index % 3 === 0 ? "BORROWED" : "LENT",
				assetType,
				principalAmount,
				currency: assetType === "MONEY" ? (index % 7 === 0 ? "USD" : "PHP") : null,
				itemDescription:
					assetType === "ITEM"
						? `${productWords[index % productWords.length]} batch for deferred settlement`
						: null,
				quantity,
				dueDate,
				status,
				remainingBalance,
				termsNote:
					index === 1
						? padText(
								"Installment terms reviewed by both parties with due-date penalties and rescheduling conditions.",
								1000,
						  )
						: index % 4 === 0
							? null
							: "Flexible repayment accepted with weekly check-ins.",
				closedAt,
				createdAt: day(-18 + index),
			};
		},
	);

	const borrowingWithRepayment = borrowingRecords.filter((record) => record.status !== "UNPAID");
	const repayments: Prisma.RepaymentCreateManyInput[] = Array.from(
		{ length: profile.repaymentCount },
		(_, index) => {
			const record = borrowingWithRepayment[index % borrowingWithRepayment.length];
			const fullAmount = (record.principalAmount ?? record.quantity ?? 0) as number;
			let amount = fullAmount;
			if (record.status === "PARTIALLY_PAID") {
				amount = Number((fullAmount - (record.remainingBalance as number)).toFixed(2));
			}
			if (amount <= 0) amount = 0.5;
			return {
				id: makeId(),
				borrowingRecordId: record.id as string,
				amount,
				paidAt: (record.closedAt as Date | null) || day(-3),
				note:
					index === 0
						? padText(
								"First repayment logged with supporting proof and balance confirmation from both parties.",
								1000,
						  )
						: index % 3 === 0
							? null
							: "Repayment acknowledged and reflected in remaining balance.",
				actorUserId:
					index % 2 === 0
						? (record.ownerUserId as string)
						: (record.counterpartyUserId as string),
				createdAt: day(-10 + index),
			};
		},
	);

	const settlementNotes: Prisma.SettlementNoteCreateManyInput[] = Array.from(
		{ length: profile.baseCount },
		(_, index) => {
			const record = borrowingRecords[index % borrowingRecords.length];
			return {
				id: makeId(),
				borrowingRecordId: record.id as string,
				note:
					index === 2
						? padText(
								"Settlement note captures final reconciliation details, handoff location, and witness acknowledgment.",
								1000,
						  )
						: `Settlement note ${index + 1}: payment checkpoint discussed with counterparty.`,
				actorUserId:
					index % 2 === 0
						? (record.ownerUserId as string)
						: (record.counterpartyUserId as string),
				createdAt: day(-8 + index),
			};
		},
	);

	const auditEvents = [
		"RECORD_CREATED",
		"REPAYMENT_POSTED",
		"STATUS_UPDATED",
		"SETTLEMENT_NOTE_ADDED",
		"RECORD_CLOSED",
		"TERMS_UPDATED",
	] as const;
	const borrowingAuditEntries: Prisma.BorrowingAuditEntryCreateManyInput[] = Array.from(
		{ length: profile.baseCount },
		(_, index) => {
			const record = borrowingRecords[index % borrowingRecords.length];
			const eventType = auditEvents[index % auditEvents.length];
			return {
				id: makeId(),
				borrowingRecordId: record.id as string,
				eventType,
				payload: asJson({
					recordStatus: record.status,
					remainingBalance: record.remainingBalance,
					note: `Audit event ${eventType} for seeded record`,
				}),
				actorUserId: record.ownerUserId as string,
				createdAt: day(-7 + index),
			};
		},
	);

	const commerceMetricSnapshots: Prisma.CommerceMetricSnapshotCreateManyInput[] = Array.from(
		{ length: profile.baseCount },
		(_, index) => {
			const rangeEnd = day(-(index % 5));
			const rangeStart = day(-(index % 5) - 30);
			const revenue = Number((1200 + index * 42.75).toFixed(2));
			const expense = Number((730 + index * 24.4).toFixed(2));
			return {
				id: makeId(),
				userId: userIds[index % userIds.length],
				rangeStart,
				rangeEnd,
				revenue,
				expense,
				profit: Number((revenue - expense).toFixed(2)),
				uniqueCustomers: 2 + (index % 9),
				transactionCount: 5 + (index % 14),
				invoiceCount: 2 + (index % 8),
				computedAt: minutesAfter(rangeEnd, 90),
				sourceVersion: 1 + (index % 3),
			};
		},
	);

	const borrowingMetricSnapshots: Prisma.BorrowingMetricSnapshotCreateManyInput[] = Array.from(
		{ length: profile.baseCount },
		(_, index) => {
			const rangeEnd = day(-(index % 6));
			const rangeStart = day(-(index % 6) - 30);
			const totalLent = Number((300 + index * 15.5).toFixed(2));
			const totalBorrowed = Number((220 + index * 13.25).toFixed(2));
			return {
				id: makeId(),
				userId: userIds[index % userIds.length],
				rangeStart,
				rangeEnd,
				totalLent,
				totalBorrowed,
				outstandingReceivable: Number((totalLent * 0.35).toFixed(2)),
				outstandingPayable: Number((totalBorrowed * 0.42).toFixed(2)),
				overdueCount: index % 5,
				computedAt: minutesAfter(rangeEnd, 60),
				sourceVersion: 1 + (index % 2),
			};
		},
	);

	const reportViewPresets: Prisma.ReportViewPresetCreateManyInput[] = Array.from(
		{ length: profile.baseCount },
		(_, index) => ({
			id: makeId(),
			userId: userIds[index % userIds.length],
			name: `Preset ${index + 1} - ${environment.toUpperCase()}`,
			module: index % 3 === 0 ? "COMMERCE" : index % 3 === 1 ? "BORROWING" : "UNIFIED",
			filters: asJson({
				range: { start: day(-30).toISOString(), end: day(0).toISOString() },
				includeArchived: index % 2 === 0,
				sort: index % 2 === 0 ? "desc" : "asc",
			}),
			isDefault: true,
			createdAt: day(-4 + index),
		}),
	);

	const reportJobStatuses = ["QUEUED", "PROCESSING", "READY", "FAILED", "EXPIRED"] as const;
	const reportExportJobs: Prisma.ReportExportJobCreateManyInput[] = Array.from(
		{ length: profile.baseCount },
		(_, index) => {
			const status = reportJobStatuses[index % reportJobStatuses.length];
			return {
				id: makeId(),
				userId: userIds[index % userIds.length],
				module: index % 3 === 0 ? "COMMERCE" : index % 3 === 1 ? "BORROWING" : "UNIFIED",
				format: index % 2 === 0 ? "CSV" : "XLSX",
				filters: asJson({
					rangeStart: day(-14).toISOString(),
					rangeEnd: day(0).toISOString(),
					groupBy: index % 2 === 0 ? "week" : "month",
				}),
				status,
				storageKey: status === "READY" ? `report-export/${environment}/${index + 1}.csv` : null,
				errorCode: status === "FAILED" ? "REPORTING_EXPORT_FAILED" : null,
				expiresAt: status === "EXPIRED" ? day(-1) : day(3 + (index % 6)),
				createdAt: day(-3 + index),
			};
		},
	);

	return {
		users,
		authSessions,
		accountRecoveryTokens,
		accountStatusEvents,
		connections,
		connectionRequests,
		connectionNotifications,
		organizations,
		organizationMemberships,
		organizationInvites,
		organizationJoinRequests,
		suggestionLayoutPreferences,
		productListings,
		listingLifecycleEvents,
		transactions,
		transactionInvoices,
		transactionAdjustments,
		borrowingRecords,
		repayments,
		settlementNotes,
		borrowingAuditEntries,
		commerceMetricSnapshots,
		borrowingMetricSnapshots,
		reportViewPresets,
		reportExportJobs,
	};
};

// SECTION: ResetAndWrite
const clearSeedableModels = async (): Promise<void> => {
	await prisma.transactionInvoice.deleteMany();
	await prisma.transactionAdjustment.deleteMany();
	await prisma.repayment.deleteMany();
	await prisma.settlementNote.deleteMany();
	await prisma.borrowingAuditEntry.deleteMany();
	await prisma.listingLifecycleEvent.deleteMany();
	await prisma.connectionNotification.deleteMany();
	await prisma.organizationInvite.deleteMany();
	await prisma.organizationJoinRequest.deleteMany();
	await prisma.organizationMembership.deleteMany();
	await prisma.connection.deleteMany();
	await prisma.connectionRequest.deleteMany();
	await prisma.authSession.deleteMany();
	await prisma.accountRecoveryToken.deleteMany();
	await prisma.accountStatusEvent.deleteMany();
	await prisma.commerceMetricSnapshot.deleteMany();
	await prisma.borrowingMetricSnapshot.deleteMany();
	await prisma.reportExportJob.deleteMany();
	await prisma.reportViewPreset.deleteMany();
	await prisma.transaction.deleteMany();
	await prisma.borrowingRecord.deleteMany();
	await prisma.productListing.deleteMany();
	await prisma.suggestionLayoutPreference.deleteMany();
	await prisma.organization.deleteMany();
	await prisma.user.deleteMany();
};

const writeSeedData = async (seedData: SeedData): Promise<void> => {
	await prisma.user.createMany({ data: seedData.users });
	await prisma.authSession.createMany({ data: seedData.authSessions });
	await prisma.accountRecoveryToken.createMany({ data: seedData.accountRecoveryTokens });
	await prisma.accountStatusEvent.createMany({ data: seedData.accountStatusEvents });
	await prisma.organization.createMany({ data: seedData.organizations });
	await prisma.organizationMembership.createMany({ data: seedData.organizationMemberships });
	await prisma.organizationInvite.createMany({ data: seedData.organizationInvites });
	await prisma.organizationJoinRequest.createMany({ data: seedData.organizationJoinRequests });
	await prisma.connectionRequest.createMany({ data: seedData.connectionRequests });
	await prisma.connection.createMany({ data: seedData.connections });
	await prisma.connectionNotification.createMany({ data: seedData.connectionNotifications });
	await prisma.suggestionLayoutPreference.createMany({
		data: seedData.suggestionLayoutPreferences,
	});
	await prisma.productListing.createMany({ data: seedData.productListings });
	await prisma.listingLifecycleEvent.createMany({ data: seedData.listingLifecycleEvents });
	await prisma.transaction.createMany({ data: seedData.transactions });
	await prisma.transactionInvoice.createMany({ data: seedData.transactionInvoices });
	await prisma.transactionAdjustment.createMany({ data: seedData.transactionAdjustments });
	await prisma.borrowingRecord.createMany({ data: seedData.borrowingRecords });
	await prisma.repayment.createMany({ data: seedData.repayments });
	await prisma.settlementNote.createMany({ data: seedData.settlementNotes });
	await prisma.borrowingAuditEntry.createMany({ data: seedData.borrowingAuditEntries });
	await prisma.commerceMetricSnapshot.createMany({ data: seedData.commerceMetricSnapshots });
	await prisma.borrowingMetricSnapshot.createMany({
		data: seedData.borrowingMetricSnapshots,
	});
	await prisma.reportViewPreset.createMany({ data: seedData.reportViewPresets });
	await prisma.reportExportJob.createMany({ data: seedData.reportExportJobs });
};

// SECTION: Main
async function main() {
	const environment = resolveSeedEnvironment();
	const profile = SEED_PROFILES[environment];

	console.log(`[seed] Environment: ${environment}`);
	console.log(`[seed] Profile: ${profile.description}`);
	console.log(`[seed] Target volume: ${profile.baseCount} records per core model`);

	const seedData = await buildSeedData(environment, profile);

	await clearSeedableModels();
	await writeSeedData(seedData);

	console.log("[seed] Completed seeding all MongoDB models.");
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (error) => {
		console.error("[seed] Failed:", error);
		await prisma.$disconnect();
		process.exit(1);
	});
