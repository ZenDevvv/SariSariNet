Adopt the persona defined in `personas/backend-engineer.md`. Read it now before proceeding.

If `skills/MIGRATION_TEMPLATE.md` exists, read it and follow its conventions for migration file naming, index conventions, and seed data format.

Read these context files before proceeding:
- BRD: `docs/brd.md`
- Architecture: `docs/architecture.md` — data models, ERD, and database type
- Review the finalized backend modules from Phase 4 to ensure output matches the actual Zod schemas, not just the architecture doc

## Detect database type

Check `docs/architecture.md` (or Prisma schema `datasource` block) to determine the database type.

---

## If SQL database (PostgreSQL, MySQL, etc.)

Generate the following for each model:
- Migration scripts (create table, indexes, foreign keys) in dependency order
- Rollback scripts for each migration
- Seed data scripts with realistic test data
- Seed data for different environments (dev, staging, test)

📋 REVIEW GATE: Do migrations match the finalized models from Phase 4 (not just Phase 3)? Can migrations run up and down cleanly?

---

## If MongoDB (Prisma + MongoDB)

MongoDB is schemaless — traditional migration scripts are unnecessary. Prisma handles schema via `npx prisma db push`. Instead, focus on **seed data and index management**.

Generate the following:
- **Prisma seed script** (`prisma/seed.ts`) that creates realistic test data for **all** models in dependency order
- Seed data per environment (dev, staging, test) with different data volumes:
  - `dev`: Small dataset (~5–10 records per model) with edge cases
  - `staging`: Medium dataset (~50–100 records per model) simulating real usage
  - `test`: Minimal dataset (~2–3 records per model) for fast test runs
- **`package.json` seed command**: `"prisma": { "seed": "ts-node prisma/seed.ts" }`
- **Do NOT** generate an index verification script — `prisma db push` already creates indexes defined in the schema

### Seed data rules:
- Use `prisma.{entity}.createMany()` where possible for performance
- Respect FK dependencies — seed parent models before children
- Use realistic data (real-looking names, emails, dates) not "test1", "test2"
- Include edge cases: empty optional fields, max-length strings, boundary dates
- Seed data must pass Zod validation — match the schemas from Phase 4 exactly
- Make seed scripts idempotent — check for existing data or use `deleteMany()` before seeding

📋 REVIEW GATE: Does seed data pass Zod validation for every model? Are FK relationships consistent? Is the data realistic enough for meaningful dev/staging testing?

## Log Progress

After completing this phase, update `docs/progress.md`:

1. If `docs/progress.md` does not exist, create it with this header:
   ```
   # Project Progress

   | Phase | Name | Scope | Status | Date | Notes |
   |-------|------|-------|--------|------|-------|
   ```
2. Append this row (fill in today's date and a one-line summary):
   `| 6 | Migrations | — | ✅ Complete | YYYY-MM-DD | {summary} |`
