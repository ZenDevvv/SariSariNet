export const AccountStatus = {
	ACTIVE: "ACTIVE",
	DEACTIVATED: "DEACTIVATED",
} as const;

export type AccountStatus = (typeof AccountStatus)[keyof typeof AccountStatus];

export const BorrowingAssetType = {
	MONEY: "MONEY",
	ITEM: "ITEM",
} as const;

export type BorrowingAssetType = (typeof BorrowingAssetType)[keyof typeof BorrowingAssetType];

export const BorrowingAuditEventType = {
	RECORD_CREATED: "RECORD_CREATED",
	REPAYMENT_POSTED: "REPAYMENT_POSTED",
	STATUS_UPDATED: "STATUS_UPDATED",
	SETTLEMENT_NOTE_ADDED: "SETTLEMENT_NOTE_ADDED",
	RECORD_CLOSED: "RECORD_CLOSED",
	TERMS_UPDATED: "TERMS_UPDATED",
} as const;

export type BorrowingAuditEventType = (typeof BorrowingAuditEventType)[keyof typeof BorrowingAuditEventType];

export const BorrowingDirection = {
	BORROWED: "BORROWED",
	LENT: "LENT",
} as const;

export type BorrowingDirection = (typeof BorrowingDirection)[keyof typeof BorrowingDirection];

export const BorrowingRecordStatus = {
	UNPAID: "UNPAID",
	PARTIALLY_PAID: "PARTIALLY_PAID",
	PAID: "PAID",
	PAID_LATE: "PAID_LATE",
} as const;

export type BorrowingRecordStatus = (typeof BorrowingRecordStatus)[keyof typeof BorrowingRecordStatus];

export const ConnectionNotificationReferenceType = {
	CONNECTION_REQUEST: "CONNECTION_REQUEST",
	CONNECTION: "CONNECTION",
} as const;

export type ConnectionNotificationReferenceType = (typeof ConnectionNotificationReferenceType)[keyof typeof ConnectionNotificationReferenceType];

export const ConnectionNotificationType = {
	REQUEST_RECEIVED: "REQUEST_RECEIVED",
	REQUEST_ACCEPTED: "REQUEST_ACCEPTED",
	REQUEST_REJECTED: "REQUEST_REJECTED",
	CONNECTION_REMOVED: "CONNECTION_REMOVED",
} as const;

export type ConnectionNotificationType = (typeof ConnectionNotificationType)[keyof typeof ConnectionNotificationType];

export const ConnectionRequestStatus = {
	PENDING: "PENDING",
	ACCEPTED: "ACCEPTED",
	REJECTED: "REJECTED",
	CANCELLED: "CANCELLED",
	EXPIRED: "EXPIRED",
} as const;

export type ConnectionRequestStatus = (typeof ConnectionRequestStatus)[keyof typeof ConnectionRequestStatus];

export const InvoiceScanStatus = {
	PENDING: "PENDING",
	CLEAN: "CLEAN",
	INFECTED: "INFECTED",
	FAILED: "FAILED",
} as const;

export type InvoiceScanStatus = (typeof InvoiceScanStatus)[keyof typeof InvoiceScanStatus];

export const ListingLifecycleEventType = {
	CREATED: "CREATED",
	UPDATED: "UPDATED",
	ARCHIVED: "ARCHIVED",
	UNARCHIVED: "UNARCHIVED",
	INVENTORY_UPDATED: "INVENTORY_UPDATED",
	SOLD_OUT: "SOLD_OUT",
	RESTOCKED: "RESTOCKED",
} as const;

export type ListingLifecycleEventType = (typeof ListingLifecycleEventType)[keyof typeof ListingLifecycleEventType];

export const OrganizationInviteStatus = {
	PENDING: "PENDING",
	ACCEPTED: "ACCEPTED",
	DECLINED: "DECLINED",
	EXPIRED: "EXPIRED",
} as const;

export type OrganizationInviteStatus = (typeof OrganizationInviteStatus)[keyof typeof OrganizationInviteStatus];

