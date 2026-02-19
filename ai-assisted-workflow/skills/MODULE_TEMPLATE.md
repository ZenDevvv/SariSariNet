# Module Template Guide

Every entity module follows a **3-file pattern** (`index.ts`, `[entity].router.ts`, `[entity].controller.ts`) plus Zod schema, config constants, and route registration.

Replace all `__Entity__` placeholders with the actual entity name.

## Naming Conventions

| Context | Convention | Example (Course) |
|---|---|---|
| Folder | `camelCase` | `app/course` |
| Files | `[entity].controller.ts`, `[entity].router.ts` | `course.controller.ts` |
| Module export | `[entity]Module` | `courseModule` |
| Prisma model | `PascalCase`, collection via `@@map("plural")` | `Course` / `@@map("courses")` |
| Zod schemas | `[Entity]Schema`, `Create[Entity]Schema`, `Update[Entity]Schema`, `GetAll[Entities]Schema` | |
| Logger | `{ module: "[entity]" }` | `{ module: "course" }` |
| API path | `/__entity__` (singular lowercase) | `/course` |
| Cache keys | `cache:[entity]:byId:${id}:*`, `cache:[entity]:list:*` | |
| Config keys | `UPPER_SNAKE_CASE` | `COURSE` |

## File Structure

```
{projectName}-api/
├── app/[entity]/
│   ├── index.ts               # Module entry — wires router + controller
│   ├── [entity].router.ts     # Routes + OpenAPI docs + cache
│   └── [entity].controller.ts # CRUD business logic
├── zod/[entity].zod.ts        # Zod validation schemas
├── prisma/schema/[entity].prisma
├── config/constant.ts         # Add entity to ERROR, SUCCESS, ACTIVITY_LOG, AUDIT_LOG
└── index.ts                   # Register module in main entry
```

## Step 1 — Prisma Schema (`prisma/schema/[entity].prisma`)

Standard fields: `id` (ObjectId), entity-specific fields, relations with `@db.ObjectId`, `isDeleted` (default false), `createdBy?`, `updatedBy?`, `createdAt`, `updatedAt`, `@@index([orgId])`, `@@map("__entities__")`. Run `npx prisma generate` after.

## Step 2 — Zod Schema (`zod/[entity].zod.ts`)

- **Full schema** (`__Entity__Schema`): All fields including relation fields
- **Create schema**: Omit `id`, `createdAt`, `updatedAt`, relation fields. Partial on optional fields + `isDeleted`
- **Update schema**: Omit `id`, `createdAt`, `updatedAt`, `isDeleted`, relation fields. All `.partial()`
- **GetAll schema**: `{ __entities__: z.array(__Entity__Schema), pagination: PaginationSchema.optional(), count: z.number().optional() }`
- Import `PaginationSchema` from `zod/common.zod.ts` — never redefine it
- Use `isValidObjectId` from mongoose for ObjectId fields

### Relation Fields Rule

Only include relations where **this model owns the foreign key**:

| Prisma has... | Include in Zod? |
|---|---|
| FK ID + relation (belongs-to) | **Yes** — `related: RelatedSchema.optional()` |
| Array relation (has-many) | **No** |
| Reverse relation (no FK) | **No** |

If a related model's Zod file doesn't exist yet, create it first (recursively). Always omit relation fields from Create/Update schemas.

## Step 3 — Config Constants (`config/constant.ts`)

Add to each section using factory functions:

```typescript
// ERROR:     createEntityErrors("__Entity__", "__entity__", "__entities__")
// SUCCESS:   createEntitySuccess("__Entity__", "__Entities__", "__entity__")
// ACTIVITY_LOG: createActivityLog("__ENTITY_UPPER__", "__Entity__", "__entity__")
// AUDIT_LOG.RESOURCES: "__entities__"
// AUDIT_LOG.ENTITY_TYPES: "__entity__"
// AUDIT_LOG (top-level): createAuditLogEntity("__entity__")
```

## Step 4 — Module Entry (`app/[entity]/index.ts`)

