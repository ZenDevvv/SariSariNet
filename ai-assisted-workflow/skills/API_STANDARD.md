# API Call Standard

Standard pattern for frontend API integration (`{projectName}-app`). Every resource follows a **4-file pattern**: endpoint config, service class, React Query hooks, and copied Zod schema.

## Placeholder Reference

| Placeholder | Convention | Example |
|---|---|---|
| `{projectName}` | Project name | `alma` — backend: `{projectName}-api`, frontend: `{projectName}-app` |
| `{Resource}` | PascalCase singular | `Order` |
| `{resource}` | camelCase singular | `order` |
| `{Resources}` | PascalCase plural | `Orders` |
| `{resources}` | camelCase plural | `orders` |
| `RESOURCE` | UPPERCASE singular | `ORDER` |

These align with backend `MODULE_TEMPLATE.md` placeholders (`__Entity__` = `{Resource}`, `__entities__` = `{resources}`, etc.).

## File Structure

```
{projectName}-app/
├── app/configs/endpoints.ts          # Add RESOURCE endpoint object
├── app/services/{resource}-service.ts # Service class extending APIService
├── app/hooks/use-{resource}.ts       # React Query hooks
├── app/zod/{resource}.zod.ts         # Copied from {projectName}-api/zod/
├── app/zod/common.zod.ts            # Shared PaginationSchema + ObjectIdSchema
└── app/lib/display-utils.ts          # Shared display helpers (badges, labels)
```

## Step 1 — Endpoints (`app/configs/endpoints.ts`)

Add a `RESOURCE` object to `API_ENDPOINTS` with keys: `GET_ALL`, `GET_BY_ID`, `CREATE`, `UPDATE`, `DELETE`. Paths use singular lowercase (e.g., `/order`, `/order/:id`). Resource name UPPERCASE, action names UPPERCASE with underscores.

## Step 2 — Service (`app/services/{resource}-service.ts`)

- Extend `APIService` to inherit query string builder methods (`select`, `search`, `paginate`, `sort`, `filter`, `count`, `document`, `pagination`)
- Use `apiClient` for all HTTP requests, type responses with `ApiResponse<T>`
- Methods: `getAll{Resources}`, `get{Resource}ById({resource}Id)`, `create{Resource}(data)`, `update{Resource}({resource}Id, data)`, `delete{Resource}({resource}Id)`
- `create` and `update` must accept `Create{Resource} | FormData` and `Update{Resource} | FormData` — use `apiClient.postFormData`/`apiClient.patchFormData` for FormData, `apiClient.post`/`apiClient.patch` for JSON
- Handle errors consistently: `error.data?.errors?.[0]?.message || error.message || "An error has occurred"`
- Export as singleton: `export default new {Resource}Service()`

## Step 3 — React Query Hooks (`app/hooks/use-{resource}.ts`)

- **`useGet{Resources}(apiParams?)`**: `useQuery` — queryKey `["{resources}", apiParams]`, chains all APIService builder methods, calls `getAll{Resources}()`
- **`useGet{Resource}ById({resource}Id, apiParams?)`**: `useQuery` — queryKey `["{resource}-by-id", {resource}Id, apiParams]`, `enabled: !!{resource}Id`
- **`useCreate{Resource}()`**: `useMutation` — mutationFn accepts `Create{Resource} | FormData`, onSuccess invalidates `["{resources}"]`
- **`useUpdate{Resource}()`**: `useMutation` — mutationFn accepts `{ {resource}Id: string; data: Update{Resource} | FormData }`, onSuccess invalidates `["{resources}"]`
- **`useDelete{Resource}()`**: `useMutation` — mutationFn accepts `{resource}Id: string` (plain string, not object), onSuccess invalidates `["{resources}"]`

Import `queryClient` from `~/lib/query-client` for cache invalidation.

## Step 4 — Copy Zod Schema from API

**Source:** `{projectName}-api/zod/{resource}.zod.ts` → **Destination:** `app/zod/{resource}.zod.ts`

The API Zod file is the **single source of truth**. Never create frontend Zod schemas from scratch.

### Copy steps:

1. Copy the file from `{projectName}-api/zod/{resource}.zod.ts`
2. Replace `import { isValidObjectId } from "mongoose"` → `import { ObjectIdSchema } from "./common.zod"`
3. Replace all `z.string().refine((val) => isValidObjectId(val))` → `ObjectIdSchema`
4. Verify `PaginationSchema` imports from `./common.zod` — if `app/zod/common.zod.ts` doesn't exist, copy it from `{projectName}-api/zod/common.zod.ts`
5. If the copied file imports other entity schemas (e.g., `PersonSchema`), recursively copy those dependency Zod files too

**Never** redefine `PaginationSchema` in entity Zod files — always import from `./common.zod`.

If the API Zod file doesn't exist yet, create it in the API project first following `skills/MODULE_TEMPLATE.md` Step 2, then copy.

## Step 5 — Using Hooks in Pages

Before using any hook, check `app/zod/{resource}.zod.ts` for response/payload types and `app/services/{resource}-service.ts` for return types.

### Fields parameter

Always pass `fields` as a comma-separated string of **all keys** from `{Resource}Schema` (scalars + relation fields). Open the Zod file, list every key, join with commas.

### Hook usage patterns:

- **GET list**: `useGet{Resources}({ page, limit, fields })` → data typed as `GetAll{Resources}` → access `data?.{resources}`, `data?.pagination`, `data?.count`
- **GET by ID**: `useGet{Resource}ById({resource}Id)` → data typed as `{Resource}`
- **CREATE**: `useCreate{Resource}()` → `mutate(payload)` where payload is `Create{Resource}` (id, createdAt, updatedAt omitted)
- **UPDATE**: `useUpdate{Resource}()` → `mutate({ {resource}Id, data })` where data is `Update{Resource}` (all fields partial)
- **DELETE**: `useDelete{Resource}()` → `mutate({resource}Id)` — pass plain string, not object

## Step 6 — Page Integration Rules

### Rule 1: Use Zod Types Directly — No Intermediate Types

Never create page-local types (e.g., `CourseRow`) to reshape data. Use Zod-inferred types (`{Resource}`, `GetAll{Resources}`, `Create{Resource}`, `Update{Resource}`) directly. No manual field mapping — use `data?.{resources} ?? []` directly.

### Rule 2: Move Display Helpers to Reusable Files

Display helpers (`statusBadge`, `levelLabel`, `roleBadge`, etc.) go in `app/lib/{resource}-utils.ts` or `app/lib/display-utils.ts` — never define inline in page components.

### Rule 3: Always Follow the Style Guide

Refer to `skills/STYLE_GUIDE.md` for component patterns, color tokens, icon usage, and layout conventions. Every UI element must comply.

| Rule | Do | Don't |
|---|---|---|
| Types | Use Zod types directly | Create page-local types and map data |
| Display helpers | Put in `app/lib/` | Define inside page files |
| Styling | Follow `skills/STYLE_GUIDE.md` | Improvise styles |

## Checklist

- [ ] Endpoint added to `app/configs/endpoints.ts`
- [ ] Service class in `app/services/{resource}-service.ts` (extends APIService, supports FormData)
- [ ] React Query hooks in `app/hooks/use-{resource}.ts`
- [ ] Zod schema copied from API (mongoose → ObjectIdSchema, PaginationSchema from common)
- [ ] All Zod dependency files recursively copied
- [ ] Pages use Zod types directly, no intermediate types
- [ ] Display helpers in reusable files, not inline
- [ ] Style guide followed for all UI