export const OrganizationJoinRequestStatus = {
	PENDING: "PENDING",
	APPROVED: "APPROVED",
	REJECTED: "REJECTED",
	CANCELLED: "CANCELLED",
} as const;

export type OrganizationJoinRequestStatus = (typeof OrganizationJoinRequestStatus)[keyof typeof OrganizationJoinRequestStatus];

export const OrganizationMembershipRole = {
	ADMIN: "ADMIN",
	MEMBER: "MEMBER",
} as const;

export type OrganizationMembershipRole = (typeof OrganizationMembershipRole)[keyof typeof OrganizationMembershipRole];

export const OrganizationMembershipStatus = {
	ACTIVE: "ACTIVE",
	REMOVED: "REMOVED",
} as const;

export type OrganizationMembershipStatus = (typeof OrganizationMembershipStatus)[keyof typeof OrganizationMembershipStatus];

export const OrganizationStatus = {
	ACTIVE: "ACTIVE",
	ARCHIVED: "ARCHIVED",
} as const;

export type OrganizationStatus = (typeof OrganizationStatus)[keyof typeof OrganizationStatus];

export const ProductListingStatus = {
	ACTIVE: "ACTIVE",
	ARCHIVED: "ARCHIVED",
	SOLD_OUT: "SOLD_OUT",
} as const;

export type ProductListingStatus = (typeof ProductListingStatus)[keyof typeof ProductListingStatus];

export const ProductListingVisibility = {
	PUBLIC: "PUBLIC",
	PRIVATE: "PRIVATE",
} as const;

export type ProductListingVisibility = (typeof ProductListingVisibility)[keyof typeof ProductListingVisibility];

export const ReportExportFormat = {
	CSV: "CSV",
	XLSX: "XLSX",
} as const;

export type ReportExportFormat = (typeof ReportExportFormat)[keyof typeof ReportExportFormat];

export const ReportExportJobStatus = {
	QUEUED: "QUEUED",
	PROCESSING: "PROCESSING",
	READY: "READY",
	FAILED: "FAILED",
	EXPIRED: "EXPIRED",
} as const;

export type ReportExportJobStatus = (typeof ReportExportJobStatus)[keyof typeof ReportExportJobStatus];

export const ReportModule = {
	COMMERCE: "COMMERCE",
	BORROWING: "BORROWING",
	UNIFIED: "UNIFIED",
} as const;

export type ReportModule = (typeof ReportModule)[keyof typeof ReportModule];

export const SuggestionLayoutMode = {
	GRID: "GRID",
	COMPACT: "COMPACT",
	CARD: "CARD",
} as const;

export type SuggestionLayoutMode = (typeof SuggestionLayoutMode)[keyof typeof SuggestionLayoutMode];

export const SuggestionSortMode = {
	RECENT: "RECENT",
	PRICE_LOW: "PRICE_LOW",
	PRICE_HIGH: "PRICE_HIGH",
} as const;

export type SuggestionSortMode = (typeof SuggestionSortMode)[keyof typeof SuggestionSortMode];

export const TransactionAdjustmentAction = {
	CORRECT: "CORRECT",
	VOID: "VOID",
} as const;

export type TransactionAdjustmentAction = (typeof TransactionAdjustmentAction)[keyof typeof TransactionAdjustmentAction];

export const TransactionInvoiceMimeType = {
	IMAGE_JPEG: "IMAGE_JPEG",
	IMAGE_PNG: "IMAGE_PNG",
	IMAGE_WEBP: "IMAGE_WEBP",
} as const;

export type TransactionInvoiceMimeType = (typeof TransactionInvoiceMimeType)[keyof typeof TransactionInvoiceMimeType];

export const TransactionInvoiceStatus = {
	NONE: "NONE",
	PENDING_SCAN: "PENDING_SCAN",
	READY: "READY",
	REJECTED: "REJECTED",
} as const;

export type TransactionInvoiceStatus = (typeof TransactionInvoiceStatus)[keyof typeof TransactionInvoiceStatus];

export const TransactionStatus = {
	POSTED: "POSTED",
	VOIDED: "VOIDED",
} as const;

export type TransactionStatus = (typeof TransactionStatus)[keyof typeof TransactionStatus];