```typescript
import express, { Router } from "express";
import { controller } from "./__entity__.controller";
import { router } from "./__entity__.router";
import { PrismaClient } from "../../generated/prisma";

export const __entity__Module = (prisma: PrismaClient): Router => {
	return router(express.Router(), controller(prisma));
};
```

## Step 5 — Router (`app/[entity]/[entity].router.ts`)

- Define `IController` interface with `getById`, `getAll`, `create`, `update`, `remove`
- Export `router(route: Router, controller: IController): Router`
- Set `const path = "/__entity__"`
- Routes: `GET /:id` (cache 90s, key `cache:__entity__:byId:${id}:${fields}`), `GET /` (cache 60s, key `cache:__entity__:list:${base64(query)}`), `POST /`, `PATCH /:id`, `DELETE /:id`
- Include `@openapi` JSDoc for each route with tags `[__Entity__]`, `bearerAuth` security
- `route.use(path, routes); return route;`

## Step 6 — Controller (`app/[entity]/[entity].controller.ts`)

Imports: `PrismaClient`, `Prisma` from generated, logger, `transformFormDataToObject`, `validateQueryParams`, query-builder helpers (`buildFilterConditions`, `buildFindManyQuery`, `buildSearchConditions`, `getNestedFields`), `buildSuccessResponse`, `buildPagination`, `groupDataByField`, error-handler helpers, Zod schemas, `logActivity`, `logAudit`, `config`, `redisClient`, `invalidateCache`.

### CRUD pattern for each method:

**create**: Handle form-data content types → Zod validate with `Create__Entity__Schema` → `prisma.__entity__.create` → `logActivity` (CREATE action) → `logAudit` (CREATE, severity LOW, include changesAfter with key fields) → `invalidateCache.byPattern("cache:__entity__:list:*")` → 201 response.

**getAll**: `validateQueryParams` → extract `page/limit/order/fields/sort/skip/query/document/pagination/count/filter/groupBy` → build `whereClause` with `isDeleted: false` → `buildSearchConditions` on searchable fields → `buildFilterConditions` → `buildFindManyQuery` → `Promise.all([findMany, count])` → optional `groupDataByField` → response with conditional `document/count/pagination/groupedBy`.

**getById**: Validate `id` and `fields` params → check Redis cache first (`redisClient.getJSON`) → fallback to `prisma.__entity__.findFirst` with `getNestedFields(fields)` → cache result (`redisClient.setJSON`, TTL 3600) → 404 if not found.

**update**: Validate `id` → Zod validate with `Update__Entity__Schema` → check non-empty body → verify entity exists → `prisma.__entity__.update` → invalidate both `byId` and `list` cache patterns.

**remove**: Validate `id` → verify entity exists → `prisma.__entity__.delete` → invalidate both `byId` and `list` cache patterns.

All methods: catch errors with `handlePrismaError`, log with `__entity__Logger`.

## Step 7 — Register Module (root `index.ts`)

```typescript
import { __entity__Module } from "./app/__entity__";
const __entity__ = __entity__Module(prisma);
app.use(config.baseApiPath, __entity__);
// Exposes GET/POST /api/__entity__ and GET/PATCH/DELETE /api/__entity__/:id
```

## Checklist

- [ ] Prisma schema + `npx prisma generate`
- [ ] Zod schemas (full, create, update, getAll) with relation fields rule applied
- [ ] Config constants (ERROR, SUCCESS, ACTIVITY_LOG, AUDIT_LOG)
- [ ] Module folder: `index.ts`, `router.ts`, `controller.ts`
- [ ] Module registered in root `index.ts`
- [ ] Search fields updated in `getAll` controller
- [ ] Audit `changesAfter` includes key fields

## Placeholder Reference

| Placeholder | Replace with | Example |
|---|---|---|
| `__Entity__` | PascalCase | `Course` |
| `__entity__` | camelCase | `course` |
| `__entities__` | camelCase plural | `courses` |
| `__Entities__` | PascalCase plural | `Courses` |
| `__ENTITY_UPPER__` | UPPER_SNAKE_CASE | `COURSE` |
| `{projectName}` | Project name | `alma` |
