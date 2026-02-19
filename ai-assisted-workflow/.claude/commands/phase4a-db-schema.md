Adopt the persona defined in `personas/backend-engineer.md`. Read it now before proceeding.

Read the skill doc at `skills/MODULE_TEMPLATE.md` — refer to **Step 1 (Prisma Schema)** and the **Naming Conventions** table only. Read it now before proceeding.

Read these context files before proceeding:
- BRD: `docs/brd.md`
- Architecture: `docs/architecture.md` — focus on data models, field types, relationships, and the ERD

## Determine scope

If `$ARGUMENTS` is **"all"** (case-insensitive), generate Prisma schema files for **every** model listed in the architecture doc's data models section. Process them in dependency order — models with no FK dependencies first, then models that depend on them. Otherwise, generate only the schema file for **$ARGUMENTS**.

For **each** model in scope, perform ALL of the following steps:

## Per-model generation

Generate the Prisma schema file at `prisma/schema/[entity].prisma` following MODULE_TEMPLATE.md Step 1:

- Model name in `PascalCase`
- `id` field as ObjectId (`@id @default(auto()) @map("_id") @db.ObjectId`)
- All entity-specific fields with correct Prisma types, optionality, and defaults from the architecture doc
- Relation fields: FK ID field (`String @db.ObjectId`) + the relation field itself
- `isDeleted   Boolean   @default(false)`
- `createdBy   String?   @db.ObjectId`
- `updatedBy   String?   @db.ObjectId`
- `createdAt   DateTime  @default(now())`
- `updatedAt   DateTime  @updatedAt`
- `@@index([orgId])` — only if an `orgId` field exists on the model
- `@@map("__entities__")` — plural lowercase collection name

## Relations

Define all relations according to the ERD in `docs/architecture.md`:

- **Belongs-to (FK owner):** include both the FK ID field (`@db.ObjectId`) and the named relation field
- **Has-many:** define the array relation on the parent side
- **Cross-model consistency:** both ends of every relation must be defined — if Model A has a relation to Model B, Model B must reference Model A too

## After all models are written

Once all `.prisma` files are written, run:

```
npx prisma generate
```

⚠️ VERIFICATION GATE: Before running `prisma generate`, verify:
- Do all FK field references point to models that exist in the schema?
- Are all relation pairs complete — both sides defined and named consistently?
- Does every model's field list match the architecture doc exactly (no missing fields, no extra fields)?
- Does every model use `@@map` with the correct plural collection name?

## Mark Downstream Phases as Stale

If this phase is being **re-run** (i.e., a row for phase 4a already exists in `docs/progress.md`), scan for any `✅ Complete` rows in `docs/progress.md` for these downstream phases:

- Phase 4b — all modules
- Phase 5 — all modules
- Phase 6
- Phase 8 — all modules

For each found row, update the Status cell from `✅ Complete` to `⚠️ Stale` and append to its Notes cell: `| Stale: phase 4a re-run YYYY-MM-DD`

This signals that generated code depending on the Prisma schema may be out of date and needs to be regenerated.

## Log Progress

After all schemas are generated and `prisma generate` succeeds, update `docs/progress.md`:

1. If `docs/progress.md` does not exist, create it with this header:
   ```
   # Project Progress

   | Phase | Name | Scope | Status | Date | Notes |
   |-------|------|-------|--------|------|-------|
   ```
2. Append one row (fill in today's date and a one-line summary):
   `| 4a | DB Schema | {scope} | ✅ Complete | YYYY-MM-DD | {N} models, prisma generate OK |`
