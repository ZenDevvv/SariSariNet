# Architecture Standard

Use this as the canonical convention set for architecture, backend generation, frontend API integration, and reviews.

## 1. Naming Conventions

### Models and Collections
- Model name: `PascalCase` singular (example: `BorrowAgreement`)
- Collection map: plural lowercase (example: `borrow_agreements`)
- Primary key type: `ObjectId`
- Standard timestamps: `createdAt`, `updatedAt`

### API and DTO Naming
- API base path: `/api`
- Resource base path: singular lowercase (example: `/product`, `/expense`, `/invoice`)
- Request/response fields: `camelCase`
- Zod schema names:
  - base: `{Entity}Schema`
  - create: `Create{Entity}Schema`
  - update: `Update{Entity}Schema`
  - list envelope: `GetAll{Entities}Schema`

### Error Code Naming
- Format: `MODULE_REASON` (uppercase, underscore-separated)
- Reuse BRD codes exactly where defined
- Keep module prefixes stable (`AUTH_`, `PRODUCT_`, `BORROW_`, etc.)

## 2. API Route Conventions

### Route Style
- CRUD and resource actions are explicit and predictable:
  - `POST /api/{resource}` create
  - `GET /api/{resource}` list
  - `GET /api/{resource}/:id` detail
  - `PATCH /api/{resource}/:id` update
- Use subpaths for domain actions:
  - `/stock/adjust`, `/status`, `/return`, `/attachment/presign`

### Query Parameters for Lists
Supported list query params:
- `page`, `limit`, `sort`, `order`, `query`, `filter`, `fields`
- optional flags: `count`, `pagination`, `document`

### Response Envelope
All endpoints return one of the following:

Success:
```json
{
  "success": true,
  "data": {},
  "meta": { "page": 1, "limit": 20, "count": 100 },
  "requestId": "req_abc123",
  "timestamp": "2026-02-18T12:00:00.000Z"
}
```

Error:
```json
{
  "success": false,
  "error": {
    "code": "PRODUCT_INVALID_PRICING",
    "message": "Price must be non-negative.",
    "details": [{ "field": "price", "issue": "min_value", "value": "-1" }]
  },
  "requestId": "req_abc123",
  "timestamp": "2026-02-18T12:00:00.000Z"
}
```

## 3. Auth Patterns

Auth levels used per route:
- `PUBLIC`
- `AUTH`
- `AUTH+OWNER`
- `AUTH+PARTICIPANT`
- `AUTH+ELIGIBLE`
- `SYSTEM`

Guard chain:
1. `requireAuth` (session validity + active account)
2. `requireEligibleCommerceProfile` when commerce actions apply
3. `requireOwner` or `requireParticipant` based on resource ownership
4. `requireSystemToken` for scheduler/service-only routes

Session model:
- Access JWT TTL: 15 minutes
- Session token TTL: 30 days
- Recovery token TTL: 15 minutes, one-time use

## 4. Error and HTTP Mapping Standard
- `400` malformed request/query
- `401` unauthenticated or invalid session
- `403` authenticated but forbidden
- `404` resource not found
- `409` state conflict/concurrency conflict
- `422` business-rule validation failure
- `429` rate-limited
- `500` internal error
- `503` dependency unavailable

All errors must include:
- `error.code`
- `error.message`
- optional `error.details[]` for field-level validation
- `requestId`

## 5. Caching Conventions
- Use Redis for read-heavy responses only.
- Key format: `cache:{resource}:{scope}:{keyParts}`
- Standard TTL defaults:
  - detail views: `300s`
  - list views: `60s`
  - dashboard summaries: `30s`
  - export job status: `15s`
- Invalidate cache on any write that changes underlying data.
- Financial freshness target: dashboard and histories reflect confirmed writes within 5 seconds.

## 6. File and Media Conventions
- Use presigned uploads for attachments.
- Allow only explicit MIME policy (`image/jpeg`, `image/png`, `image/webp`).
- Enforce max file size and per-entity attachment count.
- Persist metadata in DB (`storageKey`, `mimeType`, `size`, `sha256`, `scanStatus`).
- Expose files only through signed download URLs and participant/owner auth checks.
