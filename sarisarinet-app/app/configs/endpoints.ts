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
};
