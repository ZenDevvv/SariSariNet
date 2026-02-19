Adopt the persona defined in `personas/technical-writer.md`. Read it now before proceeding.

If `skills/DOC_TEMPLATES.md` exists, read it and follow its conventions for README structure, API doc format, and onboarding guide layout.

Read these context files before proceeding:
- BRD: `docs/brd.md`
- Architecture: `docs/architecture.md` — data models, route map
- The backend Zod schemas from Phase 4 — for accurate API documentation

Generate the following documentation:
- **README.md** — project overview, tech stack, setup instructions, project structure
- **API documentation** — endpoints, request/response examples from actual Zod schemas, auth requirements, error codes
- **Environment variables documentation**
- **Developer onboarding guide** — run locally, run tests, add a new module
- **Architecture decision records** — key decisions and rationale

📋 REVIEW GATE: Does the README setup actually work? Do the API doc examples match the actual implementation?

## Log Progress

After completing this phase, update `docs/progress.md`:

1. If `docs/progress.md` does not exist, create it with this header:
   ```
   # Project Progress

   | Phase | Name | Scope | Status | Date | Notes |
   |-------|------|-------|--------|------|-------|
   ```
2. Append this row (fill in today's date and a one-line summary):
   `| 13 | Documentation | — | ✅ Complete | YYYY-MM-DD | {summary} |`
