export const API_ENDPOINTS = {
	BASE_URL: import.meta.env.VITE_BASE_URL || "http://localhost:3000/api",

	// Auth API endpoints
	AUTH: {
		LOGIN: "/auth/login",
		LOGOUT: "/auth/logout",
		REGISTER: "/auth/register",
	},

	// User API endpoints
	USER: {
		GET_ALL: "/user",
		GET_BY_ID: "/user/:id",
		GET_CURRENT: "/user/current",
		CREATE: "/user",
		UPDATE: "/user/:id",
		DELETE: "/user/:id", // Soft delete
	},

	// Person API endpoints
	PERSON: {
		GET_ALL: "/person",
		GET_BY_ID: "/person/:id",
		CREATE: "/person",
		UPDATE: "/person/:id",
		DELETE: "/person/:id", // Soft delete
	},

	PRODUCT: {
		GET_ALL: "/product",
		GET_BY_ID: "/product/:id",
		CREATE: "/product",
		UPDATE: "/product/:id",
		DELETE: "/product/:id", // Soft delete
	},

	CATEGORY: {
		GET_ALL: "/category",
		GET_BY_ID: "/category/:id",
		CREATE: "/category",
		UPDATE: "/category/:id",
		DELETE: "/category/:id", // Soft delete
	},

	PRODUCT_TYPE: {
		GET_ALL: "/product-type",
		GET_BY_ID: "/product-type/:id",
		CREATE: "/product-type",
		UPDATE: "/product-type/:id",
		DELETE: "/product-type/:id", // Soft delete
	},

	DELIVERY_REQUEST: {
		GET_ALL: "/delivery-request",
		GET_BY_ID: "/delivery-request/:id",
		CREATE: "/delivery-request",
		UPDATE: "/delivery-request/:id",
		DELETE: "/delivery-request/:id", // Soft delete
		BULK_ITEM_UPDATE: "/delivery-request/:id/bulk",
	},

	DELIVERY_ORDER: {
		GET_ALL: "/delivery-order",
		GET_BY_ID: "/delivery-order/:id",
		CREATE: "/delivery-order",
		UPDATE: "/delivery-order/:id",
		DELETE: "/delivery-order/:id", // Soft delete
	},

	DELIVERY_RECEIPT: {
		GET_ALL: "/delivery-receipt",
		GET_BY_ID: "/delivery-receipt/:id",
		CREATE: "/delivery-receipt",
		UPDATE: "/delivery-receipt/:id",
		DELETE: "/delivery-receipt/:id", // Soft delete
	},

	DELIVERY_ORDER_ITEM: {
		GET_ALL: "/delivery-order-item",
		GET_BY_ID: "/delivery-order-item/:id",
		CREATE: "/delivery-order-item",
		UPDATE: "/delivery-order-item/:id",
		DELETE: "/delivery-order-item/:id", // Soft delete
	},

	TRANSACTION: {
		GET_ALL: "/transaction",
		GET_BY_ID: "/transaction/:id",
		CREATE: "/transaction",
		UPDATE: "/transaction/:id",
		DELETE: "/transaction/:id", // Soft delete
	},

	TRANSACTION_ITEM: {
		GET_ALL: "/transaction-item",
		GET_BY_ID: "/transaction-item/:id",
		CREATE: "/transaction-item",
		UPDATE: "/transaction-item/:id",
		DELETE: "/transaction-item/:id", // Soft delete
	},

	BATCH: {
		GET_ALL: "/batch",
		GET_BY_ID: "/batch/:id",
		CREATE: "/batch",
		UPDATE: "/batch/:id",
		DELETE: "/batch/:id", // Soft delete
	},

	SUPPLIER: {
		GET_ALL: "/supplier",
		GET_BY_ID: "/supplier/:id",
		CREATE: "/supplier",
		UPDATE: "/supplier/:id",
		DELETE: "/supplier/:id", // Soft delete
	},

	SUPPLIER_ITEM: {
		GET_ALL: "/supplier-item",
		GET_BY_ID: "/supplier-item/:id",
		CREATE: "/supplier-item",
		UPDATE: "/supplier-item/:id",
		DELETE: "/supplier-item/:id", // Soft delete
	},

	DEPARTMENT: {
		GET_ALL: "/department",
		GET_BY_ID: "/department/:id",
		CREATE: "/department",
		UPDATE: "/department/:id",
		DELETE: "/department/:id", // Soft delete
	},

	ORGANIZATION: {
		GET_ALL: "/organization",
		GET_BY_ID: "/organization/:id",
		CREATE: "/organization",
		UPDATE: "/organization/:id",
		DELETE: "/organization/:id", // Soft delete
	},

	STOCK_ITEM: {
		GET_ALL: "/stock-item",
		GET_BY_ID: "/stock-item/:id",
		CREATE: "/stock-item",
		UPDATE: "/stock-item/:id",
		DELETE: "/stock-item/:id", // Soft delete
	},

	STOCK_RECORD: {
		GET_ALL: "/stock-record",
		GET_BY_ID: "/stock-record/:id",
		GET_AGGREGATE: "/stock-record/:id/department",
		CREATE: "/stock-record",
		UPDATE: "/stock-record/:id",
		DELETE: "/stock-record/:id", // Soft delete
	},

	AUTH_SESSION: {
		GET_ALL: "/auth-session",
		GET_BY_ID: "/auth-session/:id",
		CREATE: "/auth-session",
		UPDATE: "/auth-session/:id",
		DELETE: "/auth-session/:id",
	},

	ACCOUNT_RECOVERY_TOKEN: {
		GET_ALL: "/account-recovery-token",
		GET_BY_ID: "/account-recovery-token/:id",
		CREATE: "/account-recovery-token",
		UPDATE: "/account-recovery-token/:id",
		DELETE: "/account-recovery-token/:id",
	},

	ACCOUNT_STATUS_EVENT: {
		GET_ALL: "/account-status-event",
		GET_BY_ID: "/account-status-event/:id",
		CREATE: "/account-status-event",
		UPDATE: "/account-status-event/:id",
		DELETE: "/account-status-event/:id",
	},

	CONNECTION_REQUEST: {
		GET_ALL: "/connection-request",
		GET_BY_ID: "/connection-request/:id",
		CREATE: "/connection-request",
		UPDATE: "/connection-request/:id",
		DELETE: "/connection-request/:id",
	},

	CONNECTION: {
		GET_ALL: "/connection",
		GET_BY_ID: "/connection/:id",
		CREATE: "/connection",
		UPDATE: "/connection/:id",
		DELETE: "/connection/:id",
	},

	CONNECTION_NOTIFICATION: {
		GET_ALL: "/connection-notification",
		GET_BY_ID: "/connection-notification/:id",
		CREATE: "/connection-notification",
		UPDATE: "/connection-notification/:id",
		DELETE: "/connection-notification/:id",
	},

	ORGANIZATION_MEMBERSHIP: {
		GET_ALL: "/organization-membership",
		GET_BY_ID: "/organization-membership/:id",
		CREATE: "/organization-membership",
		UPDATE: "/organization-membership/:id",
		DELETE: "/organization-membership/:id",
	},

	ORGANIZATION_INVITE: {
		GET_ALL: "/organization-invite",
		GET_BY_ID: "/organization-invite/:id",
		CREATE: "/organization-invite",
		UPDATE: "/organization-invite/:id",
		DELETE: "/organization-invite/:id",
	},

	ORGANIZATION_JOIN_REQUEST: {
		GET_ALL: "/organization-join-request",
		GET_BY_ID: "/organization-join-request/:id",
		CREATE: "/organization-join-request",
		UPDATE: "/organization-join-request/:id",
		DELETE: "/organization-join-request/:id",
	},

	SUGGESTION_LAYOUT_PREFERENCE: {
		GET_ALL: "/suggestion-layout-preference",
		GET_BY_ID: "/suggestion-layout-preference/:id",
		CREATE: "/suggestion-layout-preference",
		UPDATE: "/suggestion-layout-preference/:id",
		DELETE: "/suggestion-layout-preference/:id",
	},

	PRODUCT_LISTING: {
		GET_ALL: "/product-listing",
		GET_BY_ID: "/product-listing/:id",
		CREATE: "/product-listing",
		UPDATE: "/product-listing/:id",
		DELETE: "/product-listing/:id",
	},

	LISTING_LIFECYCLE_EVENT: {
		GET_ALL: "/listing-lifecycle-event",
		GET_BY_ID: "/listing-lifecycle-event/:id",
		CREATE: "/listing-lifecycle-event",
		UPDATE: "/listing-lifecycle-event/:id",
		DELETE: "/listing-lifecycle-event/:id",
	},

	TRANSACTION_INVOICE: {
		GET_ALL: "/transaction-invoice",
		GET_BY_ID: "/transaction-invoice/:id",
		CREATE: "/transaction-invoice",
		UPDATE: "/transaction-invoice/:id",
		DELETE: "/transaction-invoice/:id",
	},

	TRANSACTION_ADJUSTMENT: {
		GET_ALL: "/transaction-adjustment",
		GET_BY_ID: "/transaction-adjustment/:id",
		CREATE: "/transaction-adjustment",
		UPDATE: "/transaction-adjustment/:id",
		DELETE: "/transaction-adjustment/:id",
	},

	BORROWING_RECORD: {
		GET_ALL: "/borrowing-record",
		GET_BY_ID: "/borrowing-record/:id",
		CREATE: "/borrowing-record",
		UPDATE: "/borrowing-record/:id",
		DELETE: "/borrowing-record/:id",
	},

	REPAYMENT: {
		GET_ALL: "/repayment",
		GET_BY_ID: "/repayment/:id",
		CREATE: "/repayment",
		UPDATE: "/repayment/:id",
		DELETE: "/repayment/:id",
	},

	SETTLEMENT_NOTE: {
		GET_ALL: "/settlement-note",
		GET_BY_ID: "/settlement-note/:id",
		CREATE: "/settlement-note",
		UPDATE: "/settlement-note/:id",
		DELETE: "/settlement-note/:id",
	},

	BORROWING_AUDIT_ENTRY: {
		GET_ALL: "/borrowing-audit-entry",
		GET_BY_ID: "/borrowing-audit-entry/:id",
		CREATE: "/borrowing-audit-entry",
		UPDATE: "/borrowing-audit-entry/:id",
		DELETE: "/borrowing-audit-entry/:id",
	},

	COMMERCE_METRIC_SNAPSHOT: {
		GET_ALL: "/commerce-metric-snapshot",
		GET_BY_ID: "/commerce-metric-snapshot/:id",
		CREATE: "/commerce-metric-snapshot",
		UPDATE: "/commerce-metric-snapshot/:id",
		DELETE: "/commerce-metric-snapshot/:id",
	},

	BORROWING_METRIC_SNAPSHOT: {
		GET_ALL: "/borrowing-metric-snapshot",
		GET_BY_ID: "/borrowing-metric-snapshot/:id",
		CREATE: "/borrowing-metric-snapshot",
		UPDATE: "/borrowing-metric-snapshot/:id",
		DELETE: "/borrowing-metric-snapshot/:id",
	},

	REPORT_VIEW_PRESET: {
		GET_ALL: "/report-view-preset",
		GET_BY_ID: "/report-view-preset/:id",
		CREATE: "/report-view-preset",
		UPDATE: "/report-view-preset/:id",
		DELETE: "/report-view-preset/:id",
	},

	REPORT_EXPORT_JOB: {
		GET_ALL: "/report-export-job",
		GET_BY_ID: "/report-export-job/:id",
		CREATE: "/report-export-job",
		UPDATE: "/report-export-job/:id",
		DELETE: "/report-export-job/:id",
	},
};
